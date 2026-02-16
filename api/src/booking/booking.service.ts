import { PrismaService } from 'src/prisma/prisma.service';

import {
  BadRequestException,
  Injectable,
} from '@nestjs/common';

import { CreateBookingDto } from './dto/create-booking.dto';
import { UpdateBookingDto } from './dto/update-booking.dto';

@Injectable()
export class BookingService {
  constructor(private readonly prisma: PrismaService) { }


  async findAll(page: number = 1, limit: number = 10) {
    page = Math.max(page, 1);
    limit = Math.min(Math.max(limit, 1), 100);
    const skip = (page - 1) * limit;
    const [bookings, total] = await this.prisma.$transaction([
      this.prisma.booking.findMany({
        where: { isDeleted: false },
        orderBy: { title: 'asc' },
        skip,
        take: limit,
      }),
      this.prisma.booking.count({
        where: { isDeleted: false },
      }),
    ])

    return {
      data: bookings,
      meta: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      }
    }
  }


  async findOne(id: string) {
    return this.prisma.booking.findUniqueOrThrow({
      where: { id, isDeleted: false }
    })
  }


  async create(dto: CreateBookingDto) {
    const bookingExists = await this.prisma.booking.findFirst({
      where: {
        assignedUserId: dto.assignedUserId,
        startTime: dto.startTime,
        isDeleted: false
      }
    })
    if (bookingExists) {
      throw new BadRequestException('The assigned user already has a booking at this time')
    }
    const booking = await this.prisma.booking.create({
      data: dto,
    })

    return {
      booking,
      success: true,
      message: `Booking created successfully`
    }
  }


  async update(id: string, dto: UpdateBookingDto) {
    const bookingExists = await this.prisma.booking.findFirst({
      where: {
        id,
        isDeleted: false
      }
    })
    if (!bookingExists) {
      throw new BadRequestException('Booking not found')
    }
    const booking = await this.prisma.booking.update({
      where: { id },
      data: dto
    })


    return {
      booking,
      success: true,
      message: `Booking updated successfully`
    }
  }


  async delete(id: string) {
    await this.prisma.booking.update({
      where: { id },
      data: { isDeleted: true }
    })
  }




}
