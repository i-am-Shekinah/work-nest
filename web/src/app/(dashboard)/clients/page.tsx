import { PageHeader } from "@/components/layout/page-header";
import { ClientManager } from "@/features/clients/client-manager";
import { serverApiFetch } from "@/lib/api/server";
import type { ClientRecord, PaginatedResponse } from "@/lib/api/generated/contracts";

export default async function ClientsPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | undefined>>;
}) {
  const params = await searchParams;
  const clients = await serverApiFetch<PaginatedResponse<ClientRecord>>("client", {
    searchParams: params,
  });

  return (
    <>
      <PageHeader
        eyebrow="Clients"
        title="Client registry"
        description="Search, create, and inspect clients used across bookings."
      />
      <ClientManager clients={clients} />
    </>
  );
}
