// lib/get-website.ts
import { db } from "@/lib/firebase";
import { collection, query, where, getDocs } from "firebase/firestore";
import { unstable_cache } from "next/cache";

async function fetchWebsiteFromFirebase(slug: string) {
  if (!slug || typeof slug !== "string") return null;

  try {
    const q = query(collection(db, "websites"), where("slug", "==", slug));
    const snapshot = await getDocs(q);

    if (snapshot.empty) return null;
    return snapshot.docs[0].data();
  } catch (error) {
    console.error("Error fetching website:", error);
    return null;
  }
}

// 🔥 Dynamic cache function per tenant slug
export async function getWebsiteData(slug: string) {
  if (!slug) return null;

  return unstable_cache(
    async () => fetchWebsiteFromFirebase(slug),
    ["website-data", slug], // ✅ CRITICAL FIX: Include slug in cache key!
    {
      revalidate: 3600, // 1 hour background revalidation
      tags: ["website", `website-${slug}`], // ✅ Tenant specific tag
    }
  )();
}