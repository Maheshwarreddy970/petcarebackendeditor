import { notFound } from "next/navigation";
import { getWebsiteData } from "@/lib/get-website";
import WebsiteOne from "@/components/templates/WebsiteOne";

export default async function LivePage({ params }: { params: Promise<{ name: string }> }) {
  const { name } = await params;
  const dbData = await getWebsiteData(name);

  if (!dbData || !dbData.websiteOneData) {
    notFound();
  }

  return <WebsiteOne data={dbData.websiteOneData} />;
}  