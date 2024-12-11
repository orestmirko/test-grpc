import { ApiProperty } from '@nestjs/swagger';
import { IsString, Length } from 'class-validator';

export class ChangePasswordDto {
  @ApiProperty()
  @IsString()
  @Length(8, 30)
  oldPassword: string;

  @ApiProperty()
  @IsString()
  @Length(8, 30)
  newPassword: string;
}
