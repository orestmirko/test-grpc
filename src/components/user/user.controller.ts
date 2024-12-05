import { RefreshTokenDto, SignUpDto, TokensDto } from '@dtos';
import { Body, Controller, Post, UseGuards, Request } from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags, ApiBearerAuth } from '@nestjs/swagger';
import { UserService } from '@providers';
import { JwtAuthGuard } from '@guards';

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

  @Post('logout')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Logout user' })
  @ApiResponse({
    status: 200,
    description: 'User successfully logged out',
  })
  public async logout(@Request() req): Promise<void> {
    await this.userService.logout(req.user.sub);
  }

  @Post('refresh')
  @ApiOperation({ summary: 'Refresh access token' })
  @ApiResponse({
    status: 200,
    description: 'Tokens successfully refreshed',
    type: TokensDto,
  })
  public async refresh(@Body() refreshTokenDto: RefreshTokenDto): Promise<TokensDto> {
    return this.userService.refreshTokens(refreshTokenDto.refreshToken);
  }
} 