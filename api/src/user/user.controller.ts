import { CurrentUser } from 'src/auth/decorators/current-user.decorator';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth-guard';

import { Body, Controller, Get, Patch, Req, UseGuards } from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';

import { ChangePasswordDto } from './dto/change-password.dto';
import { UpdateProfileDto } from './dto/update-profile.dto';
import { UserService } from './user.service';

@ApiTags('User')
@Controller('me')
@UseGuards(JwtAuthGuard)
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get()
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get current user profile' })
  @ApiOkResponse({
    description: 'Current user profile retrieved successfully',
    schema: {
      example: {
        user: {
          id: 'nw7m5p9j9k0q2r4s5t6u7v8w',
          email: 'mail@example.com',
          firstName: 'Work',
          lastName: 'Nest',
          role: 'STAFF',
          status: 'PENDING',
          profilePictureUrl: 'https://example.com/profile.jpg',
          departmentId: 'nw7m5p9j9k0q2r4s5t6u7v8w',
          departmentName: 'Engineering',
          headedDepartmentId: 'nw7m5p9j9k0q2r4s5t6u7v8w',
          headedDepartmentName: 'Engineering',
          createdAt: '2026-01-29T10:20:30.000Z',
        },
      },
    },
  })
  async getProfile(@CurrentUser('id') userId: string, @Req() req: any) {
    return this.userService.getProfile(userId);
  }

  @Patch('update-profile-picture')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Update profile picture' })
  @ApiOkResponse({
    description: 'Profile picture updated successfully',
    schema: {
      example: {
        user: {
          id: 'nw7m5p9j9k0q2r4s5t6u7v8w',
          email: 'mail@example.com',
          firstName: 'Work',
          lastName: 'Nest',
          role: 'STAFF',
          status: 'PENDING',
          profilePictureUrl: 'https://example.com/profile.jpg',
          departmentId: 'nw7m5p9j9k0q2r4s5t6u7v8w',
          departmentName: 'Engineering',
          headedDepartmentId: 'nw7m5p9j9k0q2r4s5t6u7v8w',
          headedDepartmentName: 'Engineering',
          createdAt: '2026-01-29T10:20:30.000Z',
        },
      },
    },
  })
  async updateProfilePicture(
    @CurrentUser('id') userId: string,
    @Body() dto: UpdateProfileDto,
  ) {
    return this.userService.updateProfilePicture(userId, dto);
  }

  @Patch('change-password')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Change user password' })
  @ApiOkResponse({
    description: 'Password changed successfully',
    schema: {
      example: {
        message: 'Password updated successfully',
      },
    },
  })
  async changePassword(
    @CurrentUser('id') userId: string,
    @Body() dto: ChangePasswordDto,
  ) {
    return this.userService.changePassword(userId, dto);
  }
}
