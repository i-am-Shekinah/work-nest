import { IsEmail } from 'class-validator';

import { ApiProperty } from '@nestjs/swagger';

export class ForgetPasswordDto {
  @ApiProperty({ example: 'mail@example.com' })
  @IsEmail()
  email: string;
}
