import { PrismaModule } from 'src/prisma/prisma.module';

import { Module } from '@nestjs/common';

import { BookingController } from './booking.controller';
import { BookingService } from './booking.service';

@Module({
  imports: [PrismaModule],
  providers: [BookingService],
  controllers: [BookingController],
})
export class BookingModule {}
