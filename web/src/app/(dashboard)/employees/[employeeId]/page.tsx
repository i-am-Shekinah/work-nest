import { redirect } from "next/navigation";

import { PageHeader } from "@/components/layout/page-header";
import { Card } from "@/components/ui/card";
import { getSession } from "@/lib/auth/session";
import { serverApiFetch } from "@/lib/api/server";
import type { EmployeeRecord } from "@/lib/api/generated/contracts";

export default async function EmployeeDetailPage({
  params,
}: {
  params: Promise<{ employeeId: string }>;
}) {
  const session = await getSession();
  if (session?.user.role !== "ADMIN") {
    redirect("/dashboard");
  }

  const { employeeId } = await params;
  const employee = await serverApiFetch<EmployeeRecord>(`department/employee/${employeeId}`);

  return (
    <>
      <PageHeader
        eyebrow="Employee detail"
        title={`${employee.firstName} ${employee.lastName}`}
        description="Inspect an employee record from the department administration surface."
      />
      <Card>
        <dl className="grid gap-4 sm:grid-cols-2">
          <div>
            <dt className="text-sm text-slate-500">Email</dt>
            <dd className="mt-1 font-semibold text-slate-900">{employee.email}</dd>
          </div>
          <div>
            <dt className="text-sm text-slate-500">Role</dt>
            <dd className="mt-1 font-semibold text-slate-900">{employee.role}</dd>
          </div>
          <div>
            <dt className="text-sm text-slate-500">Status</dt>
            <dd className="mt-1 font-semibold text-slate-900">{employee.status}</dd>
          </div>
          <div>
            <dt className="text-sm text-slate-500">Department</dt>
            <dd className="mt-1 font-semibold text-slate-900">{employee.departmentName}</dd>
          </div>
        </dl>
      </Card>
    </>
  );
}
