"use client";

import { useEffect, useState, use } from "react";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { useEditorStore } from "@/store/useEditorStore";
import { useSearchParams } from "next/navigation";
import { Save, Download, Loader2, ArrowLeft, Image as ImageIcon, ChevronDown, Plus, Trash2, Upload } from "lucide-react";
import Link from "next/link";
import WebsiteOne from "@/components/templates/WebsiteOne";

// 🔥 IMPORT THE NEW SERVER ACTION
import { uploadImageAction } from "@/actions/upload";

// --- HELPER COMPONENTS ---
const Section = ({ title, children }: { title: string, children: React.ReactNode }) => (
  <details className="group border-b border-gray-100 last:border-0 [&_summary::-webkit-details-marker]:hidden">
    <summary className="flex items-center justify-between cursor-pointer py-4 select-none outline-none">
      <span className="text-xs font-bold text-gray-500 uppercase tracking-widest group-hover:text-black transition-colors">{title}</span>
      <ChevronDown size={16} className="text-gray-400 transition-transform group-open:rotate-180" />
    </summary>
    <div className="pb-6 space-y-4 animate-in fade-in slide-in-from-top-2">
      {children}
    </div>
  </details>
);

const Input = ({ label, value, onChange, isTextArea = false }: { label: string, value: string, onChange: (val: string) => void, isTextArea?: boolean }) => (
  <div className="space-y-1.5 w-full">
    <label className="text-xs font-medium text-gray-500">{label}</label>
    {isTextArea ? (
      <textarea value={value || ""} onChange={(e) => onChange(e.target.value)} className="w-full bg-gray-50 border border-gray-200 p-2.5 rounded text-sm min-h-[80px] outline-none focus:border-black resize-y" />
    ) : (
      <input type="text" value={value || ""} onChange={(e) => onChange(e.target.value)} className="w-full bg-gray-50 border border-gray-200 p-2.5 rounded text-sm outline-none focus:border-black" />
    )}
  </div>
);

// 🔥 NEW FEATURE: Text Input with Inline Color Picker
export const ColorText = ({ label, colorValue, onColorChange }: any) => {
  // Strictly enforce HEX only. Rejects any attempt to type rgba or hsl.
  const handleHexInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let val = e.target.value;

    // Regex allows only '#' followed by 0 to 6 hex characters (0-9, A-F)
    if (/^#?[0-9A-Fa-f]{0,6}$/.test(val)) {
      // Auto-add the '#' if the user starts typing without it
      if (val.length > 0 && !val.startsWith('#')) {
        val = '#' + val;
      }
      onColorChange(val);
    }
  };

  return (
    <div className="space-y-1.5 w-full">
      <label className="text-xs font-medium text-gray-500">{label}</label>
      <div className="flex items-start gap-2">

        {/* Color Pencil / Picker */}
        <div
          className="relative w-9 h-9 rounded border border-gray-300 shrink-0 overflow-hidden shadow-sm"
          style={{ backgroundColor: colorValue || '#000000' }}
        >
          <input
            type="color"
            value={colorValue || "#000000"}
            onChange={e => onColorChange(e.target.value)}
            className="opacity-0 w-full h-full cursor-pointer absolute inset-0"
            title="Change Color"
          />
        </div>

        {/* Text Input (Strictly Hex Only) */}
        <input
          type="text"
          value={colorValue || ""}
          onChange={handleHexInputChange}
          placeholder="#000000"
          maxLength={7}
          className="w-full h-9 bg-gray-50 border border-gray-200 px-3 rounded text-sm outline-none focus:border-black"
        />

      </div>
    </div>
  );
};

// 🔥 NEW FEATURE: Button Configuration (Text, Link, Bg Color, Text Color)
export const ButtonConfig = ({ label, textVal, hrefVal, bgCol, textCol, onText, onHref, onBg, onCol }: any) => {
  
  // Reusable strict HEX validator. Rejects rgba/hsl and allows only valid hex codes.
  const handleHexChange = (e: React.ChangeEvent<HTMLInputElement>, callback: (val: string) => void) => {
    let val = e.target.value;
    if (/^#?[0-9A-Fa-f]{0,6}$/.test(val)) {
      if (val.length > 0 && !val.startsWith('#')) {
        val = '#' + val;
      }
      callback(val);
    }
  };

  return (
    <div className="p-3 border border-gray-200 rounded-lg bg-gray-50 space-y-3">
      <label className="text-xs font-bold text-gray-700 uppercase tracking-wider">{label}</label>
      
      {/* Top Row: Text and Link Inputs */}
      <div className="grid grid-cols-2 gap-3">
        <input type="text" placeholder="Button Text" value={textVal || ""} onChange={e => onText(e.target.value)} className="w-full h-9 px-3 border border-gray-200 rounded text-sm outline-none focus:border-black" />
        <input type="text" placeholder="Link (URL)" value={hrefVal || ""} onChange={e => onHref(e.target.value)} className="w-full h-9 px-3 border border-gray-200 rounded text-sm outline-none focus:border-black" />
      </div>
      
      {/* Bottom Row: Color Configs */}
      <div className="grid grid-cols-2 gap-3">
        
        {/* Background Color */}
        <div className="space-y-1">
          <span className="text-[10px] text-gray-500 font-bold uppercase tracking-wider">Background</span>
          <div className="flex items-center gap-2">
            <div className="relative w-8 h-8 rounded border border-gray-300 overflow-hidden shrink-0" style={{ backgroundColor: bgCol || '#000000' }}>
              <input type="color" value={bgCol || "#000000"} onChange={e => onBg(e.target.value)} className="opacity-0 w-full h-full cursor-pointer absolute inset-0" title="Change Background Color" />
            </div>
            <input 
              type="text" 
              value={bgCol || ""} 
              onChange={e => handleHexChange(e, onBg)} 
              placeholder="#000000" 
              maxLength={7} 
              className="w-full h-8 px-2 bg-white border border-gray-200 rounded text-xs font-mono uppercase outline-none focus:border-black" 
            />
          </div>
        </div>

        {/* Text Color */}
        <div className="space-y-1">
          <span className="text-[10px] text-gray-500 font-bold uppercase tracking-wider">Text</span>
          <div className="flex items-center gap-2">
            <div className="relative w-8 h-8 rounded border border-gray-300 overflow-hidden shrink-0" style={{ backgroundColor: textCol || '#ffffff' }}>
              <input type="color" value={textCol || "#ffffff"} onChange={e => onCol(e.target.value)} className="opacity-0 w-full h-full cursor-pointer absolute inset-0" title="Change Text Color" />
            </div>
            <input 
              type="text" 
              value={textCol || ""} 
              onChange={e => handleHexChange(e, onCol)} 
              placeholder="#FFFFFF" 
              maxLength={7} 
              className="w-full h-8 px-2 bg-white border border-gray-200 rounded text-xs font-mono uppercase outline-none focus:border-black" 
            />
          </div>
        </div>

      </div>
    </div>
  );
};

