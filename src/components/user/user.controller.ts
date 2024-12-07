import { RefreshTokenDto, SignUpDto, TokensDto, VerifySignUpDto } from '@dtos';
import { Body, Controller, Post, UseGuards, Request } from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags, ApiBearerAuth } from '@nestjs/swagger';
import { UserService } from '@providers';
import { JwtAuthGuard } from '@guards';

@ApiTags('Users')
@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post('sign-up')
  @ApiOperation({ summary: 'Initiate sign up process' })
  @ApiResponse({
    status: 201,
    description: 'Verification code sent',
  })
  public signUp(@Body() signUpDto: SignUpDto): Promise<void> {
    return this.userService.signUp(signUpDto);
  }

  @Post('verify')
  @ApiOperation({ summary: 'Verify phone and complete registration' })
  @ApiResponse({
    status: 201,
    description: 'User successfully created',
    type: TokensDto,
  })
  public verifyAndCompleteSignUp(@Body() verifySignUpDto: VerifySignUpDto): Promise<TokensDto> {
    return this.userService.verifyAndCompleteSignUp(verifySignUpDto.phone, verifySignUpDto.code);
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
