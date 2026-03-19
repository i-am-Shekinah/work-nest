"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useForm } from "react-hook-form";

import { DataTable } from "@/components/data-display/data-table";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { FormField } from "@/components/ui/form-field";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { clientApiFetch } from "@/lib/api/client";
import type {
  DepartmentDeleteAction,
  DepartmentRecord,
  EmployeeRecord,
  PaginatedResponse,
} from "@/lib/api/generated/contracts";

export function DepartmentManager({
  departments,
  employees,
}: {
  departments: PaginatedResponse<DepartmentRecord>;
  employees: PaginatedResponse<EmployeeRecord>;
}) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const createForm = useForm({
    defaultValues: { name: "" },
  });
  const deleteForm = useForm<{
    departmentId: string;
    action: DepartmentDeleteAction;
    reassignedDepartmentId: string;
  }>({
    defaultValues: {
      departmentId: departments.data[0]?.id ?? "",
      action: "NONE",
      reassignedDepartmentId: departments.data[1]?.id ?? "",
    },
  });

  return (
    <div className="grid gap-6">
      <Card>
        <form action="/departments" className="flex flex-col gap-3 sm:flex-row">
          <Input name="search" placeholder="Search departments" defaultValue={searchParams.get("search") ?? ""} />
          <Button type="submit">Search</Button>
        </form>
      </Card>

      <div className="grid gap-6 xl:grid-cols-[1.2fr_0.8fr]">
        <DataTable
          title="Departments"
          rows={departments.data}
          rowHref={(department) => `/departments/${department.id}`}
          columns={[
            { key: "name", header: "Department", render: (department) => department.name },
            { key: "hod", header: "HOD", render: (department) => department.hodId ?? "Unassigned" },
            { key: "createdAt", header: "Created", render: (department) => department.createdAt.slice(0, 10) },
          ]}
        />

        <div className="grid gap-6">
          <Card>
            <h2 className="text-lg font-semibold text-slate-900">Create department</h2>
            <form
              className="mt-4 grid gap-4"
              onSubmit={createForm.handleSubmit(async (values) => {
                await clientApiFetch("department", {
                  method: "POST",
                  body: values,
                });
                createForm.reset();
                router.refresh();
              })}
            >
              <FormField label="Department name">
                <Input {...createForm.register("name")} />
              </FormField>
              <Button type="submit">Create</Button>
            </form>
          </Card>

          <Card>
            <h2 className="text-lg font-semibold text-slate-900">Delete or reassign department</h2>
            <form
              className="mt-4 grid gap-4"
              onSubmit={deleteForm.handleSubmit(async (values) => {
                await clientApiFetch(`department/${values.departmentId}/delete`, {
                  method: "DELETE",
                  body: {
                    action: values.action,
                    reassignedDepartmentId: values.reassignedDepartmentId || undefined,
                  },
                });
                router.refresh();
              })}
            >
              <FormField label="Department">
                <Select {...deleteForm.register("departmentId")}>
                  {departments.data.map((department) => (
                    <option key={department.id} value={department.id}>
                      {department.name}
                    </option>
                  ))}
                </Select>
              </FormField>
              <FormField label="Action">
                <Select {...deleteForm.register("action")}>
                  <option value="NONE">NONE</option>
                  <option value="REASSIGN">REASSIGN</option>
                  <option value="DEACTIVATE">DEACTIVATE</option>
                </Select>
              </FormField>
              <FormField label="Reassign to">
                <Select {...deleteForm.register("reassignedDepartmentId")}>
                  <option value="">Select department</option>
                  {departments.data.map((department) => (
                    <option key={department.id} value={department.id}>
                      {department.name}
                    </option>
                  ))}
                </Select>
              </FormField>
              <Button variant="danger" type="submit">
                Apply delete action
              </Button>
            </form>
          </Card>

          <Card>
            <h2 className="text-lg font-semibold text-slate-900">Employees snapshot</h2>
            <div className="mt-4 grid gap-3">
              {employees.data.slice(0, 6).map((employee) => (
                <div key={employee.id} className="rounded-2xl border border-slate-200 p-3">
                  <p className="font-medium text-slate-900">
                    {employee.firstName} {employee.lastName}
                  </p>
                  <p className="text-sm text-slate-500">{employee.departmentName}</p>
                </div>
              ))}
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
