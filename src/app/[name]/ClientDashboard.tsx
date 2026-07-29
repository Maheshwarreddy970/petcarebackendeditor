"use client";

import { useState } from "react";
import Link from "next/link";
import { LayoutTemplate, Code, Download, ExternalLink, Loader2 } from "lucide-react";
import merge from "lodash/merge";
import WebsiteOne from "@/components/templates/WebsiteOne";

interface DashboardProps {
  name: string;
  dbData: any;
}

export default function ClientDashboard({ name, dbData }: DashboardProps) {
  const [downloading, setDownloading] = useState(false);
  const paid = dbData.paid;
  const activeData = merge({}, dbData?.websiteOneData || {});

  const handleDownload = async () => {
    setDownloading(true);
    try {
      const previewBox = document.getElementById("live-preview-box");
      if (!previewBox) throw new Error("Preview not found");

      const rawHtml = previewBox.outerHTML; // Grabs the full wrapper
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
    <div className="min-h-screen bg-[#f8f9fa] text-black p-8 font-sans flex flex-col">
      
      {/* Header */}
      <div className="w-full max-w-[1400px] mx-auto flex flex-col md:flex-row items-start md:items-center justify-between pb-6 mb-8 border-b border-gray-200 gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-gray-900">{dbData?.clientName || name}</h1>
          <p className="text-sm text-gray-500 mt-1 font-medium">Website Dashboard & Preview</p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <Link href={`/${name}/edit?tab=visual`} className="flex items-center gap-2 px-4 py-2 text-sm font-medium bg-white border border-gray-300 rounded-lg hover:bg-gray-50 hover:text-black transition-all shadow-sm">
            <LayoutTemplate size={16} className="text-gray-500" /> Edit Visual
          </Link>
          <Link href={`/${name}/edit?tab=json`} className="flex items-center gap-2 px-4 py-2 text-sm font-medium bg-white border border-gray-300 rounded-lg hover:bg-gray-50 hover:text-black transition-all shadow-sm">
            <Code size={16} className="text-gray-500" /> Edit JSON
          </Link>
          <Link href={`/${name}/live`} target="_blank" className="flex items-center gap-2 px-4 py-2 text-sm font-medium bg-white border border-gray-300 rounded-lg hover:bg-gray-50 hover:text-black transition-all shadow-sm">
            <ExternalLink size={16} className="text-gray-500" /> Fullscreen
          </Link>
          {paid &&
            <button onClick={handleDownload} disabled={downloading} className="flex items-center gap-2 px-4 py-2 text-sm font-medium bg-black text-white rounded-lg hover:bg-gray-800 transition-all shadow-md disabled:opacity-70">
              {downloading ? <Loader2 size={16} className="animate-spin" /> : <Download size={16} />}
              {downloading ? "Packaging..." : "Export ZIP"}
            </button>
          }
        </div>
      </div>

      {/* Browser Mockup Card Preview */}
      <div className="flex-1 flex justify-center items-start w-full">
        <div className="w-full max-w-[1200px] bg-white rounded-xl shadow-2xl border border-gray-200/60 overflow-hidden flex flex-col ring-1 ring-black/5">
          
          {/* Fake Browser Top Bar */}
          <div className="h-12 bg-gray-50 border-b border-gray-200 flex items-center px-4 shrink-0 relative">
            {/* Window Controls */}
            <div className="flex gap-2 absolute left-4">
              <div className="w-3 h-3 rounded-full bg-[#ff5f56] border border-[#e0443e]"></div>
              <div className="w-3 h-3 rounded-full bg-[#ffbd2e] border border-[#dea123]"></div>
              <div className="w-3 h-3 rounded-full bg-[#27c93f] border border-[#1aab29]"></div>
            </div>

            {/* Fake URL Bar */}
            <div className="mx-auto bg-white border border-gray-200 shadow-sm text-gray-400 text-xs py-1.5 px-6 rounded-md w-full max-w-sm text-center flex items-center justify-center gap-2">
              <svg className="w-3 h-3 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"></path></svg>
              <span className="truncate">{name}.petocare.com</span>
            </div>
          </div>

          {/* Actual Scrollable Website Preview */}
          <div className="relative w-full h-[700px] overflow-y-auto overflow-x-hidden bg-[#f3f3f3]">
            {/* The wrapper ID needed for the download function */}
            <div id="live-preview-box" className="w-full bg-white min-h-full">
              <WebsiteOne data={activeData} />
            </div>
          </div>

        </div>
      </div>

    </div>
  );
}