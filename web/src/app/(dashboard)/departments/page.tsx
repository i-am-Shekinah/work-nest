import { redirect } from "next/navigation";

import { PageHeader } from "@/components/layout/page-header";
import { DepartmentManager } from "@/features/departments/department-manager";
import { InviteUserForm } from "@/features/auth/forms";
import { getSession } from "@/lib/auth/session";
import { serverApiFetch } from "@/lib/api/server";
import type {
  DepartmentRecord,
  EmployeeRecord,
  PaginatedResponse,
} from "@/lib/api/generated/contracts";

export default async function DepartmentsPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | undefined>>;
}) {
  const session = await getSession();
  if (session?.user.role !== "ADMIN") {
    redirect("/dashboard");
  }

  const params = await searchParams;
  const [departments, employees] = await Promise.all([
    serverApiFetch<PaginatedResponse<DepartmentRecord>>("department", {
      searchParams: params,
    }),
    serverApiFetch<PaginatedResponse<EmployeeRecord>>("department/employees", {
      searchParams: { limit: 25 },
    }),
  ]);

  return (
    <>
      <PageHeader
        eyebrow="Departments"
        title="Department operations"
        description="Create departments, inspect staffing, invite users, and manage delete actions."
      />
      <div className="grid gap-6">
        <InviteUserForm
          departments={departments.data.map((department) => ({
            id: department.id,
            name: department.name,
          }))}
        />
        <DepartmentManager departments={departments} employees={employees} />
      </div>
    </>
  );
}
