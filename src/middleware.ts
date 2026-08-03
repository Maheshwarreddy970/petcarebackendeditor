import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export const config = {
  matcher: [
    "/((?!api/|_next/|_static/|_vercel|[\\w-]+\\.\\w+).*)",
  ],
};

export default function middleware(req: NextRequest) {
  const url = req.nextUrl;
  
  // Get the domain the visitor is using (e.g. "www.pettowngrooming.com" or "nexpetcare.online")
  let hostname = req.headers.get("host") || "";

  // Remove "www." to keep database lookups consistent
  hostname = hostname.replace("www.", "");

  // Your main platform domains
  const mainDomains = ["localhost:3000", "nexpetcare.online"];

  // If the visitor is using an EXTERNAL custom domain
  if (!mainDomains.includes(hostname)) {
    // Silently rewrite the request to a special dynamic route that handles custom domains
    return NextResponse.rewrite(new URL(`/custom-domain/${hostname}`, req.url));
  }

  // If they are just browsing your main site, let them pass normally
  return NextResponse.next();
}