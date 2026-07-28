import React from 'react';

import { cn } from '@/lib/utils';

export default function Footer({ data }: { data: any }) {
    if (!data) return null;

    const logo = data.logo || {};
    const info = data.info || {};
    const socials = data.socials || {};

    return (
        <footer className="bg-[var(--bg)] px-6 pt-28 pb-16 font-sans overflow-hidden">
            <div className="max-w-7xl mx-auto flex flex-col gap-16">

                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-10 items-start">

                    {/* Logo */}
                    <div >
                        <div className="flex items-center gap-3">
                            <a href="#" className="group">
                                {logo.src ? (
                                    <img src={logo.src} alt={logo.alt || "Business Logo"} className="h-14 w-auto max-w-full object-contain object-left" />
                                ) : (
                                    <span className="font-bold text-xl text-[var(--primary)]">Logo</span>
                                )}
                            </a>
                        </div>
                    </div>

                    {/* Quick Links */}
                    <div >
                        <nav aria-label="Quick links">
                            <h4 className="text-sm font-normal text-[var(--textMuted)] mb-5 tracking-wide">Quick Links</h4>
                            <ul className="space-y-4">
                                {[{ label: "About", href: "#" }, { label: "Services", href: "#" }, { label: "Contact", href: "#" }].map((link, index) => (
                                    <li key={index}>
                                        <a href={link.href} className="text-base font-medium text-[var(--text)] hover:text-[var(--primary)] transition-colors">
                                            {link.label}
                                        </a>
                                    </li>
                                ))}
                            </ul>
                        </nav>
                    </div>

                    {/* Legal */}
                    <div >
                        <nav aria-label="Legal documents">
                            <h4 className="text-sm font-normal text-[var(--textMuted)] mb-5 tracking-wide">Legal</h4>
                            <ul className="space-y-4">
                                {[{ label: "Terms & Conditions", href: "#" }, { label: "Privacy Policy", href: "#" }].map((link, index) => (
                                    <li key={index}>
                                        <a href={link.href} className="text-base font-medium text-[var(--text)] hover:text-[var(--primary)] transition-colors">
                                            {link.label}
                                        </a>
                                    </li>
                                ))}
                            </ul>
                        </nav>
                    </div>

                    {/* Contact Info */}
                    <div >
                        <div>
                            <h4 className="text-sm font-normal text-[var(--textMuted)] mb-5 tracking-wide">Our Info</h4>
                            <address className="not-italic space-y-4 text-base font-normal text-[var(--text)] leading-relaxed">
                                <p>{info.address}</p>
                                {info.phone?.label && (
                                    <p>
                                        <a href={info.phone.href} className="hover:text-[var(--primary)] transition-colors">
                                            {info.phone.label}
                                        </a>
                                    </p>
                                )}
                                {info.email?.label && (
                                    <p>
                                        <a href={info.email.href} className="hover:text-[var(--primary)] transition-colors">
                                            {info.email.label}
                                        </a>
                                    </p>
                                )}
                            </address>
                        </div>
                    </div>

                </div>

                <div className="pt-8 border-t border-[var(--border)] flex flex-col sm:flex-row items-center justify-between gap-4">
                    <p className="text-sm text-[var(--textMuted)] text-center sm:text-left">
                        {data.copyright}
                    </p>

                    <div className="flex items-center gap-2.5">
                        {socials.facebook && (
                            <a href={socials.facebook} className="w-[26px] h-[26px] bg-[var(--accent)] text-white rounded-full flex items-center justify-center transition-transform hover:scale-105">
                                <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 24 24"><path d="M22 12c0-5.52-4.48-10-10-10S2 6.48 2 12c0 4.84 3.44 8.87 8 9.8V15H8v-3h2V9.5C10 7.57 11.57 6 13.5 6H16v3h-2c-.55 0-1 .45-1 1v2h3v3h-3v6.95c4.56-.93 8-4.96 8-9.8z" /></svg>
                            </a>
                        )}
                        {socials.instagram && (
                            <a href={socials.instagram} className="w-[26px] h-[26px] bg-[var(--accent)] text-white rounded-full flex items-center justify-center transition-transform hover:scale-105">
                                <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z" /></svg>
                            </a>
                        )}
                    </div>
                </div>

            </div >
        </footer >
    );
}