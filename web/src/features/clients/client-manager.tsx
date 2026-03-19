"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useForm } from "react-hook-form";

import { DataTable } from "@/components/data-display/data-table";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { FormField } from "@/components/ui/form-field";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { clientApiFetch } from "@/lib/api/client";
import type { ClientRecord, PaginatedResponse } from "@/lib/api/generated/contracts";

export function ClientManager({ clients }: { clients: PaginatedResponse<ClientRecord> }) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const form = useForm({
    defaultValues: {
      firstName: "",
      lastName: "",
      email: "",
      phone: "",
      notes: "",
    },
  });

  return (
    <div className="grid gap-6 xl:grid-cols-[1.2fr_0.8fr]">
      <div className="grid gap-6">
        <Card>
          <form action="/clients" className="flex flex-col gap-3 sm:flex-row">
            <Input name="search" placeholder="Search clients" defaultValue={searchParams.get("search") ?? ""} />
            <Button type="submit">Search</Button>
          </form>
        </Card>
        <DataTable
          title="Clients"
          rows={clients.data}
          rowHref={(client) => `/clients/${client.id}`}
          columns={[
            { key: "name", header: "Name", render: (client) => `${client.firstName} ${client.lastName}` },
            { key: "email", header: "Email", render: (client) => client.email },
            { key: "phone", header: "Phone", render: (client) => client.phone },
          ]}
        />
      </div>
      <Card>
        <h2 className="text-lg font-semibold text-slate-900">Create client</h2>
        <form
          className="mt-4 grid gap-4"
          onSubmit={form.handleSubmit(async (values) => {
            await clientApiFetch("client", {
              method: "POST",
              body: values,
            });
            form.reset();
            router.refresh();
          })}
        >
          <div className="grid gap-4 sm:grid-cols-2">
            <FormField label="First name">
              <Input {...form.register("firstName")} />
            </FormField>
            <FormField label="Last name">
              <Input {...form.register("lastName")} />
            </FormField>
          </div>
          <FormField label="Email">
            <Input type="email" {...form.register("email")} />
          </FormField>
          <FormField label="Phone">
            <Input {...form.register("phone")} />
          </FormField>
          <FormField label="Notes">
            <Textarea {...form.register("notes")} />
          </FormField>
          <Button type="submit">Create client</Button>
        </form>
      </Card>
    </div>
  );
}
