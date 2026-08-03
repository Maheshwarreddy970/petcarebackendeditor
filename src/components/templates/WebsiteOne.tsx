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

  // 🚀 Dynamic Config Helpers
  const logoUrl = data.logo || data.navbar?.logo?.src || data.hero?.logo || "/favicon.ico";
  const getIconUrl = (width: number, height: number = width, format: string = "png") => logoUrl;

  const tenantName = data.tenant?.name || data.seo?.title || "My App";
  const seoDescription = data.seo?.description || "Welcome to our website";

  // 🚀 Build Dynamic Manifest Data URI
  const manifest = {
    name: tenantName,
    short_name: tenantName,
    start_url: "/",
    display: "standalone",
    background_color: data.theme?.bg || "#ffffff",
    theme_color: data.theme?.primary || "#ffffff",
    icons: [
      { src: getIconUrl(192), sizes: "192x192", type: "image/png" },
      { src: getIconUrl(512), sizes: "512x512", type: "image/png" }
    ]
  };
  
  // Data URI ensures the manifest travels flawlessly in the ZIP download
  const manifestDataUrl = `data:application/manifest+json;charset=utf-8,${encodeURIComponent(JSON.stringify(manifest))}`;

  return (
    <>
      {/* --- 🔥 DYNAMIC SEO TAGS --- */}
      <title>{data.seo?.title || tenantName}</title>
      <meta name="description" content={seoDescription} />
      <meta property="og:type" content="website" />
      <meta property="og:title" content={data.seo?.title || tenantName} />
      <meta property="og:description" content={seoDescription} />
      <meta property="og:image" content={logoUrl} />
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={data.seo?.title || tenantName} />
      <meta name="twitter:description" content={seoDescription} />
      <meta name="twitter:image" content={logoUrl} />

      {/* --- 🔥 FONTS & DYNAMIC PWA ICONS --- */}
      <link rel="preconnect" href="https://fonts.googleapis.com" />
      <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
      
      {/* Dynamic Favicon (browser tab, Google search – ICO for better support) */}
      <link rel="icon" href={getIconUrl(16, 16, "ico")} sizes="16x16" type="image/x-icon" />
      <link rel="icon" href={getIconUrl(32, 32, "ico")} sizes="32x32" type="image/x-icon" />
      <link rel="icon" href={getIconUrl(48, 48, "ico")} sizes="48x48" type="image/x-icon" />
      
      {/* Dynamic Apple/iOS Icons (home screen – multiple sizes for full compatibility) */}
      <link rel="apple-touch-icon" href={getIconUrl(180)} sizes="180x180" />
      <link rel="apple-touch-icon" href={getIconUrl(152)} sizes="152x152" />
      <link rel="apple-touch-icon" href={getIconUrl(120)} sizes="120x120" />
      
      {/* Force white status bar background on iOS (white background + dark text) */}
      <meta name="apple-mobile-web-app-capable" content="yes" />
      <meta name="apple-mobile-web-app-status-bar-style" content="default" />
      <meta name="apple-mobile-web-app-title" content={tenantName} />
      
      {/* Dynamic Inline PWA Manifest */}
      <link rel="manifest" href={manifestDataUrl} />
      
      {/* Dynamic PWA Meta (native app feel) */}
      <meta name="theme-color" content="#FFFFFF" />
      <meta name="mobile-web-app-capable" content="yes" />
      <meta name="format-detection" content="telephone=no" />
      <meta name="application-name" content={tenantName} />
      
      {/* Windows Tile */}
      <meta name="msapplication-TileColor" content={data.theme?.bg || "#FAFAFA"} />
      <meta name="msapplication-TileImage" content={getIconUrl(150)} />

      {/* --- 🔥 MAIN CONTENT START --- */}
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
    </>
  );
}