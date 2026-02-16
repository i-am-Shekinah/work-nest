import { UserRole } from 'generated/prisma/enums';
import { Roles } from 'src/auth/decorators/roles.decorator';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth-guard';
import { RolesGuard } from 'src/auth/guards/roles.guard';

import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Patch,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiCreatedResponse,
  ApiNoContentResponse,
  ApiOkResponse,
  ApiOperation,
  ApiQuery,
  ApiTags,
} from '@nestjs/swagger';

import { BookingService } from './booking.service';
import { CreateBookingDto } from './dto/create-booking.dto';
import { GetBookingsQueryDto } from './dto/get-bookings-query.dto';
import { UpdateBookingDto } from './dto/update-booking.dto';

@ApiTags('Booking')
@Controller('booking')
@UseGuards(JwtAuthGuard, RolesGuard)
export class BookingController {
  constructor(private readonly bookingService: BookingService) { }

  @Get()
  @Roles(UserRole.ADMIN, UserRole.STAFF)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get bookings with search & filters' })
  @ApiOkResponse({
    description: 'List of bookings',
    schema: {
      example: {
        bookings: [
          {
            id: 'nw7m5p9j9k0q2r4s5t6u7v8w',
            title: 'Weekly Team Meeting',
            description: 'Internal meeting to discuss project updates and blockers',
            status: 'CONFIRMED',
            startTime: '2026-01-29T10:20:30.000Z',
            endTime: '2026-01-29T12:20:30.000Z',
            createdAt: '2026-01-29T10:20:30.000Z',
            updatedAt: '2026-01-29T10:20:30.000Z',
          },
          {
            id: 'nw7m5p9j9k0q2r4s5t6u7v8x',
            title: 'Project Kickoff',
            description: 'Initial meeting with John to discuss project scope and deliverables',
            status: 'CANCELLED',
            startTime: '2026-01-29T10:20:30.000Z',
            endTime: '2026-01-29T12:20:30.000Z',
            createdAt: '2026-01-29T10:20:30.000Z',
            updatedAt: '2026-01-29T10:20:30.000Z',
          }
        ]
      }
    }
  })
  @ApiQuery({ name: 'search', required: false, description: 'Search by title or description', example: 'team' })
  @ApiQuery({ name: 'status', required: false, description: 'Filter by booking status', example: 'CONFIRMED', enum: ['CONFIRMED', 'CANCELLED', 'PENDING'] })
  @ApiQuery({ name: 'startDate', required: false, description: 'Filter bookings starting from this date', example: '2026-01-01T00:00:00Z' })
  @ApiQuery({ name: 'endDate', required: false, description: 'Filter bookings up to this date', example: '2026-01-31T23:59:59Z' })

  @ApiQuery({ name: 'page', required: false, example: 1 })
  @ApiQuery({ name: 'limit', required: false, example: 10 })
  async findAll(@Query() dto: GetBookingsQueryDto) {
    return this.bookingService.findAll(dto);
  }


  @Get(':bookingId')
  @Roles(UserRole.ADMIN, UserRole.STAFF)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get booking by ID' })
  @ApiOkResponse({
    description: 'The booking details',
    schema: {
      example: {
        id: 'nw7m5p9j9k0q2r4s5t6u7v8w',
        title: 'Design Review Meeting',
        description: 'Review design documents with Bob',
        status: 'CONFIRMED',
        startTime: '2026-01-29T10:20:30.000Z',
        endTime: '2026-01-29T12:20:30.000Z',
        createdAt: '2026-01-29T10:20:30.000Z',
        updatedAt: '2026-01-29T10:20:30.000Z',
      }
    }
  })
  async findOne(@Param('bookingId') bookingId: string) {
    return this.bookingService.findOne(bookingId);
  }

  // TODO: Test when ClientID is available...
  @Post()
  @HttpCode(HttpStatus.CREATED)
  @Roles(UserRole.ADMIN, UserRole.STAFF)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Create a new booking' })
  @ApiCreatedResponse({
    description: 'The booking has been successfully created',
    schema: {
      example: {
        booking: {
          id: 'nw7m5p9j9k0q2r4s5t6u7v8w',
          title: 'Project Kickoff',
          description: 'Initial meeting with Alice to discuss project scope and deliverables',
          status: 'CONFIRMED',
          startTime: '2026-01-29T10:20:30.000Z',
          endTime: '2026-01-29T12:20:30.000Z',
          createdAt: '2026-01-29T10:20:30.000Z',
          updatedAt: '2026-01-29T10:20:30.000Z',
        },
        success: true,
        message: 'Booking created successfully',
      }
    }
  })
  async create(@Body() dto: CreateBookingDto) {
    return this.bookingService.create(dto);
  }


  @Patch(':bookingId')
  @Roles(UserRole.ADMIN, UserRole.STAFF)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Update an existing booking' })
  @ApiOkResponse({
    description: 'The booking has been successfully updated',
    schema: {
      example: {
        booking: {
          id: 'nw7m5p9j9k0q2r4s5t6u7v8w',
          title: 'Updated Meeting Title',
          description: 'Updated meeting description',
          status: 'CONFIRMED',
          startTime: '2026-01-29T10:20:30.000Z',
          endTime: '2026-01-29T12:20:30.000Z',
          createdAt: '2026-01-29T10:20:30.000Z',
          updatedAt: '2026-01-29T11:35:45.456Z',
        },
        success: true,
        message: 'Booking updated successfully',
      }
    }
  })
  async update(@Param('bookingId') bookingId: string, @Body() dto: UpdateBookingDto) {
    return this.bookingService.update(bookingId, dto);
  }


  @Delete(':bookingId')
  @Roles(UserRole.ADMIN, UserRole.STAFF)
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Delete a booking' })
  @ApiNoContentResponse({
    description: 'The booking has been successfully deleted',
    schema: {
      example: {
        success: true,
        message: 'Booking deleted successfully',
      }
    }
  })
  async delete(@Param('bookingId') bookingId: string) {
    return this.bookingService.delete(bookingId);
  }




}
