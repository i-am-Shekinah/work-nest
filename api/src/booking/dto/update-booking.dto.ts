import {
  IsDateString,
  IsEnum,
  IsOptional,
  IsString,
  Validate,
} from 'class-validator';
import { BookingStatus } from 'generated/prisma/enums';

import {
  ApiProperty,
  ApiPropertyOptional,
} from '@nestjs/swagger';

import { IsBookingTimeValid } from '../validators/is-booking-time-valid';

export class UpdateBookingDto {
  @ApiProperty({ example: 'Conference Room A' })
  @IsString()
  @IsOptional()
  readonly title?: string;


  @ApiPropertyOptional({ example: 'A large conference room with a capacity of 100 people' })
  @IsString()
  @IsOptional()
  readonly description?: string;


  @ApiPropertyOptional({ example: 'CONFIRMED | CANCELLED | PENDING | COMPLETED' })
  @IsEnum(BookingStatus)
  @IsOptional()
  readonly status?: BookingStatus;


  @ApiPropertyOptional({ example: '2026-03-03T14:00:00.000Z' })
  @IsDateString()
  @IsOptional()
  readonly startTime?: string;


  @ApiPropertyOptional({ example: '2026-03-03T16:00:00.000Z' })
  @IsDateString()
  @Validate(IsBookingTimeValid, ['startTime'])
  @IsOptional()
  readonly endTime?: string;


  @ApiPropertyOptional({ example: 'nw7m5p9j9k0q2r4s5t6u7d9w' })
  @IsString()
  @IsOptional()
  readonly assignedUserId?: string;



}
