import { notFound } from "next/navigation";
import { getWebsiteData } from "@/lib/get-website";
import WebsiteOne from "@/components/templates/WebsiteOne";

export default async function LivePreviewPage({ params }: { params: Promise<{ name: string }> }) {
    const { name } = await params;
    
    const dbData = await getWebsiteData(name);
    
    // If it doesn't exist, or if they haven't deployed it yet, block access
    if (!dbData || !dbData.deployed) {
        return (
            <div className="flex h-screen items-center justify-center flex-col gap-4 font-sans bg-gray-50 text-black">
                <h1 className="text-2xl font-bold">Site Not Deployed</h1>
                <p className="text-gray-500">This website has not been deployed to the public yet.</p>
            </div>
        );
    }

    return (
        <main className="w-full min-h-screen">
            <WebsiteOne data={dbData.websiteOneData} />
        </main>
    );
}