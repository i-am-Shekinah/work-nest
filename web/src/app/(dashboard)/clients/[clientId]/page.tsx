import { PageHeader } from "@/components/layout/page-header";
import { Card } from "@/components/ui/card";
import { serverApiFetch } from "@/lib/api/server";
import { formatDate } from "@/lib/format";
import type { ClientRecord } from "@/lib/api/generated/contracts";

export default async function ClientDetailPage({
  params,
}: {
  params: Promise<{ clientId: string }>;
}) {
  const { clientId } = await params;
  const client = await serverApiFetch<ClientRecord>(`client/${clientId}`);

  return (
    <>
      <PageHeader
        eyebrow="Client detail"
        title={`${client.firstName} ${client.lastName}`}
        description="Review the contact details and notes that support the booking workflow."
      />
      <Card>
        <dl className="grid gap-4 sm:grid-cols-2">
          <div>
            <dt className="text-sm text-slate-500">Email</dt>
            <dd className="mt-1 font-semibold text-slate-900">{client.email}</dd>
          </div>
          <div>
            <dt className="text-sm text-slate-500">Phone</dt>
            <dd className="mt-1 font-semibold text-slate-900">{client.phone}</dd>
          </div>
          <div>
            <dt className="text-sm text-slate-500">Created</dt>
            <dd className="mt-1 font-semibold text-slate-900">{formatDate(client.createdAt)}</dd>
          </div>
          <div className="sm:col-span-2">
            <dt className="text-sm text-slate-500">Notes</dt>
            <dd className="mt-1 text-slate-700">{client.notes || "No notes"}</dd>
          </div>
        </dl>
      </Card>
    </>
  );
}
