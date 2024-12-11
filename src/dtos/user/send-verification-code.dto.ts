import { ApiProperty } from '@nestjs/swagger';
import { IsString, Length, Matches } from 'class-validator';

export class SendVerificationCodeDto {
  @ApiProperty({ example: '380501234567' })
  @IsString()
  @Length(12, 12, { message: 'Phone must be exactly 12 characters' })
  @Matches(/^380\d{9}$/, {
    message: 'Phone must start with 380 and contain only numbers',
  })
  phone: string;
}
