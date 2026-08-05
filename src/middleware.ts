// middleware.ts
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export const config = {
  matcher: [
    "/((?!api/|_next/|_static/|_vercel|[\\w-]+\\.\\w+).*)",
  ],
};

export default function middleware(req: NextRequest) {
  const url = req.nextUrl;
  
  // Read header injected by Cloudflare Worker first, then fallback to host
  let hostname = req.headers.get("X-Subdomain-Host") || req.headers.get("host") || "";
  hostname = hostname.replace("www.", ""); 

  const mainDomains = ["localhost:3000", "nexpetcare.online"];

  // 1. Subdomain routing: doggieteethcleaning.nexpetcare.online -> /[slug]
  if (hostname.endsWith(".nexpetcare.online") && hostname !== "nexpetcare.online") {
    const subdomain = hostname.replace(".nexpetcare.online", "");
    
    // Rewrite path to target app/[slug]/page.tsx internally
    return NextResponse.rewrite(new URL(`/${subdomain}${url.pathname}`, req.url));
  }

  // 2. Custom Domain routing: fluffys-salon.com
  if (!mainDomains.includes(hostname)) {
    return NextResponse.rewrite(new URL(`/live/domain/${hostname}${url.pathname}`, req.url));
  }

  return NextResponse.next();
}