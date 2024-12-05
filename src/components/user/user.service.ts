import { SignUpDto, TokensDto } from '@dtos';
import { UserEntity } from '@entities';
import { Injectable, Logger, ConflictException, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CustomJwtService } from '../jwt/jwt.service';
import { RedisService } from 'src/core/cache/redis.service';

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
    private readonly logger: Logger,
  ) {}

  public async signUp(body: SignUpDto): Promise<TokensDto> {
    try {
      const existingUser = await this.usersRepository.findOne({
        where: { phone: body.phone },
      });

      if (existingUser) {
        throw new ConflictException(`User with phone: ${body.phone} already exists`);
      }

      const newUser = this.usersRepository.create(body);
      const savedUser = await this.usersRepository.save(newUser);
      
      const tokens = await this.jwtService.generateTokens(savedUser);
      await this.saveSession(savedUser.id, tokens);
      
      this.logger.log(`New user registered with ID: ${savedUser.id}`);
      return tokens;
    } catch (error) {
      this.logger.error(`Failed to register user: ${error.message}`);
      throw error;
    }
  }

  public async logout(userId: number): Promise<void> {
    try {
      const sessionKey = this.getSessionKey(userId);
      await this.redisService.del(sessionKey);
      this.logger.log(`User with ID ${userId} logged out successfully`);
    } catch (error) {
      this.logger.error(`Failed to logout user ${userId}: ${error.message}`);
      throw error;
    }
  }

  public async refreshTokens(userId: number, refreshToken: string): Promise<TokensDto> {
    try {
      const isValidSession = await this.validateSession(userId, refreshToken);
      
      if (!isValidSession) {
        throw new UnauthorizedException('Invalid refresh token');
      }

      const user = await this.usersRepository.findOne(userId);
      
      if (!user) {
        this.logger.error(`User with ID ${userId} not found during token refresh`);
        throw new UnauthorizedException('User not found');
      }

      const tokens = await this.jwtService.generateTokens(user);
      await this.saveSession(userId, tokens);
      
      this.logger.log(`Tokens successfully refreshed for user ${userId}`);
      return tokens;
    } catch (error) {
      this.logger.error(`Failed to refresh tokens for user ${userId}: ${error.message}`);
      throw error;
    }
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