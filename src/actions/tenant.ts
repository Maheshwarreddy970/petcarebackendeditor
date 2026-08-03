"use server";

import { doc, updateDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";

// 1. Action to mark the website as "Deployed" in Firebase
export async function deployWebsiteAction(slug: string) {
  try {
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

// 2. Action to add Custom Domain using Vercel API
export async function addDomainToVercel(domain: string) {
  try {
    const projectId = process.env.VERCEL_PROJECT_ID; // Your Vercel Project ID
    const token = process.env.VERCEL_API_TOKEN; // Your Vercel Access Token
    const teamId = process.env.VERCEL_TEAM_ID; // Optional: Only if your project is inside a Vercel Team

    // If environment variables aren't set yet, return the default Vercel DNS records anyway so the UI works
    if (!projectId || !token) {
      console.warn("Vercel API keys missing. Returning mock DNS instructions.");
      return {
        success: true,
        isMock: true,
        dnsRecords: [
          { type: "A", name: "@", value: "76.76.21.21" },
          { type: "CNAME", name: "www", value: "cname.vercel-dns.com" }
        ]
      };
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

    if (!response.ok) {
      throw new Error(data.error?.message || "Failed to add domain to Vercel.");
    }

    // Return the universal Vercel DNS records
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