import { Injectable, Logger } from '@nestjs/common';
import { RedisService } from 'src/core/cache/redis.service';
import * as sendpulse from 'sendpulse-api';
import CONFIG from '@config';

@Injectable()
export class EmailService {
  private readonly logger = new Logger(EmailService.name);

  constructor(private readonly redisService: RedisService) {}

  public async sendEmail(email: string, subject: string, message: string): Promise<void> {
    try {
      // Перевіряємо ліміт відправок на день
      const dailyAttemptsKey = `email_daily_attempts:${email}`;
      const dailyAttempts = await this.redisService.get(dailyAttemptsKey);

      if (dailyAttempts && parseInt(dailyAttempts) >= 5) {
        throw new Error('Daily email limit exceeded');
      }

      // Перевіряємо час останньої відправки
      const lastSentKey = `email_last_sent:${email}`;
      const lastSent = await this.redisService.get(lastSentKey);

      if (lastSent) {
        throw new Error('Please wait 1 minute before sending new email');
      }

      // Відправляємо email
      await this.sendEmailViaSendpulse(email, subject, message);

      // Встановлюємо обмеження на повторну відправку (1 хвилина)
      await this.redisService.set(lastSentKey, 'true', 60);

      // Оновлюємо лічильник денних спроб
      const currentAttempts = dailyAttempts ? parseInt(dailyAttempts) : 0;
      await this.redisService.set(dailyAttemptsKey, (currentAttempts + 1).toString(), 86400);

      this.logger.log(`Email sent successfully to ${email}`);
    } catch (error) {
      this.logger.error(`Failed to send email: ${error.message}`);
      throw error;
    }
  }

  private async sendEmailViaSendpulse(
    email: string,
    subject: string,
    message: string,
  ): Promise<void> {
    return new Promise((resolve, reject) => {
      sendpulse.init(CONFIG.SENDPULSE.USER_ID, CONFIG.SENDPULSE.SECRET, '/tmp/', () => {
        console.log(CONFIG.SENDPULSE.SENDER_EMAIL);
        const emailData = {
          subject,
          html: message,
          from: {
            name: CONFIG.SENDPULSE.SENDER_NAME,
            email: CONFIG.SENDPULSE.SENDER_EMAIL,
          },
          to: [
            {
              email,
            },
          ],
        };

        sendpulse.smtpSendMail((data) => {
          return data.result ? resolve() : reject(data);
        }, emailData);
      });
    });
  }
}
