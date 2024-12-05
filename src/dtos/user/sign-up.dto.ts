import { ApiProperty } from '@nestjs/swagger';
import { IsString, Length, Matches } from 'class-validator';

export class SignUpDto {
  @ApiProperty({ example: 'Андрій' })
  @IsString()
  @Length(2, 20, { message: 'Name must be between 2 and 20 characters' })
  @Matches(/^[а-яА-ЯёЁіІїЇєЄґҐa-zA-Z\s]*$/, {
    message: 'Name can only contain letters and spaces',
  })
  public name: string;

  @ApiProperty({ example: '380501234567' })
  @IsString()
  @Length(12, 12, { message: 'Phone must be exactly 12 characters' })
  @Matches(/^380\d{9}$/, {
    message: 'Phone must start with 380 and contain only numbers',
  })
  public phone: string;
} 