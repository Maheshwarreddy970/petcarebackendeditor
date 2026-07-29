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
  const paid=dbData.paid
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
    <div className="min-h-screen bg-white text-black p-8 font-sans flex flex-col">
      <div className="w-full mx-auto flex items-center justify-between pb-6 mb-6 border-b border-gray-200">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">{dbData?.clientName || name}</h1>
          <p className="text-sm text-gray-500 mt-1">Website Manager</p>
        </div>

        <div className="flex items-center gap-3">
          <Link href={`/${name}/edit?tab=visual`} className="flex items-center gap-2 px-4 py-2 text-sm font-medium border border-gray-300 rounded hover:bg-gray-50 text-black transition-colors">
            <LayoutTemplate size={16} /> Edit Visual
          </Link>
          <Link href={`/${name}/edit?tab=json`} className="flex items-center gap-2 px-4 py-2 text-sm font-medium border border-gray-300 rounded hover:bg-gray-50 text-black transition-colors">
            <Code size={16} /> Edit JSON
          </Link>
          <Link href={`/${name}/live`} target="_blank" className="flex items-center gap-2 px-4 py-2 text-sm font-medium border border-gray-300 rounded hover:bg-gray-50 text-black transition-colors">
            <ExternalLink size={16} /> Fullscreen
          </Link>
          {paid &&
            <button onClick={handleDownload} disabled={downloading} className="flex items-center gap-2 px-4 py-2 text-sm font-medium bg-black text-white rounded hover:bg-gray-800 transition-colors">
              {downloading ? <Loader2 size={16} className="animate-spin" /> : <Download size={16} />}
              {downloading ? "Packaging..." : "Export ZIP"}
            </button>
          }
        </div>
      </div>

      {/* Massive Scaled Preview */}
      <div className="relative w-full flex-1 bg-gray-50 rounded-lg overflow-hidden border border-gray-200">
        <div className="absolute top-0 left-0 w-[1440px] h-[900px] origin-top-left transform scale-[0.70] xl:scale-[0.85] pointer-events-none">
          <WebsiteOne data={activeData} />
        </div>
      </div>
    </div>
  );
}