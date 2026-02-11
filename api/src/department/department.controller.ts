import { UserRole } from 'generated/prisma/enums';
import { Roles } from 'src/auth/decorators/roles.decorator';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth-guard';
import { RolesGuard } from 'src/auth/guards/roles.guard';

import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Patch,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiCreatedResponse,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';

import { DepartmentService } from './department.service';
import { AppointHODDto } from './dto/appoint-hod.dto';
import { CreateDepartmentDto } from './dto/create-department.dto';
import { DeleteDepartmentDto } from './dto/delete-deparment.dto';
import { GetEmployeesQueryDto } from './dto/get-employees-query.dto';
import { UpdateDepartmentNameDto } from './dto/update-department-name.dto';

@ApiTags('Department')
@Controller('department')
@UseGuards(JwtAuthGuard, RolesGuard)
export class DepartmentController {

  constructor(private readonly departmentService: DepartmentService) { }


  @Get()
  @Roles(UserRole.ADMIN)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get all departments' })
  @ApiOkResponse({
    description: 'List of departments',
    schema: {
      example: {
        departments: [
          {
            id: 'nw7m5p9j9k0q2r4s5t6u7v8w',
            name: 'Administration',
            hodId: 'nw7m5p9j9k0q2r4s5t6u7d9w',
            createdAt: '2026-01-29T10:20:30.000Z',
            updatedAt: '2026-01-29T10:20:30.000Z',
          },
          {
            id: 'nw7m5p9j9k0q2r4s5t6u7v8x',
            name: 'Engineering',
            hodId: null,
            createdAt: '2026-01-29T10:20:30.000Z',
            updatedAt: '2026-01-29T10:20:30.000Z',
          }
        ]
      }
    }
  })
  async findAll() {
    return this.departmentService.findAll();
  }


  @Get('employees')
  @Roles(UserRole.ADMIN)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get all employees', description: 'Optionally filter by department ID using query parameter ?departmentId=' })
  @ApiOkResponse({
    description: 'List of employees in the department',
    schema: {
      example: {
        employees: [
          {
            id: 'nw7m5p9j9k0q2r4s5t6u7d9w',
            name: 'John Doe',
            email: 'john.doe@example.com',
          }
        ]
      }
    }
  })
  async getEmployees(@Query() dto: GetEmployeesQueryDto) {
    return this.departmentService.getEmployees(dto);
  }


  @Get('search/:name')
  @Roles(UserRole.ADMIN)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Search departments by name' })
  @ApiOkResponse({
    description: 'List of departments matching the search criteria',
    schema: {
      example: {
        departments: [
          {
            id: 'nw7m5p9j9k0q2r4s5t6u7v8w',
            name: 'Administration',
            hodId: 'nw7m5p9j9k0q2r4s5t6u7d9w',
            createdAt: '2026-01-29T10:20:30.000Z',
            updatedAt: '2026-01-29T10:20:30.000Z',
          }
        ]
      }
    }
  })
  async searchByName(@Param('name') name: string) {
    return this.departmentService.searchByName(name);
  }


  @Get(':departmentId')
  @Roles(UserRole.ADMIN)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get a department by ID' })
  @ApiOkResponse({
    description: 'The department details',
    schema: {
      example: {
        id: 'nw7m5p9j9k0q2r4s5t6u7v8w',
        name: 'Administration',
        hodId: 'nw7m5p9j9k0q2r4s5t6u7d9w',
        createdAt: '2026-01-29T10:20:30.000Z',
        updatedAt: '2026-01-29T10:20:30.000Z',
      }
    }
  })
  async findOne(@Param('departmentId') departmentId: string) {
    return this.departmentService.findOne(departmentId);
  }


  @Delete(':departmentId/delete')
  @Roles(UserRole.ADMIN)
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Soft delete a department' })
  @ApiOkResponse({
    description: 'The deleted department details',

  })
  async delete(@Param('departmentId') departmentId: string, @Body() dto: DeleteDepartmentDto) {
    return this.departmentService.delete(departmentId, dto);
  }


  @Post(':departmentId/hod')
  @Roles(UserRole.ADMIN)
  @HttpCode(HttpStatus.OK)
  @ApiBearerAuth()
  @ApiOperation({
    summary: 'Appoint or Remove a Head of Department (HOD)', description: 'To remove HOD, set the userId in the request body to null'
  })
  @ApiOkResponse({
    description: 'HOD appointed successfully',
    schema: {
      example: {
        department: {
          id: 'nw7m5p9j9k0q2r4s5t6u7v8w',
          name: 'Administration',
          hodId: 'nw7m5p9j9k0q2r4s5t6u7d9w',
          createdAt: '2026-01-29T10:20:30.000Z',
          updatedAt: '2026-01-29T10:20:30.000Z',
        },
        success: true,
        message: 'HOD appointed successfully',
      }
    }
  })
  async appointHOD(@Param('departmentId') departmentId: string, @Body() dto: AppointHODDto) {
    return this.departmentService.updateHOD(departmentId, dto);
  }


  @Patch(':departmentId/update-name')
  @Roles(UserRole.ADMIN)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Update department name' })
  @ApiOkResponse({
    description: 'Department name updated successfully',
    schema: {
      example: {
        department: {
          id: 'nw7m5p9j9k0q2r4s5t6u7v8w',
          name: 'Updated Administration',
          hodId: null,
          createdAt: '2026-01-29T10:20:30.000Z',
          updatedAt: '2026-01-29T10:20:30.000Z',
        },
        message: 'Department name updated to Updated Administration successfully',
      }
    }
  })
  async update(@Param('departmentId') departmentId: string, @Body() dto: UpdateDepartmentNameDto) {
    return this.departmentService.update(departmentId, dto);
  }



  @Get('employee/:employeeId')
  @HttpCode(HttpStatus.OK)
  @Roles(UserRole.ADMIN)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get an employee by ID' })
  @ApiOkResponse({
    description: 'The employee details',
    schema: {
      example: {
        id: 'nw7m5p9j9k0q2r4s5t6u7d9w',
        name: 'John Doe',
        email: 'john.doe@example.com',
      }
    }
  })
  async getEmployeeById(@Param('employeeId') employeeId: string) {
    return this.departmentService.getEmployeeById(employeeId);
  }


  @Post()
  @HttpCode(HttpStatus.CREATED)
  @Roles(UserRole.ADMIN)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Create a new department' })
  @ApiCreatedResponse({
    description: 'The created department details',
    schema: {
      example: {
        department: {
          id: 'nw7m5p9j9k0q2r4s5t6u7v8w',
          name: 'Administration',
          hodId: null,
          createdAt: '2026-01-29T10:20:30.000Z',
          updatedAt: '2026-01-29T10:20:30.000Z',
        },
        message: 'Department Administration created successfully'
      }
    }
  })
  async create(@Body() dto: CreateDepartmentDto) {
    return this.departmentService.create(dto);
  }



}
