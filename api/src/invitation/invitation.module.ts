import { MailModule } from 'src/mail/mail.module';
import { PrismaModule } from 'src/prisma/prisma.module';

import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';

import { InvitationController } from './invitation.controller';
import { InvitationService } from './invitation.service';

@Module({
  imports: [MailModule, PrismaModule, JwtModule],
  providers: [InvitationService],
  controllers: [InvitationController],
})
export class InvitationModule {}
