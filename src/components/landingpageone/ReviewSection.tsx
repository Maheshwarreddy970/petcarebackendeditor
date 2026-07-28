import React from 'react';
import { CalendarDays, Star } from 'lucide-react';




export default function StatsBanner({ data }: any) {
    const statsData = {
        ...data,
    };

    const starCount =
        Number.isFinite(statsData.rating.stars) && statsData.rating.stars >= 0
            ? statsData.rating.stars
            : 5;

    return (
        <section className="bg-[#1e0c05] py-16 md:py-20 w-full overflow-hidden">
            <div className="max-w-7xl mx-auto px-6 md:px-12 flex flex-col lg:flex-row items-center justify-between gap-16 lg:gap-8">

                <div className="max-w-[408px] w-full">
                    <h2 className="text-[#fdfdfd] text-center lg:text-left text-[22px] md:text-[24px] font-medium leading-[1.35] tracking-[-0.7px]">
                        {statsData.heading}
                    </h2>
                </div>

                <div className="flex flex-col sm:flex-row items-center justify-center gap-16 sm:gap-20 md:gap-[120px]">

                    <div className="flex flex-col items-center text-center">
                        <div className="text-[#fdfdfd] text-[32px] font-medium tracking-[-1px] flex items-center">
                            {statsData.rating.score}<span className="ml-1 text-[28px] text-white/90">{statsData.rating.max}</span>
                        </div>
                        <div className="flex items-center gap-1 mt-2 mb-2">
                            {[...Array(starCount)].map((_, index) => (
                                <Star key={index} className="w-[17px] h-[17px] text-[#8c863a] fill-[#8c863a]" />
                            ))}
                        </div>
                        <p className="text-[#fffaf8] text-[14px]">{statsData.rating.label}</p>
                    </div>

                    <div className="flex flex-col items-center text-center">
                        <CalendarDays className="w-10 h-10 text-[#8c863a] stroke-[1.5]" />
                        <div className="flex flex-col mt-4">
                            <h3 className="text-[#fdfdfd] text-[18px] font-semibold leading-snug">
                                {statsData.experience.title}
                            </h3>
                            <p className="text-[#fffaf8] text-[14px] mt-1 opacity-90">
                                {statsData.experience.subtitle}
                            </p>
                        </div>
                    </div>

                </div>
            </div >
        </section >
    );
}