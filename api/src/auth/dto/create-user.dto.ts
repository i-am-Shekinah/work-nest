import { IsEmail, IsNotEmpty, IsString } from 'class-validator';

import { ApiProperty } from '@nestjs/swagger';

export class CreateUserDto {
  @ApiProperty({ example: 'mail@example.com' })
  @IsEmail()
  readonly email: string;

  @ApiProperty({ example: 'some_password' })
  @IsString()
  @IsNotEmpty()
  readonly password: string;

  @ApiProperty({ example: 'Work' })
  @IsString()
  @IsNotEmpty()
  readonly firstName: string;

  @ApiProperty({ example: 'Nest' })
  @IsString()
  @IsNotEmpty()
  readonly lastName: string;
}
