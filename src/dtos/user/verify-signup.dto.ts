import { ApiProperty } from '@nestjs/swagger';
import { IsString, Length, Matches } from 'class-validator';

export class VerifySignUpDto {
  @ApiProperty({ example: '380501234567' })
  @IsString()
  @Length(12, 12, { message: 'Phone must be exactly 12 characters' })
  @Matches(/^380\d{9}$/, {
    message: 'Phone must start with 380 and contain only numbers',
  })
  phone: string;

  @ApiProperty({ example: '12345' })
  @IsString()
  @Length(5, 5, { message: 'Code must be exactly 5 characters' })
  @Matches(/^\d{5}$/, {
    message: 'Code must contain exactly 5 digits',
  })
  code: string;
}
