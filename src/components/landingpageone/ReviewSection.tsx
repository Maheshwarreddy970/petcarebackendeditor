import React from 'react';
import { CalendarDays, Star } from 'lucide-react';

export default function StatsBanner({ data }: { data: any }) {
    if (!data) return null;

    const starCount = Number.isFinite(Number(data.rating?.stars)) && Number(data.rating?.stars) >= 0 
        ? Number(data.rating?.stars) 
        : 5;

    return (
        <section 
            className="py-16 md:py-20 w-full overflow-hidden"
            style={{ backgroundColor: data.bg }}
        >
            <div className="max-w-7xl mx-auto px-6 md:px-12 flex flex-col lg:flex-row items-center justify-between gap-16 lg:gap-8">

                <div className="max-w-[408px] w-full">
                    <h2 
                        className="text-center lg:text-left text-[22px] md:text-[24px] font-medium leading-[1.35] tracking-[-0.7px]"
                        style={{ color: data.headingColor }}
                        dangerouslySetInnerHTML={{ __html: data.heading || "" }}
                    />
                </div>

                <div className="flex flex-col sm:flex-row items-center justify-center gap-16 sm:gap-20 md:gap-[120px]">

                    {/* Ratings Block */}
                    <div className="flex flex-col items-center text-center">
                        <div 
                            className="text-[32px] font-medium tracking-[-1px] flex items-center"
                            style={{ color: data.rating?.scoreColor }}
                        >
                            {data.rating?.score}
                            <span className="ml-1 text-[28px] opacity-90">{data.rating?.max}</span>
                        </div>
                        <div className="flex items-center gap-1 mt-2 mb-2">
                            {[...Array(starCount)].map((_, index) => (
                                <Star 
                                    key={index} 
                                    className="w-[17px] h-[17px]" 
                                    style={{ color: data.rating?.starColor, fill: data.rating?.starColor }} 
                                />
                            ))}
                        </div>
                        <p 
                            className="text-[14px]"
                            style={{ color: data.rating?.labelColor }}
                        >
                            {data.rating?.label}
                        </p>
                    </div>

                    {/* Experience Block */}
                    <div className="flex flex-col items-center text-center">
                        <CalendarDays 
                            className="w-10 h-10 stroke-[1.5]" 
                            style={{ color: data.experience?.iconColor }} 
                        />
                        <div className="flex flex-col mt-4">
                            <h3 
                                className="text-[18px] font-semibold leading-snug"
                                style={{ color: data.experience?.titleColor }}
                            >
                                {data.experience?.title}
                            </h3>
                            <p 
                                className="text-[14px] mt-1 opacity-90"
                                style={{ color: data.experience?.subColor }}
                            >
                                {data.experience?.subtitle}
                            </p>
                        </div>
                    </div>

                </div>
            </div >
        </section >
    );
}