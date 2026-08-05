// middleware.ts
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export const config = {
  matcher: [
    "/((?!api/|_next/|_static/|_vercel|[\\w-]+\\.\\w+).*)",
  ],
};

export default function middleware(req: NextRequest) {
  const url = req.nextUrl;
  let hostname = req.headers.get("host") || "";
  hostname = hostname.replace("www.", ""); 

  const mainDomains = ["localhost:3000", "nexpetcare.online"];

  // 1. Map subdomains: dogvanaokotoks.nexpetcare.online -> /[slug]
  if (hostname.endsWith('.nexpetcare.online') && hostname !== 'nexpetcare.online') {
    const subdomain = hostname.replace('.nexpetcare.online', '');
    
    // Redirects the background traffic transparently to your /app/[slug] route folder
    return NextResponse.rewrite(new URL(`/${subdomain}${url.pathname}`, req.url));
  }

  // 2. Map completely custom domains: fluffys-salon.com -> /live/domain/[hostname]
  if (!mainDomains.includes(hostname)) {
    return NextResponse.rewrite(new URL(`/live/domain/${hostname}${url.pathname}`, req.url));
  }

  return NextResponse.next();
}