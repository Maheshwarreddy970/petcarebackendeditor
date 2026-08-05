// lib/get-website.ts
import { db } from "@/lib/firebase";
import { collection, query, where, getDocs } from "firebase/firestore";
import { unstable_cache } from "next/cache";

export const getWebsiteData = unstable_cache(
  async (slug: string) => {
    // 🚨 Safeguard: Prevent sending undefined/null to Firebase where()
    if (!slug || typeof slug !== "string") {
      return null;
    }

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
  ["website-data"],
  {
    revalidate: 3600, // Cache for 1 hour at the Edge
    tags: ["website"],
  }
);