import { PageHeader } from "@/components/layout/page-header";
import { Card } from "@/components/ui/card";
import { serverApiFetch } from "@/lib/api/server";
import { formatDateTime } from "@/lib/format";
import type { BookingRecord } from "@/lib/api/generated/contracts";

export default async function BookingDetailPage({
  params,
}: {
  params: Promise<{ bookingId: string }>;
}) {
  const { bookingId } = await params;
  const booking = await serverApiFetch<BookingRecord>(`booking/${bookingId}`);

  return (
    <>
      <PageHeader
        eyebrow="Booking detail"
        title={booking.title}
        description="Inspect the booking schedule, status, and backend identifiers."
      />
      <Card>
        <dl className="grid gap-4 sm:grid-cols-2">
          <div>
            <dt className="text-sm text-slate-500">Status</dt>
            <dd className="mt-1 font-semibold text-slate-900">{booking.status}</dd>
          </div>
          <div>
            <dt className="text-sm text-slate-500">Assigned user</dt>
            <dd className="mt-1 font-semibold text-slate-900">{booking.assignedUserId}</dd>
          </div>
          <div>
            <dt className="text-sm text-slate-500">Client</dt>
            <dd className="mt-1 font-semibold text-slate-900">{booking.clientId}</dd>
          </div>
          <div>
            <dt className="text-sm text-slate-500">Created</dt>
            <dd className="mt-1 font-semibold text-slate-900">{formatDateTime(booking.createdAt)}</dd>
          </div>
          <div>
            <dt className="text-sm text-slate-500">Start</dt>
            <dd className="mt-1 font-semibold text-slate-900">{formatDateTime(booking.startTime)}</dd>
          </div>
          <div>
            <dt className="text-sm text-slate-500">End</dt>
            <dd className="mt-1 font-semibold text-slate-900">{formatDateTime(booking.endTime)}</dd>
          </div>
          <div className="sm:col-span-2">
            <dt className="text-sm text-slate-500">Description</dt>
            <dd className="mt-1 text-slate-700">{booking.description || "No description"}</dd>
          </div>
        </dl>
      </Card>
    </>
  );
}
