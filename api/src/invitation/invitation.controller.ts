import { UserRole } from 'generated/prisma/enums';
import { Public } from 'src/auth/decorators/public.decorator';
import { Roles } from 'src/auth/decorators/roles.decorator';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth-guard';
import { RolesGuard } from 'src/auth/guards/roles.guard';

import { Body, Controller, Post, UseGuards } from '@nestjs/common';
import {
  ApiBadRequestResponse,
  ApiBearerAuth,
  ApiForbiddenResponse,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';

import { AcceptInvitationDto } from './dto/accept-invitation.dto';
import { InviteUserDto } from './dto/invite-user.dto';
import { InvitationService } from './invitation.service';

@ApiTags('Invitation')
@Controller('invitation')
@UseGuards(JwtAuthGuard, RolesGuard)
export class InvitationController {
  constructor(private readonly invitationService: InvitationService) {}

  @Post('invite-user')
  @Roles(UserRole.ADMIN)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Invite a user to the system' })
  @ApiOkResponse({
    description: 'User invited successfully',
    schema: {
      example: {
        user: {
          id: 'nw7m5p9j9k0q2r4s5t6u7v8w',
          email: 'mail@example.com',
          firstName: 'Work',
          lastName: 'Nest',
          role: 'STAFF',
          status: 'PENDING',
          departmentId: 'nw7m5p9j9k0q2r4s5t6u7v8w',
          createdAt: '2026-01-29T10:20:30.000Z',
        },
        token: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...',
      },
    },
  })
  @ApiBadRequestResponse({
    description: 'Invalid request payload',
  })
  @ApiForbiddenResponse({
    description: 'Forbidden (Admin only)',
  })
  @ApiUnauthorizedResponse({
    description: 'Unauthorized',
  })
  async inviteUser(@Body() dto: InviteUserDto) {
    return this.invitationService.inviteUser(dto);
  }

  @Public()
  @Post('accept-invite')
  @ApiOperation({ summary: 'Accept an invitation' })
  @ApiOkResponse({
    description: 'Invitation accepted successfully',
    schema: {
      example: {
        accessToken: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...',
      },
    },
  })
  @ApiUnauthorizedResponse({
    description: 'Invalid or expired invitation token',
  })
  @ApiBadRequestResponse({
    description: 'Invalid request payload',
  })
  async acceptUser(@Body() dto: AcceptInvitationDto) {
    const token = await this.invitationService.acceptInvitation(dto);
    return { token };
  }
}
