import React from 'react';
import { Calendar, Star } from 'lucide-react';
import { cn } from '@/lib/utils';

export default function HeroSection({ data }: { data: any }) {
    if (!data) return null;

    const rawStars = data.socialProof?.stars;
    const parsedStars = Number(rawStars);
    const starCount = Number.isFinite(parsedStars) ? Math.max(0, Math.floor(parsedStars)) : 5;

    return (
        <section 
            className="relative w-full lg:min-h-[115vh] h-screen flex md:items-center items-end overflow-hidden"
            style={{ backgroundColor: data.bg }} // Real-time background color
        >
            {/* Standard <img> tag, perfectly suited for the ZIP export */}
            {data.image && (
                <img
                    src={data.image}
                    alt="Hero Background"
                    className="absolute inset-0 w-full h-full object-cover object-[70%_center] md:object-center  z-0"
                />
            )}

            <div className="relative z-10 w-full mx-auto px-6 md:px-12 lg:px-0 lg:ml-[10%]">
                <div className="flex flex-col max-w-[620px] py-20">

                    <div className="flex flex-col gap-6 md:gap-8">
                        {/* Heading - Inline styling maps to data.headingColor */}
                        <h1 
                            className="font-normal text-4xl font-bold md:text-6xl lg:text-[80px] leading-[1.1] tracking-[-2px] lg:tracking-[-5px]"
                            style={{ color: data.headingColor }}
                            dangerouslySetInnerHTML={{ __html: data.heading || "" }}
                        />
                        {/* Description - Inline styling maps to data.descColor */}
                        <p 
                            className="text-sm md:text-[18px] leading-[1.6] max-w-[380px]"
                            style={{ color: data.descColor }}
                            dangerouslySetInnerHTML={{ __html: data.description || "" }}
                        />
                    </div>

                    <div className="mt-10 md:mt-12">
                        {/* Button - Inline styling maps to data.cta.bg and data.cta.text */}
                        <a 
                            href={data.cta?.href || "#"} 
                            className={cn(
                                "group relative rounded-2xl py-3.5 px-6 flex items-center justify-center gap-[14px] w-fit overflow-hidden",
                                "transition-all duration-300 shadow-sm hover:opacity-90"
                            )}
                            style={{ 
                                backgroundColor: data.cta?.bg || '#a35c38', 
                                color: data.cta?.text || '#ffffff' 
                            }}
                        >
                            <Calendar className="w-5 h-5 flex-shrink-0" />
                            <span className="font-medium text-[16px] whitespace-nowrap">
                                {data.cta?.label}
                            </span>
                        </a>
                    </div>

                    <div className="flex flex-col gap-2 mt-6 md:mt-10">
                        <div className="flex items-center gap-1">
                            {[...Array(starCount)].map((_, index) => (
                                <Star 
                                    key={index} 
                                    className="w-[17px] h-[17px]" 
                                    style={{ 
                                        color: data.socialProof?.starColor || '#8c863a', 
                                        fill: data.socialProof?.starColor || '#8c863a' 
                                    }} 
                                />
                            ))}
                        </div>
                        <p 
                            className="font-medium text-[16px] opacity-90"
                            style={{ color: data.socialProof?.textColor }}
                        >
                            {data.socialProof?.text}
                        </p>
                    </div>

                </div>
            </div >
        </section >
    );
}