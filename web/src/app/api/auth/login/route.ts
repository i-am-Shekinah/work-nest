import { NextResponse } from "next/server";

import { appConfig } from "@/lib/config";
import { setSession } from "@/lib/auth/session";
import type { AuthSession } from "@/lib/api/generated/contracts";

export async function POST(request: Request) {
  const body = await request.json();

  const response = await fetch(`${appConfig.apiBaseUrl}/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
    cache: "no-store",
  });

  const payload = await response.json();

  if (!response.ok) {
    return NextResponse.json(payload, { status: response.status });
  }

  await setSession({
    token: payload.token,
    user: payload.user,
  });

  return NextResponse.json({
    user: payload.user,
  } satisfies Omit<AuthSession, "token">);
}
