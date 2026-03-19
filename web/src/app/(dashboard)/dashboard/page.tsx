import { PageHeader } from "@/components/layout/page-header";
import { DashboardOverview } from "@/features/dashboard/overview";
import { serverApiFetch } from "@/lib/api/server";
import { getSession } from "@/lib/auth/session";
import type {
  BookingRecord,
  ClientRecord,
  DepartmentRecord,
  EmployeeRecord,
  PaginatedResponse,
} from "@/lib/api/generated/contracts";

export default async function DashboardPage() {
  const session = await getSession();
  const [bookings, clients] = await Promise.all([
    serverApiFetch<PaginatedResponse<BookingRecord>>("booking", {
      searchParams: { limit: 5 },
    }),
    serverApiFetch<PaginatedResponse<ClientRecord>>("client", {
      searchParams: { limit: 5 },
    }),
  ]);

  let departments: PaginatedResponse<DepartmentRecord> | undefined;
  let employees: PaginatedResponse<EmployeeRecord> | undefined;

  if (session?.user.role === "ADMIN") {
    [departments, employees] = await Promise.all([
      serverApiFetch<PaginatedResponse<DepartmentRecord>>("department", {
        searchParams: { limit: 5 },
      }),
      serverApiFetch<PaginatedResponse<EmployeeRecord>>("department/employees", {
        searchParams: { limit: 5 },
      }),
    ]);
  }

  return (
    <>
      <PageHeader
        eyebrow="Dashboard"
        title="Control room"
        description="A role-aware overview of bookings, clients, departments, and active staff."
      />
      <DashboardOverview
        bookings={bookings}
        clients={clients}
        departments={departments}
        employees={employees}
      />
    </>
  );
}
