import React from 'react';
import Image from 'next/image';


export default function InsightsSection({ data }: { data: any }) {
    if (!data) return null;

    const insights = data.items || [];
    const gridDelays = ["delay-0", "delay-150", "delay-300"];

    return (
        <section className="bg-[var(--bgAlt)] py-20 w-full overflow-hidden">
            <div className="max-w-7xl mx-auto px-6 md:px-12 flex flex-col items-center">
                <div className="flex flex-col items-center text-center mb-12 lg:mb-16">
                    <h2 className="text-[var(--text)] font-medium text-4xl md:text-[48px] leading-[1.2] tracking-[-1.5px] mb-4">
                        {data.heading}
                    </h2>
                    <p className="text-[var(--textMuted)] text-base md:text-[18px] leading-[1.6]">
                        {data.description}
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 lg:gap-8 w-full">
                    {insights.map((insight: any, index: number) => (
                        <div key={insight.id || index} className="w-full">
                            <article className="flex flex-col group cursor-pointer">
                                <div className="relative w-full aspect-[408/252] rounded-2xl overflow-hidden mb-6 shadow-sm border border-[var(--border)]">
                                    {insight.image && (
                                        <img src={insight.image} alt={insight.title || "Blog Post"} className="object-cover transition-transform duration-500 ease-out group-hover:scale-105" sizes="(max-width: 768px) 100vw, 33vw" />
                                    )}
                                </div>
                                <div className="flex flex-col items-start px-1">
                                    <div className="inline-flex items-center justify-center bg-[var(--bg)] border border-[var(--border)] rounded-lg px-3 py-1 mb-4">
                                        <span className="text-[var(--textMuted)] font-medium text-[14px] leading-[1.6]">
                                            {insight.date}
                                        </span>
                                    </div>
                                    <h3 className="text-[var(--text)] font-medium text-[22px] md:text-[24px] leading-[1.3] tracking-[-0.7px] group-hover:text-[var(--primary)] transition-colors duration-300">
                                        {insight.title}
                                    </h3>
                                </div>
                            </article>
                        </div>
                    ))}
                </div>
            </div>
        </section >
    );
}