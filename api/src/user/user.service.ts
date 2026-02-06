import * as bcrypt from 'bcrypt';
import { PrismaService } from 'src/prisma/prisma.service';

import { BadRequestException, Injectable } from '@nestjs/common';

import { ChangePasswordDto } from './dto/change-password.dto';
import { UpdateProfileDto } from './dto/update-profile.dto';
import { mapUserToAuthResponse } from './mappers/user.mapper';

@Injectable()
export class UserService {
  constructor(private readonly prisma: PrismaService) {}

  async getProfile(userId: string) {
    if (!userId) {
      throw new BadRequestException('User ID is required');
    }

    const user = await this.prisma.user.findUniqueOrThrow({
      where: { id: userId },
      include: {
        department: true,
        headedDepartment: true,
      },
    });

    return mapUserToAuthResponse(user);
  }

  async updateProfilePicture(userId: string, dto: UpdateProfileDto) {
    return await this.prisma.user.update({
      where: { id: userId },
      data: dto,
    });
  }

  async changePassword(userId: string, dto: ChangePasswordDto) {
    const { oldPassword, newPassword } = dto;

    const user = await this.prisma.user.findUniqueOrThrow({
      where: { id: userId },
    });

    if (!user.hashedPassword) {
      throw new BadRequestException('Cannot change password for this account');
    }

    const isMatch = await bcrypt.compare(oldPassword, user.hashedPassword);
    if (!isMatch) {
      throw new BadRequestException('Old password is incorrect');
    }

    const hashed = await bcrypt.hash(newPassword, 10);
    await this.prisma.user.update({
      where: { id: userId },
      data: { hashedPassword: hashed },
    });

    return {
      message: 'Password updated successfully',
    };
  }
}
