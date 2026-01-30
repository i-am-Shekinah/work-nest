import * as bcrypt from 'bcrypt';
import { PrismaService } from 'src/prisma/prisma.service';
import { mapUserToAuthResponse } from 'src/user/mappers/user.mapper';

import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

import { LoginDto } from './dto/login.dto';

@Injectable()
export class AuthService {
  constructor(
    private readonly jwtService: JwtService,
    private readonly prisma: PrismaService,
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
}
