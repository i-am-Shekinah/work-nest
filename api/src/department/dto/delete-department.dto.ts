import { IsEnum, IsOptional, IsString } from 'class-validator';

import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export enum DepartmentDeleteAction {
  NONE = 'NONE',
  REASSIGN = 'REASSIGN',
  DEACTIVATE = 'DEACTIVATE',
}

export class DeleteDepartmentDto {
  @ApiProperty({
    enum: DepartmentDeleteAction,
    description: 'Action to perform when deleting a department',
    example: DepartmentDeleteAction.REASSIGN,
  })
  @IsEnum(DepartmentDeleteAction, {
    message: `action must be one of: ${Object.values(DepartmentDeleteAction).join(', ')}`,
  })
  action: DepartmentDeleteAction;

  @ApiPropertyOptional({
    description:
      'ID of the department to reassign employees to (required if action is REASSIGN)',
    example: 'nw7m5p9j9k0q2r4s5t6u7d9w',
  })
  @IsString()
  @IsOptional()
  reassignedDepartmentId?: string;
}
