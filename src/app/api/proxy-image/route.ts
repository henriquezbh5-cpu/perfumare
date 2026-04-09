import { NextRequest } from "next/server";

// GET /api/proxy-image?url=https://...
// Proxies external images so Canvas can read pixels (bypasses CORS)
export async function GET(request: NextRequest) {
  const url = request.nextUrl.searchParams.get("url");

  if (!url) {
    return new Response("Missing url param", { status: 400 });
  }

  try {
    const res = await fetch(url);
    if (!res.ok) {
      return new Response("Image not found", { status: 404 });
    }

    const buffer = await res.arrayBuffer();
    const contentType = res.headers.get("content-type") ?? "image/jpeg";

    return new Response(buffer, {
      headers: {
        "Content-Type": contentType,
        "Cache-Control": "public, max-age=86400, s-maxage=86400",
        "Access-Control-Allow-Origin": "*",
      },
    });
  } catch {
    return new Response("Failed to fetch image", { status: 500 });
  }
}
