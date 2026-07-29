"use server";

import { doc, setDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";

const CLOUD_URL = "https://res.cloudinary.com/doscyny4j/image/upload";

// The COMPLETE JSON structure combining your full content + granular color controls
const defaultWebsiteOneData = {
  theme: { 
    primaryColor: "#a35c38" 
  },
  navbar: {
    bg: "#ffffff",
    linkColor: "#625b5b",
    linkHoverColor: "#1e0c05",
    logo: { src: `${CLOUD_URL}/0cGSckUnYfQekLfhg0llimhDCf4_bdsxhs.png`, alt: "Petocare Logo", status: "approved" },
    cta: { label: "Schedule a visit", href: "#", bg: "#a35c38", text: "#ffffff" },
    links: [
      { href: "/", label: "Home", icon: "Home" },
      { href: "./websitetwo/services", label: "Services", icon: "Briefcase" },
      { href: "/bookings", label: "Bookings", icon: "Calendar" },
      { href: "/pets", label: "Pets", icon: "Dog" },
      { href: "/profile", label: "Profile", icon: "User" }
    ]
  },
  hero: {
    bg: "#fffaf8",
    heading: "We care for your pet like our baby",
    headingColor: "#1e0c05",
    description: "Assure clients they're completely safe with a trusted, results-driven experience.",
    descColor: "#1e0c05",
    image: `${CLOUD_URL}/homeimage_qhup2j.avif`,
    cta: { label: "Book A Schedule", href: "#", bg: "#a35c38", text: "#ffffff" },
    socialProof: { stars: 5, starColor: "#8c863a", text: "Over 400 Happy Pets Are Enjoyed", textColor: "#1e0c05" }
  },
  statsBanner: {
    bg: "#1e0c05",
    heading: "Trusted by pet owners across the city for grooming & personal care.",
    headingColor: "#fdfdfd",
    rating: { score: "4.96", max: "/5", scoreColor: "#fdfdfd", stars: 5, starColor: "#8c863a", label: "5-Star Reviews: 500+", labelColor: "#fffaf8" },
    experience: { title: "8+ Years of Experience", titleColor: "#fdfdfd", subtitle: "Started In 2018", subColor: "#fffaf8", iconColor: "#8c863a" }
  },
  gallery: {
    bg: "#fffaf8",
    heading: "See it to believe it",
    headingColor: "#1e0c05",
    description: "Every photo shows care and skill. Browse our gallery to see the Petocare difference — one happy pet at a time.",
    descColor: "#625b5b",
    arrowColor: "#8c863a",
    badgeBg: "#faf3ec",
    badgeText: "#1e0c05",
    items: [
      { id: 1, before: `${CLOUD_URL}/b_gshps9.avif`, after: `${CLOUD_URL}/a_ivvwa8.avif`, alt: "Golden Retriever grooming" },
      { id: 2, before: `${CLOUD_URL}/bb_rqe6lx.avif`, after: `${CLOUD_URL}/aa_ox3xov.avif`, alt: "Long-haired cat grooming" },
      { id: 3, before: `${CLOUD_URL}/bbb_fhhhxy.avif`, after: `${CLOUD_URL}/aaa_hwpome.avif`, alt: "Poodle grooming" }
    ]
  },
  about: {
    bg: "#fffaf8",
    heading: "We care for pets like they're our own",
    headingColor: "#1e0c05",
    description: "Petocare started with a simple idea — every pet deserves loads of love, patience, and expert care. From our very first client to our thousandth, we've always put pets first.",
    descColor: "#625b5b",
    image: `${CLOUD_URL}/feature-image1_zpl2k9.avif`,
    features: [
      "8+ years of professional pet care experience",
      "1,200+ happy pets served",
      "Trusted by families across the city"
    ],
    featureColor: "#1e0c05",
    featureIconColor: "#8c863a",
    cta: { label: "About Petocare", href: "#", bg: "#a35c38", text: "#ffffff" }
  },
  services: {
    bg: "#faf3ec",
    heading: "Services we provide",
    headingColor: "#1e0c05",
    description: "Our awesome team treats your pets like family, whether it's a quick bath or a full-on grooming and style session.",
    descColor: "#625b5b",
    cardBg: "#ffffff",
    cardBorder: "#ece5de",
    iconColor: "#a35c38",
    titleColor: "#1e0c05",
    priceColor: "#8a4e2f",
    items: [
      { title: "Full body grooming", description: "Complete pampering from head to tail—bath, dry, trim, and style all taken care of.", priceLabel: "From $79", iconKey: "grooming" },
      { title: "Bath & blow dry", description: "Deep cleansing bath premium a professional blow dry finish included.", priceLabel: "From $45", iconKey: "bath" },
      { title: "Haircut & styling", description: "Custom cuts and fun styles that totally match your pet's unique vibe perfectly.", priceLabel: "From $65", iconKey: "scissor" },
      { title: "Nail trimming", description: "Safe and precise nail clipping to keep your pet comfortable and healthy always.", priceLabel: "From $15", iconKey: "nail" }
    ],
    cta: { label: "View More Services", href: "#", bg: "#a35c38", text: "#ffffff" }
  },
  process: {
    bg: "#fffaf8",
    heading: "We make it simple",
    headingColor: "#1e0c05",
    description: "At Petocare, we truly value your time and your pet's comfort. Our process ensures a smooth experience.",
    descColor: "#625b5b",
    lineColor: "#a35c38",
    steps: [
      { id: "01", title: "Book your appointment", titleColor: "#1e0c05", description: "Pick the service you want and book a convenient time that suits you—online anytime, day or night.", descColor: "#625b5b", image: `${CLOUD_URL}/1_qifxdc.avif` },
      { id: "02", title: "Drop off your pet", titleColor: "#1e0c05", description: "Drop by our friendly studio with your pet at your appointment time & say hi to your groomer.", descColor: "#625b5b", image: `${CLOUD_URL}/2_oxpbkk.jpg` },
      { id: "03", title: "Pick up a happy pet", titleColor: "#1e0c05", description: "Grab your freshly groomed, happy pup and enjoy the awesome, lasting results of our expert care!", descColor: "#625b5b", image: `${CLOUD_URL}/3_zubywe.jpg` }
    ]
  },
  comparison: {
    bg: "#ffffff",
    heading: "Why choose petocare",
    headingColor: "#1e0c05",
    description: "We offer more than grooming — an experience of trust, expertise, and love for animals. Petocare is why owners keep returning.",
    descColor: "#625b5b",
    vsBg: "#a35c38",
    vsText: "#ffffff",
    leftBg: "#faf3ec",
    leftText: "#625b5b",
    leftIcon: "#625b5b",
    otherOffers: [
        "Untrained or uncertified staff",
        "Harsh chemicals and poor products",
        "Stressful, noisy pet environment",
        "No updates during your pet's session",
        "One-size-fits-all service packages",
        "Inconsistent results every visit"
    ],
    rightBg: "#8c863a",
    rightText: "#ffffff",
    rightIcon: "#ffffff",
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
    bg: "#fffaf8",
    heading: "The reviews say it all",
    headingColor: "#1e0c05",
    description: "Our rating truly speaks for itself — but the words behind it speak even louder and clearer, expressing our commitment.",
    descColor: "#625b5b",
    columns: {
      col1: [
          { type: "review", name: "David Chen", role: "Dog Owner", text: "“I was kinda nervous about taking Luna for grooming, but Petocare totally relaxed her and made the experience enjoyable.”", avatar: `${CLOUD_URL}/p1_wroqky.avif`, bg: "#faf3ec", textColor: "#625b5b", titleColor: "#1e0c05", starColor: "#8c863a" },
          { type: "stat-numeric", score: "4.96", scale: "/5", subtext: "5-Star Reviews: 500+", bg: "#a35c38", scoreColor: "#ffffff", textColor: "#ffffff", starColor: "#ffffff" }
      ],
      col2: [
          { type: "review", name: "James Thornton", role: "Cat Owner", text: "“Petocare truly transformed my golden retriever, Max! He looked amazing, was happy the whole time, and their exceptional care and professionalism far surpass any other groomers I've tried.”", avatar: `${CLOUD_URL}/p2_dx0rmx.avif`, bg: "#faf3ec", textColor: "#625b5b", titleColor: "#1e0c05", starColor: "#8c863a" }
      ],
      col3: [
          { type: "stat-image", image: `${CLOUD_URL}/gos_q5rxld.avif`, heading: "1200+", subtext: "Happy Pets Delivered Quarterly", bg: "#1e0c05", textColor: "#ffffff", iconColor: "#ffffff" },
          { type: "review", name: "Marcus Williams", role: "Cat Owner", text: "“As someone who owns three dogs I need a groomer I can fully trust.”", avatar: `${CLOUD_URL}/p3_sp2hha.avif`, bg: "#faf3ec", textColor: "#625b5b", titleColor: "#1e0c05", starColor: "#8c863a" }
      ]
    }
  },
  insights: {
    bg: "#fffaf8",
    heading: "Pet care insights",
    headingColor: "#1e0c05",
    description: "Awesome results come from a passionate team of dedicated animal lovers at Petocare.",
    descColor: "#625b5b",
    cardBg: "#ffffff",
    cardTitle: "#1e0c05",
    cardDateBg: "#faf3ec",
    cardDateText: "#625b5b",
    items: [
      { id: 1, title: "5 Signs your cat needs grooming help", date: "Mar 12, 2026", image: `${CLOUD_URL}/b1_n4dpky.avif` },
      { id: 2, title: "How often do usually groom your dog?", date: "Apr 5, 2026", image: `${CLOUD_URL}/b2_x13qni.avif` },
      { id: 3, title: "Keeping your pet calm during grooming", date: "May 3, 2026", image: `${CLOUD_URL}/b3_hs9zzk.avif` }
    ]
  },
  ctaSection: {
    bg: "#faf3ec",
    heading: "Book a session & feel the difference today",
    headingColor: "#1e0c05",
    description: "Nothing beats seeing your happy, freshly groomed pet run to you.",
    descColor: "#625b5b",
    image: `${CLOUD_URL}/cta_zurnmb.avif`,
    cta: { label: "Book A Schedule", href: "#", bg: "#a35c38", text: "#ffffff" }
  },
  footer: {
    bg: "#fdfdfd",
    logo: { src: `${CLOUD_URL}/logomain_zyihkn.avif`, alt: "Petocare Logo" },
    textColor: "#1e0c05",
    mutedColor: "#625b5b",
    iconBg: "#847e53",
    iconText: "#ffffff",
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
      paid:false,
      lastUpdated: new Date().toISOString(),
      websiteOneData: defaultWebsiteOneData 
    });
    return { success: true, slug };
  } catch (error: any) {
    console.error("Firebase Error:", error);
    return { success: false, error: error.message };
  }
}