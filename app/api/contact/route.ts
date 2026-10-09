import { NextResponse } from "next/server";

type ContactPayload = {
  name?: string;
  email?: string;
  message?: string;
  website?: string;
};

const recentRequests = new Map<string, number>();

function clean(value: unknown, max: number) {
  return typeof value === "string" ? value.trim().slice(0, max) : "";
}

export async function POST(request: Request) {
  const ip = request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || "unknown";
  const previous = recentRequests.get(ip);
  if (previous && Date.now() - previous < 15_000) {
    return NextResponse.json({ ok: false, error: "Too many requests" }, { status: 429 });
  }

  let payload: ContactPayload;
  try {
    payload = (await request.json()) as ContactPayload;
  } catch {
    return NextResponse.json({ ok: false, error: "Invalid request" }, { status: 400 });
  }

  // Honeypot: bots that fill this hidden field are quietly rejected.
  if (clean(payload.website, 100)) {
    return NextResponse.json({ ok: true });
  }

  const name = clean(payload.name, 100);
  const email = clean(payload.email, 180);
  const message = clean(payload.message, 3000);
  if (!name || !/^\S+@\S+\.\S+$/.test(email) || !message) {
    return NextResponse.json({ ok: false, error: "Please provide valid contact details" }, { status: 422 });
  }

  recentRequests.set(ip, Date.now());

  const webhookUrl = process.env.CONTACT_WEBHOOK_URL;
  if (!webhookUrl) {
    return NextResponse.json({ ok: false, code: "EMAIL_NOT_CONFIGURED" }, { status: 503 });
  }

  try {
    const response = await fetch(webhookUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        subject: `New studio enquiry from ${name}`,
        name,
        email,
        message,
        receivedAt: new Date().toISOString()
      }),
      cache: "no-store"
    });
    if (!response.ok) throw new Error(`Webhook returned ${response.status}`);
    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ ok: false, error: "Message delivery failed" }, { status: 502 });
  }
}
