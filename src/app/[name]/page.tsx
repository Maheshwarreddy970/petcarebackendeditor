import { notFound } from "next/navigation";
import { getWebsiteData } from "@/lib/get-website";
import ClientDashboard from "./ClientDashboard";
// Update this import to point to the components folder:

export default async function ClientPage({ params }: { params: Promise<{ name: string }> }) {
    const { name } = await params;

    const dbData = await getWebsiteData(name);
    if (!dbData) {
        notFound();
    }

    return <ClientDashboard name={name} dbData={dbData} />;
}