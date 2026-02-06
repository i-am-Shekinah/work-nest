import { UserRole } from 'generated/prisma/enums';

const rolesToScopesMap: Record<UserRole, string[]> = {
  [UserRole.ADMIN]: ['user:create', 'user:read', 'user:update', 'user:delete'],
  [UserRole.STAFF]: ['user:read', 'user:update'],
};

export function getUserScopes(role: UserRole): string[] {
  return rolesToScopesMap[role] || [];
}
