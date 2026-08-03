"use client";

import { useState } from "react";
import Link from "next/link";
import { LayoutTemplate, Code, ExternalLink, Loader2, Globe, Calendar, Server, ShieldCheck, CheckCircle2, Lock, Link as LinkIcon } from "lucide-react";
import merge from "lodash/merge";
import WebsiteOne from "@/components/templates/WebsiteOne";
import { deployWebsiteAction, connectCustomDomainAction } from "@/actions/tenant";

interface DashboardProps {
  name: string;
  dbData: any;
}

const DEPLOY_STEPS = [
  "Initializing edge servers...",
  "Building static assets...",
  "Optimizing images via Cloudinary...",
  "Provisioning subdomain...",
  "Deploying to Vercel Edge Network..."
];

export default function ClientDashboard({ name, dbData }: DashboardProps) {
  const [isDeployed, setIsDeployed] = useState(dbData?.isDeployed || false);
  const [isDeploying, setIsDeploying] = useState(false);
  const [deployStep, setDeployStep] = useState(0);
  
  const [showDnsModal, setShowDnsModal] = useState(false);
  const [customDomainInput, setCustomDomainInput] = useState("");
  const [dnsRecords, setDnsRecords] = useState<any>(null);
  const [isConnecting, setIsConnecting] = useState(false);

  // Read the active custom domain from Firebase, otherwise fallback to subdomain
  const activeDomain = dbData?.customDomain || `${name}.nexpetcare.online`;
  const activeData = merge({}, dbData?.websiteOneData || {});

  const handleDeploy = async () => {
    setIsDeploying(true);
    setDeployStep(0);

    for (let i = 0; i < DEPLOY_STEPS.length; i++) {
      setDeployStep(i);
      await new Promise(res => setTimeout(res, 800)); 
    }

    const res = await deployWebsiteAction(name);
    
    if (res.success) {
      setIsDeployed(true);
    } else {
      alert("Deployment failed. Have you added your Vercel API keys?");
    }
    
    setIsDeploying(false);
  };

  const handleConnectDomain = async () => {
    if (!customDomainInput) return;
    setIsConnecting(true);
    
    // Call the new action to register in Vercel AND save to Firebase
    const res = await connectCustomDomainAction(name, customDomainInput.toLowerCase());
    
    if (res.success) {
      setDnsRecords(res.dnsRecords);
      // Reload the page slightly later to refresh the dbData
      setTimeout(() => window.location.reload(), 2000);
    } else {
      alert(`Error connecting domain: ${res.error}`);
    }
    setIsConnecting(false);
  };

  return (
    <div className="min-h-screen bg-[#f8f9fa] text-black p-6 md:p-10 font-sans flex flex-col items-center">

      <div className="w-full max-w-7xl mx-auto flex flex-col md:flex-row md:items-center justify-between gap-6 bg-white p-6 rounded-2xl shadow-sm border border-gray-200">
        <div>
          <h1 className="text-2xl font-bold tracking-tight capitalize text-gray-900">
            {dbData?.clientName || name}
          </h1>
          <div className="flex items-center gap-2 mt-1">
            <span className={`w-2 h-2 rounded-full ${isDeployed ? "bg-green-500 animate-pulse" : "bg-gray-300"}`}></span>
            <p className="text-sm text-gray-500 font-medium">
              {isDeployed ? "Live on Global Edge Network" : "Draft Mode - Not Deployed"}
            </p>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <Link href={`/${name}/edit?tab=visual`} className="flex items-center gap-2 px-4 py-2 text-sm font-medium bg-white border border-gray-300 rounded-lg hover:bg-gray-50 hover:text-blue-600 transition-colors shadow-sm">
            <LayoutTemplate size={16} /> Edit Visual
          </Link>
          <Link href={`/${name}/edit?tab=json`} className="flex items-center gap-2 px-4 py-2 text-sm font-medium bg-white border border-gray-300 rounded-lg hover:bg-gray-50 text-gray-700 transition-colors shadow-sm">
            <Code size={16} /> Edit JSON
          </Link>

          {isDeployed && (
            <Link href={`https://${activeDomain}`} target="_blank" className="flex items-center gap-2 px-4 py-2 text-sm font-medium bg-blue-50 border border-blue-200 text-blue-700 rounded-lg hover:bg-blue-100 transition-colors shadow-sm">
              <ExternalLink size={16} /> Visit Live Site
            </Link>
          )}
        </div>
      </div>

      {!isDeployed ? (
        <div className="w-full max-w-3xl mx-auto mt-12 bg-white p-12 rounded-2xl shadow-sm border border-gray-200 text-center flex flex-col items-center">
          <div className="w-20 h-20 bg-blue-50 rounded-full flex items-center justify-center mb-6">
            <Server className="w-10 h-10 text-blue-600" />
          </div>
          <h2 className="text-2xl font-bold mb-2">Deploy Your Site to Preview</h2>
          <p className="text-gray-500 mb-8 max-w-md">
            Your website is currently in draft mode. Deploy it to our global edge network to generate your subdomain and view the live preview.
          </p>

          <button 
            onClick={handleDeploy} 
            disabled={isDeploying}
            className="flex items-center gap-2 px-8 py-3.5 text-base font-semibold bg-black text-white rounded-xl hover:bg-gray-800 transition-all shadow-md disabled:opacity-80 disabled:cursor-not-allowed"
          >
            {isDeploying ? <Loader2 size={18} className="animate-spin" /> : <Globe size={18} />}
            {isDeploying ? "Deploying..." : "Deploy Website"}
          </button>

          {isDeploying && (
            <div className="mt-6 flex flex-col items-center">
              <p className="text-sm font-medium text-blue-600 animate-pulse">
                {DEPLOY_STEPS[deployStep]}
              </p>
              <div className="w-64 h-1.5 bg-gray-100 rounded-full mt-3 overflow-hidden">
                <div 
                  className="h-full bg-blue-600 transition-all duration-300"
                  style={{ width: `${((deployStep + 1) / DEPLOY_STEPS.length) * 100}%` }}
                />
              </div>
            </div>
          )}
        </div>
      ) : (
        <>
          <div className="w-full max-w-7xl mx-auto mt-8 bg-gradient-to-r from-blue-900 to-slate-900 rounded-2xl p-8 text-white flex flex-col md:flex-row items-center justify-between shadow-lg">
            <div className="flex-1 pr-8">
              <div className="flex items-center gap-2 text-blue-300 mb-2">
                <ShieldCheck size={18} />
                <span className="text-sm font-bold uppercase tracking-wider">Vercel Domain Network</span>
              </div>
              <h3 className="text-2xl font-bold mb-2">
                {dbData?.customDomain ? "Custom Domain Connected" : "Connect Your Own Domain (Free)"}
              </h3>
              
              {dbData?.customDomain ? (
                <p className="text-blue-100/80 mb-6 text-sm max-w-2xl">
                  Your site is officially live at <span className="font-mono bg-green-500/20 text-green-300 px-1.5 py-0.5 rounded border border-green-500/30">{activeDomain}</span>. SSL certificates and Edge CDN routing are fully operational.
                </p>
              ) : (
                <p className="text-blue-100/80 mb-6 text-sm max-w-2xl">
                  Your site is currently live at <span className="font-mono bg-black/30 px-1.5 py-0.5 rounded text-white">{activeDomain}</span>. Want to use a custom domain like <span className="font-mono bg-black/30 px-1.5 py-0.5 rounded text-white">www.yourpetsalon.com</span>? Connect it instantly via our secure network.
                </p>
              )}
              
              <div className="flex flex-wrap gap-4">
                <button 
                  onClick={() => setShowDnsModal(!showDnsModal)}
                  className="bg-white text-black px-6 py-2.5 rounded-lg font-semibold text-sm hover:bg-gray-100 transition-colors flex items-center gap-2"
                >
                  <LinkIcon size={16} />
                  {dbData?.customDomain ? "Manage DNS Records" : "Setup DNS Records"}
                </button>
              </div>
            </div>
          </div>

          {showDnsModal && (
            <div className="w-full max-w-7xl mx-auto mt-4 bg-white border border-gray-200 rounded-2xl p-6 shadow-sm animate-in fade-in slide-in-from-top-4">
              <h4 className="font-bold text-lg mb-4">Domain Configuration</h4>
              <div className="flex items-center gap-3 mb-6">
                <input 
                  type="text" 
                  placeholder="Enter your domain (e.g. yoursite.com)"
                  value={customDomainInput}
                  onChange={e => setCustomDomainInput(e.target.value)}
                  className="w-full max-w-md border border-gray-300 px-4 py-2 rounded-lg text-sm outline-none focus:border-blue-500"
                />
                <button 
                  onClick={handleConnectDomain} 
                  disabled={isConnecting || !customDomainInput}
                  className="bg-black text-white px-4 py-2 rounded-lg text-sm font-medium disabled:opacity-70 flex items-center gap-2"
                >
                  {isConnecting ? <Loader2 size={16} className="animate-spin" /> : null}
                  Generate DNS
                </button>
              </div>

              {dnsRecords && (
                <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
                  <p className="text-sm text-gray-600 mb-3">Add these records to your domain registrar (GoDaddy, Namecheap, Route53, etc.)</p>
                  <div className="flex flex-col gap-2">
                    {dnsRecords.map((record: any, idx: number) => (
                      <div key={idx} className="grid grid-cols-4 gap-4 bg-white p-3 rounded border border-gray-200 text-sm font-mono text-gray-700">
                        <div><span className="text-xs text-gray-400 block mb-1">Type</span>{record.type}</div>
                        <div><span className="text-xs text-gray-400 block mb-1">Name</span>{record.name}</div>
                        <div className="col-span-2"><span className="text-xs text-gray-400 block mb-1">Target / Value</span>{record.value}</div>
                      </div>
                    ))}
                  </div>
                  <div className="mt-4 flex items-center gap-2 text-sm text-green-600 font-medium">
                    <CheckCircle2 size={16} /> SSL Certificate will be automatically provisioned by Vercel.
                  </div>
                </div>
              )}
            </div>
          )}

          <div className="w-full max-w-7xl mx-auto mt-10 flex flex-col bg-white rounded-2xl shadow-2xl border border-gray-300 overflow-hidden ring-1 ring-black/5">
            <div className="h-14 bg-gray-100/80 border-b border-gray-200 flex items-center px-4 justify-between select-none">
              <div className="flex gap-2 w-20">
                <div className="w-3 h-3 rounded-full bg-[#ff5f56] border border-[#e0443e]" />
                <div className="w-3 h-3 rounded-full bg-[#ffbd2e] border border-[#dea123]" />
                <div className="w-3 h-3 rounded-full bg-[#27c93f] border border-[#1aab29]" />
              </div>

              <div className="flex-1 flex justify-center">
                <div className="bg-white px-8 py-1.5 text-xs text-gray-500 font-medium rounded-md border border-gray-200 shadow-sm flex items-center gap-2 min-w-[250px] justify-center">
                  <Lock size={12} className={dbData?.customDomain ? "text-green-500" : "text-gray-400"} />
                  {activeDomain}
                </div>
              </div>
              <div className="w-20" />
            </div>

            <div className="relative w-full h-[750px] overflow-y-auto overflow-x-hidden bg-gray-50 custom-scrollbar">
              <div id="live-preview-box" className="w-full bg-white min-h-full flex flex-col relative origin-top">
                <WebsiteOne data={activeData} />
              </div>
            </div>
          </div>
        </>
      )}
      
      <style jsx global>{`
        .custom-scrollbar::-webkit-scrollbar { width: 8px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: #f1f1f1; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: #c1c1c1; border-radius: 4px; }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover { background: #a8a8a8; }
      `}</style>
    </div>
  );
}