import { Card } from "@/components/ui/card";
import { EmptyState } from "@/components/data-display/empty-state";
import { formatDateTime } from "@/lib/format";
import type {
  BookingRecord,
  ClientRecord,
  DepartmentRecord,
  EmployeeRecord,
  PaginatedResponse,
} from "@/lib/api/generated/contracts";

export function DashboardOverview({
  bookings,
  clients,
  departments,
  employees,
}: {
  bookings: PaginatedResponse<BookingRecord>;
  clients: PaginatedResponse<ClientRecord>;
  departments?: PaginatedResponse<DepartmentRecord>;
  employees?: PaginatedResponse<EmployeeRecord>;
}) {
  const stats = [
    { label: "Bookings", value: bookings.meta.total, tone: "from-cyan-500 to-blue-500" },
    { label: "Clients", value: clients.meta.total, tone: "from-emerald-500 to-teal-500" },
    { label: "Departments", value: departments?.meta.total ?? 0, tone: "from-violet-500 to-indigo-500" },
    { label: "Employees", value: employees?.meta.total ?? 0, tone: "from-amber-500 to-orange-500" },
  ];

  return (
    <div className="grid gap-6">
      <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {stats.map((stat) => (
          <Card key={stat.label} className={`bg-gradient-to-br ${stat.tone} text-white`}>
            <p className="text-sm uppercase tracking-[0.24em] text-white/70">{stat.label}</p>
            <p className="mt-8 text-4xl font-semibold">{stat.value}</p>
          </Card>
        ))}
      </section>

      <section className="grid gap-6 xl:grid-cols-2">
        <Card>
          <h2 className="text-xl font-semibold text-slate-900">Upcoming bookings</h2>
          {bookings.data.length === 0 ? (
            <div className="mt-4">
              <EmptyState
                title="No bookings yet"
                description="Create the first booking to populate the dashboard."
              />
            </div>
          ) : (
            <div className="mt-4 grid gap-3">
              {bookings.data.slice(0, 5).map((booking) => (
                <div key={booking.id} className="rounded-2xl border border-slate-200 p-4">
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <p className="font-semibold text-slate-900">{booking.title}</p>
                      <p className="mt-1 text-sm text-slate-500">{booking.description || "No description"}</p>
                    </div>
                    <p className="text-sm font-medium text-slate-600">{booking.status}</p>
                  </div>
                  <p className="mt-3 text-sm text-slate-500">{formatDateTime(booking.startTime)}</p>
                </div>
              ))}
            </div>
          )}
        </Card>

        <Card>
          <h2 className="text-xl font-semibold text-slate-900">Operational snapshot</h2>
          <div className="mt-4 grid gap-3">
            <div className="rounded-2xl bg-slate-50 p-4">
              <p className="text-sm text-slate-500">Recent clients</p>
              <p className="mt-2 text-2xl font-semibold text-slate-900">{clients.data.length}</p>
            </div>
            {departments ? (
              <div className="rounded-2xl bg-slate-50 p-4">
                <p className="text-sm text-slate-500">Active departments</p>
                <p className="mt-2 text-2xl font-semibold text-slate-900">{departments.meta.total}</p>
              </div>
            ) : null}
            {employees ? (
              <div className="rounded-2xl bg-slate-50 p-4">
                <p className="text-sm text-slate-500">Active employees</p>
                <p className="mt-2 text-2xl font-semibold text-slate-900">{employees.meta.total}</p>
              </div>
            ) : null}
          </div>
        </Card>
      </section>
    </div>
  );
}
