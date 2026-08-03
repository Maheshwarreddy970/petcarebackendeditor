"use server";

import { doc, updateDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";

// 1. Action to add Custom Domain or Subdomain using Vercel API
export async function addDomainToVercel(domain: string) {
  try {
    const projectId = process.env.VERCEL_PROJECT_ID; 
    const token = process.env.VERCEL_API_TOKEN; 
    const teamId = process.env.VERCEL_TEAM_ID; 

    // Fallback if env variables are missing
    if (!projectId || !token) {
      console.warn("Vercel API keys missing. Skipping Vercel domain addition.");
      return { success: true, isMock: true };
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

    // Vercel returns 400 if the domain is already added to the project, which is fine!
    if (!response.ok && data.error?.code !== "domain_already_in_use") {
      throw new Error(data.error?.message || "Failed to add domain to Vercel.");
    }

    return {
      success: true,
      dnsRecords: [
        { type: "A", name: "@", value: "76.76.21.21" },
        { type: "CNAME", name: "www", value: "cname.vercel-dns.com" }
      ]
    };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}

// 2. Action to mark the website as "Deployed" AND provision the subdomain
export async function deployWebsiteAction(slug: string) {
  try {
    // 🔥 NEW: Automatically provision the subdomain in Vercel first!
    const subdomain = `${slug}.nexpetcare.online`;
    const vercelRes = await addDomainToVercel(subdomain);

    if (!vercelRes.success) {
      throw new Error(`Vercel provisioning failed: ${vercelRes.error}`);
    }

    // If Vercel succeeds, update Firebase to show the live preview
    const websiteRef = doc(db, "websites", slug);
    await updateDoc(websiteRef, {
      isDeployed: true,
      lastDeployed: new Date().toISOString()
    });

    return { success: true };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}