import { UserMapperInput } from 'src/prisma/prisma.types';

import { UserResponseDto } from '../dto/user-response.dto';

export function mapUserToAuthResponse(user: UserMapperInput): UserResponseDto {
  return {
    id: user.id,
    email: user.email,
    firstName: user.firstName,
    lastName: user.lastName,
    role: user.role,
    status: user.status,
    profilePictureUrl:
      user.profilePictureUrl != null ? user.profilePictureUrl : '',
    departmentId: user.departmentId,
    departmentName: user.department?.name ?? '',
    isDepartmentHead: user.headedDepartment?.name ? true : false,
    createdAt: user.createdAt,
  };
}
