import { UserStatus } from 'generated/prisma/enums';
import { PrismaService } from 'src/prisma/prisma.service';
import { mapUserToAuthResponse } from 'src/user/mappers/user.mapper';

import {
  BadRequestException,
  Injectable,
} from '@nestjs/common';

import { AppointHODDto } from './dto/appoint-hod.dto';
import { CreateDepartmentDto } from './dto/create-department.dto';
import { GetEmployeesQueryDto } from './dto/get-employees-query.dto';
import { UpdateDepartmentNameDto } from './dto/update-department-name.dto';

@Injectable()
export class DepartmentService {
  constructor(
    private readonly prisma: PrismaService,
  ) { }


  async findAll() {
    const departments = await this.prisma.department.findMany({
      where: { isDeleted: false },
      orderBy: { createdAt: 'asc' },
    });

    return {
      departments
    }
  }


  async findOne(id: string) {
    return this.prisma.department.findUniqueOrThrow({
      where: { id, isDeleted: false },
    })
  }


  async create(dto: CreateDepartmentDto) {
    const deptExists = await this.prisma.department.findFirst({
      where: {
        name: dto.name,
        isDeleted: false,
      },
    })
    if (deptExists) {
      throw new BadRequestException(`An active ${deptExists.name} department already exists`);
    }

    const dept = await this.prisma.department.create({
      data: dto,
    })

    return {
      department: dept,
      message: `${dept.name} department created successfully`,
    }
  }


  async delete(departmentId: string) {
    const deptExists = await this.prisma.department.findFirst({
      where: { id: departmentId, isDeleted: false },
    })

    if (!deptExists) {
      throw new BadRequestException('Department not found or already deleted');
    }

    await this.prisma.department.update({
      where: { id: departmentId },
      data: { deletedAt: new Date(), isDeleted: true, },
    })

    return {
      success: true,
      message: 'Department deleted successfully',
    }
  }


  async updateHOD(departmentId: string, dto: AppointHODDto) {
    const { userId } = dto;

    const dept = await this.prisma.department.findUnique({
      where: { id: departmentId, isDeleted: false },
    });

    if (!dept) {
      throw new BadRequestException('Department not found');
    }

    if (userId) {
      const user = await this.prisma.user.findUnique({
        where: { id: userId },
      });

      if (!user) {
        throw new BadRequestException('User not found');
      }

      if (user.departmentId !== departmentId) {
        throw new BadRequestException('User does not belong to this department');
      }

      await this.prisma.department.update({
        where: { id: departmentId },
        data: { hodId: userId },
      });

      return {
        department: dept,
        success: true,
        message: `${user.firstName} ${user.lastName} has been appointed as the HOD of ${dept.name}`,
      }

    } else {
      await this.prisma.department.update({
        where: { id: departmentId },
        data: { hodId: null },
      })
      return {
        department: dept,
        success: true,
        message: 'HOD removed successfully',
      }
    }

  }


  async update(departmentId: string, dto: UpdateDepartmentNameDto) {
    const { name } = dto;

    const dept = await this.prisma.department.findUnique({
      where: { id: departmentId, isDeleted: false },
    });

    if (!dept) {
      throw new BadRequestException('Department not found');
    }

    await this.prisma.department.update({
      where: { id: departmentId },
      data: { name },
    });

    return {
      department: dept,
      message: `Department name updated to ${name} successfully`,
    }
  }


  async getEmployees(dto: GetEmployeesQueryDto) {
    const { departmentId } = dto;
    if (departmentId) {
      const dept = await this.prisma.department.findUnique({
        where: { id: departmentId, isDeleted: false },
      });

      if (!dept) {
        throw new BadRequestException('Department not found');
      }
    }

    const employees = await this.prisma.user.findMany({
      where: {
        status: UserStatus.ACTIVE,
        ...(departmentId && { departmentId })
      },
      include: {
        department: true,
        headedDepartment: true,
      },
      orderBy: { firstName: 'asc' },
    });
    return { employees: employees.map(mapUserToAuthResponse) };
  }


  async searchByName(name: string) {
    const query = name.trim().toLowerCase();
    if (!query) {
      return [];
    }

    return this.prisma.department.findMany({
      where: {
        isDeleted: false,
        name: {
          contains: query,
          mode: 'insensitive',
        },
      },
      orderBy: { name: 'asc' },
    });
  }


  async getEmployeeById(employeeId: string) {
    const employee = await this.prisma.user.findUnique({
      where: { id: employeeId },
    });

    if (!employee) {
      throw new BadRequestException('Employee not found');
    }

    return employee;
  }

}
