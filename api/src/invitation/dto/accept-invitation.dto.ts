import { IsNotEmpty, IsOptional, IsString, IsUrl } from 'class-validator';

import { ApiProperty } from '@nestjs/swagger';

export class AcceptInvitationDto {
  @ApiProperty({ example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...' })
  @IsString()
  @IsNotEmpty()
  readonly token: string;

  @ApiProperty({ example: 'Work' })
  @IsOptional()
  @IsString()
  readonly firstName?: string;

  @ApiProperty({ example: 'Nest' })
  @IsOptional()
  @IsString()
  readonly lastName?: string;

  @ApiProperty({ example: 'some_password' })
  @IsString()
  @IsNotEmpty()
  readonly password: string;

  @ApiProperty({
    example: 'https://www.profile-picture-avatar.com/avatar1.png',
  })
  @IsOptional()
  @IsUrl()
  readonly profilePictureUrl?: string;
}
