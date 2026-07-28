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

// 🔥 FIXED COLOR INPUT UI
const ColorInput = ({ label, value, onChange }: { label: string, value: string, onChange: (val: string) => void }) => (
  <div className="flex justify-between items-center py-2 border-b border-gray-100 last:border-0">
    <label className="text-xs font-medium text-gray-600">{label}</label>
    <div className="flex gap-2 items-center w-36 border border-gray-200 rounded-md p-1 bg-white shadow-sm">
      <div className="relative w-6 h-6 rounded overflow-hidden border border-gray-200 shrink-0">
        <input type="color" value={value || "#000000"} onChange={(e) => onChange(e.target.value)} className="absolute -top-2 -left-2 w-10 h-10 cursor-pointer" />
      </div>
      <input type="text" value={value || ""} onChange={(e) => onChange(e.target.value)} className="flex-1 outline-none text-xs bg-transparent uppercase font-mono" />
    </div>
  </div>
);

const ImageUploader = ({ label, src, isUploading, onUpload }: { label: string, src: string, isUploading: boolean, onUpload: (e: React.ChangeEvent<HTMLInputElement>) => void }) => (
  <div className="border border-gray-200 p-3 rounded-lg bg-gray-50/50 w-full">
    <label className="text-xs font-medium text-gray-500 mb-2 block">{label}</label>
    {src && <img src={src} className="w-full h-24 object-contain rounded mb-3 border border-gray-200 bg-white shadow-sm" />}
    <label className="flex items-center justify-center gap-2 w-full p-2 bg-white border border-gray-200 rounded cursor-pointer hover:bg-gray-50 text-xs font-medium text-gray-700 transition-colors">
      {isUploading ? <Loader2 size={14} className="animate-spin" /> : <Upload size={14} />}
      {isUploading ? "Optimizing & Uploading..." : "Upload Image"}
      <input type="file" accept="image/*" className="hidden" onChange={onUpload} disabled={isUploading} />
    </label>
  </div>
);

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
            <div className="flex gap-2">
              <button onClick={handleSave} className="p-2 bg-black text-white rounded hover:bg-gray-800 transition-colors" title="Save">{saving ? <Loader2 size={16} className="animate-spin" /> : <Save size={16} />}</button>
              <button onClick={handleDownload} className="p-2 bg-white border border-gray-200 text-black rounded hover:bg-gray-50 transition-colors" title="Download ZIP">{downloading ? <Loader2 size={16} className="animate-spin" /> : <Download size={16} />}</button>
            </div>
          </div>
        </div>

        {activeTab === "json" && (
          <div className="flex-1 p-4 bg-gray-50">
            <textarea value={jsonInput} onChange={(e) => { setJsonInput(e.target.value); updateFromJson(e.target.value); }} className="w-full h-full bg-white border border-gray-200 rounded-lg p-4 font-mono text-sm resize-none outline-none focus:border-black focus:ring-1 focus:ring-black" />
          </div>
        )}

        {activeTab === "visual" && (
          <div className="flex-1 overflow-y-auto px-6 pb-20 scrollbar-hide bg-white">

            <Section title="Theme Colors">
              <div className="space-y-1 bg-gray-50 p-3 rounded-lg border border-gray-100">
                <ColorInput label="Primary (Buttons)" value={config.theme?.primary} onChange={(v) => updateField('theme.primary', v)} />
                <ColorInput label="Primary Hover" value={config.theme?.primaryHover} onChange={(v) => updateField('theme.primaryHover', v)} />
                <ColorInput label="Accent (Icons/Stars)" value={config.theme?.accent} onChange={(v) => updateField('theme.accent', v)} />
                <ColorInput label="Main Text" value={config.theme?.text} onChange={(v) => updateField('theme.text', v)} />
                <ColorInput label="Muted Text" value={config.theme?.textMuted} onChange={(v) => updateField('theme.textMuted', v)} />
                <ColorInput label="Main Background" value={config.theme?.bg} onChange={(v) => updateField('theme.bg', v)} />
                <ColorInput label="Alt Background" value={config.theme?.bgAlt} onChange={(v) => updateField('theme.bgAlt', v)} />
                <ColorInput label="Borders" value={config.theme?.border} onChange={(v) => updateField('theme.border', v)} />
              </div>
            </Section>

            <Section title="Navigation Bar">
              <ImageUploader label="Logo Image" src={config.navbar?.logo?.src} isUploading={uploadingImage === 'navbar.logo.src'} onUpload={(e) => handleImageUpload(e, 'navbar.logo.src')} />
              <Input label="Logo Alt Text" value={config.navbar?.logo?.alt} onChange={(v) => updateField('navbar.logo.alt', v)} />
              <Input label="Button Label" value={config.navbar?.cta?.label} onChange={(v) => updateField('navbar.cta.label', v)} />
              <Input label="Button Link" value={config.navbar?.cta?.href} onChange={(v) => updateField('navbar.cta.href', v)} />
            </Section>

            <Section title="Hero Section">
              <Input label="Heading" value={config.hero?.heading} onChange={(v) => updateField('hero.heading', v)} />
              <Input label="Description" value={config.hero?.description} onChange={(v) => updateField('hero.description', v)} isTextArea />
              <ImageUploader label="Background Image" src={config.hero?.image} isUploading={uploadingImage === 'hero.image'} onUpload={(e) => handleImageUpload(e, 'hero.image')} />
              <Input label="Button Label" value={config.hero?.cta?.label} onChange={(v) => updateField('hero.cta.label', v)} />
              <Input label="Button Link" value={config.hero?.cta?.href} onChange={(v) => updateField('hero.cta.href', v)} />
              <div className="grid grid-cols-2 gap-2 mt-2">
                <Input label="Star Rating (1-5)" value={config.hero?.socialProof?.stars} onChange={(v) => updateField('hero.socialProof.stars', v)} />
                <Input label="Social Proof Text" value={config.hero?.socialProof?.text} onChange={(v) => updateField('hero.socialProof.text', v)} />
              </div>
            </Section>

            <Section title="Stats Banner">
              <Input label="Heading" value={config.statsBanner?.heading} onChange={(v) => updateField('statsBanner.heading', v)} />
              <div className="grid grid-cols-2 gap-2">
                <Input label="Score (e.g. 4.96)" value={config.statsBanner?.rating?.score} onChange={(v) => updateField('statsBanner.rating.score', v)} />
                <Input label="Scale (e.g. /5)" value={config.statsBanner?.rating?.max} onChange={(v) => updateField('statsBanner.rating.max', v)} />
                <Input label="Stars Count" value={config.statsBanner?.rating?.stars} onChange={(v) => updateField('statsBanner.rating.stars', v)} />
                <Input label="Review Label" value={config.statsBanner?.rating?.label} onChange={(v) => updateField('statsBanner.rating.label', v)} />
              </div>
              <Input label="Experience Title" value={config.statsBanner?.experience?.title} onChange={(v) => updateField('statsBanner.experience.title', v)} />
              <Input label="Experience Subtitle" value={config.statsBanner?.experience?.subtitle} onChange={(v) => updateField('statsBanner.experience.subtitle', v)} />
            </Section>

            <Section title="About Us">
              <Input label="Heading" value={config.about?.heading} onChange={(v) => updateField('about.heading', v)} />
              <Input label="Description" value={config.about?.description} onChange={(v) => updateField('about.description', v)} isTextArea />
              <ImageUploader label="About Image" src={config.about?.image} isUploading={uploadingImage === 'about.image'} onUpload={(e) => handleImageUpload(e, 'about.image')} />
              <Input label="Button Label" value={config.about?.cta?.label} onChange={(v) => updateField('about.cta.label', v)} />
              <Input label="Button Link" value={config.about?.cta?.href} onChange={(v) => updateField('about.cta.href', v)} />
            </Section>

            {config.gallery?.items && (
              <Section title="Gallery">
                <Input label="Heading" value={config.gallery?.heading} onChange={(v) => updateField('gallery.heading', v)} />
                <Input label="Description" value={config.gallery?.description} onChange={(v) => updateField('gallery.description', v)} isTextArea />
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

            {config.services?.items && (
              <Section title="Services">
                <Input label="Heading" value={config.services?.heading} onChange={(v) => updateField('services.heading', v)} />
                <Input label="Description" value={config.services?.description} onChange={(v) => updateField('services.description', v)} isTextArea />
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
                <Input label="Button Label" value={config.services?.cta?.label} onChange={(v) => updateField('services.cta.label', v)} />
                <Input label="Button Link" value={config.services?.cta?.href} onChange={(v) => updateField('services.cta.href', v)} />
              </Section>
            )}

            {config.process?.steps && (
              <Section title="Process Steps">
                <Input label="Heading" value={config.process?.heading} onChange={(v) => updateField('process.heading', v)} />
                <Input label="Description" value={config.process?.description} onChange={(v) => updateField('process.description', v)} isTextArea />
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
                      <Input label="Step Title" value={item.title} onChange={(v) => updateField(`process.steps[${i}].title`, v)} />
                      <Input label="Description" value={item.description} onChange={(v) => updateField(`process.steps[${i}].description`, v)} isTextArea />
                      <ImageUploader label="Step Image" src={item.image} isUploading={uploadingImage === `process.steps[${i}].image`} onUpload={(e) => handleImageUpload(e, `process.steps[${i}].image`)} />
                    </div>
                  ))}
                </div>
              </Section>
            )}

            {config.comparison && (
              <Section title="Comparison Board">
                <Input label="Heading" value={config.comparison?.heading} onChange={(v) => updateField('comparison.heading', v)} />
                <Input label="Description" value={config.comparison?.description} onChange={(v) => updateField('comparison.description', v)} isTextArea />

                <div className="space-y-2 mt-4">
                  <label className="text-xs font-medium text-red-500 flex justify-between items-center">
                    Other Offers (Negative)
                    <button onClick={() => addArrayItem('comparison.otherOffers', "New Negative Point")} className="text-red-500 hover:text-red-700"><Plus size={14} /></button>
                  </label>
                  {config.comparison.otherOffers?.map((feat: string, i: number) => (
                    <div key={i} className="flex gap-2 relative group">
                      <input type="text" value={feat} onChange={(e) => updateField(`comparison.otherOffers[${i}]`, e.target.value)} className="w-full bg-red-50 border border-red-100 p-2 rounded text-sm outline-none focus:border-red-400" />
                      <button onClick={() => removeArrayItem('comparison.otherOffers', i)} className="absolute right-2 top-2 text-red-400 opacity-0 group-hover:opacity-100"><Trash2 size={14} /></button>
                    </div>
                  ))}
                </div>

                <div className="space-y-2 mt-4">
                  <label className="text-xs font-medium text-green-600 flex justify-between items-center">
                    Your Offers (Positive)
                    <button onClick={() => addArrayItem('comparison.petocareOffers', "New Positive Point")} className="text-green-600 hover:text-green-700"><Plus size={14} /></button>
                  </label>
                  {config.comparison.petocareOffers?.map((feat: string, i: number) => (
                    <div key={i} className="flex gap-2 relative group">
                      <input type="text" value={feat} onChange={(e) => updateField(`comparison.petocareOffers[${i}]`, e.target.value)} className="w-full bg-green-50 border border-green-100 p-2 rounded text-sm outline-none focus:border-green-500" />
                      <button onClick={() => removeArrayItem('comparison.petocareOffers', i)} className="absolute right-2 top-2 text-red-400 opacity-0 group-hover:opacity-100"><Trash2 size={14} /></button>
                    </div>
                  ))}
                </div>
              </Section>
            )}

            {config.reviews?.columns && (
              <Section title="Reviews">
                <Input label="Heading" value={config.reviews?.heading} onChange={(v) => updateField('reviews.heading', v)} />
                <Input label="Description" value={config.reviews?.description} onChange={(v) => updateField('reviews.description', v)} isTextArea />
                {['col1', 'col2', 'col3'].map((col) => (
                  <div key={col} className="mt-4 space-y-3">
                    <label className="text-xs font-bold text-gray-500 uppercase flex justify-between items-center">
                      {col} Cards
                      <button onClick={() => addArrayItem(`reviews.columns.${col}`, { type: 'review', name: 'New User', role: 'Client', text: 'Great!' })} className="text-blue-600 hover:text-blue-700 flex items-center gap-1">
                        <Plus size={14} /> Add Card
                      </button>
                    </label>
                    {config.reviews.columns[col]?.map((item: any, i: number) => (
                      <div key={i} className="border border-gray-200 p-4 rounded-lg bg-gray-50 space-y-3 relative group">
                        <button onClick={() => removeArrayItem(`reviews.columns.${col}`, i)} className="p-2 text-red-400 hover:text-red-600 absolute -right-3 -top-3 bg-white border border-gray-200 rounded-full opacity-0 group-hover:opacity-100 transition-opacity z-10"><Trash2 size={12} /></button>

                        <label className="text-xs font-medium text-gray-500">Card Type</label>
                        <select value={item.type} onChange={(e) => updateField(`reviews.columns.${col}[${i}].type`, e.target.value)} className="w-full bg-white border border-gray-200 p-2 rounded text-xs outline-none focus:border-black">
                          <option value="review">Review Card</option>
                          <option value="stat-numeric">Numeric Stat</option>
                          <option value="stat-image">Image Stat</option>
                        </select>

                        {item.type === 'review' && (
                          <>
                            <Input label="Client Name" value={item.name} onChange={(v) => updateField(`reviews.columns.${col}[${i}].name`, v)} />
                            <Input label="Role" value={item.role} onChange={(v) => updateField(`reviews.columns.${col}[${i}].role`, v)} />
                            <Input label="Review Text" value={item.text} onChange={(v) => updateField(`reviews.columns.${col}[${i}].text`, v)} isTextArea />
                            <ImageUploader label="Avatar" src={item.avatar} isUploading={uploadingImage === `reviews.columns.${col}[${i}].avatar`} onUpload={(e) => handleImageUpload(e, `reviews.columns.${col}[${i}].avatar`)} />
                          </>
                        )}
                        {item.type === 'stat-numeric' && (
                          <>
                            <Input label="Score" value={item.score} onChange={(v) => updateField(`reviews.columns.${col}[${i}].score`, v)} />
                            <Input label="Scale" value={item.scale} onChange={(v) => updateField(`reviews.columns.${col}[${i}].scale`, v)} />
                            <Input label="Subtext" value={item.subtext} onChange={(v) => updateField(`reviews.columns.${col}[${i}].subtext`, v)} />
                          </>
                        )}
                        {item.type === 'stat-image' && (
                          <>
                            <Input label="Heading" value={item.heading} onChange={(v) => updateField(`reviews.columns.${col}[${i}].heading`, v)} />
                            <Input label="Subtext" value={item.subtext} onChange={(v) => updateField(`reviews.columns.${col}[${i}].subtext`, v)} />
                            <ImageUploader label="Background Image" src={item.image} isUploading={uploadingImage === `reviews.columns.${col}[${i}].image`} onUpload={(e) => handleImageUpload(e, `reviews.columns.${col}[${i}].image`)} />
                          </>
                        )}
                      </div>
                    ))}
                  </div>
                ))}
              </Section>
            )}

            {config.insights?.items && (
              <Section title="Insights / Blog">
                <Input label="Heading" value={config.insights?.heading} onChange={(v) => updateField('insights.heading', v)} />
                <Input label="Description" value={config.insights?.description} onChange={(v) => updateField('insights.description', v)} isTextArea />
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

            <Section title="Bottom CTA">
              <Input label="Heading" value={config.ctaSection?.heading} onChange={(v) => updateField('ctaSection.heading', v)} />
              <Input label="Description" value={config.ctaSection?.description} onChange={(v) => updateField('ctaSection.description', v)} isTextArea />
              <ImageUploader label="Background Image" src={config.ctaSection?.image} isUploading={uploadingImage === 'ctaSection.image'} onUpload={(e) => handleImageUpload(e, 'ctaSection.image')} />
              <Input label="Button Label" value={config.ctaSection?.cta?.label} onChange={(v) => updateField('ctaSection.cta.label', v)} />
              <Input label="Button Link" value={config.ctaSection?.cta?.href} onChange={(v) => updateField('ctaSection.cta.href', v)} />
            </Section>

            <Section title="Footer">
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