const ImageUploader = ({ label, src, isUploading, onUpload }: { label: string, src: string, isUploading: boolean, onUpload: (e: React.ChangeEvent<HTMLInputElement> | any) => void }) => {
  const [isDragOver, setIsDragOver] = useState(false);

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragOver(true);
  };

  const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragOver(false);
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragOver(false);

    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      // Mocks the React ChangeEvent so your existing handleImageUpload function works instantly
      const mockEvent = {
        target: { files: e.dataTransfer.files }
      };
      onUpload(mockEvent);
    }
  };

  return (
    <div className="space-y-1.5 w-full">
      <label className="text-xs font-medium text-gray-500">{label}</label>
      
      <div 
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        className={`w-full p-3 rounded-lg border-2 transition-all duration-200 ${
          isDragOver 
            ? "border-blue-500 bg-blue-50/50 border-dashed scale-[1.02]" 
            : "border-gray-200 bg-gray-50/50 border-solid"
        }`}
      >
        {src && (
          <img 
            src={src} 
            alt="Preview"
            // pointer-events-none stops the image from interrupting the drag area
            className="w-full h-24 object-contain rounded mb-3 border border-gray-200 bg-white shadow-sm pointer-events-none" 
          />
        )}
        
        <label className={`flex items-center justify-center gap-2 w-full p-2 bg-white border border-gray-200 rounded cursor-pointer text-xs font-medium text-gray-700 transition-colors ${
            isDragOver ? "ring-2 ring-blue-500/20 text-blue-600" : "hover:bg-gray-50"
        }`}>
          {isUploading ? <Loader2 size={14} className="animate-spin" /> : <Upload size={14} />}
          
          {isUploading 
            ? "Optimizing & Uploading..." 
            : isDragOver 
              ? "Drop image here!" 
              : "Click or Drag Image"
          }
          
          <input 
            type="file" 
            accept="image/*" 
            className="hidden" 
            onChange={onUpload} 
            disabled={isUploading} 
          />
        </label>
      </div>
    </div>
  );
};

