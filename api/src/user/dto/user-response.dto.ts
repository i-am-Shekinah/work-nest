import { IsDate, IsEmail, IsEnum, IsString } from 'class-validator';
import { UserRole, UserStatus } from 'generated/prisma/enums';

import { ApiProperty } from '@nestjs/swagger';

export class UserResponseDto {
  @IsString()
  @ApiProperty({ example: 'nw7m5p9j9k0q2r4s5t6u7v8w' })
  readonly id: string;

  @IsEmail()
  @ApiProperty({ example: 'mail@example.com' })
  readonly email: string;

  @IsString()
  @ApiProperty({ example: 'Work' })
  readonly firstName: string;

  @IsString()
  @ApiProperty({ example: 'Nest' })
  readonly lastName: string;

  @IsEnum(UserRole)
  @ApiProperty({ enum: UserRole, example: UserRole.STAFF })
  readonly role: UserRole;

  @IsEnum(UserStatus)
  @ApiProperty({ enum: UserStatus, example: UserStatus.PENDING })
  status: UserStatus;

  @IsString()
  @ApiProperty({ example: 'nw7m5p9j9k0q2r4s5t6u7v8e' })
  readonly departmentId: string;

  @IsDate()
  @ApiProperty({ example: '2026-01-29T10:20:30.000Z' })
  readonly createdAt: Date;
}
