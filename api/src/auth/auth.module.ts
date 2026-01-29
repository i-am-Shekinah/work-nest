import { PrismaModule } from 'src/prisma/prisma.module';

import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';

import { AuthService } from './auth.service';

@Module({
  imports: [PrismaModule, JwtModule],
  providers: [AuthService],
  exports: [AuthService],
})
export class AuthModule {}
