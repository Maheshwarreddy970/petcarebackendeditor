// app/[slug]/page.tsx
import { notFound } from "next/navigation";
import { getWebsiteData } from "@/lib/get-website";
import WebsiteOne from "@/components/templates/WebsiteOne";

export const revalidate = 3600; 

export default async function LiveTenantPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  // 🚨 CRITICAL NEXT.JS 15 FIX: Await params before reading slug
  const { slug } = await params;

  if (!slug) {
    return notFound();
  }

  // Fetch cached data from Firebase
  const data = await getWebsiteData(slug);

  if (!data || !data.isDeployed) {
    return notFound();
  }

  return (
    <main className="w-full min-h-screen">
      <WebsiteOne data={data.websiteOneData} />
    </main>
  );
}