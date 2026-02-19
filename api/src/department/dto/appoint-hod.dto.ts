import { IsOptional, IsString } from 'class-validator';

import { ApiPropertyOptional } from '@nestjs/swagger';

export class AppointHODDto {
  @ApiPropertyOptional({ example: 'nw7m5p9j9k0q2r4s5t6u7d9w' })
  @IsString()
  @IsOptional()
  readonly userId?: string | null;
}
