import { notFound } from "next/navigation";
import { getWebsiteData } from "@/lib/get-website"; // Your existing fetch logic
import WebsiteOne from "@/components/templates/WebsiteOne";

export default async function LiveSitePage({ params }: { params: Promise<{ slug: string }> }) {
    const { slug } = await params;

    // Fetch the client data from Firebase based on the subdomain/slug
    const dbData = await getWebsiteData(slug);

    // If no data exists, or if the client hasn't clicked "Deploy" yet, show 404
    if (!dbData || !dbData.isDeployed) {
        return notFound();
    }

    return (
        <main className="w-full min-h-screen">
            <WebsiteOne data={dbData.websiteOneData} />
        </main>
    );
}