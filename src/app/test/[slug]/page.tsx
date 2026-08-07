import { notFound } from "next/navigation";
import { getWebsiteData } from "@/lib/get-website";
import WebsiteOne from "@/components/templates/WebsiteOne";

export const revalidate = 3600; 

// 🔥 THIS MAGICALLY INJECTS SEO SETTINGS INTO THE <head>
export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const data = await getWebsiteData(slug);
  const settings = data?.settings || {};

  return {
    title: settings.seoTitle || `${slug} | NexPet Care`,
    description: settings.seoDescription || "Built with NexPet Care",
    keywords: settings.keywords || "pet care, grooming",
    icons: {
      icon: settings.favicon || "/favicon.ico",
    },
    openGraph: {
      images: [settings.ogImage || "https://nexpetcare.online/default-og.jpg"],
    },
  };
}

export default async function LiveTenantPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;

  if (!slug) return notFound();

  const data = await getWebsiteData(slug);

  if (!data || !data.isDeployed) {
    return notFound();
  }

  return (
    <main className="w-full min-h-screen">
      <WebsiteOne data={data.websiteOneData} />
      
      {/* 🚀 Inject Google Analytics if they added it! */}
      {data.settings?.googleAnalyticsId && (
        <script async src={`https://www.googletagmanager.com/gtag/js?id=${data.settings.googleAnalyticsId}`}></script>
      )}
      
      {/* ⭐ Inject Google Reviews Widget Script (assuming Elfsight or similar) */}
      {data.settings?.googleReviewsId && (
         <script src="https://apps.elfsight.com/p/platform.js" defer></script>
      )}
      {data.settings?.googleReviewsId && (
         <div className={`elfsight-app-${data.settings.googleReviewsId}`}></div>
      )}
    </main>
  );
}