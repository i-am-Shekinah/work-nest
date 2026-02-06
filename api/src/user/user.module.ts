import { PrismaModule } from 'src/prisma/prisma.module';

import { Module } from '@nestjs/common';

import { UserController } from './user.controller';
import { UserService } from './user.service';

@Module({
  imports: [PrismaModule],
  exports: [],
  providers: [UserService],
  controllers: [UserController],
})
export class UserModule {}
