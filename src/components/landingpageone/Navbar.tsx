"use client";

import { usePathname } from "next/navigation";
import { useInView } from "react-intersection-observer";
import { Home, Briefcase, Calendar, Dog, User } from "lucide-react";
import PawIcon from "@/icons/icon1"; 
import { cn } from "@/lib/utils";

export default function Navbar({ data }: { data: any }) {
  const pathname = usePathname();
  const { ref, inView } = useInView({ threshold: 0, initialInView: true });
  const isScrolled = !inView;

  if (!data) return null;

  const logo = data.logo || { src: "", alt: "Logo" };
  const links = data.links || [];

  return (
    <>
      <div ref={ref} className="hidden sm:absolute top-0 left-0 w-full h-5 pointer-events-none" />

      {/* DESKTOP TOP NAVIGATION */}
      <nav 
        className="hidden md:block fixed top-0 left-0 w-full z-50 transition-all duration-300"
     
      >
        <div className="px-6 md:px-12 lg:px-24 xl:px-40 py-3 flex items-center justify-between relative">
          
          {/* LOGO */}
          <a href={data.cta?.href || "/"} className="relative flex items-center justify-start w-40 h-12">
            {logo.src ? (
              <img
                src={logo.src}
                alt={logo.alt || "Business Logo"}
                className="h-full w-auto max-w-full object-contain object-left transition-all" 
              />
            ) : (
              <PawIcon className="h-11 w-11" style={{ color: data.cta?.bg }} />
            )}
          </a>

          {/* DYNAMIC NAVIGATION LINKS */}
          <div 
            className="flex items-center rounded-full px-1 py-1 gap-2 shadow-sm border"
            style={{ backgroundColor: data.bg, borderColor: data.linkHoverColor + '20' }}
          >
            {links.length > 0 ? (
              links.map((link: any, index: number) => {
                const isActive = pathname === link.href;
                return (
                  <a
                    key={index}
                    href={link.href}
                    className={cn(
                      "px-4 py-1.5 rounded-full text-sm transition-all duration-200"
                    )}
                    style={{
                      backgroundColor: isActive ? `${data.linkHoverColor}10` : 'transparent',
                      color: isActive ? data.linkHoverColor : 'var(--nav-link)',
                      fontWeight: isActive ? 500 : 400
                    }}
                    onMouseEnter={(e) => e.currentTarget.style.color = data.linkHoverColor}
                    onMouseLeave={(e) => e.currentTarget.style.color = isActive ? data.linkHoverColor : data.linkColor}
                  >
                    {link.label}
                  </a>
                );
              })
            ) : (
              <span className="px-4 py-1 text-sm opacity-50">Add links in editor</span>
            )}
          </div>

          {/* CTA BUTTON */}
          <a 
            href={data.cta?.href || "#"} 
            className="flex items-center gap-2.5 text-sm font-medium pl-5 pr-2 py-2 rounded-full cursor-pointer transition-transform hover:scale-105"
            style={{ backgroundColor: data.cta?.bg, color: data.cta?.text }}
          >
            {data.cta?.label || "Schedule"}
            <span className="w-7 h-7 rounded-full bg-white/20 flex items-center justify-center">
              <svg width="12" height="10" viewBox="0 0 12 10" fill="none">
                <path d="M.6 4.602h10m-4-4 4 4-4 4" stroke={data.cta?.text || "#ffffff"} strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </span>
          </a>
        </div>
      </nav>

      {/* MOBILE TOP HEADER */}
      <div 
        className={cn("fixed top-0 left-0 w-full z-40 p-4 transition-all duration-300 md:hidden")}
        style={{ 
          backgroundColor: isScrolled ? `${data.bg}E6` : 'transparent',
          backdropFilter: isScrolled ? 'blur(16px)' : 'none'
        }}
      >
        <a href="/" className="relative flex items-center w-32 h-10">
          {logo.src ? (
            <img src={logo.src} alt={logo.alt || "Business Logo"} className="h-full w-auto max-w-full object-contain object-left transition-all" />
          ) : (
            <PawIcon className="h-10 w-10" style={{ color: data.cta?.bg }} />
          )}
        </a>
      </div>

      {/* MOBILE BOTTOM NAVIGATION */}
      <nav 
        className="md:hidden fixed inset-x-0 bottom-4 mx-auto z-50 w-fit border rounded-full flex items-center p-2 shadow-xl space-x-1"
        style={{ backgroundColor: data.bg, borderColor: data.linkHoverColor + '20' }}
      >
        {links.slice(0, 4).map((link: any, index: number) => {
          // Fallback icons for mobile nav if dynamic mapping is needed
          const icons = [Home, Briefcase, Calendar, Dog];
          const Icon = icons[index % icons.length];
          const isActive = pathname === link.href;
          
          return (
            <a 
              key={index} 
              href={link.href} 
              className={cn("flex items-center gap-0 px-3 py-2 rounded-full transition-colors duration-200 relative h-10 min-w-[44px]", isActive ? "gap-2" : "")}
              style={{
                backgroundColor: isActive ? `${data.linkHoverColor}10` : 'transparent',
                color: isActive ? data.linkHoverColor : data.linkColor
              }}
            >
              <Icon size={22} strokeWidth={2} className="flex-shrink-0" />
              <div className="overflow-hidden flex items-center transition-all duration-300" style={{ width: isActive ? "68px" : "0px", opacity: isActive ? 1 : 0, marginLeft: isActive ? "4px" : "0px" }}>
                <span className="font-medium text-xs whitespace-nowrap overflow-hidden text-ellipsis leading-relaxed">
                  {link.label}
                </span>
              </div>
            </a>
          );
        })}
      </nav>
    </>
  );
}