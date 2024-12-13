import { Injectable, Logger, UnauthorizedException, ConflictException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { AdminEntity } from '@entities';
import { AdminLoginDto, ChangePasswordDto, AdminInviteDto, TokensDto } from '@dtos';
import { CustomJwtService } from '../jwt/jwt.service';
import { RedisService } from 'src/core/cache/redis.service';
import * as crypto from 'crypto';
import { EmailService } from '../email/email.service';

@Injectable()
export class AdminService {
  private readonly logger = new Logger(AdminService.name);

  constructor(
    @InjectRepository(AdminEntity)
    private readonly adminRepository: Repository<AdminEntity>,
    private readonly jwtService: CustomJwtService,
    private readonly redisService: RedisService,
    private readonly emailService: EmailService,
  ) {}

  public async login(loginDto: AdminLoginDto) {
    try {
      const admin = await this.adminRepository.findOne({
        where: { email: loginDto.email },
      });

      if (!admin) {
        throw new UnauthorizedException('Invalid credentials');
      }

      const hashedPassword = await this.hashPassword(loginDto.password);
      if (hashedPassword !== admin.password) {
        throw new UnauthorizedException('Invalid credentials');
      }

      const tokens = await this.jwtService.generateTokens(admin);
      await this.saveSession(admin.id, tokens);

      return tokens;
    } catch (error) {
      this.logger.error(`Login failed: ${error.message}`);
      throw error;
    }
  }

  public async invite(inviteDto: AdminInviteDto) {
    try {
      const existingAdmin = await this.adminRepository.findOne({
        where: { email: inviteDto.email },
      });

      if (existingAdmin) {
        throw new ConflictException('Admin with this email already exists');
      }

      const temporaryPassword = this.generateTemporaryPassword();
      const hashedPassword = await this.hashPassword(temporaryPassword);

      const newAdmin = this.adminRepository.create({
        email: inviteDto.email,
        password: hashedPassword,
      });

      // await this.sendInviteEmail(inviteDto.email, temporaryPassword);
      console.log('invited admin', { password: temporaryPassword, email: inviteDto.email });
      await this.adminRepository.save(newAdmin);

      this.logger.log(`Invite sent to ${inviteDto.email}`);
    } catch (error) {
      this.logger.error(`Failed to send invite: ${error.message}`);
      throw error;
    }
  }

  public async changePassword(adminId: number, changePasswordDto: ChangePasswordDto) {
    try {
      const admin = await this.adminRepository.findOne({
        where: { id: adminId },
      });

      if (!admin) {
        throw new UnauthorizedException('Admin not found');
      }

      const hashedOldPassword = await this.hashPassword(changePasswordDto.oldPassword);
      if (hashedOldPassword !== admin.password) {
        throw new UnauthorizedException('Invalid old password');
      }

      const hashedNewPassword = await this.hashPassword(changePasswordDto.newPassword);
      admin.password = hashedNewPassword;

      await this.adminRepository.save(admin);
      await this.logout(adminId);

      this.logger.log(`Password changed for admin ${adminId}`);
    } catch (error) {
      this.logger.error(`Failed to change password: ${error.message}`);
      throw error;
    }
  }

  private async saveSession(adminId: number, tokens: any): Promise<void> {
    const sessionKey = `admin_session:${adminId}`;
    await this.redisService.set(sessionKey, JSON.stringify(tokens));
  }

  public async logout(adminId: number): Promise<void> {
    try {
      const sessionKey = `admin_session:${adminId}`;
      const exists = await this.redisService.exists(sessionKey);

      if (!exists) {
        this.logger.warn(`No active session found for admin ${adminId}`);
        return;
      }

      await this.redisService.del(sessionKey);
      this.logger.log(`Admin with ID ${adminId} logged out successfully`);
    } catch (error) {
      this.logger.error(`Failed to logout admin ${adminId}: ${error.message}`);
      throw error;
    }
  }

  private async hashPassword(password: string): Promise<string> {
    return crypto.createHash('sha256').update(password).digest('hex');
  }

  private generateTemporaryPassword(): string {
    return crypto.randomBytes(4).toString('hex');
  }

  private async sendInviteEmail(email: string, temporaryPassword: string): Promise<void> {
    const subject = 'Запрошення адміністратора';
    const message = `
      <h2>Ласкаво просимо!</h2>
      <p>Ви були запрошені як адміністратор.</p>
      <p>Ваш тимчасовий пароль: <strong>${temporaryPassword}</strong></p>
      <p>Будь ласка, змініть його після першого входу.</p>
    `;

    await this.emailService.sendEmail(email, subject, message);
  }

  public async refreshTokens(refreshToken: string): Promise<TokensDto> {
    try {
      const payload = await this.jwtService.verifyRefreshToken(refreshToken);
      const adminId = payload.sub;

      const sessionKey = `admin_session:${adminId}`;
      const storedTokens = await this.redisService.get(sessionKey);

      if (!storedTokens) {
        throw new UnauthorizedException('Session not found');
      }

      const tokens = JSON.parse(storedTokens);
      if (tokens.refreshToken !== refreshToken) {
        throw new UnauthorizedException('Invalid refresh token');
      }

      const admin = await this.adminRepository.findOne({ where: { id: adminId } });

      if (!admin) {
        this.logger.error(`Admin with ID ${adminId} not found during token refresh`);
        throw new UnauthorizedException('Admin not found');
      }

      await this.logout(adminId);
      const newTokens = await this.jwtService.generateTokens(admin);
      await this.saveSession(adminId, newTokens);

      this.logger.log(`Tokens successfully refreshed for admin ${adminId}`);
      return newTokens;
    } catch (error) {
      this.logger.error(`Failed to refresh tokens: ${error.message}`);
      throw error;
    }
  }
}
