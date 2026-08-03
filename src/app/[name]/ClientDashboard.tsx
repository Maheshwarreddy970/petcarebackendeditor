"use client";

import { useState } from "react";
import Link from "next/link";
import { LayoutTemplate, Code, Download, ExternalLink, Loader2, Lock } from "lucide-react";
import merge from "lodash/merge";
import WebsiteOne from "@/components/templates/WebsiteOne";

interface DashboardProps {
  name: string;
  dbData: any;
}

export default function ClientDashboard({ name, dbData }: DashboardProps) {
  const [downloading, setDownloading] = useState(false);
  const paid = dbData?.paid;
  const activeData = merge({}, dbData?.websiteOneData || {});

  const handleDownload = async () => {
    setDownloading(true);
    try {
      const previewBox = document.getElementById("live-preview-box");
      if (!previewBox) throw new Error("Preview not found");

      const rawHtml = previewBox.outerHTML;
      const fullHtml = `<!DOCTYPE html><html lang="en"><head><meta charset="UTF-8"><meta name="viewport" content="width=device-width, initial-scale=1.0"><title>${dbData?.clientName || 'Website'}</title><script src="https://unpkg.com/@tailwindcss/browser@4"></script><style>body{margin:0;padding:0;overflow-x:hidden;font-family:sans-serif;}</style></head><body>${rawHtml}</body></html>`;

      const res = await fetch("/api/export", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ fullHtml })
      });

      if (!res.ok) throw new Error("Export failed");
      const blob = await res.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `${name}-website.zip`;
      a.click();
    } catch (error) {
      alert("Failed to download website ZIP");
    }
    setDownloading(false);
  };

  return (
    <div className="min-h-screen bg-[#f8f9fa] text-black p-6 md:p-10 font-sans flex flex-col items-center">

      {/* Dashboard Header */}
      <div className="w-full max-w-8xl mx-auto flex flex-col md:flex-row md:items-center justify-between gap-6 bg-white p-6 rounded-2xl shadow-sm border border-gray-200">
        <div>
          <h1 className="text-2xl font-bold tracking-tight capitalize text-gray-900">
            {dbData?.clientName || name}
          </h1>

        </div>

        <div className="flex flex-wrap items-center gap-3">
          <Link href={`/${name}/edit?tab=visual`} className="flex items-center gap-2 px-4 py-2 text-sm font-medium bg-white border border-gray-300 rounded-lg hover:bg-gray-50 hover:text-blue-600 transition-colors shadow-sm">
            <LayoutTemplate size={16} /> Edit Visual
          </Link>
          <Link href={`/${name}/edit?tab=json`} className="flex items-center gap-2 px-4 py-2 text-sm font-medium bg-white border border-gray-300 rounded-lg hover:bg-gray-50 text-gray-700 transition-colors shadow-sm">
            <Code size={16} /> Edit JSON
          </Link>
          <Link href={`/${name}/live`} target="_blank" className="flex items-center gap-2 px-4 py-2 text-sm font-medium bg-white border border-gray-300 rounded-lg hover:bg-gray-50 text-gray-700 transition-colors shadow-sm">
            <ExternalLink size={16} /> Fullscreen
          </Link>

          {paid ? (
            <button onClick={handleDownload} disabled={downloading} className="flex items-center gap-2 px-5 py-2 text-sm font-semibold bg-black text-white rounded-lg hover:bg-gray-800 transition-colors shadow-md disabled:opacity-70">
              {downloading ? <Loader2 size={16} className="animate-spin" /> : <Download size={16} />}
              {downloading ? "Packaging..." : "Export ZIP"}
            </button>
          ) : (
            <button disabled className="flex items-center gap-2 px-5 py-2 text-sm font-semibold bg-gray-200 text-gray-500 rounded-lg cursor-not-allowed border border-gray-300">
              <Lock size={16} /> Export ZIP (Pro)
            </button>
          )}
        </div>
      </div>
      <div className="flex flex-wrap items-center justify-center gap-4 mt-12 relative z-20">
        {[
          {
            name: "Netlify",
            url: "https://app.netlify.com/",
            icon: (
              <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-5 h-5">
                <path d="M5.926 24L11.583 13.064L8.136 9.47L0 17.511L5.926 24Z" fill="#00C7B7" />
                <path d="M22.062 5.093L13.123 9.47L17.842 14.512L22.062 5.093Z" fill="#4D9CB9" />
                <path d="M12.441 9.47L12.446 0L24.004 5.093L12.441 24V9.47Z" fill="#305869" />
              </svg>
            )
          },
          {
            name: "Vercel",
            url: "https://vercel.com/",
            icon: (
              <svg viewBox="0 0 76 65" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-4 h-4 text-black">
                <path d="M37.5274 0L75.0548 65H0L37.5274 0Z" fill="currentColor" />
              </svg>
            )
          },
          {
            name: "Cloudflare",
            url: "https://www.cloudflare.com/drop/",
            icon: (
              <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-5 h-5 text-[#F38020]">
                <path d="M17.5 10c-.3 0-.7.03-1 .08C15.7 7.7 13.5 6 11 6c-3 0-5.5 2.2-5.9 5.1C3.3 11.5 2 13.1 2 15c0 2.2 1.8 4 4 4h11.5c2.5 0 4.5-2 4.5-4.5S20 10 17.5 10z" fill="currentColor" />
              </svg>
            )
          }
        ].map((platform, index) => (
          <a
            key={index}
            href={platform.url}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 px-5 py-2.5 bg-white text-gray-800 font-medium rounded-xl shadow-sm border border-gray-200 hover:shadow-md hover:border-gray-300 hover:-translate-y-0.5 transition-all duration-200"
          >
            {platform.icon}
            {platform.name}
          </a>
        ))}
      </div>
      {/* Browser Mockup Card Container */}
      <div className="w-full max-w-8xl mx-auto mt-10 flex flex-col bg-white rounded-2xl shadow-2xl border border-gray-300 overflow-hidden ring-1 ring-black/5">

        {/* Safari/Chrome Fake Header Bar */}
        <div className="h-14 bg-gray-100/80 border-b border-gray-200 flex items-center px-4 justify-between select-none">
          {/* Traffic Lights */}
          <div className="flex gap-2 w-20">
            <div className="w-3 h-3 rounded-full bg-[#ff5f56] border border-[#e0443e]" />
            <div className="w-3 h-3 rounded-full bg-[#ffbd2e] border border-[#dea123]" />
            <div className="w-3 h-3 rounded-full bg-[#27c93f] border border-[#1aab29]" />
          </div>

          {/* Fake Address Bar */}
          <div className="flex-1 flex justify-center">
            <div className="bg-white px-8 py-1.5 text-xs text-gray-500 font-medium rounded-md border border-gray-200 shadow-sm flex items-center gap-2 min-w-[250px] justify-center">
              <Lock size={12} className="text-gray-400" />
              {dbData?.clientName || name}.petocare.com
            </div>
          </div>

          <div className="w-20" /> {/* Spacer to balance flex-between */}
        </div>

        {/* Live Website Content */}
        {/* 
            CRITICAL FIX: `transform translate-x-0 translate-y-0` creates a new containing block. 
            This forces any `fixed` elements inside (like the Navbar) to attach to THIS DIV, 
            preventing them from flying out into the rest of the dashboard! 
        */}
        <div className="relative w-full h-[750px] overflow-y-auto overflow-x-hidden bg-gray-50 transform translate-x-0 translate-y-0 custom-scrollbar">

          <div id="live-preview-box" className="w-full bg-white min-h-full flex flex-col relative origin-top">
            <WebsiteOne data={activeData} />
          </div>

        </div>
      </div>

      <style jsx global>{`
        /* Nice custom scrollbar for the preview window */
        .custom-scrollbar::-webkit-scrollbar {
          width: 8px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: #f1f1f1; 
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: #c1c1c1; 
          border-radius: 4px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: #a8a8a8; 
        }
      `}</style>
    </div>
  );
}