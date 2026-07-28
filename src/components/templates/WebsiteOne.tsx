import React from "react";
import Navbar from "@/components/landingpageone/Navbar";
import Homepage from "@/components/landingpageone/Home";
import StatsBanner from "@/components/landingpageone/ReviewSection";
import GallerySection from "@/components/landingpageone/GallerySection";
import AboutSection from "@/components/landingpageone/AboutSection";
import ServicesSection from "@/components/landingpageone/ServicesSection";
import ProcessSection from "@/components/landingpageone/ProcessSection";
import ComparisonSection from "@/components/landingpageone/ComparisonSection";
import ReviewsSection from "@/components/landingpageone/ReviewsSection";
import InsightsSection from "@/components/landingpageone/InsightsSection";
import CTASection from "@/components/landingpageone/CTASection";
import Footer from "@/components/landingpageone/footer";

export default function WebsiteOne({ data }: { data: any }) {
  if (!data) return null;

  return (
    <div 
      id="live-preview-box"
      className="relative w-full min-h-screen bg-[var(--bg)] font-sans text-[var(--text)]"
      style={{ 
        "--primary": data.theme?.primary || "#a35c38",
        "--primary-hover": data.theme?.primaryHover || "#8a4e2f",
        "--accent": data.theme?.accent || "#8c863a",
        "--text": data.theme?.text || "#1e0c05",
        "--text-muted": data.theme?.textMuted || "#625b5b",
        "--bg": data.theme?.bg || "#ffffff",
        "--bg-alt": data.theme?.bgAlt || "#faf3ec",
        "--border": data.theme?.border || "#ece5de",
      } as React.CSSProperties}
    >
      {data.navbar && <Navbar data={data.navbar} />}
      {data.hero && <Homepage data={data.hero} />}
      {data.statsBanner && <StatsBanner data={data.statsBanner} />}
      {data.gallery && <GallerySection data={data.gallery} />}
      {data.about && <AboutSection data={data.about} />}
      {data.services && <ServicesSection data={data.services} />}
      {data.process && <ProcessSection data={data.process} />}
      {data.comparison && <ComparisonSection data={data.comparison} />}
      {data.reviews && <ReviewsSection data={data.reviews} />}
      {data.insights && <InsightsSection data={data.insights} />}
      {data.ctaSection && <CTASection data={data.ctaSection} />}
      {data.footer && <Footer data={data.footer} />}
    </div>
  );
}