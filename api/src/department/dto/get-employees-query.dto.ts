import {
  IsOptional,
  IsString,
} from 'class-validator';

import { ApiPropertyOptional } from '@nestjs/swagger';

export class GetEmployeesQueryDto {
  @ApiPropertyOptional({
    description: 'Filter employees by department ID',
  })
  @IsString()
  @IsOptional()
  readonly departmentId?: string;
}