import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    "/((?!api/|_next/|_static/|_vercel|[\\w-]+\\.\\w+).*)",
  ],
};

export default function middleware(req: NextRequest) {
  const url = req.nextUrl;
  
  // Get hostname of request (e.g. demo.nexpetcare.online, customdomain.com, or localhost:3000)
  let hostname = req.headers.get("host") || "";

  // Define your main application domains (add localhost for development)
  const mainDomains = ["localhost:3000", "nexpetcare.online", "www.nexpetcare.online"];

  // If the request is NOT coming from your main dashboard domain
  if (!mainDomains.includes(hostname)) {
    // Extract the slug from the subdomain (e.g., "mahesh.nexpetcare.online" -> "mahesh")
    // If they use a custom domain (e.g., "maheshpets.com"), we pass the whole domain.
    const slug = hostname.replace(".nexpetcare.online", "");

    // Rewrite the URL to our hidden [live] route
    return NextResponse.rewrite(new URL(`/live/${slug}`, req.url));
  }

  return NextResponse.next();
}