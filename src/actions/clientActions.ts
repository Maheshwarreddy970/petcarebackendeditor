"use server";

import { doc, setDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";

const CLOUD_URL = "https://res.cloudinary.com/doscyny4j/image/upload";

// The COMPLETE JSON structure using your actual Cloudinary assets & new Navbar layout
const defaultWebsiteOneData = {
  theme: { 
    primaryColor: "#a35c38" 
  },
  navbar: {
    logo: { src: `${CLOUD_URL}/0cGSckUnYfQekLfhg0llimhDCf4_bdsxhs.png`, alt: "Petocare Logo", status: "approved" },
    cta: { label: "Schedule a visit", href: "#" },
    links: [
      { href: "/", label: "Home", icon: "Home" },
      { href: "./websitetwo/services", label: "Services", icon: "Briefcase" },
      { href: "/bookings", label: "Bookings", icon: "Calendar" },
      { href: "/pets", label: "Pets", icon: "Dog" },
      { href: "/profile", label: "Profile", icon: "User" }
    ]
  },
  hero: {
    heading: "We care for your pet like our baby",
    description: "Assure clients they're completely safe with  a trusted, results-driven experience.",
    image: `${CLOUD_URL}/homeimage_qhup2j.avif`,
    cta: { label: "Book A Schedule", href: "#" },
    socialProof: { stars: 5, text: "Over 400 Happy Pets Are Enjoyed" }
  },
  statsBanner: {
    heading: "Trusted by pet owners across the city for grooming & personal care.",
    rating: { score: "4.96", max: "/5", stars: 5, label: "5-Star Reviews: 500+" },
    experience: { title: "8+ Years of Experience", subtitle: "Started In 2018" }
  },
  gallery: {
    heading: "See it to believe it",
    description: "Every photo shows care and skill. Browse our gallery to see the Petocare difference — one happy pet at a time.",
    items: [
      { id: 1, before: `${CLOUD_URL}/b_gshps9.avif`, after: `${CLOUD_URL}/a_ivvwa8.avif`, alt: "Golden Retriever grooming" },
      { id: 2, before: `${CLOUD_URL}/bb_rqe6lx.avif`, after: `${CLOUD_URL}/aa_ox3xov.avif`, alt: "Long-haired cat grooming" },
      { id: 3, before: `${CLOUD_URL}/bbb_fhhhxy.avif`, after: `${CLOUD_URL}/aaa_hwpome.avif`, alt: "Poodle grooming" }
    ]
  },
  about: {
    heading: "We care for pets  like they're our own",
    description: "Petocare started with a simple idea — every pet deserves loads of love, patience, and expert care. From our very first client to our thousandth, we've always put pets first.",
    image: `${CLOUD_URL}/feature-image1_zpl2k9.avif`,
    features: [
      "8+ years of professional pet care experience",
      "1,200+ happy pets served",
      "Trusted by families across the city"
    ],
    cta: { label: "About Petocare", href: "#" }
  },
  services: {
    heading: "Services we provide",
    description: "Our awesome team treats your pets like family, whether it's a quick bath or a full-on grooming and style session.",
    items: [
      { title: "Full body grooming", description: "Complete pampering from head to tail—bath, dry, trim, and style all taken care of.", priceLabel: "From $79", iconKey: "grooming" },
      { title: "Bath & blow dry", description: "Deep cleansing bath premium a professional blow dry finish included.", priceLabel: "From $45", iconKey: "bath" },
      { title: "Haircut & styling", description: "Custom cuts and fun styles that totally match your pet's unique vibe perfectly.", priceLabel: "From $65", iconKey: "scissor" },
      { title: "Nail trimming", description: "Safe and precise nail clipping to keep your pet comfortable and healthy always.", priceLabel: "From $15", iconKey: "nail" }
    ],
    cta: { label: "View More Services", href: "#" }
  },
  process: {
    heading: "We make it simple",
    description: "At Petocare, we truly value your time and your pet's comfort.  Our process ensures a smooth experience.",
    steps: [
      { id: "01", title: "Book your appointment", description: "Pick the service you want and book a convenient time that suits you—online anytime, day or night.", image: `${CLOUD_URL}/1_qifxdc.avif` },
      { id: "02", title: "Drop off your pet", description: "Drop by our friendly studio with your pet at your appointment time & say hi to your groomer.", image: `${CLOUD_URL}/2_oxpbkk.jpg` },
      { id: "03", title: "Pick up a happy pet", description: "Grab your freshly groomed, happy pup and enjoy the awesome, lasting results of our expert care!", image: `${CLOUD_URL}/3_zubywe.jpg` }
    ]
  },
  comparison: {
    heading: "Why choose petocare",
    description: "We offer more than grooming — an experience of trust, expertise, and love for animals. Petocare is why owners keep returning.",
    otherOffers: [
        "Untrained or uncertified staff",
        "Harsh chemicals and poor products",
        "Stressful, noisy pet environment",
        "No updates during your pet's session",
        "One-size-fits-all service packages",
        "Inconsistent results every visit"
    ],
    petocareOffers: [
        "Certified, professional groomers",
        "100% pet-safe, eco-friendly products",
        "Calm, welcoming, stress-free space",
        "Real-time session updates",
        "Flexible packages for your pet",
        "Premium quality every visit"
    ]
  },
  reviews: {
    heading: "The reviews say it all",
    description: "Our rating truly speaks for itself — but the words behind it speak even louder and clearer, expressing our commitment.",
    columns: {
      col1: [
          { type: "review", name: "David Chen", role: "Dog Owner", text: "“I was kinda nervous about taking Luna for grooming, but Petocare totally relaxed her and made the experience enjoyable.”", avatar: `${CLOUD_URL}/p1_wroqky.avif` },
          { type: "stat-numeric", score: "4.96", scale: "/5", subtext: "5-Star Reviews: 500+" }
      ],
      col2: [
          { type: "review", name: "James Thornton", role: "Cat Owner", text: "“Petocare truly transformed my golden retriever, Max! He looked amazing, was happy the whole time, and their exceptional care and professionalism far surpass any other groomers I've tried.”", avatar: `${CLOUD_URL}/p2_dx0rmx.avif` }
      ],
      col3: [
          { type: "stat-image", image: `${CLOUD_URL}/gos_q5rxld.avif`, heading: "1200+", subtext: "Happy Pets Delivered Quarterly" },
          { type: "review", name: "Marcus Williams", role: "Cat Owner", text: "“As someone who owns three dogs I need a groomer I can fully trust.”", avatar: `${CLOUD_URL}/p3_sp2hha.avif` }
      ]
    }
  },
  insights: {
    heading: "Pet care insights",
    description: "Awesome results come from a passionate team of dedicated animal lovers at Petocare.",
    items: [
      { id: 1, title: "5 Signs your cat needs grooming help", date: "Mar 12, 2026", image: `${CLOUD_URL}/b1_n4dpky.avif` },
      { id: 2, title: "How often do usually groom your dog?", date: "Apr 5, 2026", image: `${CLOUD_URL}/b1_n4dpky.avif` },
      { id: 3, title: "Keeping your pet calm during grooming", date: "May 3, 2026", image: `${CLOUD_URL}/b3_hs9zzk.avif` }
    ]
  },
  ctaSection: {
    heading: "Book a session & feel  the difference today",
    description: "Nothing beats seeing your happy, freshly groomed pet run to you.",
    image: `${CLOUD_URL}/cta_zurnmb.avif`,
    cta: { label: "Book A Schedule", href: "#" }
  },
  footer: {
    logo: { src: `${CLOUD_URL}/logomain_zyihkn.avif`, alt: "Petocare Logo" },
    info: {
      address: "2458 Oceanview Drive, Sunnyvale, CA 94085.",
      phone: { label: "+1-587-302-7481", href: "tel:+15873027481" },
      email: { label: "hello@Petocare.com", href: "mailto:hello@Petocare.com" }
    },
    copyright: "Copyright © 2026 Petocare. All rights reserved.",
    socials: { facebook: "#", instagram: "#" }
  }
};

export async function createNewClient(name: string, slug: string) {
  if (!name || !slug) return { success: false, error: "Missing fields" };
  try {
    await setDoc(doc(db, "websites", slug), {
      clientName: name,
      slug: slug,
      lastUpdated: new Date().toISOString(),
      websiteOneData: defaultWebsiteOneData 
    });
    return { success: true, slug };
  } catch (error: any) {
    console.error("Firebase Error:", error);
    return { success: false, error: error.message };
  }
}