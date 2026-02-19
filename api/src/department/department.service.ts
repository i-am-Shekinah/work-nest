import { UserStatus } from 'generated/prisma/enums';
import { PrismaService } from 'src/prisma/prisma.service';
import { mapUserToAuthResponse } from 'src/user/mappers/user.mapper';

import { BadRequestException, Injectable } from '@nestjs/common';

import { AppointHODDto } from './dto/appoint-hod.dto';
import { CreateDepartmentDto } from './dto/create-department.dto';
import {
  DeleteDepartmentDto,
  DepartmentDeleteAction,
} from './dto/delete-department.dto';
import { GetDepartmentQueryDto } from './dto/get-department-query.dto';
import { GetEmployeesQueryDto } from './dto/get-employees-query.dto';
import { UpdateDepartmentNameDto } from './dto/update-department-name.dto';

@Injectable()
export class DepartmentService {
  constructor(private readonly prisma: PrismaService) {}

  private async getValidDepartmentOrThrow(departmentId: string) {
    const department = await this.prisma.department.findFirst({
      where: { id: departmentId, isDeleted: false },
    });

    if (!department) {
      throw new BadRequestException('Department not found or already deleted');
    }

    return department;
  }

  private async countActiveUsers(departmentId: string) {
    return this.prisma.user.count({
      where: {
        departmentId,
        status: UserStatus.ACTIVE,
      },
    });
  }

  private async validateDeleteActionOrThrow(
    departmentId: string,
    activeUsersCount: number,
    dto: DeleteDepartmentDto,
  ) {
    const { action, reassignedDepartmentId } = dto;

    if (activeUsersCount > 0 && action === DepartmentDeleteAction.NONE) {
      throw new BadRequestException(
        `Department has ${activeUsersCount} active employee(s).
        You must choose to REASSIGN or DEACTIVATE them.`,
      );
    }

    if (action === DepartmentDeleteAction.REASSIGN) {
      if (!reassignedDepartmentId) {
        throw new BadRequestException(
          'Reassigned departmentId is required for reassignment',
        );
      }

      if (reassignedDepartmentId === departmentId) {
        throw new BadRequestException(
          'Cannot reassign to the same department being deleted',
        );
      }

      const reassignedDept = await this.prisma.department.findFirst({
        where: { id: reassignedDepartmentId, isDeleted: false },
      });

      if (!reassignedDept) {
        throw new BadRequestException(
          'Reassigned department not found or deleted',
        );
      }
    }
  }

  private async executeDeletionTransaction(
    departmentId: string,
    dto: DeleteDepartmentDto,
  ) {
    const { action, reassignedDepartmentId } = dto;

    return this.prisma.$transaction(async (tx) => {
      if (action === DepartmentDeleteAction.REASSIGN) {
        await tx.user.updateMany({
          where: { departmentId },
          data: { departmentId: reassignedDepartmentId },
        });
      }

      if (action === DepartmentDeleteAction.DEACTIVATE) {
        await tx.user.updateMany({
          where: { departmentId },
          data: { status: UserStatus.INACTIVE },
        });
      }

      await tx.department.update({
        where: { id: departmentId },
        data: {
          isDeleted: true,
          deletedAt: new Date(),
        },
      });
    });
  }

  async findAll(dto: GetDepartmentQueryDto) {
    let { search, page = 1, limit = 100 } = dto;
    const safePage = Math.max(page, 1);
    const safeLimit = Math.min(Math.max(limit, 1), 100);
    const skip = (safePage - 1) * safeLimit;

    const where: any = {
      isDeleted: false,
    };
    if (search) {
      where.name = {
        contains: search.trim(),
        mode: 'insensitive',
      };
    }
    const [departments, total] = await this.prisma.$transaction([
      this.prisma.department.findMany({
        where,
        orderBy: { name: 'asc' },
        skip,
        take: safeLimit,
      }),
      this.prisma.department.count({
        where: { isDeleted: false },
      }),
    ]);

    return {
      data: departments,
      meta: {
        total,
        page: safePage,
        limit: safeLimit,
        totalPages: Math.ceil(total / safeLimit),
      },
    };
  }

