import React from 'react';

export default function CtaSection({ data }: { data: any }) {
    if (!data) return null;

    // Grab the background color to dynamically generate the fading gradient
    const gradientBg = data.bg || '#faf3ec';

    return (
        <section 
        id='#cta'
            className="relative w-full overflow-hidden px-6 py-20 md:px-12 md:py-32 lg:px-20"
            style={{ backgroundColor: data.bg }}
        >
            {/* Background Image Container */}
            <div className="absolute inset-0 z-0">
                {data.image && (
                    <img 
                        className="h-full w-full object-cover object-right md:object-center opacity-60 mix-blend-multiply" 
                        src={data.image} 
                        alt="CTA Background" 
                    />
                )}
                {/* Inline-powered gradient mask that adapts to the chosen background color */}
                <div
                    className="absolute inset-0 pointer-events-none"
                    style={{
                        background: `linear-gradient(243deg, transparent 20%, ${gradientBg} 50%, ${gradientBg} 80%)`
                    }}
                />
            </div>

            <div className="relative z-10 mx-auto max-w-[1272px]">
                <div className="flex max-w-[540px] flex-col items-start gap-8 md:gap-10">
                    
                    <div className="flex flex-col gap-4">
                        <h2 
                            className="text-balance font-sans text-3xl font-medium tracking-[-1.5px] leading-[1.15] sm:text-4xl md:text-5xl"
                            style={{ color: data.headingColor }}
                            dangerouslySetInnerHTML={{ __html: data.heading || "" }}
                        />
                        <p 
                            className="text-pretty font-sans text-base leading-relaxed sm:text-lg"
                            style={{ color: data.descColor }}
                            dangerouslySetInnerHTML={{ __html: data.description || "" }}
                        />
                    </div>

                    <div>
                        <a 
                            href={data.cta?.href || "#"} 
                            className="group relative flex items-center justify-center gap-3.5 overflow-hidden rounded-2xl px-[22px] py-3.5 text-base font-medium transition-all duration-300 hover:shadow-lg active:scale-[0.98] hover:opacity-90"
                            style={{ 
                                backgroundColor: data.cta?.bg || '#a35c38', 
                                color: data.cta?.text || '#ffffff' 
                            }}
                        >
                            <svg 
                                className="h-5 w-5 shrink-0 transition-transform duration-300 group-hover:scale-110" 
                                fill="none" 
                                viewBox="0 0 24 24" 
                                stroke="currentColor" 
                                strokeWidth={2}
                            >
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