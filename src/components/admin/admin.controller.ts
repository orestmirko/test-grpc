import { Body, Controller, Post, UseGuards, Request } from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags, ApiBearerAuth } from '@nestjs/swagger';
import { AdminService } from './admin.service';
import { AdminLoginDto, ChangePasswordDto, AdminInviteDto, TokensDto } from '@dtos';
import { AuthGuard, Roles } from '@guards';
import { UserRole } from '@enums';

@ApiTags('Admin')
@Controller('admin')
export class AdminController {
  constructor(private readonly adminService: AdminService) {}

  @Post('login')
  @ApiOperation({ summary: 'Admin login' })
  @ApiResponse({
    status: 200,
    description: 'Successfully logged in',
    type: TokensDto,
  })
  public async login(@Body() loginDto: AdminLoginDto) {
    return this.adminService.login(loginDto);
  }

  @Post('invite')
  @ApiOperation({ summary: 'Invite new admin (Admin step 1)' })
  @ApiResponse({
    status: 201,
    description: 'Invitation sent',
  })
  public async invite(@Body() inviteDto: AdminInviteDto) {
    return this.adminService.invite(inviteDto);
  }

  @Post('change-password')
  @UseGuards(AuthGuard)
  @Roles(UserRole.ADMIN)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Change admin password (Admin step 2)' })
  @ApiResponse({
    status: 200,
    description: 'Password successfully changed',
  })
  public async changePassword(@Request() req, @Body() changePasswordDto: ChangePasswordDto) {
    return this.adminService.changePassword(req.user.sub, changePasswordDto);
  }

  @Post('logout')
  @UseGuards(AuthGuard)
  @Roles(UserRole.ADMIN)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Logout admin' })
  @ApiResponse({
    status: 200,
    description: 'Admin successfully logged out',
  })
  public async logout(@Request() req): Promise<void> {
    await this.adminService.logout(req.user.sub);
  }
}
