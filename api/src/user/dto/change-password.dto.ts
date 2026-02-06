import { IsNotEmpty, IsString } from 'class-validator';

import { ApiProperty } from '@nestjs/swagger';

export class ChangePasswordDto {
  @ApiProperty({ example: 'oldPassword123' })
  @IsString()
  @IsNotEmpty()
  readonly oldPassword: string;

  @ApiProperty({ example: 'newPassword123' })
  @IsString()
  @IsNotEmpty()
  readonly newPassword: string;
}
