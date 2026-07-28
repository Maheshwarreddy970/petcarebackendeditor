import React from 'react';


export default function CtaSection({ data }: { data: any }) {
    if (!data) return null;

    return (
        <section className="relative w-full overflow-hidden bg-[var(--bgAlt)] px-6 py-20 md:px-12 md:py-32 lg:px-20 border-y border-[var(--border)]">
            {/* Background Image Container */}
            <div className="absolute inset-0 z-0">
                {data.image && (
                    <img className="h-full w-full object-cover object-right md:object-center opacity-60 mix-blend-multiply" src={data.image} alt="CTA Background" />
                )}
                {/* CSS Variable-powered gradient mask */}
                <div
                    className="absolute inset-0 pointer-events-none"
                    style={{
                        background: `linear-gradient(243deg, transparent 20%, var(--bgAlt) 50%, var(--bgAlt) 80%)`
                    }}
                />
            </div>

            <div className="relative z-10 mx-auto max-w-[1272px]">
                <div className="flex max-w-[540px] flex-col items-start gap-8 md:gap-10">
                    <div className="flex flex-col gap-4">
                        <h2 className="text-balance font-sans text-3xl font-medium tracking-[-1.5px] leading-[1.15] text-[var(--text)] sm:text-4xl md:text-5xl">
                            {data.heading}
                        </h2>
                        <p className="text-pretty font-sans text-base leading-relaxed text-[var(--textMuted)] sm:text-lg">
                            {data.description}
                        </p>
                    </div>

                    <div >
                        <a href={data.cta?.href || "#"} className="group relative flex items-center justify-center gap-3.5 overflow-hidden rounded-2xl bg-[var(--primary)] px-[22px] py-3.5 text-base font-medium text-white transition-all duration-300 hover:bg-[var(--primaryHover)] hover:shadow-lg active:scale-[0.98]">
                            <svg className="h-5 w-5 shrink-0 text-white transition-transform duration-300 group-hover:scale-110" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                <path strokeLinecap="round" strokeLinejoin="round" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                            </svg>
                            <span>{data.cta?.label}</span>
                            <div className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/10 to-transparent transition-transform duration-1000 group-hover:translate-x-full" />
                        </a>
                    </div>
                </div>
            </div>
        </section >
    );
}