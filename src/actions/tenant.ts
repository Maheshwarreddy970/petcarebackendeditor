"use server";

import { doc, updateDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";

// Helper function to talk to Vercel API
async function callVercelApi(domain: string) {
  const projectId = process.env.VERCEL_PROJECT_ID; 
  const token = process.env.VERCEL_API_TOKEN; 
  const teamId = process.env.VERCEL_TEAM_ID; 

  if (!projectId || !token) {
    console.warn("Vercel API keys missing. Skipping automated domain registration.");
    return true; // Mock success if keys aren't added yet so local dev doesn't break
  }

  let url = `https://api.vercel.com/v10/projects/${projectId}/domains`;
  if (teamId) url += `?teamId=${teamId}`;

  const response = await fetch(url, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ name: domain }),
  });

  const data = await response.json();

  if (!response.ok && data.error?.code !== "domain_already_in_use") {
    throw new Error(data.error?.message || "Failed to add domain to Vercel.");
  }

  return true;
}

// 1. Deploy action (Provisions the sub-domain e.g., pettowngrooming.nexpetcare.online)
export async function deployWebsiteAction(slug: string) {
  try {
    const subdomain = `${slug}.nexpetcare.online`;
    await callVercelApi(subdomain);

    const websiteRef = doc(db, "websites", slug);
    await updateDoc(websiteRef, {
      isDeployed: true,
      lastDeployed: new Date().toISOString()
    });

    return { success: true };
  } catch (error: any) {
    console.error("Deploy Error:", error.message);
    return { success: false, error: error.message };
  }
}

// 2. Custom Domain action (Provisions custom domains e.g., www.yourpetsalon.com)
export async function connectCustomDomainAction(slug: string, customDomain: string) {
  try {
    const cleanDomain = customDomain.replace(/^https?:\/\//, "").replace(/\/$/, "");
    await callVercelApi(cleanDomain);

    const websiteRef = doc(db, "websites", slug);
    await updateDoc(websiteRef, {
      customDomain: cleanDomain,
      lastUpdated: new Date().toISOString()
    });

    return {
      success: true,
      dnsRecords: [
        { type: "CNAME", name: "@", value: "4e69a923b9f27034.vercel-dns-017.com" },
        { type: "CNAME", name: "www", value: "4e69a923b9f27034.vercel-dns-017.com" }
      ]
    };
  } catch (error: any) {
    console.error("Custom Domain Error:", error.message);
    return { success: false, error: error.message };
  }
}