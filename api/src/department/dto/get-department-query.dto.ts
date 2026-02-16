import { Type } from 'class-transformer';
import {
  IsOptional,
  IsString,
  Max,
  Min,
} from 'class-validator';

export class GetDepartmentQueryDto {
  @IsOptional()
  @IsString()
  search?: string;

  @IsOptional()
  @Type(() => Number)
  page?: number = 1;


  @IsOptional()
  @Type(() => Number)
  @Min(1)
  @Max(100)
  limit?: number = 10;
}