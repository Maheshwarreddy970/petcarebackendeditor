import React from 'react';
import Image from 'next/image';
import { CircleCheck, ArrowRight } from 'lucide-react';


export default function AboutSection({ data }: { data: any }) {
    if (!data) return null;

    return (
        <section className="bg-[var(--bgAlt)] py-20 w-full overflow-hidden">
            <div className="max-w-7xl mx-auto px-6 md:px-12 w-full">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-[108px] items-center">

                    <div className="relative w-full max-w-[552px] mx-auto lg:mx-0 aspect-[552/640] rounded-3xl overflow-hidden shadow-sm">
                        {data.image && (
                            <img
                                src={data.image}
                                alt="About Image"

                                className="object-cover"
                                sizes="(max-width: 1024px) 100vw, 50vw"
                            />
                        )}
                    </div>

                    <div className="flex flex-col gap-10 lg:gap-[72px] max-w-[548px] mx-auto lg:mx-0">
                        <div className="flex flex-col gap-6">
                            <h2 className="text-[var(--text)] font-medium text-4xl md:text-5xl lg:text-[48px] leading-[1.2] tracking-[-1.5px]">
                                {data.heading}
                            </h2>
                            <p className="text-[var(--textMuted)] text-base md:text-[18px] leading-[1.6]">
                                {data.description}
                            </p>
                        </div>

                        <div className="flex flex-col gap-8 lg:gap-10">
                            <ul className="flex flex-col gap-4">
                                {data.features?.map((feature: string, index: number) => {
                                    const delays = ["delay-150", "delay-300", "delay-500"];
                                    return (
                                        <div key={index} className="flex items-center gap-3">
                                            <li className="flex items-center gap-3">
                                                <CircleCheck className="w-5 h-5 text-[var(--accent)] flex-shrink-0" strokeWidth={1.5} />
                                                <span className="text-[var(--text)] font-medium text-base md:text-[18px] leading-[1.6]">
                                                    {feature}
                                                </span>
                                            </li>
                                        </div>
                                    );
                                })}
                            </ul>

                            {data.cta && (
                                <div>
                                    <a href={data.cta.href || "#"} className="group relative bg-[var(--primary)] text-white rounded-2xl py-3.5 px-6 flex items-center justify-center gap-2.5 w-fit overflow-hidden hover:bg-[var(--primaryHover)] transition-colors duration-300">
                                        <span className="font-medium text-[16px] whitespace-nowrap">
                                            {data.cta.label}
                                        </span>
                                        <ArrowRight className="w-5 h-5 flex-shrink-0 group-hover:translate-x-1 transition-transform duration-300" />
                                    </a>
                                </div>
                            )}
                        </div>
                    </div>

                </div>
            </div>
        </section >
    );
}