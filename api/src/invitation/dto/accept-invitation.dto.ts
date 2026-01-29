import { IsNotEmpty, IsString } from 'class-validator';

import { ApiProperty } from '@nestjs/swagger';

export class AcceptInvitationDto {
  @ApiProperty({ example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...' })
  @IsString()
  @IsNotEmpty()
  readonly token: string;

  @ApiProperty({ example: 'Work' })
  @IsString()
  readonly firstName?: string;

  @ApiProperty({ example: 'Nest' })
  @IsString()
  readonly lastName?: string;

  @ApiProperty({ example: 'some_password' })
  @IsString()
  @IsNotEmpty()
  readonly password: string;
}
