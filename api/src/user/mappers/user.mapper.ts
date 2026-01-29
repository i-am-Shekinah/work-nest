import { User } from 'generated/prisma/client';

import { UserResponseDto } from '../dto/user-response.dto';

export class UserMapper {
  static toResponse(user: User): UserResponseDto {
    return {
      id: user.id,
      email: user.email,
      firstName: user.firstName,
      lastName: user.lastName,
      role: user.role,
      status: user.status,
      departmentId: user.departmentId,
      createdAt: user.createdAt,
    };
  }
}
