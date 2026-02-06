import { IsNotEmpty, IsUrl } from 'class-validator';

import { ApiProperty } from '@nestjs/swagger';

export class UpdateProfileDto {
  @ApiProperty({ example: 'https://www.profile-picture.com/avatar1.png' })
  @IsUrl()
  @IsNotEmpty()
  readonly profilePictureUrl: string;
}
