import { SignUpDto, TokensDto } from '@dtos';
import { UserEntity } from '@entities';
import { Injectable, Logger, ConflictException, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CustomJwtService } from '../jwt/jwt.service';
import { RedisService } from 'src/core/cache/redis.service';
import { SmsService } from '../sms/sms.service';

interface SessionTokens {
  accessToken: string;
  refreshToken: string;
}

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(UserEntity)
    private readonly usersRepository: Repository<UserEntity>,
    private readonly jwtService: CustomJwtService,
    private readonly redisService: RedisService,
    private readonly smsService: SmsService,
    private readonly logger: Logger,
  ) {}

  public async signUp(body: SignUpDto): Promise<void> {
    try {
      const existingUser = await this.usersRepository.findOne({
        where: { phone: body.phone },
      });

      if (existingUser) {
        throw new ConflictException(`User with phone: ${body.phone} already exists`);
      }

      const tempUserKey = `temp_user:${body.phone}`;
      await this.redisService.set(tempUserKey, JSON.stringify(body), 600);

      await this.smsService.sendVerificationCode(body.phone);

      this.logger.log(`Verification code sent to phone: ${body.phone}`);
    } catch (error) {
      this.logger.error(`Failed to initiate signup: ${error.message}`);
      throw error;
    }
  }

  public async verifyAndCompleteSignUp(phone: string, code: string): Promise<TokensDto> {
    try {
      const verificationKey = `verification_code:${phone}`;
      const storedCode = await this.redisService.get(verificationKey);

      if (!storedCode || storedCode !== code) {
        throw new UnauthorizedException('Invalid verification code');
      }

      const tempUserKey = `temp_user:${phone}`;
      const tempUserData = await this.redisService.get(tempUserKey);

      if (!tempUserData) {
        throw new UnauthorizedException('Registration session expired');
      }

      const userData = JSON.parse(tempUserData) as SignUpDto;
      const newUser = this.usersRepository.create(userData);

      const [savedUser, tokens] = await Promise.all([
        this.usersRepository.save(newUser),
        this.jwtService.generateTokens(newUser),
      ]);

      await this.saveSession(savedUser.id, tokens);

      await Promise.all([
        this.redisService.del(verificationKey),
        this.redisService.del(tempUserKey),
      ]);

      this.logger.log(`New user registered with ID: ${savedUser.id}`);
      return tokens;
    } catch (error) {
      this.logger.error(`Failed to complete registration: ${error.message}`);
      throw error;
    }
  }

  public async logout(userId: number): Promise<void> {
    try {
      const sessionKey = this.getSessionKey(userId);
      const exists = await this.redisService.exists(sessionKey);

      if (!exists) {
        this.logger.warn(`No active session found for user ${userId}`);
        return;
      }

      await this.redisService.del(sessionKey);

      const sessionExists = await this.redisService.exists(sessionKey);
      if (sessionExists) {
        throw new Error(`Failed to delete session for user ${userId}`);
      }

      this.logger.log(`User with ID ${userId} logged out successfully`);
    } catch (error) {
      this.logger.error(`Failed to logout user ${userId}: ${error.message}`);
      throw error;
    }
  }

  public async refreshTokens(refreshToken: string): Promise<TokensDto> {
    try {
      const payload = await this.jwtService.verifyRefreshToken(refreshToken);
      const userId = payload.sub;

      const isValidSession = await this.validateSession(userId, refreshToken);

      if (!isValidSession) {
        throw new UnauthorizedException('Invalid refresh token');
      }

      const user = await this.usersRepository.findOne({ where: { id: userId } });

      if (!user) {
        this.logger.error(`User with ID ${userId} not found during token refresh`);
        throw new UnauthorizedException('User not found');
      }

      await this.logout(userId);
      const tokens = await this.jwtService.generateTokens(user);
      await this.saveSession(userId, tokens);

      this.logger.log(`Tokens successfully refreshed for user ${userId}`);
      return tokens;
    } catch (error) {
      this.logger.error(`Failed to refresh tokens: ${error.message}`);
      throw error;
    }
  }

  public async login(phone: string, code: string): Promise<TokensDto> {
    try {
      const verificationKey = `verification_code:${phone}`;
      const storedCode = await this.redisService.get(verificationKey);

      if (!storedCode || storedCode !== code) {
        throw new UnauthorizedException('Invalid verification code');
      }

      const user = await this.usersRepository.findOne({
        where: { phone },
      });

      if (!user) {
        throw new UnauthorizedException('User not found');
      }

      const tokens = await this.jwtService.generateTokens(user);
      await this.saveSession(user.id, tokens);
      await this.redisService.del(verificationKey);

      this.logger.log(`User ${user.id} successfully logged in`);
      return tokens;
    } catch (error) {
      this.logger.error(`Login failed: ${error.message}`);
      throw error;
    }
  }

  public async sendVerificationCode(phone: string): Promise<void> {
    await this.smsService.sendVerificationCode(phone);
  }

  private getSessionKey(userId: number): string {
    return `user_session:${userId}`;
  }

  private async saveSession(userId: number, tokens: TokensDto): Promise<void> {
    try {
      const sessionKey = this.getSessionKey(userId);
      await this.redisService.set(sessionKey, JSON.stringify(tokens));
      this.logger.debug(`Session saved for user ${userId}`);
    } catch (error) {
      this.logger.error(`Failed to save session for user ${userId}: ${error.message}`);
      throw error;
    }
  }

  private async validateSession(userId: number, refreshToken: string): Promise<boolean> {
    try {
      const sessionKey = this.getSessionKey(userId);
      const storedTokens = await this.redisService.get(sessionKey);

      if (!storedTokens) {
        this.logger.warn(`No active session found for user ${userId}`);
        return false;
      }

      const tokens: SessionTokens = JSON.parse(storedTokens);
      return tokens.refreshToken === refreshToken;
    } catch (error) {
      this.logger.error(`Failed to validate session for user ${userId}: ${error.message}`);
      throw error;
    }
  }
}
