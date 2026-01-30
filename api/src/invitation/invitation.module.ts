import { MailModule } from 'src/mail/mail.module';
import { PrismaModule } from 'src/prisma/prisma.module';

import { Module } from '@nestjs/common';

import { InvitationController } from './invitation.controller';
import { InvitationService } from './invitation.service';

@Module({
  imports: [MailModule, PrismaModule],
  providers: [InvitationService],
  controllers: [InvitationController],
})
export class InvitationModule {}