  async findOne(id: string) {
    return this.prisma.department.findUniqueOrThrow({
      where: { id, isDeleted: false },
    });
  }

  async create(dto: CreateDepartmentDto) {
    const deptExists = await this.prisma.department.findFirst({
      where: {
        name: dto.name,
        isDeleted: false,
      },
    });
    if (deptExists) {
      throw new BadRequestException(
        `An active ${deptExists.name} department already exists`,
      );
    }

    const dept = await this.prisma.department.create({
      data: dto,
    });

    return {
      department: dept,
      message: `${dept.name} department created successfully`,
    };
  }

  /**
   * Soft deletes a department with controlled handling of its active users.
   *
   * Business Rules:
   * - A department cannot be deleted if it does not exist or is already deleted.
   * - If the department has active users:
   *    - action = NONE        → deletion is blocked
   *    - action = REASSIGN    → all users are moved to another valid department
   *    - action = DEACTIVATE  → all users are marked as INACTIVE
   *
   * Reassignment Rules:
   * - reassignedDepartmentId must be provided when action = REASSIGN
   * - reassignedDepartmentId must exist and not be soft deleted
   * - reassignedDepartmentId cannot be the same as the department being deleted
   *
   * All operations (user updates + department soft delete) are executed
   * inside a single database transaction to ensure consistency.
   *
   *
   * @param departmentId The ID of the department to be removed.
   * @param dto Controls how active users are handled during deletion.
   *
   * @throws BadRequestException
   * - If the department does not exist
   * - If active users exists and no valid action is provided
   * - If reassignment is chosen but no valid reassignedDepartmentId is provided
   *
   */
  async delete(departmentId: string, dto: DeleteDepartmentDto) {
    await this.getValidDepartmentOrThrow(departmentId);

    const activeUsersCount = await this.countActiveUsers(departmentId);

    await this.validateDeleteActionOrThrow(departmentId, activeUsersCount, dto);

    await this.executeDeletionTransaction(departmentId, dto);

    return {
      success: true,
      message: 'Department deleted successfully',
    };
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
        throw new BadRequestException(
          'User does not belong to this department',
        );
      }

      await this.prisma.department.update({
        where: { id: departmentId },
        data: { hodId: userId },
      });

      return {
        department: dept,
        success: true,
        message: `${user.firstName} ${user.lastName} has been appointed as the HOD of ${dept.name}`,
      };
    } else {
      await this.prisma.department.update({
        where: { id: departmentId },
        data: { hodId: null },
      });
      return {
        department: dept,
        success: true,
        message: 'HOD removed successfully',
      };
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
    };
  }

  async getEmployees(dto: GetEmployeesQueryDto) {
    const { page = 1, limit = 10, departmentId } = dto;
    const validatedPage = Math.max(page, 1);
    const validatedLimit = Math.min(Math.max(limit, 1), 100);
    const skip = (validatedPage - 1) * validatedLimit;

    if (departmentId) {
      const dept = await this.prisma.department.findUnique({
        where: { id: departmentId, isDeleted: false },
      });

      if (!dept) {
        throw new BadRequestException('Department not found');
      }
    }

    const [employees, total] = await this.prisma.$transaction([
      this.prisma.user.findMany({
        where: {
          status: UserStatus.ACTIVE,
          ...(departmentId && { departmentId }),
        },
        include: {
          department: true,
          headedDepartment: true,
        },
        orderBy: { firstName: 'asc' },
        skip,
        take: limit,
      }),
      this.prisma.user.count({
        where: {
          status: UserStatus.ACTIVE,
          ...(departmentId && { departmentId }),
        },
      }),
    ]);

    return {
      data: employees.map(mapUserToAuthResponse),
      meta: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    };
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
