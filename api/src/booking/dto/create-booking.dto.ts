import {
  IsDateString,
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsString,
  Validate,
} from 'class-validator';
import { BookingStatus } from 'generated/prisma/enums';

import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

import { IsBookingTimeValid } from '../validators/is-booking-time-valid';

export class CreateBookingDto {
  @ApiProperty({ example: 'Design review' })
  @IsString()
  @IsNotEmpty()
  readonly title: string;

  @ApiPropertyOptional({ example: 'A meeting with Stacy' })
  @IsString()
  @IsOptional()
  readonly description?: string;

  @ApiProperty({ example: 'CONFIRMED | CANCELLED | PENDING | COMPLETED' })
  @IsEnum(BookingStatus)
  readonly status: BookingStatus;

  @ApiProperty({ example: '2026-03-03T14:00:00.000Z' })
  @IsDateString()
  readonly startTime: string;

  @ApiProperty({ example: '2026-03-03T16:00:00.000Z' })
  @IsDateString()
  @Validate(IsBookingTimeValid, ['startTime'])
  readonly endTime: string;

  @ApiProperty({ example: 'nw7m5p9j9k0q2r4s5t6u7d9w' })
  @IsString()
  @IsNotEmpty()
  readonly assignedUserId: string;

  @ApiProperty({ example: 'nw7m5p9j9k0q2r4s5t6u7d9w' })
  @IsString()
  @IsNotEmpty()
  readonly clientId: string;
}
