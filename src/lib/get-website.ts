// lib/get-website.ts
import { db } from "@/lib/firebase";
import { collection, query, where, getDocs } from "firebase/firestore";
import { unstable_cache } from "next/cache";

// Wrap the Firebase call in unstable_cache to cache it globally
export const getWebsiteData = unstable_cache(
  async (slug: string) => {
    try {
      const q = query(collection(db, "websites"), where("slug", "==", slug));
      const snapshot = await getDocs(q);

      if (snapshot.empty) return null;
      return snapshot.docs[0].data();
    } catch (error) {
      console.error("Error fetching website:", error);
      return null;
    }
  },
  ['website-data'], // Cache key prefix
  { 
    revalidate: 3600, // Revalidate background cache every 60 minutes
    tags: ['website'] // Allows for on-demand revalidation
  }
);