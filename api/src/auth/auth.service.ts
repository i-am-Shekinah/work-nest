import * as bcrypt from 'bcrypt';
import * as crypto from 'crypto';
import { MailService } from 'src/mail/mail.service';
import { PrismaService } from 'src/prisma/prisma.service';
import { mapUserToAuthResponse } from 'src/user/mappers/user.mapper';

import {
  BadRequestException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';

import { ForgetPasswordDto } from './dto/forget-password.dto';
import { LoginDto } from './dto/login.dto';
import { ResetPasswordDto } from './dto/reset-password.dto';

@Injectable()
export class AuthService {
  constructor(
    private readonly jwtService: JwtService,
    private readonly prisma: PrismaService,
    private readonly configService: ConfigService,
    private readonly mailService: MailService,
  ) {}

  async login(dto: LoginDto) {
    const { email, password } = dto;

    const fullUser = await this.prisma.user.findUnique({
      where: { email: email.toLowerCase() },
      include: { department: true, headedDepartment: true },
    });

    // fake hash to normalize response time
    const fakeHash =
      '$2a$10$Z55yvUWYa6mWIVa/4YpBz.1w17gMjjaQ8oCSI1FScahPGM2mZP4Xa';

    if (!fullUser || fullUser.hashedPassword === null) {
      await bcrypt.compare(password, fakeHash);
      throw new UnauthorizedException('Invalid credentials');
    }

    const isMatch = await bcrypt.compare(password, fullUser.hashedPassword);

    if (!isMatch) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const payload = {
      sub: fullUser.id,
      email,
      role: fullUser.role,
    };
    const token = await this.jwtService.signAsync(payload);
    const user = mapUserToAuthResponse(fullUser);

    return {
      user,
      token,
    };
  }

  async forgotPassword(dto: ForgetPasswordDto) {
    const { email } = dto;
    const user = await this.prisma.user.findUnique({
      where: { email },
    });

    if (!user) {
      return {
        message: 'If the email exists, a reset link has been sent.',
      };
    }

    const rawToken = crypto.randomBytes(32).toString('hex');

    const hashedToken = crypto
      .createHash('sha256')
      .update(rawToken)
      .digest('hex');

    await this.prisma.user.update({
      where: { id: user.id },
      data: {
        resetPasswordToken: hashedToken,
        resetPasswordExpires: new Date(Date.now() + 1000 * 60 * 60),
      },
    });

    const resetLink = `${this.configService.get('FRONTEND_URL')}/reset-password?token=${rawToken}`;

    await this.mailService.sendPasswordReset(
      user.email,
      user.firstName,
      resetLink,
    );

    return {
      message: 'If the email exists, a reset link has been sent.',
    };
  }

  async resetPassword(dto: ResetPasswordDto) {
    const { token, password } = dto;

    const hashedToken = crypto.createHash('sha256').update(token).digest('hex');

    const user = await this.prisma.user.findFirst({
      where: {
        resetPasswordToken: hashedToken,
        resetPasswordExpires: {
          gt: new Date(),
        },
      },
    });

    if (!user) {
      throw new BadRequestException('Invalid or expired reset token');
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    await this.prisma.user.update({
      where: { id: user.id },
      data: {
        hashedPassword,
        resetPasswordExpires: null,
        resetPasswordToken: null,
      },
    });

    return {
      message: 'Password reset successfully',
    };
  }
}
