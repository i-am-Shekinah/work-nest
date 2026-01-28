import * as bcrypt from 'bcrypt';
import {
  PrismaClient,
  UserRole,
} from 'generated/prisma/client';
import { MailService } from 'src/mail/mail.service';
import { PrismaService } from 'src/prisma/prisma.service';
import { UserStatus } from 'src/types';

import {
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

import { AcceptInvitationDto } from './dto/accept-invitation.dto';
import { InviteUserDto } from './dto/invite-user.dto';

@Injectable()
export class InvitationService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly jwtService: JwtService,
    private readonly mailService: MailService,
  ) { }

  async inviteUser(dto: InviteUserDto) {
    const { email, firstName, lastName, role, departmentId } = dto;

    return await this.prisma.$transaction(async (tx: PrismaClient) => {

      let user = await this.prisma.user.findUnique({
        where: { email: email },
      });

      if (!user) {
        user = await this.prisma.user.create({
          data: {
            email,
            firstName,
            lastName,
            role,
            departmentId
          },
        })
      }

      const token = await this.jwtService.signAsync(
        {
          sub: user.id,
          email,
          role,
        },
        { expiresIn: '7d' },
      );

      await this.mailService.sendUserInvitation(
        email,
        firstName,
        lastName,
        token,
      );

      return {
        token,
        user,
      };
    })

  }

  async acceptInvitation(dto: AcceptInvitationDto) {
    const { token, password, firstName, lastName } = dto;
    let payload: { sub: string, email: string, role: UserRole }

    try {
      payload = await this.jwtService.verifyAsync(token);
    } catch (error) {
      throw new UnauthorizedException('Invalid or expired invitation token');
    }

    return await this.prisma.$transaction(async (tx: PrismaClient) => {
      const hashedPassword = await bcrypt.hash(password, 10);

      const user = await tx.user.update({
        where: { id: payload.sub },
        data: {
          hashedPassword,
          status: UserStatus.ACTIVE,
          firstName,
          lastName,
        },
      });

      const jwt = await this.jwtService.signAsync({
        sub: user.id,
        email: user.email,
        role: user.role,
      });

      return jwt;
    })
  }
}
