import { NextResponse } from "next/server";
import { readSiteContent } from "../../../lib/site-content";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const content = await readSiteContent();
    return NextResponse.json(content, { headers: { "Cache-Control": "no-store, max-age=0" } });
  } catch {
    return NextResponse.json({ error: "تعذر تحميل محتوى الموقع." }, { status: 503 });
  }
}
