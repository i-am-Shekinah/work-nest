import { JwtAuthGuard } from 'src/auth/guards/jwt-auth-guard';
import { RolesGuard } from 'src/auth/guards/roles.guard';
import { Roles } from 'src/auth/roles.decorator';
import { UserRole } from 'src/types';

import {
  Body,
  Controller,
  Post,
  UseGuards,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';

import { AcceptInvitationDto } from './dto/accept-invitation.dto';
import { InviteUserDto } from './dto/invite-user.dto';
import { InvitationService } from './invitation.service';

@ApiTags('Invitation')
@Controller('invitation')
@UseGuards(JwtAuthGuard, RolesGuard)
export class InvitationController {

  constructor(private readonly invitationService: InvitationService) { }

  @Post('invite-user')
  @Roles(UserRole.ADMIN)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Invite a user to the system' })
  async inviteUser(@Body() dto: InviteUserDto) {
    return this.invitationService.inviteUser(dto);
  }

  @Post('accept-invite')
  @ApiOperation({ summary: 'Accept an invitation' })
  async acceptUser(@Body() dto: AcceptInvitationDto) {
    return this.invitationService.acceptInvitation(dto);
  }
}
