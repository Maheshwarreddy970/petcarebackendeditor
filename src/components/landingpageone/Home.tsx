import React from 'react';
import { Calendar, Star } from 'lucide-react';


export default function HeroSection({ data }: { data: any }) {
    if (!data) return null;

    const rawStars = data.socialProof?.stars;
    const parsedStars = Number(rawStars);
    const starCount = Number.isFinite(parsedStars) ? Math.max(0, Math.floor(parsedStars)) : 5;
    return (
        <section className="relative w-full lg:min-h-[115vh] h-screen flex md:items-center items-end bg-[var(--bgAlt)] overflow-hidden">
            {/* Background Image */}
            <img
                src={data.image}
                alt="Hero Background"
                className="absolute inset-0 w-full h-full object-cover object-[70%_center] md:object-center  "
            />

            <div className="relative z-10 w-full mx-auto px-6 md:px-12 lg:px-0 lg:ml-[10%]">
                <div className="flex flex-col max-w-[620px] py-20">

                    <div>
                        <div className="flex flex-col gap-6 md:gap-8">
                            {/* Plain text heading, dynamically colored */}
                            <h1 className="text-[var(--text)] font-normal text-4xl font-bold md:text-6xl lg:text-[80px] leading-[1.1] tracking-[-2px] lg:tracking-[-5px]">
                                {data.heading}
                            </h1>
                            <p className="text-[var(--textMuted)] text-sm md:text-[18px] leading-[1.6] max-w-[380px]">
                                {data.description}
                            </p>
                        </div>
                    </div>

                    <div className="mt-10 md:mt-12">
                        <a href={data.cta?.href || "#"} className="group relative bg-[var(--primary)] text-white rounded-2xl py-3.5 px-6 flex items-center justify-center gap-[14px] w-fit overflow-hidden hover:bg-[var(--primaryHover)] transition-all duration-300 shadow-sm">
                            <Calendar className="w-5 h-5 flex-shrink-0" />
                            <span className="font-medium text-[16px] whitespace-nowrap">
                                {data.cta?.label}
                            </span>
                        </a>
                    </div>

                    <div className="flex flex-col gap-2 mt-6 md:mt-10">
                        <div className="flex items-center gap-1">
                            {[...Array(starCount)].map((_, index) => (
                                <Star key={index} className="w-[17px] h-[17px] text-[var(--accent)] fill-[var(--accent)]" />
                            ))}
                        </div>
                        <p className="text-[var(--text)] font-medium text-[16px] opacity-90">
                            {data.socialProof?.text}
                        </p>
                    </div>

                </div>
            </div >
        </section >
    );
}