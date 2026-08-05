"use client";

import { useState } from "react";
import { Save, Search, Share2, BarChart, ArrowRightLeft, Plus, Trash2, Image as ImageIcon, Star } from "lucide-react";
// Assuming you have a store, or you can pass these as props:
// import { useEditorStore } from "@/store/useEditorStore";

export default function SettingsTab({ data, onSave }: { data: any, onSave: (data: any) => void }) {
  const [settings, setSettings] = useState({
    seoTitle: data?.settings?.seoTitle || "",
    seoDescription: data?.settings?.seoDescription || "",
    keywords: data?.settings?.keywords || "",
    favicon: data?.settings?.favicon || "",
    ogImage: data?.settings?.ogImage || "",
    googleAnalyticsId: data?.settings?.googleAnalyticsId || "",
    googleReviewsId: data?.settings?.googleReviewsId || "",
    redirects: data?.settings?.redirects || []
  });

  const handleChange = (field: string, value: any) => {
    setSettings(prev => ({ ...prev, [field]: value }));
  };

  const addRedirect = () => {
    setSettings(prev => ({
      ...prev,
      redirects: [...prev.redirects, { oldPath: "", newPath: "" }]
    }));
  };

  const updateRedirect = (index: number, field: string, value: string) => {
    const newRedirects = [...settings.redirects];
    newRedirects[index][field] = value;
    handleChange("redirects", newRedirects);
  };

  const removeRedirect = (index: number) => {
    const newRedirects = settings.redirects.filter((_: any, i: number) => i !== index);
    handleChange("redirects", newRedirects);
  };

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-8 pb-32">
      
      <div className="flex justify-between items-center bg-white p-4 rounded-xl border border-gray-200 shadow-sm sticky top-4 z-10">
        <div>
          <h2 className="text-lg font-bold text-gray-900">Global Website Settings</h2>
          <p className="text-sm text-gray-500">Manage SEO, Integrations, and 301 Redirects.</p>
        </div>
        <button 
          onClick={() => onSave({ settings })}
          className="flex items-center gap-2 bg-black text-white px-5 py-2.5 rounded-lg font-semibold hover:bg-gray-800 transition-all shadow-md"
        >
          <Save size={16} /> Save Settings
        </button>
      </div>

      {/* 1. Google Search & SEO */}
      <section className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm space-y-6">
        <div className="flex items-center gap-2 text-blue-600 mb-2">
          <Search size={20} />
          <h3 className="text-lg font-bold text-gray-900">Search Engine Optimization (SEO)</h3>
        </div>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">Meta Title (Heading on Google)</label>
            <input 
              type="text" 
              value={settings.seoTitle}
              onChange={e => handleChange("seoTitle", e.target.value)}
              placeholder="e.g., Fluffy's Salon | Best Dog Grooming in Toronto" 
              className="w-full border border-gray-300 rounded-lg px-4 py-2 outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
            />
            <p className="text-xs text-gray-500 mt-1">Recommended: 50-60 characters.</p>
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">Meta Description (Subheading on Google)</label>
            <textarea 
              value={settings.seoDescription}
              onChange={e => handleChange("seoDescription", e.target.value)}
              rows={3}
              placeholder="e.g., Book your dog's teeth cleaning today. Stress-free, anesthesia-free, and affordable..." 
              className="w-full border border-gray-300 rounded-lg px-4 py-2 outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">Keywords</label>
            <input 
              type="text" 
              value={settings.keywords}
              onChange={e => handleChange("keywords", e.target.value)}
              placeholder="e.g., dog grooming, pet care, teeth cleaning near me" 
              className="w-full border border-gray-300 rounded-lg px-4 py-2 outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
            />
          </div>
        </div>
      </section>

      {/* 2. Social Media Branding (Favicon & Facebook Thumbnail) */}
      <section className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm space-y-6">
        <div className="flex items-center gap-2 text-indigo-600 mb-2">
          <Share2 size={20} />
          <h3 className="text-lg font-bold text-gray-900">Branding & Social Sharing</h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">Favicon URL (Browser Tab Icon)</label>
            <div className="flex gap-2 items-center">
              {settings.favicon && <img src={settings.favicon} alt="Favicon" className="w-8 h-8 rounded border" />}
              <input 
                type="text" 
                value={settings.favicon}
                onChange={e => handleChange("favicon", e.target.value)}
                placeholder="https://..." 
                className="w-full border border-gray-300 rounded-lg px-4 py-2 outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">Social Thumbnail (Facebook/iMessage)</label>
            <div className="flex gap-2 items-center">
              {settings.ogImage ? (
                <img src={settings.ogImage} alt="Social" className="w-12 h-8 object-cover rounded border" />
              ) : (
                <div className="w-12 h-8 bg-gray-100 border rounded flex items-center justify-center text-gray-400"><ImageIcon size={14}/></div>
              )}
              <input 
                type="text" 
                value={settings.ogImage}
                onChange={e => handleChange("ogImage", e.target.value)}
                placeholder="Image URL for social previews" 
                className="w-full border border-gray-300 rounded-lg px-4 py-2 outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
              />
            </div>
          </div>
        </div>
      </section>

      {/* 3. Integrations (Analytics & Reviews) */}
      <section className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm space-y-6">
        <div className="flex items-center gap-2 text-green-600 mb-2">
          <BarChart size={20} />
          <h3 className="text-lg font-bold text-gray-900">Integrations</h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">Google Analytics ID</label>
            <input 
              type="text" 
              value={settings.googleAnalyticsId}
              onChange={e => handleChange("googleAnalyticsId", e.target.value)}
              placeholder="G-XXXXXXXXXX" 
              className="w-full border border-gray-300 rounded-lg px-4 py-2 outline-none focus:border-green-500 focus:ring-1 focus:ring-green-500"
            />
          </div>

          <div>
            <label className="flex items-center gap-1 text-sm font-semibold text-gray-700 mb-1">
              <Star size={14} className="text-yellow-500" /> Google Reviews Widget Code
            </label>
            <input 
              type="text" 
              value={settings.googleReviewsId}
              onChange={e => handleChange("googleReviewsId", e.target.value)}
              placeholder="e.g. Elfsight or Google Place ID" 
              className="w-full border border-gray-300 rounded-lg px-4 py-2 outline-none focus:border-green-500 focus:ring-1 focus:ring-green-500"
            />
          </div>
        </div>
      </section>

      {/* 4. 301 Redirect Mapping (SEO Protection) */}
      <section className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm space-y-6 border-l-4 border-l-red-500">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-2 text-red-600">
            <ArrowRightLeft size={20} />
            <h3 className="text-lg font-bold text-gray-900">301 Redirect Mapping (Protect SEO)</h3>
          </div>
          <button 
            onClick={addRedirect}
            className="flex items-center gap-1 text-sm bg-red-50 text-red-600 px-3 py-1.5 rounded-lg hover:bg-red-100 transition-colors font-medium"
          >
            <Plus size={16} /> Add Redirect
          </button>
        </div>
        
        <p className="text-sm text-gray-600">
          Moving from Wix/WordPress? Map your old URLs here so Google knows where your pages moved. This protects your keyword rankings.
        </p>

        {settings.redirects.length === 0 ? (
          <div className="text-center p-8 border-2 border-dashed border-gray-200 rounded-xl text-gray-400 text-sm">
            No redirects set. Your SEO is starting fresh.
          </div>
        ) : (
          <div className="space-y-3">
            {settings.redirects.map((redirect: any, index: number) => (
              <div key={index} className="flex items-center gap-3 bg-gray-50 p-3 rounded-lg border border-gray-200">
                <div className="flex-1">
                  <label className="text-[10px] uppercase font-bold text-gray-500 block">Old Path (Wix/WP)</label>
                  <input 
                    type="text" 
                    value={redirect.oldPath}
                    onChange={e => updateRedirect(index, "oldPath", e.target.value)}
                    placeholder="/old-services-page" 
                    className="w-full bg-transparent border-b border-gray-300 outline-none focus:border-red-500 py-1 text-sm"
                  />
                </div>
                <ArrowRightLeft size={16} className="text-gray-400 mt-4 shrink-0" />
                <div className="flex-1">
                  <label className="text-[10px] uppercase font-bold text-gray-500 block">New Path (NexPet)</label>
                  <input 
                    type="text" 
                    value={redirect.newPath}
                    onChange={e => updateRedirect(index, "newPath", e.target.value)}
                    placeholder="/services" 
                    className="w-full bg-transparent border-b border-gray-300 outline-none focus:border-red-500 py-1 text-sm"
                  />
                </div>
                <button 
                  onClick={() => removeRedirect(index)}
                  className="mt-4 p-2 text-gray-400 hover:text-red-500 transition-colors"
                >
                  <Trash2 size={16} />
                </button>
              </div>
            ))}
          </div>
        )}
      </section>

    </div>
  );
}