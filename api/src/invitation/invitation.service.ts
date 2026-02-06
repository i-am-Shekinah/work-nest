import * as bcrypt from 'bcrypt';
import { PrismaClient, UserRole, UserStatus } from 'generated/prisma/client';
import { MailService } from 'src/mail/mail.service';
import { PrismaService } from 'src/prisma/prisma.service';
import { mapUserToAuthResponse } from 'src/user/mappers/user.mapper';

import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';

import { AcceptInvitationDto } from './dto/accept-invitation.dto';
import { InviteUserDto } from './dto/invite-user.dto';

@Injectable()
export class InvitationService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly jwtService: JwtService,
    private readonly mailService: MailService,
    private readonly configService: ConfigService,
  ) {}

  async inviteUser(dto: InviteUserDto) {
    const { email, firstName, lastName, role, departmentId } = dto;

    const user = await this.prisma.$transaction(
      async (tx: PrismaClient) => {
        const existingUser = await this.prisma.user.findUnique({
          where: { email: email },
          include: { department: true, headedDepartment: true },
        });

        if (existingUser) return existingUser;

        return await this.prisma.user.create({
          data: {
            email,
            firstName,
            lastName,
            role,
            departmentId,
          },
          include: {
            department: true,
            headedDepartment: true,
          },
        });
      },
      { timeout: 10000 },
    );

    const token = await this.jwtService.signAsync(
      {
        sub: user.id,
        email,
        role,
      },
      { expiresIn: '7d' },
    );

    const invitationLink = `${this.configService.get(
      'FRONTEND_URL',
    )}/register?token=${token}`;

    try {
      await this.mailService.sendUserInvitation(
        email,
        firstName,
        lastName,
        invitationLink,
      );
    } catch (error) {
      console.error('Failed to send invitation email:', error);
    }

    return {
      user: mapUserToAuthResponse(user),
    };
  }

  async acceptInvitation(dto: AcceptInvitationDto) {
    const { token, password, firstName, lastName, profilePictureUrl } = dto;
    let payload: { sub: string; email: string; role: UserRole };

    try {
      payload = await this.jwtService.verifyAsync(token);
    } catch (error) {
      throw new UnauthorizedException('Invalid or expired invitation token');
    }

    const existingUser = await this.prisma.user.findUnique({
      where: { id: payload.sub },
    });

    if (existingUser?.status === UserStatus.ACTIVE) {
      throw new UnauthorizedException(
        'The invitation has already been accepted',
      );
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
          profilePictureUrl,
        },
      });

      const token = await this.jwtService.signAsync({
        sub: user.id,
        email: user.email,
        role: user.role,
      });

      return { token };
    });
  }
}
