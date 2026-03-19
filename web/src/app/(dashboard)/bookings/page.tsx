import { PageHeader } from "@/components/layout/page-header";
import { BookingManager } from "@/features/bookings/booking-manager";
import { serverApiFetch } from "@/lib/api/server";
import type {
  BookingRecord,
  ClientRecord,
  EmployeeRecord,
  PaginatedResponse,
} from "@/lib/api/generated/contracts";

export default async function BookingsPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | undefined>>;
}) {
  const params = await searchParams;
  const [bookings, clients, employees] = await Promise.all([
    serverApiFetch<PaginatedResponse<BookingRecord>>("booking", { searchParams: params }),
    serverApiFetch<PaginatedResponse<ClientRecord>>("client", {
      searchParams: { limit: 100 },
    }),
    serverApiFetch<PaginatedResponse<EmployeeRecord>>("department/employees", {
      searchParams: { limit: 100 },
    }),
  ]);

  return (
    <>
      <PageHeader
        eyebrow="Bookings"
        title="Calendar and booking desk"
        description="Manage booking intake with a hybrid list and calendar view, plus quick create."
      />
      <BookingManager bookings={bookings} clients={clients} employees={employees} />
    </>
  );
}
