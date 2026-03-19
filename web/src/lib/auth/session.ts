"use server";

import { cookies } from "next/headers";

import { appConfig } from "@/lib/config";
import type { AuthSession, AuthenticatedUser } from "@/lib/api/generated/contracts";

type SessionPayload = {
  token: string;
  user: AuthenticatedUser;
};

const cookieOptions = {
  httpOnly: true,
  secure: process.env.NODE_ENV === "production",
  sameSite: "lax" as const,
  path: "/",
  maxAge: 60 * 60,
};

export async function getSession(): Promise<AuthSession | null> {
  const cookieStore = await cookies();
  const raw = cookieStore.get(appConfig.sessionCookieName)?.value;

  if (!raw) {
    return null;
  }

  try {
    return JSON.parse(raw) as AuthSession;
  } catch {
    return null;
  }
}

export async function setSession(payload: SessionPayload) {
  const cookieStore = await cookies();
  cookieStore.set(
    appConfig.sessionCookieName,
    JSON.stringify({
      token: payload.token,
      user: payload.user,
    } satisfies AuthSession),
    cookieOptions,
  );
}

export async function clearSession() {
  const cookieStore = await cookies();
  cookieStore.delete(appConfig.sessionCookieName);
}

export async function getAuthToken() {
  const session = await getSession();
  return session?.token ?? null;
}
