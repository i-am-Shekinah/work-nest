import { redirect } from "next/navigation";

import { PageHeader } from "@/components/layout/page-header";
import { Card } from "@/components/ui/card";
import { getSession } from "@/lib/auth/session";
import { serverApiFetch } from "@/lib/api/server";
import type { DepartmentRecord } from "@/lib/api/generated/contracts";

export default async function DepartmentDetailPage({
  params,
}: {
  params: Promise<{ departmentId: string }>;
}) {
  const session = await getSession();
  if (session?.user.role !== "ADMIN") {
    redirect("/dashboard");
  }

  const { departmentId } = await params;
  const department = await serverApiFetch<DepartmentRecord>(`department/${departmentId}`);

  return (
    <>
      <PageHeader
        eyebrow="Department detail"
        title={department.name}
        description="Inspect the current department metadata from the backend."
      />
      <Card>
        <dl className="grid gap-4 sm:grid-cols-2">
          <div>
            <dt className="text-sm text-slate-500">Department ID</dt>
            <dd className="mt-1 font-semibold text-slate-900">{department.id}</dd>
          </div>
          <div>
            <dt className="text-sm text-slate-500">HOD</dt>
            <dd className="mt-1 font-semibold text-slate-900">{department.hodId ?? "Unassigned"}</dd>
          </div>
        </dl>
      </Card>
    </>
  );
}