export default function EditPage({ params }: { params: Promise<{ name: string }> }) {
  const { name } = use(params);
  const searchParams = useSearchParams();
  const { config, currentSlug, setConfig, updateField, updateFromJson, addArrayItem, removeArrayItem } = useEditorStore();

  const initialTab = searchParams.get("tab") === "json" ? "json" : "visual";
  const [activeTab, setActiveTab] = useState<"visual" | "json">(initialTab);
  const [jsonInput, setJsonInput] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [downloading, setDownloading] = useState(false);
  const [uploadingImage, setUploadingImage] = useState<string | null>(null);
  const [isHydrated, setIsHydrated] = useState(false);

  const [sidebarWidth, setSidebarWidth] = useState(420);
  const [isDragging, setIsDragging] = useState(false);

  useEffect(() => setIsHydrated(true), []);

  useEffect(() => {
    if (!isHydrated) return;
    const initializeData = async () => {
      try {
        if (currentSlug === name && config) {
          setJsonInput(JSON.stringify(config, null, 2));
          return;
        }
        const docSnap = await getDoc(doc(db, "websites", name));
        if (docSnap.exists() && docSnap.data().websiteOneData) {
          setConfig(docSnap.data().websiteOneData, name);
          setJsonInput(JSON.stringify(docSnap.data().websiteOneData, null, 2));
        }
      } finally {
        setLoading(false);
      }
    };
    initializeData();
  }, [name, isHydrated]);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!isDragging) return;
      let newWidth = e.clientX;
      if (newWidth < 320) newWidth = 320;
      if (newWidth > 800) newWidth = 800;
      setSidebarWidth(newWidth);
    };
    const handleMouseUp = () => setIsDragging(false);

    if (isDragging) {
      document.addEventListener("mousemove", handleMouseMove);
      document.addEventListener("mouseup", handleMouseUp);
    }
    return () => {
      document.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseup", handleMouseUp);
    };
  }, [isDragging]);

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>, path: string) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploadingImage(path);
    try {
      const formData = new FormData();
      formData.append("file", file);

      // CALLS THE SERVER ACTION
      const optimizedUrl = await uploadImageAction(formData);

      updateField(path, optimizedUrl);
      if (config) setTimeout(() => setJsonInput(JSON.stringify(useEditorStore.getState().config, null, 2)), 100);
    } catch (error: any) {
      alert(`Image upload failed: ${error.message}`);
    } finally {
      setUploadingImage(null);
    }
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      await setDoc(doc(db, "websites", name), { lastUpdated: new Date().toISOString(), websiteOneData: config }, { merge: true });
    } finally {
      setSaving(false);
    }
  };

  const handleDownload = async () => {
    setDownloading(true);
    try {
      const previewBox = document.getElementById("live-preview-box");
      const rawHtml = previewBox ? previewBox.outerHTML : "";
      const fullHtml = `<!DOCTYPE html><html lang="en"><head><meta charset="UTF-8"><meta name="viewport" content="width=device-width, initial-scale=1.0"><title>${config.hero?.heading || 'Website'}</title><script src="https://unpkg.com/@tailwindcss/browser@4"></script><style>body{margin:0;padding:0;overflow-x:hidden;font-family:sans-serif;}</style></head><body>${rawHtml}</body></html>`;

      const res = await fetch("/api/export", {
        method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ fullHtml })
      });
      if (!res.ok) throw new Error("Export Failed");

      const blob = await res.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `${name}-website.zip`;
      a.click();
    } catch (error) {
      alert("Error generating ZIP package.");
    }
    setDownloading(false);
  };

  if (loading || !config || !isHydrated) return <div className="flex h-screen items-center justify-center bg-white"><Loader2 className="animate-spin text-black w-8 h-8" /></div>;

  return (
    <div className="flex w-full h-screen overflow-hidden bg-white text-black font-sans">

      {/* 1. SIDEBAR */}
      <div style={{ width: sidebarWidth }} className="h-full flex flex-col shrink-0 bg-white shadow-2xl shadow-black/5 z-20">

        <div className="flex flex-col gap-5 px-6 pt-10 pb-5 border-b border-gray-100">
          <Link href={`/${name}`} className="text-gray-400 hover:text-black flex items-center gap-1.5 text-sm font-medium w-fit transition-colors">
            <ArrowLeft size={16} /> Back to Dashboard
          </Link>
          <div className="flex items-center justify-between">
            <div className="flex bg-gray-50 border border-gray-200 rounded p-1">
              <button onClick={() => setActiveTab("visual")} className={`px-4 py-1.5 text-xs rounded font-medium transition-all ${activeTab === "visual" ? "bg-white shadow-sm border border-gray-200 text-black" : "text-gray-500 hover:text-black"}`}>Visual</button>
              <button onClick={() => setActiveTab("json")} className={`px-4 py-1.5 text-xs rounded font-medium transition-all ${activeTab === "json" ? "bg-white shadow-sm border border-gray-200 text-black" : "text-gray-500 hover:text-black"}`}>JSON</button>
            </div>
          </div>
        </div>

        {activeTab === "json" && (
          <div className="flex-1 p-4 bg-gray-50">
            <textarea value={jsonInput} onChange={(e) => { setJsonInput(e.target.value); updateFromJson(e.target.value); }} className="w-full h-full bg-white border border-gray-200 rounded-lg p-4 font-mono text-sm resize-none outline-none focus:border-black focus:ring-1 focus:ring-black" />
          </div>
        )}

        {activeTab === "visual" && (
          <div className="flex-1 overflow-y-auto px-6 pb-20 scrollbar-hide bg-white space-y-2">

            {/* NAVBAR SECTION */}
            <Section title="Navigation Bar">
              <ColorText label="Background Color" colorValue={config.navbar?.bg} onColorChange={(v: string) => updateField('navbar.bg', v)} />
              <ColorText label="Nav Link Color" colorValue={config.navbar?.linkColor} onColorChange={(v: string) => updateField('navbar.linkColor', v)} />
              <ColorText label="Nav Hover Color" colorValue={config.navbar?.linkHoverColor} onColorChange={(v: string) => updateField('navbar.linkHoverColor', v)} />

              <ImageUploader label="Logo Image" src={config.navbar?.logo?.src} isUploading={uploadingImage === 'navbar.logo.src'} onUpload={(e) => handleImageUpload(e, 'navbar.logo.src')} />
              <Input label="Logo Alt Text" value={config.navbar?.logo?.alt} onChange={(v) => updateField('navbar.logo.alt', v)} />

              <ButtonConfig label="CTA Button" textVal={config.navbar?.cta?.label} hrefVal={config.navbar?.cta?.href} bgCol={config.navbar?.cta?.bg} textCol={config.navbar?.cta?.text} onText={(v: string) => updateField('navbar.cta.label', v)} onHref={(v: string) => updateField('navbar.cta.href', v)} onBg={(v: string) => updateField('navbar.cta.bg', v)} onCol={(v: string) => updateField('navbar.cta.text', v)} />
            </Section>

            {/* HERO SECTION */}
            <Section title="Hero Section">
              <ColorText label="Background Color" colorValue={config.hero?.bg} onColorChange={(v: string) => updateField('hero.bg', v)} />
              <ColorText label="Heading" textValue={config.hero?.heading} colorValue={config.hero?.headingColor} onTextChange={(v: string) => updateField('hero.heading', v)} onColorChange={(v: string) => updateField('hero.headingColor', v)} />
              <ColorText label="Description" textValue={config.hero?.description} colorValue={config.hero?.descColor} onTextChange={(v: string) => updateField('hero.description', v)} onColorChange={(v: string) => updateField('hero.descColor', v)} isTextArea />

              <ImageUploader label="Background Image" src={config.hero?.image} isUploading={uploadingImage === 'hero.image'} onUpload={(e) => handleImageUpload(e, 'hero.image')} />

              <ButtonConfig label="CTA Button" textVal={config.hero?.cta?.label} hrefVal={config.hero?.cta?.href} bgCol={config.hero?.cta?.bg} textCol={config.hero?.cta?.text} onText={(v: string) => updateField('hero.cta.label', v)} onHref={(v: string) => updateField('hero.cta.href', v)} onBg={(v: string) => updateField('hero.cta.bg', v)} onCol={(v: string) => updateField('hero.cta.text', v)} />

              <div className="border border-gray-200 p-3 rounded-lg bg-gray-50 mt-4 space-y-3">
                <label className="text-xs font-bold text-gray-700 uppercase tracking-wider">Social Proof</label>
                <ColorText label="Star Count (1-5)" textValue={config.hero?.socialProof?.stars} colorValue={config.hero?.socialProof?.starColor} onTextChange={(v: string) => updateField('hero.socialProof.stars', v)} onColorChange={(v: string) => updateField('hero.socialProof.starColor', v)} />
                <ColorText label="Social Proof Text" textValue={config.hero?.socialProof?.text} colorValue={config.hero?.socialProof?.textColor} onTextChange={(v: string) => updateField('hero.socialProof.text', v)} onColorChange={(v: string) => updateField('hero.socialProof.textColor', v)} />
              </div>
            </Section>

            {/* STATS BANNER */}
            <Section title="Stats Banner">
              <ColorText label="Background Color" colorValue={config.statsBanner?.bg} onColorChange={(v: string) => updateField('statsBanner.bg', v)} />
              <ColorText label="Heading" textValue={config.statsBanner?.heading} colorValue={config.statsBanner?.headingColor} onTextChange={(v: string) => updateField('statsBanner.heading', v)} onColorChange={(v: string) => updateField('statsBanner.headingColor', v)} />

              <div className="border border-gray-200 p-3 rounded-lg bg-gray-50 mt-4 space-y-3">
                <label className="text-xs font-bold text-gray-700 uppercase tracking-wider">Ratings</label>
                <ColorText label="Score (e.g. 4.96)" textValue={config.statsBanner?.rating?.score} colorValue={config.statsBanner?.rating?.scoreColor} onTextChange={(v: string) => updateField('statsBanner.rating.score', v)} onColorChange={(v: string) => updateField('statsBanner.rating.scoreColor', v)} />
                <Input label="Scale (e.g. /5)" value={config.statsBanner?.rating?.max} onChange={(v) => updateField('statsBanner.rating.max', v)} />
                <ColorText label="Stars Count" textValue={config.statsBanner?.rating?.stars} colorValue={config.statsBanner?.rating?.starColor} onTextChange={(v: string) => updateField('statsBanner.rating.stars', v)} onColorChange={(v: string) => updateField('statsBanner.rating.starColor', v)} />
                <ColorText label="Review Label" textValue={config.statsBanner?.rating?.label} colorValue={config.statsBanner?.rating?.labelColor} onTextChange={(v: string) => updateField('statsBanner.rating.label', v)} onColorChange={(v: string) => updateField('statsBanner.rating.labelColor', v)} />
              </div>

              <div className="border border-gray-200 p-3 rounded-lg bg-gray-50 mt-4 space-y-3">
                <label className="text-xs font-bold text-gray-700 uppercase tracking-wider">Experience</label>
                <ColorText label="Icon Color" colorValue={config.statsBanner?.experience?.iconColor} onColorChange={(v: string) => updateField('statsBanner.experience.iconColor', v)} />
                <ColorText label="Title" textValue={config.statsBanner?.experience?.title} colorValue={config.statsBanner?.experience?.titleColor} onTextChange={(v: string) => updateField('statsBanner.experience.title', v)} onColorChange={(v: string) => updateField('statsBanner.experience.titleColor', v)} />
                <ColorText label="Subtitle" textValue={config.statsBanner?.experience?.subtitle} colorValue={config.statsBanner?.experience?.subColor} onTextChange={(v: string) => updateField('statsBanner.experience.subtitle', v)} onColorChange={(v: string) => updateField('statsBanner.experience.subColor', v)} />
              </div>
            </Section>

            {/* ABOUT US */}
            <Section title="About Us">
              <ColorText label="Background Color" colorValue={config.about?.bg} onColorChange={(v: string) => updateField('about.bg', v)} />
              <ColorText label="Heading" textValue={config.about?.heading} colorValue={config.about?.headingColor} onTextChange={(v: string) => updateField('about.heading', v)} onColorChange={(v: string) => updateField('about.headingColor', v)} />
              <ColorText label="Description" textValue={config.about?.description} colorValue={config.about?.descColor} onTextChange={(v: string) => updateField('about.description', v)} onColorChange={(v: string) => updateField('about.descColor', v)} isTextArea />

              <ImageUploader label="About Image" src={config.about?.image} isUploading={uploadingImage === 'about.image'} onUpload={(e) => handleImageUpload(e, 'about.image')} />

              <div className="border border-gray-200 p-3 rounded-lg bg-gray-50 mt-4 space-y-3">
                <label className="text-xs font-bold text-gray-700 uppercase tracking-wider">Features List</label>
                <ColorText label="Icon Color" colorValue={config.about?.featureIconColor} onColorChange={(v: string) => updateField('about.featureIconColor', v)} />
                <ColorText label="Text Color" colorValue={config.about?.featureColor} onColorChange={(v: string) => updateField('about.featureColor', v)} />
                {config.about?.features?.map((feat: string, i: number) => (
                  <div key={i} className="flex gap-2 relative group">
                    <input type="text" value={feat} onChange={(e) => updateField(`about.features[${i}]`, e.target.value)} className="w-full bg-white border border-gray-200 p-2 rounded text-sm outline-none focus:border-black" />
                    <button onClick={() => removeArrayItem('about.features', i)} className="absolute right-2 top-2 text-red-400 opacity-0 group-hover:opacity-100"><Trash2 size={14} /></button>
                  </div>
                ))}
                <button onClick={() => addArrayItem('about.features', "New Feature")} className="text-xs text-blue-600 hover:text-blue-700 flex items-center gap-1 font-medium"><Plus size={14} /> Add Feature</button>
              </div>

              <ButtonConfig label="CTA Button" textVal={config.about?.cta?.label} hrefVal={config.about?.cta?.href} bgCol={config.about?.cta?.bg} textCol={config.about?.cta?.text} onText={(v: string) => updateField('about.cta.label', v)} onHref={(v: string) => updateField('about.cta.href', v)} onBg={(v: string) => updateField('about.cta.bg', v)} onCol={(v: string) => updateField('about.cta.text', v)} />
            </Section>

            {/* GALLERY */}
            {config.gallery?.items && (
              <Section title="Gallery">
                <ColorText label="Background Color" colorValue={config.gallery?.bg} onColorChange={(v: string) => updateField('gallery.bg', v)} />
                <ColorText label="Heading" textValue={config.gallery?.heading} colorValue={config.gallery?.headingColor} onTextChange={(v: string) => updateField('gallery.heading', v)} onColorChange={(v: string) => updateField('gallery.headingColor', v)} />
                <ColorText label="Description" textValue={config.gallery?.description} colorValue={config.gallery?.descColor} onTextChange={(v: string) => updateField('gallery.description', v)} onColorChange={(v: string) => updateField('gallery.descColor', v)} isTextArea />

                <ColorText label="Arrow Icon Color" colorValue={config.gallery?.arrowColor} onColorChange={(v: string) => updateField('gallery.arrowColor', v)} />
                <ColorText label="Before/After Badge Bg" colorValue={config.gallery?.badgeBg} onColorChange={(v: string) => updateField('gallery.badgeBg', v)} />
                <ColorText label="Before/After Badge Text" colorValue={config.gallery?.badgeText} onColorChange={(v: string) => updateField('gallery.badgeText', v)} />

                <div className="mt-4 space-y-3">
                  <label className="text-xs font-bold text-gray-500 flex justify-between items-center">
                    Gallery Images
                    <button onClick={() => addArrayItem('gallery.items', { before: "", after: "", alt: "New Image" })} className="text-blue-600 hover:text-blue-700 flex items-center gap-1">
                      <Plus size={14} /> Add Image
                    </button>
                  </label>
                  {config.gallery.items.map((item: any, i: number) => (
                    <div key={item.id || i} className="border border-gray-200 p-4 rounded-lg bg-gray-50 space-y-3 relative group">
                      <button onClick={() => removeArrayItem('gallery.items', i)} className="p-2 text-red-400 hover:text-red-600 absolute -right-3 -top-3 bg-white border border-gray-200 rounded-full opacity-0 group-hover:opacity-100 transition-opacity z-10"><Trash2 size={12} /></button>
                      <ImageUploader label="Before Image" src={item.before} isUploading={uploadingImage === `gallery.items[${i}].before`} onUpload={(e) => handleImageUpload(e, `gallery.items[${i}].before`)} />
                      <ImageUploader label="After Image" src={item.after} isUploading={uploadingImage === `gallery.items[${i}].after`} onUpload={(e) => handleImageUpload(e, `gallery.items[${i}].after`)} />
                      <Input label="Alt Text" value={item.alt} onChange={(v) => updateField(`gallery.items[${i}].alt`, v)} />
                    </div>
                  ))}
                </div>
              </Section>
            )}

            {/* SERVICES */}
            {config.services?.items && (
              <Section title="Services">
                <ColorText label="Background Color" colorValue={config.services?.bg} onColorChange={(v: string) => updateField('services.bg', v)} />
                <ColorText label="Heading" textValue={config.services?.heading} colorValue={config.services?.headingColor} onTextChange={(v: string) => updateField('services.heading', v)} onColorChange={(v: string) => updateField('services.headingColor', v)} />
                <ColorText label="Description" textValue={config.services?.description} colorValue={config.services?.descColor} onTextChange={(v: string) => updateField('services.description', v)} onColorChange={(v: string) => updateField('services.descColor', v)} isTextArea />

                <div className="grid grid-cols-2 gap-2 my-4 p-3 bg-gray-50 rounded-lg border border-gray-200">
                  <ColorText label="Card Bg" colorValue={config.services?.cardBg} onColorChange={(v: string) => updateField('services.cardBg', v)} />
                  <ColorText label="Card Border" colorValue={config.services?.cardBorder} onColorChange={(v: string) => updateField('services.cardBorder', v)} />
                  <ColorText label="Icon Color" colorValue={config.services?.iconColor} onColorChange={(v: string) => updateField('services.iconColor', v)} />
                  <ColorText label="Title Color" colorValue={config.services?.titleColor} onColorChange={(v: string) => updateField('services.titleColor', v)} />
                  <ColorText label="Price Color" colorValue={config.services?.priceColor} onColorChange={(v: string) => updateField('services.priceColor', v)} />
                </div>

                <div className="mt-4 space-y-3">
                  <label className="text-xs font-bold text-gray-500 flex justify-between items-center">
                    Service Items
                    <button onClick={() => addArrayItem('services.items', { title: "New Service", description: "", priceLabel: "", iconKey: "pet" })} className="text-blue-600 hover:text-blue-700 flex items-center gap-1">
                      <Plus size={14} /> Add Service
                    </button>
                  </label>
                  {config.services.items.map((item: any, i: number) => (
                    <div key={i} className="border border-gray-200 p-4 rounded-lg bg-gray-50 space-y-3 relative group">
                      <button onClick={() => removeArrayItem('services.items', i)} className="p-2 text-red-400 hover:text-red-600 absolute -right-3 -top-3 bg-white border border-gray-200 rounded-full opacity-0 group-hover:opacity-100 transition-opacity z-10"><Trash2 size={12} /></button>
                      <Input label="Service Title" value={item.title} onChange={(v) => updateField(`services.items[${i}].title`, v)} />
                      <Input label="Description" value={item.description} onChange={(v) => updateField(`services.items[${i}].description`, v)} isTextArea />
                      <Input label="Price Label" value={item.priceLabel} onChange={(v) => updateField(`services.items[${i}].priceLabel`, v)} />
                    </div>
                  ))}
                </div>

                <div className="mt-4">
                  <ButtonConfig label="CTA Button" textVal={config.services?.cta?.label} hrefVal={config.services?.cta?.href} bgCol={config.services?.cta?.bg} textCol={config.services?.cta?.text} onText={(v: string) => updateField('services.cta.label', v)} onHref={(v: string) => updateField('services.cta.href', v)} onBg={(v: string) => updateField('services.cta.bg', v)} onCol={(v: string) => updateField('services.cta.text', v)} />
                </div>
              </Section>
            )}

            {/* PROCESS STEPS */}
            {config.process?.steps && (
              <Section title="Process Steps">
                <ColorText label="Background Color" colorValue={config.process?.bg} onColorChange={(v: string) => updateField('process.bg', v)} />
                <ColorText label="Vertical Line Color" colorValue={config.process?.lineColor} onColorChange={(v: string) => updateField('process.lineColor', v)} />
                <ColorText label="Heading" textValue={config.process?.heading} colorValue={config.process?.headingColor} onTextChange={(v: string) => updateField('process.heading', v)} onColorChange={(v: string) => updateField('process.headingColor', v)} />
                <ColorText label="Description" textValue={config.process?.description} colorValue={config.process?.descColor} onTextChange={(v: string) => updateField('process.description', v)} onColorChange={(v: string) => updateField('process.descColor', v)} isTextArea />

                <div className="mt-4 space-y-3">
                  <label className="text-xs font-bold text-gray-500 flex justify-between items-center">
                    Steps
                    <button onClick={() => addArrayItem('process.steps', { title: "New Step", description: "", image: "" })} className="text-blue-600 hover:text-blue-700 flex items-center gap-1">
                      <Plus size={14} /> Add Step
                    </button>
                  </label>
                  {config.process.steps.map((item: any, i: number) => (
                    <div key={i} className="border border-gray-200 p-4 rounded-lg bg-gray-50 space-y-3 relative group">
                      <button onClick={() => removeArrayItem('process.steps', i)} className="p-2 text-red-400 hover:text-red-600 absolute -right-3 -top-3 bg-white border border-gray-200 rounded-full opacity-0 group-hover:opacity-100 transition-opacity z-10"><Trash2 size={12} /></button>
                      <ColorText label="Step Title" textValue={item.title} colorValue={item.titleColor} onTextChange={(v: string) => updateField(`process.steps[${i}].title`, v)} onColorChange={(v: string) => updateField(`process.steps[${i}].titleColor`, v)} />
                      <ColorText label="Description" textValue={item.description} colorValue={item.descColor} onTextChange={(v: string) => updateField(`process.steps[${i}].description`, v)} onColorChange={(v: string) => updateField(`process.steps[${i}].descColor`, v)} isTextArea />
                      <ImageUploader label="Step Image" src={item.image} isUploading={uploadingImage === `process.steps[${i}].image`} onUpload={(e) => handleImageUpload(e, `process.steps[${i}].image`)} />
                    </div>
                  ))}
                </div>
              </Section>
            )}

            {/* COMPARISON BOARD */}
            {config.comparison && (
              <Section title="Comparison Board">
                <ColorText label="Background Color" colorValue={config.comparison?.bg} onColorChange={(v: string) => updateField('comparison.bg', v)} />
                <ColorText label="Heading" textValue={config.comparison?.heading} colorValue={config.comparison?.headingColor} onTextChange={(v: string) => updateField('comparison.heading', v)} onColorChange={(v: string) => updateField('comparison.headingColor', v)} />
                <ColorText label="Description" textValue={config.comparison?.description} colorValue={config.comparison?.descColor} onTextChange={(v: string) => updateField('comparison.description', v)} onColorChange={(v: string) => updateField('comparison.descColor', v)} isTextArea />

                <div className="grid grid-cols-2 gap-4 mt-4 p-3 bg-gray-50 rounded border border-gray-200">
                  <ColorText label="VS Badge Bg" colorValue={config.comparison?.vsBg} onColorChange={(v: string) => updateField('comparison.vsBg', v)} />
                  <ColorText label="VS Badge Text" colorValue={config.comparison?.vsText} onColorChange={(v: string) => updateField('comparison.vsText', v)} />
                </div>

                <div className="space-y-3 mt-4 border border-red-200 p-3 rounded-lg bg-red-50/50">
                  <div className="flex justify-between items-center">
                    <label className="text-xs font-bold text-red-600 uppercase">Other Offers (Negative)</label>
                    <button onClick={() => addArrayItem('comparison.otherOffers', "New Negative Point")} className="text-red-500 hover:text-red-700 flex items-center gap-1"><Plus size={14} /> Add</button>
                  </div>
                  <div className="flex gap-2">
                    <ColorText label="Card Background" colorValue={config.comparison?.leftBg} onColorChange={(v: string) => updateField('comparison.leftBg', v)} />
                    <ColorText label="Text Color" colorValue={config.comparison?.leftText} onColorChange={(v: string) => updateField('comparison.leftText', v)} />
                    <ColorText label="Icon Color" colorValue={config.comparison?.leftIcon} onColorChange={(v: string) => updateField('comparison.leftIcon', v)} />
                  </div>
                  {config.comparison.otherOffers?.map((feat: string, i: number) => (
                    <div key={i} className="flex gap-2 relative group">
                      <input type="text" value={feat} onChange={(e) => updateField(`comparison.otherOffers[${i}]`, e.target.value)} className="w-full bg-white border border-red-100 p-2.5 rounded text-sm outline-none focus:border-red-400" />
                      <button onClick={() => removeArrayItem('comparison.otherOffers', i)} className="absolute right-2 top-2.5 text-red-400 opacity-0 group-hover:opacity-100"><Trash2 size={14} /></button>
                    </div>
                  ))}
                </div>

                <div className="space-y-3 mt-4 border border-green-200 p-3 rounded-lg bg-green-50/50">
                  <div className="flex justify-between items-center">
                    <label className="text-xs font-bold text-green-600 uppercase">Your Offers (Positive)</label>
                    <button onClick={() => addArrayItem('comparison.petocareOffers', "New Positive Point")} className="text-green-600 hover:text-green-700 flex items-center gap-1"><Plus size={14} /> Add</button>
                  </div>
                  <div className="flex gap-2">
                    <ColorText label="Card Background" colorValue={config.comparison?.rightBg} onColorChange={(v: string) => updateField('comparison.rightBg', v)} />
                    <ColorText label="Text Color" colorValue={config.comparison?.rightText} onColorChange={(v: string) => updateField('comparison.rightText', v)} />
                    <ColorText label="Icon Color" colorValue={config.comparison?.rightIcon} onColorChange={(v: string) => updateField('comparison.rightIcon', v)} />
                  </div>
                  {config.comparison.petocareOffers?.map((feat: string, i: number) => (
                    <div key={i} className="flex gap-2 relative group">
                      <input type="text" value={feat} onChange={(e) => updateField(`comparison.petocareOffers[${i}]`, e.target.value)} className="w-full bg-white border border-green-100 p-2.5 rounded text-sm outline-none focus:border-green-500" />
                      <button onClick={() => removeArrayItem('comparison.petocareOffers', i)} className="absolute right-2 top-2.5 text-red-400 opacity-0 group-hover:opacity-100"><Trash2 size={14} /></button>
                    </div>
                  ))}
                </div>
              </Section>
            )}

           {/* REVIEWS SECTION */}
            {config.reviews?.columns && (
              <Section title="Reviews">
                <ColorText 
                  label="Section Background" 
                  colorValue={config.reviews?.bg} 
                  onColorChange={(v: string) => updateField('reviews.bg', v)} 
                />
                <ColorText 
                  label="Heading" 
                  textValue={config.reviews?.heading} 
                  colorValue={config.reviews?.headingColor} 
                  onTextChange={(v: string) => updateField('reviews.heading', v)} 
                  onColorChange={(v: string) => updateField('reviews.headingColor', v)} 
                />
                <ColorText 
                  label="Description" 
                  textValue={config.reviews?.description} 
                  colorValue={config.reviews?.descColor} 
                  onTextChange={(v: string) => updateField('reviews.description', v)} 
                  onColorChange={(v: string) => updateField('reviews.descColor', v)} 
                  isTextArea 
                />
                
                {['col1', 'col2', 'col3'].map((col) => (
                  <div key={col} className="mt-6 space-y-3">
                    <label className="text-xs font-bold text-gray-500 uppercase flex justify-between items-center border-b border-gray-100 pb-2">
                      {col.toUpperCase()} Cards
                      <button 
                        onClick={() => addArrayItem(`reviews.columns.${col}`, { type: 'review', name: 'New Client', role: 'Pet Parent', text: 'Great grooming experience!', avatar: '', bg: '#faf3ec', textColor: '#625b5b', titleColor: '#1e0c05', starColor: '#8c863a' })} 
                        className="text-blue-600 hover:text-blue-700 flex items-center gap-1 font-semibold"
                      >
                        <Plus size={14} /> Add Card
                      </button>
                    </label>

                    {config.reviews.columns[col]?.map((item: any, i: number) => (
                      <div key={i} className="border border-gray-200 p-4 rounded-lg bg-gray-50 space-y-3 relative group">
                        <button 
                          onClick={() => removeArrayItem(`reviews.columns.${col}`, i)} 
                          className="p-1.5 text-red-400 hover:text-red-600 absolute right-2 top-2 bg-white border border-gray-200 rounded-full opacity-0 group-hover:opacity-100 transition-opacity z-10"
                          title="Delete Card"
                        >
                          <Trash2 size={13} />
                        </button>

                        <div className="flex justify-between items-center bg-white p-2 rounded border border-gray-200">
                          <label className="text-xs font-medium text-gray-500">Card Type</label>
                          <select 
                            value={item.type || 'review'} 
                            onChange={(e) => updateField(`reviews.columns.${col}[${i}].type`, e.target.value)} 
                            className="bg-transparent text-xs font-semibold outline-none cursor-pointer"
                          >
                            <option value="review">Review Card</option>
                            <option value="stat-numeric">Numeric Stat</option>
                            <option value="stat-image">Image Stat</option>
                          </select>
                        </div>

                        <ColorText 
                          label="Card Background" 
                          colorValue={item.bg} 
                          onColorChange={(v: string) => updateField(`reviews.columns.${col}[${i}].bg`, v)} 
                        />

                        {/* 1. REVIEW CARD CONTROLS */}
                        {item.type === 'review' && (
                          <>
                            <ColorText 
                              label="Client Name & Color" 
                              textValue={item.name} 
                              colorValue={item.titleColor} 
                              onTextChange={(v: string) => updateField(`reviews.columns.${col}[${i}].name`, v)} 
                              onColorChange={(v: string) => updateField(`reviews.columns.${col}[${i}].titleColor`, v)} 
                            />
                            <Input 
                              label="Role / Subtitle" 
                              value={item.role} 
                              onChange={(v) => updateField(`reviews.columns.${col}[${i}].role`, v)} 
                            />
                            <ColorText 
                              label="Review Text & Color" 
                              textValue={item.text} 
                              colorValue={item.textColor} 
                              onTextChange={(v: string) => updateField(`reviews.columns.${col}[${i}].text`, v)} 
                              onColorChange={(v: string) => updateField(`reviews.columns.${col}[${i}].textColor`, v)} 
                              isTextArea 
                            />
                            <ColorText 
                              label="Star Rating Color" 
                              colorValue={item.starColor} 
                              onColorChange={(v: string) => updateField(`reviews.columns.${col}[${i}].starColor`, v)} 
                            />
                            <ImageUploader 
                              label="Avatar Image" 
                              src={item.avatar} 
                              isUploading={uploadingImage === `reviews.columns.${col}[${i}].avatar`} 
                              onUpload={(e) => handleImageUpload(e, `reviews.columns.${col}[${i}].avatar`)} 
                            />
                          </>
                        )}

                        {/* 2. NUMERIC STAT CARD CONTROLS */}
                        {item.type === 'stat-numeric' && (
                          <>
                            <ColorText 
                              label="Score Value (e.g. 4.96)" 
                              textValue={item.score} 
                              colorValue={item.scoreColor} 
                              onTextChange={(v: string) => updateField(`reviews.columns.${col}[${i}].score`, v)} 
                              onColorChange={(v: string) => updateField(`reviews.columns.${col}[${i}].scoreColor`, v)} 
                            />
                            <Input 
                              label="Scale (e.g. /5)" 
                              value={item.scale} 
                              onChange={(v) => updateField(`reviews.columns.${col}[${i}].scale`, v)} 
                            />
                            <ColorText 
                              label="Subtext & Color" 
                              textValue={item.subtext} 
                              colorValue={item.textColor} 
                              onTextChange={(v: string) => updateField(`reviews.columns.${col}[${i}].subtext`, v)} 
                              onColorChange={(v: string) => updateField(`reviews.columns.${col}[${i}].textColor`, v)} 
                            />
                            <ColorText 
                              label="Star Rating Color" 
                              colorValue={item.starColor} 
                              onColorChange={(v: string) => updateField(`reviews.columns.${col}[${i}].starColor`, v)} 
                            />
                          </>
                        )}

                        {/* 3. IMAGE STAT CARD CONTROLS */}
                        {item.type === 'stat-image' && (
                          <>
                            <ColorText 
                              label="Heading & Color" 
                              textValue={item.heading} 
                              colorValue={item.textColor} 
                              onTextChange={(v: string) => updateField(`reviews.columns.${col}[${i}].heading`, v)} 
                              onColorChange={(v: string) => updateField(`reviews.columns.${col}[${i}].textColor`, v)} 
                            />
                            <Input 
                              label="Subtext" 
                              value={item.subtext} 
                              onChange={(v) => updateField(`reviews.columns.${col}[${i}].subtext`, v)} 
                            />
                            <ColorText 
                              label="Smile Icon Color" 
                              colorValue={item.iconColor} 
                              onColorChange={(v: string) => updateField(`reviews.columns.${col}[${i}].iconColor`, v)} 
                            />
                            <ImageUploader 
                              label="Background Image" 
                              src={item.image} 
                              isUploading={uploadingImage === `reviews.columns.${col}[${i}].image`} 
                              onUpload={(e) => handleImageUpload(e, `reviews.columns.${col}[${i}].image`)} 
                            />
                          </>
                        )}
                      </div>
                    ))}
                  </div>
                ))}
              </Section>
            )}

            {/* INSIGHTS */}
            {config.insights?.items && (
              <Section title="Insights / Blog">
                <ColorText label="Background Color" colorValue={config.insights?.bg} onColorChange={(v: string) => updateField('insights.bg', v)} />
                <ColorText label="Heading" textValue={config.insights?.heading} colorValue={config.insights?.headingColor} onTextChange={(v: string) => updateField('insights.heading', v)} onColorChange={(v: string) => updateField('insights.headingColor', v)} />
                <ColorText label="Description" textValue={config.insights?.description} colorValue={config.insights?.descColor} onTextChange={(v: string) => updateField('insights.description', v)} onColorChange={(v: string) => updateField('insights.descColor', v)} isTextArea />

                <div className="grid grid-cols-2 gap-2 mt-4">
                  <ColorText label="Card Bg" colorValue={config.insights?.cardBg} onColorChange={(v: string) => updateField('insights.cardBg', v)} />
                  <ColorText label="Card Title Text" colorValue={config.insights?.cardTitle} onColorChange={(v: string) => updateField('insights.cardTitle', v)} />
                  <ColorText label="Date Badge Bg" colorValue={config.insights?.cardDateBg} onColorChange={(v: string) => updateField('insights.cardDateBg', v)} />
                  <ColorText label="Date Text" colorValue={config.insights?.cardDateText} onColorChange={(v: string) => updateField('insights.cardDateText', v)} />
                </div>

                <div className="mt-4 space-y-3">
                  <label className="text-xs font-bold text-gray-500 flex justify-between items-center">
                    Articles
                    <button onClick={() => addArrayItem('insights.items', { title: "New Article", date: "Jan 1, 2026", image: "" })} className="text-blue-600 hover:text-blue-700 flex items-center gap-1">
                      <Plus size={14} /> Add Article
                    </button>
                  </label>
                  {config.insights.items.map((item: any, i: number) => (
                    <div key={i} className="border border-gray-200 p-4 rounded-lg bg-gray-50 space-y-3 relative group">
                      <button onClick={() => removeArrayItem('insights.items', i)} className="p-2 text-red-400 hover:text-red-600 absolute -right-3 -top-3 bg-white border border-gray-200 rounded-full opacity-0 group-hover:opacity-100 transition-opacity z-10"><Trash2 size={12} /></button>
                      <Input label="Title" value={item.title} onChange={(v) => updateField(`insights.items[${i}].title`, v)} />
                      <Input label="Date" value={item.date} onChange={(v) => updateField(`insights.items[${i}].date`, v)} />
                      <ImageUploader label="Article Image" src={item.image} isUploading={uploadingImage === `insights.items[${i}].image`} onUpload={(e) => handleImageUpload(e, `insights.items[${i}].image`)} />
                    </div>
                  ))}
                </div>
              </Section>
            )}

            {/* BOTTOM CTA */}
            <Section title="Bottom CTA">
              <ColorText label="Background Color" colorValue={config.ctaSection?.bg} onColorChange={(v: string) => updateField('ctaSection.bg', v)} />
              <ColorText label="Heading" textValue={config.ctaSection?.heading} colorValue={config.ctaSection?.headingColor} onTextChange={(v: string) => updateField('ctaSection.heading', v)} onColorChange={(v: string) => updateField('ctaSection.headingColor', v)} />
              <ColorText label="Description" textValue={config.ctaSection?.description} colorValue={config.ctaSection?.descColor} onTextChange={(v: string) => updateField('ctaSection.description', v)} onColorChange={(v: string) => updateField('ctaSection.descColor', v)} isTextArea />

              <ImageUploader label="Background Image" src={config.ctaSection?.image} isUploading={uploadingImage === 'ctaSection.image'} onUpload={(e) => handleImageUpload(e, 'ctaSection.image')} />
              <ButtonConfig label="CTA Button" textVal={config.ctaSection?.cta?.label} hrefVal={config.ctaSection?.cta?.href} bgCol={config.ctaSection?.cta?.bg} textCol={config.ctaSection?.cta?.text} onText={(v: string) => updateField('ctaSection.cta.label', v)} onHref={(v: string) => updateField('ctaSection.cta.href', v)} onBg={(v: string) => updateField('ctaSection.cta.bg', v)} onCol={(v: string) => updateField('ctaSection.cta.text', v)} />
            </Section>

            {/* FOOTER */}
            <Section title="Footer">
              <ColorText label="Background Color" colorValue={config.footer?.bg} onColorChange={(v: string) => updateField('footer.bg', v)} />
              <div className="grid grid-cols-2 gap-2 mt-2">
                <ColorText label="Main Text Color" colorValue={config.footer?.textColor} onColorChange={(v: string) => updateField('footer.textColor', v)} />
                <ColorText label="Muted Text Color" colorValue={config.footer?.mutedColor} onColorChange={(v: string) => updateField('footer.mutedColor', v)} />
                <ColorText label="Icon Bg Color" colorValue={config.footer?.iconBg} onColorChange={(v: string) => updateField('footer.iconBg', v)} />
                <ColorText label="Icon Text Color" colorValue={config.footer?.iconText} onColorChange={(v: string) => updateField('footer.iconText', v)} />
              </div>

              <ImageUploader label="Footer Logo" src={config.footer?.logo?.src} isUploading={uploadingImage === 'footer.logo.src'} onUpload={(e) => handleImageUpload(e, 'footer.logo.src')} />

              <Input label="Address" value={config.footer?.info?.address} onChange={(v) => updateField('footer.info.address', v)} isTextArea />
              <div className="grid grid-cols-2 gap-2 mt-2">
                <Input label="Phone Label" value={config.footer?.info?.phone?.label} onChange={(v) => updateField('footer.info.phone.label', v)} />
                <Input label="Phone Link (tel:)" value={config.footer?.info?.phone?.href} onChange={(v) => updateField('footer.info.phone.href', v)} />
                <Input label="Email Label" value={config.footer?.info?.email?.label} onChange={(v) => updateField('footer.info.email.label', v)} />
                <Input label="Email Link (mailto:)" value={config.footer?.info?.email?.href} onChange={(v) => updateField('footer.info.email.href', v)} />
              </div>
              <Input label="Copyright Text" value={config.footer?.copyright} onChange={(v) => updateField('footer.copyright', v)} />
              <div className="grid grid-cols-2 gap-2 mt-2">
                <Input label="Facebook URL" value={config.footer?.socials?.facebook} onChange={(v) => updateField('footer.socials.facebook', v)} />
                <Input label="Instagram URL" value={config.footer?.socials?.instagram} onChange={(v) => updateField('footer.socials.instagram', v)} />
              </div>
            </Section>

          </div>
        )}
      </div>

      {/* 2. DRAG BAR */}
      <div
        onMouseDown={() => setIsDragging(true)}
        className={`w-[4px] cursor-col-resize z-30 transition-colors ${isDragging ? 'bg-blue-500' : 'bg-gray-100 hover:bg-gray-300'}`}
      />

      {/* 3. LIVE PREVIEW */}
      <div className="flex-1 h-full bg-[#f3f3f3] overflow-y-auto relative">
        <div id="live-preview-box" className="w-full pointer-events-auto bg-white min-h-screen border-l border-gray-200">
          <WebsiteOne data={config} />
        </div>
      </div>

    </div>
  );
}