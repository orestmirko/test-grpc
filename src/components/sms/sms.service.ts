import { Injectable, Logger } from '@nestjs/common';
import { RedisService } from 'src/core/cache/redis.service';
import * as sendpulse from 'sendpulse-api';
import CONFIG from '@config';

@Injectable()
export class SmsService {
  private readonly logger = new Logger(SmsService.name);

  constructor(private readonly redisService: RedisService) {}

  public async sendVerificationCode(phone: string): Promise<string> {
    try {
      // Перевіряємо ліміт відправок на день
      const dailyAttemptsKey = `sms_daily_attempts:${phone}`;
      const dailyAttempts = await this.redisService.get(dailyAttemptsKey);

      if (dailyAttempts && parseInt(dailyAttempts) >= 3) {
        throw new Error('Daily SMS limit exceeded');
      }

      // Перевіряємо час останньої відправки
      const lastSentKey = `sms_last_sent:${phone}`;
      const lastSent = await this.redisService.get(lastSentKey);

      if (lastSent) {
        throw new Error('Please wait 1 minute before requesting new code');
      }

      // Генеруємо код
      const code = this.generateVerificationCode();
      const verificationKey = `verification_code:${phone}`;

      // Зберігаємо код в Redis на 10 хвилин
      await this.redisService.set(verificationKey, code, 600);

      // Встановлюємо обмеження на повторну відправку (1 хвилина)
      await this.redisService.set(lastSentKey, 'true', 60);

      // Оновлюємо лічильник денних спроб
      const currentAttempts = dailyAttempts ? parseInt(dailyAttempts) : 0;
      await this.redisService.set(dailyAttemptsKey, (currentAttempts + 1).toString(), 86400);

      // Відправляємо SMS
      console.log('Sending SMS to', phone, `Your verification code is: ${code}`);
      // await this.sendSMS(phone, `Your verification code is: ${code}`);

      return code;
    } catch (error) {
      this.logger.error(`Failed to send verification code: ${error.message}`);
      throw error;
    }
  }

  private generateVerificationCode(): string {
    return Math.floor(10000 + Math.random() * 90000).toString();
  }

  private async sendSMS(phone: string, message: string): Promise<void> {
    try {
      const date = '';
      const transliterate = 0;
      const route = '';

      await new Promise((resolve, reject) => {
        sendpulse.init(CONFIG.SENDPULSE.USER_ID, CONFIG.SENDPULSE.SECRET, '/tmp/', () => {
          sendpulse.smsSend(
            (response) => {
              return response.result ? resolve(response) : reject(response);
            },
            CONFIG.SENDPULSE.SENDER_NAME,
            [phone],
            message,
            date,
            transliterate,
            route,
          );
        });
      });

      this.logger.log(`SMS sent successfully to ${phone}`);
    } catch (error) {
      this.logger.error(`SMS sending failed: ${error.message}`);
      throw error;
    }
  }
}
