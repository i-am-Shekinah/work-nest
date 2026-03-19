"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  LayoutDashboard,
  CalendarRange,
  Building2,
  Users,
  UserCircle2,
} from "lucide-react";

import type { AuthenticatedUser } from "@/lib/api/generated/contracts";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { RoleBadge } from "@/components/data-display/status-badge";

const navByRole = {
  ADMIN: [
    { href: "/dashboard", label: "Overview", icon: LayoutDashboard },
    { href: "/bookings", label: "Bookings", icon: CalendarRange },
    { href: "/clients", label: "Clients", icon: Users },
    { href: "/departments", label: "Departments", icon: Building2 },
    { href: "/settings/profile", label: "Profile", icon: UserCircle2 },
  ],
  STAFF: [
    { href: "/dashboard", label: "Overview", icon: LayoutDashboard },
    { href: "/bookings", label: "Bookings", icon: CalendarRange },
    { href: "/clients", label: "Clients", icon: Users },
    { href: "/settings/profile", label: "Profile", icon: UserCircle2 },
  ],
} as const;

export function AppShell({
  user,
  children,
}: {
  user: AuthenticatedUser;
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const router = useRouter();
  const nav = navByRole[user.role];

  return (
    <div className="min-h-screen bg-[radial-gradient(circle_at_top_left,_rgba(14,116,144,0.12),_transparent_32%),linear-gradient(180deg,#f8fafc_0%,#eef2ff_100%)]">
      <div className="mx-auto grid min-h-screen max-w-7xl gap-6 px-4 py-6 lg:grid-cols-[260px_minmax(0,1fr)] lg:px-6">
        <aside className="rounded-[2rem] border border-slate-200 bg-slate-950 p-5 text-slate-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs uppercase tracking-[0.24em] text-cyan-300">
                WorkNest
              </p>
              <h1 className="mt-2 text-2xl font-semibold">Operations Hub</h1>
            </div>
            <RoleBadge role={user.role} />
          </div>
          <p className="mt-4 text-sm text-slate-400">
            {user.firstName} {user.lastName}
          </p>
          <nav className="mt-8 grid gap-2">
            {nav.map((item) => {
              const Icon = item.icon;
              const active =
                pathname === item.href ||
                (item.href !== "/dashboard" && pathname.startsWith(item.href));

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    "flex items-center gap-3 rounded-2xl px-4 py-3 text-sm font-medium transition",
                    active
                      ? "bg-white !text-[#030619]"
                      : "text-slate-300 hover:bg-slate-900 hover:!text-white",
                  )}
                >
                  <Icon className="h-4 w-4 text-inherit" />
                  {item.label}
                </Link>
              );
            })}
          </nav>
        </aside>
        <main className="space-y-6">
          <div className="flex flex-col gap-4 rounded-[2rem] border border-slate-200 bg-white/80 px-6 py-4 backdrop-blur sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="text-sm font-medium text-slate-900">
                {user.firstName} {user.lastName}
              </p>
              <p className="text-sm text-slate-500">{user.email}</p>
            </div>
            <div className="flex gap-3">
              <Button
                variant="secondary"
                onClick={() => {
                  router.push("/settings/profile");
                }}
              >
                Profile
              </Button>
              <Button
                variant="ghost"
                onClick={async () => {
                  await fetch("/api/auth/logout", { method: "POST" });
                  router.push("/login");
                  router.refresh();
                }}
              >
                Sign out
              </Button>
            </div>
          </div>
          {children}
        </main>
      </div>
    </div>
  );
}
