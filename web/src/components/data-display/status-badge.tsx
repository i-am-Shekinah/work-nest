import { Badge } from "@/components/ui/badge";
import type {
  BookingStatus,
  UserRole,
  UserStatus,
} from "@/lib/api/generated/contracts";

const bookingColors: Record<BookingStatus, string> = {
  CANCELLED: "bg-red-100 text-red-700",
  COMPLETED: "bg-emerald-100 text-emerald-700",
  CONFIRMED: "bg-blue-100 text-blue-700",
  PENDING: "bg-amber-100 text-amber-700",
};

const userStatusColors: Record<UserStatus, string> = {
  ACTIVE: "bg-emerald-100 text-emerald-700",
  INACTIVE: "bg-slate-200 text-slate-700",
  PENDING: "bg-amber-100 text-amber-700",
};

const roleColors: Record<UserRole, string> = {
  ADMIN: "bg-violet-100 text-violet-700",
  STAFF: "bg-cyan-100 text-cyan-700",
};

export function BookingStatusBadge({ status }: { status: BookingStatus }) {
  return <Badge className={bookingColors[status]}>{status}</Badge>;
}

export function UserStatusBadge({ status }: { status: UserStatus }) {
  return <Badge className={userStatusColors[status]}>{status}</Badge>;
}

export function RoleBadge({ role }: { role: UserRole }) {
  return <Badge className={roleColors[role]}>{role}</Badge>;
}
