import { IsEmail, IsNotEmpty, IsString } from 'class-validator';

import { ApiProperty } from '@nestjs/swagger';

export class LoginDto {
  @ApiProperty({ example: 'mail@example.com' })
  @IsEmail()
  readonly email: string;

  @ApiProperty({ example: 'some_password' })
  @IsString()
  @IsNotEmpty()
  readonly password: string;
}
