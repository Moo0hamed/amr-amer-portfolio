import { NextResponse } from "next/server";
import { createOwnerSession, sessionCookieName } from "../../../../lib/auth";

export async function POST(request: Request) {
  let payload: { email?: unknown; password?: unknown };
  try {
    payload = (await request.json()) as { email?: unknown; password?: unknown };
  } catch {
    return NextResponse.json({ ok: false, error: "Invalid request" }, { status: 400 });
  }

  const email = typeof payload.email === "string" ? payload.email.trim() : "";
  const password = typeof payload.password === "string" ? payload.password : "";
  const configuredEmail = process.env.OWNER_EMAIL;
  const configuredPassword = process.env.OWNER_PASSWORD;

  if (!configuredEmail || !configuredPassword || !process.env.OWNER_SESSION_SECRET) {
    return NextResponse.json({ ok: false, code: "AUTH_NOT_CONFIGURED" }, { status: 503 });
  }

  if (email !== configuredEmail || password !== configuredPassword) {
    return NextResponse.json({ ok: false, code: "INVALID_CREDENTIALS", error: "Invalid credentials" }, { status: 401 });
  }

  const response = NextResponse.json({ ok: true });
  response.cookies.set({
    name: sessionCookieName(),
    value: createOwnerSession(email),
    httpOnly: true,
    sameSite: "strict",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 60 * 60 * 12
  });
  return response;
}
