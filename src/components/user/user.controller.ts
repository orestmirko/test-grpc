import { SignUpDto, TokensDto } from '@dtos';
import { Body, Controller, Post } from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { UserService } from '@providers';

@ApiTags('Users')
@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post('sign-up')
  @ApiOperation({ summary: 'Sign up a new user' })
  @ApiResponse({
    status: 201,
    description: 'User successfully created',
    type: TokensDto,
  })
  public signUp(@Body() signUpDto: SignUpDto): Promise<TokensDto> {
    return this.userService.signUp(signUpDto);
  }
} 