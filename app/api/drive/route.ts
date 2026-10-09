import { NextRequest, NextResponse } from "next/server";
import { readSiteContent } from "../../../lib/site-content";

export const dynamic = "force-dynamic";

export async function GET(request: NextRequest) {
  const id = request.nextUrl.searchParams.get("id");
  let project;
  try {
    project = (await readSiteContent()).projects.find((item) => item.id === id);
  } catch {
    return NextResponse.json({ error: "Project list is unavailable" }, { status: 503 });
  }

  if (!project) {
    return NextResponse.json({ error: "Unknown Drive file" }, { status: 404 });
  }

  try {
    const response = await fetch(`https://drive.google.com/thumbnail?id=${encodeURIComponent(project.id)}&sz=w800`, {
      headers: { Accept: "image/avif,image/webp,image/apng,image/svg+xml,image/*,*/*;q=0.8" },
      redirect: "follow",
      cache: "no-store"
    });
    const contentType = response.headers.get("content-type") || "";

    if (!response.ok || !contentType.startsWith("image/")) {
      return NextResponse.json({ error: "Drive file could not be rendered as an image" }, { status: 502 });
    }

    return new NextResponse(response.body, {
      headers: {
        "Cache-Control": "public, max-age=3600, s-maxage=86400",
        "Content-Type": contentType
      }
    });
  } catch {
    return NextResponse.json({ error: "Drive image request failed" }, { status: 502 });
  }
}
