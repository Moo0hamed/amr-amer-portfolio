import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { sessionCookieName, verifyOwnerSession } from "../../../../lib/auth";
import { contentStorageReady, readSiteContent, writeSiteContent } from "../../../../lib/site-content";

export const dynamic = "force-dynamic";

async function isOwner() {
  const cookieStore = await cookies();
  return verifyOwnerSession(cookieStore.get(sessionCookieName())?.value);
}

export async function GET() {
  if (!(await isOwner())) return NextResponse.json({ error: "يلزم تسجيل الدخول." }, { status: 401 });
  try {
    return NextResponse.json({ content: await readSiteContent(), canSave: contentStorageReady() }, {
      headers: { "Cache-Control": "no-store, max-age=0" }
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : "تعذر تحميل المحتوى.";
    return NextResponse.json({ error: message }, { status: 503 });
  }
}

export async function PUT(request: Request) {
  if (!(await isOwner())) return NextResponse.json({ error: "يلزم تسجيل الدخول." }, { status: 401 });
  const origin = request.headers.get("origin");
  let sameOrigin = false;
  try {
    sameOrigin = Boolean(origin) && new URL(origin!).origin === new URL(request.url).origin;
  } catch {
    sameOrigin = false;
  }
  if (!sameOrigin) {
    return NextResponse.json({ error: "الطلب غير مسموح." }, { status: 403 });
  }
  const declaredLength = Number(request.headers.get("content-length") || 0);
  if (declaredLength > 1_600_000) return NextResponse.json({ error: "حجم المحتوى أكبر من الحد المسموح." }, { status: 413 });
  try {
    const body = await request.json() as { content?: unknown };
    const result = await writeSiteContent(body.content);
    return NextResponse.json({ ok: true, savedTo: result.savedTo });
  } catch (error) {
    const message = error instanceof Error ? error.message : "تعذر حفظ التعديلات.";
    const status = message.includes("غير صالحة") || message.includes("غير مكتملة") ? 400 : 503;
    return NextResponse.json({ error: message }, { status });
  }
}
