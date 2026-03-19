"use client";

import { useMemo, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useForm } from "react-hook-form";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { FormField } from "@/components/ui/form-field";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { DataTable } from "@/components/data-display/data-table";
import { BookingStatusBadge, UserStatusBadge } from "@/components/data-display/status-badge";
import { clientApiFetch } from "@/lib/api/client";
import { formatDateTime, getFullName } from "@/lib/format";
import type {
  BookingRecord,
  BookingStatus,
  ClientRecord,
  EmployeeRecord,
  PaginatedResponse,
} from "@/lib/api/generated/contracts";

type BookingManagerProps = {
  bookings: PaginatedResponse<BookingRecord>;
  clients: PaginatedResponse<ClientRecord>;
  employees: PaginatedResponse<EmployeeRecord>;
};

export function BookingManager({ bookings, clients, employees }: BookingManagerProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [mode, setMode] = useState<"table" | "calendar">("table");
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const form = useForm({
    defaultValues: {
      title: "",
      description: "",
      status: "PENDING" as BookingStatus,
      startTime: "",
      endTime: "",
      assignedUserId: employees.data[0]?.id ?? "",
      clientId: clients.data[0]?.id ?? "",
    },
  });

  const grouped = useMemo(() => {
    return bookings.data.reduce<Record<string, BookingRecord[]>>((acc, booking) => {
      const key = booking.startTime.slice(0, 10);
      acc[key] ??= [];
      acc[key].push(booking);
      return acc;
    }, {});
  }, [bookings.data]);

  return (
    <div className="grid gap-6">
      <Card>
        <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
          <form className="grid gap-3 md:grid-cols-4" action="/bookings">
            <Input name="search" placeholder="Search title or description" defaultValue={searchParams.get("search") ?? ""} />
            <Select name="status" defaultValue={searchParams.get("status") ?? ""}>
              <option value="">All statuses</option>
              <option value="PENDING">PENDING</option>
              <option value="CONFIRMED">CONFIRMED</option>
              <option value="CANCELLED">CANCELLED</option>
              <option value="COMPLETED">COMPLETED</option>
            </Select>
            <Input name="startDate" type="date" defaultValue={searchParams.get("startDate") ?? ""} />
            <Input name="endDate" type="date" defaultValue={searchParams.get("endDate") ?? ""} />
            <Button type="submit" className="md:col-span-4 md:w-fit">
              Apply filters
            </Button>
          </form>
          <div className="flex gap-2">
            <Button variant={mode === "table" ? "primary" : "secondary"} onClick={() => setMode("table")}>
              Table
            </Button>
            <Button variant={mode === "calendar" ? "primary" : "secondary"} onClick={() => setMode("calendar")}>
              Calendar
            </Button>
          </div>
        </div>
      </Card>

      <div className="grid gap-6 xl:grid-cols-[1.3fr_0.7fr]">
        {mode === "table" ? (
          <DataTable
            title="Bookings"
            rows={bookings.data}
            rowHref={(booking) => `/bookings/${booking.id}`}
            columns={[
              { key: "title", header: "Title", render: (booking) => booking.title },
              {
                key: "schedule",
                header: "Schedule",
                render: (booking) => (
                  <div>
                    <p>{formatDateTime(booking.startTime)}</p>
                    <p className="text-xs text-slate-500">{formatDateTime(booking.endTime)}</p>
                  </div>
                ),
              },
              {
                key: "status",
                header: "Status",
                render: (booking) => <BookingStatusBadge status={booking.status} />,
              },
            ]}
          />
        ) : (
          <Card>
            <h2 className="text-lg font-semibold text-slate-900">Calendar lane</h2>
            <div className="mt-4 grid gap-4">
              {Object.entries(grouped).map(([day, dayBookings]) => (
                <div key={day} className="rounded-2xl border border-slate-200 p-4">
                  <p className="text-sm font-semibold uppercase tracking-[0.18em] text-slate-500">{day}</p>
                  <div className="mt-3 grid gap-3">
                    {dayBookings.map((booking) => (
                      <div key={booking.id} className="rounded-2xl bg-slate-50 p-4">
                        <div className="flex items-center justify-between gap-4">
                          <p className="font-semibold text-slate-900">{booking.title}</p>
                          <BookingStatusBadge status={booking.status} />
                        </div>
                        <p className="mt-2 text-sm text-slate-500">{formatDateTime(booking.startTime)}</p>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </Card>
        )}

        <Card>
          <h2 className="text-lg font-semibold text-slate-900">Create booking</h2>
          <form
            className="mt-4 grid gap-4"
            onSubmit={form.handleSubmit(async (values) => {
              setError(null);
              setMessage(null);
              try {
                await clientApiFetch("booking", {
                  method: "POST",
                  body: values,
                });
                setMessage("Booking created.");
                form.reset();
                router.refresh();
              } catch (submissionError) {
                setError(
                  submissionError instanceof Error ? submissionError.message : "Unable to create booking.",
                );
              }
            })}
          >
            <FormField label="Title">
              <Input {...form.register("title")} />
            </FormField>
            <FormField label="Description">
              <Textarea {...form.register("description")} />
            </FormField>
            <FormField label="Status">
              <Select {...form.register("status")}>
                <option value="PENDING">PENDING</option>
                <option value="CONFIRMED">CONFIRMED</option>
                <option value="CANCELLED">CANCELLED</option>
                <option value="COMPLETED">COMPLETED</option>
              </Select>
            </FormField>
            <div className="grid gap-4 sm:grid-cols-2">
              <FormField label="Start time">
                <Input type="datetime-local" {...form.register("startTime")} />
              </FormField>
              <FormField label="End time">
                <Input type="datetime-local" {...form.register("endTime")} />
              </FormField>
            </div>
            <FormField label="Assigned employee">
              <Select {...form.register("assignedUserId")}>
                {employees.data.map((employee) => (
                  <option key={employee.id} value={employee.id}>
                    {getFullName(employee.firstName, employee.lastName)}
                  </option>
                ))}
              </Select>
            </FormField>
            <FormField label="Client">
              <Select {...form.register("clientId")}>
                {clients.data.map((client) => (
                  <option key={client.id} value={client.id}>
                    {getFullName(client.firstName, client.lastName)}
                  </option>
                ))}
              </Select>
            </FormField>
            {error ? <p className="text-sm text-red-600">{error}</p> : null}
            {message ? <p className="text-sm text-emerald-700">{message}</p> : null}
            <Button type="submit">Create booking</Button>
          </form>
          <div className="mt-6 rounded-2xl bg-slate-50 p-4">
            <p className="text-sm font-semibold text-slate-900">Available employees</p>
            <div className="mt-3 grid gap-2">
              {employees.data.slice(0, 5).map((employee) => (
                <div key={employee.id} className="flex items-center justify-between rounded-xl bg-white px-3 py-2">
                  <span className="text-sm text-slate-700">
                    {getFullName(employee.firstName, employee.lastName)}
                  </span>
                  <UserStatusBadge status={employee.status} />
                </div>
              ))}
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}
