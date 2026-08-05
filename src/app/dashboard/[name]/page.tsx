// app/[slug]/page.tsx
import { notFound } from "next/navigation";
import { getWebsiteData } from "@/lib/get-website";
import WebsiteOne from "@/components/templates/WebsiteOne";

// Required for ISR caching behavior in the new App Router
export const revalidate = 3600; 

export default async function LiveTenantPage({ params }: { params: { slug: string } }) {
  // 1. Because of `unstable_cache`, this will not hit Firebase after the first page load
  const data = await getWebsiteData(params.slug);

  if (!data || !data.isDeployed) {
    return notFound();
  }

  // 2. Render the template statically
  return (
    <main className="w-full min-h-screen">
      <WebsiteOne data="{data.websiteOneData}"/>
    </main>
  );
}