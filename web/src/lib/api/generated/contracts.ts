export type UserRole = "ADMIN" | "STAFF";
export type UserStatus = "PENDING" | "ACTIVE" | "INACTIVE";
export type BookingStatus = "PENDING" | "CONFIRMED" | "CANCELLED" | "COMPLETED";
export type DepartmentDeleteAction = "NONE" | "REASSIGN" | "DEACTIVATE";

export type AuthenticatedUser = {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  role: UserRole;
  status: UserStatus;
  profilePictureUrl: string;
  departmentId: string;
  departmentName: string;
  isDepartmentHead?: boolean;
  createdAt: string;
};

export type AuthSession = {
  token: string;
  user: AuthenticatedUser;
};

export type LoginDto = {
  email: string;
  password: string;
};

export type ForgetPasswordDto = {
  email: string;
};

export type ResetPasswordDto = {
  token: string;
  password: string;
};

export type AcceptInvitationDto = {
  token: string;
  password: string;
  firstName?: string;
  lastName?: string;
  profilePictureUrl?: string;
};

export type ChangePasswordDto = {
  oldPassword: string;
  newPassword: string;
};

export type UpdateProfileDto = {
  profilePictureUrl: string;
};

export type CreateClientDto = {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  notes?: string;
};

export type ClientRecord = {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  notes?: string | null;
  isDeleted: boolean;
  createdAt: string;
  updatedAt: string;
};

export type DepartmentRecord = {
  id: string;
  name: string;
  hodId?: string | null;
  createdAt: string;
  updatedAt: string;
};

export type EmployeeRecord = AuthenticatedUser;

export type InviteUserDto = {
  email: string;
  firstName: string;
  lastName: string;
  role: UserRole;
  departmentId: string;
};

export type CreateDepartmentDto = {
  name: string;
};

export type UpdateDepartmentNameDto = {
  name: string;
};

export type AppointHodDto = {
  userId?: string | null;
};

export type DeleteDepartmentDto = {
  action: DepartmentDeleteAction;
  reassignedDepartmentId?: string;
};

export type BookingRecord = {
  id: string;
  title: string;
  description?: string | null;
  status: BookingStatus;
  startTime: string;
  endTime: string;
  assignedUserId: string;
  clientId: string;
  createdAt: string;
  updatedAt: string;
};

export type CreateBookingDto = {
  title: string;
  description?: string;
  status: BookingStatus;
  startTime: string;
  endTime: string;
  assignedUserId: string;
  clientId: string;
};

export type UpdateBookingDto = Partial<CreateBookingDto>;

export type PaginatedResponse<T> = {
  data: T[];
  meta: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
};

export type ApiMutationResponse<T extends string, V> = Record<T, V> & {
  success?: boolean;
  message?: string;
};
