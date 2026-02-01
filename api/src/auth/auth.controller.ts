import { Body, Controller, HttpCode, HttpStatus, Post } from '@nestjs/common';
import { ApiOkResponse, ApiOperation, ApiTags } from '@nestjs/swagger';

import { AuthService } from './auth.service';
import { ForgetPasswordDto } from './dto/forget-password.dto';
import { LoginDto } from './dto/login.dto';
import { ResetPasswordDto } from './dto/reset-password.dto';

@ApiTags('Authentication')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Log in' })
  @ApiOkResponse({
    description: 'Log into the system',
    schema: {
      example: {
        user: {
          id: 'nw7m5p9j9k0q2r4s5t6u7v8w',
          email: 'mail@example.com',
          firstName: 'Work',
          lastName: 'Nest',
          role: 'STAFF',
          status: 'ACTIVE',
          profilePictureUrl: 'string',
          departmentId: 'nw7m5p9j9k0q2r4s5t6u7v8w',
          createdAt: '2026-01-29T10:20:30.000Z',
        },
        token: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...',
      },
    },
  })
  async login(@Body() dto: LoginDto) {
    return this.authService.login(dto);
  }

  @Post('forgot-password')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Forget password' })
  @ApiOkResponse({
    description: 'Forget password',
    schema: {
      example: {
        message: 'If the email exists, a reset link has been sent.',
      },
    },
  })
  async forgetPassword(@Body() dto: ForgetPasswordDto) {
    return this.authService.forgotPassword(dto);
  }

  @Post('reset-password')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Reset password' })
  @ApiOkResponse({
    description: 'Reset password',
    schema: {
      example: {
        message: 'Password reset successfully',
      },
    },
  })
  async resetPassword(@Body() dto: ResetPasswordDto) {
    return this.authService.resetPassword(dto);
  }
}
