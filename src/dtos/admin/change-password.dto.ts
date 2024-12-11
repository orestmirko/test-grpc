import { ApiProperty } from '@nestjs/swagger';
import { IsString, MaxLength, NotContains, IsStrongPassword, Matches } from 'class-validator';

const SPECIAL_CHARS_REGEX_FOR_PASSWORD = /[!@#$%^&*(),.?":{}|<>]/;

export class ChangePasswordDto {
  @ApiProperty({
    example: 'YourOldPassword123!',
  })
  @IsString()
  oldPassword: string;

  @ApiProperty({
    example: 'Qwerty123!',
  })
  @IsString()
  @MaxLength(20)
  @NotContains(' ', { message: 'Password should not contain spaces' })
  @IsStrongPassword(
    {
      minLength: 8,
      minLowercase: 1,
      minUppercase: 1,
      minNumbers: 1,
      minSymbols: 1,



      
    },
    {
      message:
        'Password must contain at least 8 characters, one uppercase letter, one lowercase letter, one number and one special character',
    },
  )
  @Matches(SPECIAL_CHARS_REGEX_FOR_PASSWORD, {
    message: 'Password must contain at least one special character (e.g., !, @, #, $, etc.)',
  })
  newPassword: string;
}
