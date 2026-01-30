import { IsEmail, IsEnum, IsNotEmpty, IsString } from 'class-validator';
import { UserRole } from 'generated/prisma/enums';

import { ApiProperty } from '@nestjs/swagger';

export class InviteUserDto {
  @ApiProperty({ example: 'mail@example.com' })
  @IsEmail()
  readonly email: string;

  @ApiProperty({ example: 'Work' })
  @IsString()
  @IsNotEmpty()
  readonly firstName: string;

  @ApiProperty({ example: 'Nest' })
  @IsString()
  @IsNotEmpty()
  readonly lastName: string;

  @ApiProperty({ example: 'STAFF' })
  @IsEnum(UserRole)
  readonly role: UserRole;

  @ApiProperty({ example: 'nw7m5p9j9k0q2r4s5t6u7v8w' })
  @IsString()
  @IsNotEmpty()
  readonly departmentId: string;
}
