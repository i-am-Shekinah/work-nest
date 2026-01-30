import { Department } from 'generated/prisma/browser';
import { User } from 'generated/prisma/client';

export type UserMapperInput = User & {
  department?: Pick<Department, 'id' | 'name'>;
  headedDepartment?: Pick<Department, 'id' | 'name'> | null;
};
