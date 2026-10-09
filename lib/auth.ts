import { createHmac, timingSafeEqual } from "crypto";

const COOKIE_NAME = "amr_owner_session";
const SESSION_TTL_SECONDS = 60 * 60 * 12;

function secret() {
  return process.env.OWNER_SESSION_SECRET || "";
}

export function sessionCookieName() {
  return COOKIE_NAME;
}

export function createOwnerSession(email: string) {
  const now = Math.floor(Date.now() / 1000);
  const payload = `${email}:${now}`;
  const signature = createHmac("sha256", secret()).update(payload).digest("base64url");
  return `${Buffer.from(payload).toString("base64url")}.${signature}`;
}

export function verifyOwnerSession(token: string | undefined) {
  if (!token || !secret()) return false;
  const [encodedPayload, signature] = token.split(".");
  if (!encodedPayload || !signature) return false;

  try {
    const payload = Buffer.from(encodedPayload, "base64url").toString("utf8");
    const [email, timestamp] = payload.split(":");
    const createdAt = Number(timestamp);
    const configuredEmail = process.env.OWNER_EMAIL;
    if (!email || !timestamp || !configuredEmail || email !== configuredEmail || !Number.isFinite(createdAt)) return false;
    if (Math.floor(Date.now() / 1000) - createdAt > SESSION_TTL_SECONDS) return false;

    const expected = createHmac("sha256", secret()).update(payload).digest();
    const received = Buffer.from(signature, "base64url");
    return received.length === expected.length && timingSafeEqual(received, expected);
  } catch {
    return false;
  }
}
