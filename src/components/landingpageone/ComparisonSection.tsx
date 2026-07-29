import React from 'react';
import { XCircle, CheckCircle } from 'lucide-react';

export default function ComparisonSection({ data }: { data: any }) {
    if (!data) return null;

    return (
        <section 
        id='#comparison'
            className="py-20 w-full overflow-hidden"
            style={{ backgroundColor: data.bg || '#ffffff' }}
        >
            <div className="max-w-7xl mx-auto px-6 md:px-12 flex flex-col items-center">

                <div className="flex flex-col items-center text-center max-w-[628px] mb-12 lg:mb-16">
                    <h2 
                        className="font-medium text-4xl md:text-[48px] leading-[1.2] tracking-[-1.5px] mb-4"
                        style={{ color: data.headingColor }}
                    >
                        {data.heading}
                    </h2>
                    <p 
                        className="text-base md:text-[18px] leading-[1.6]"
                        style={{ color: data.descColor }}
                    >
                        {data.description}
                    </p>
                </div>

                {/* Comparison Board */}
                <div className="relative w-full max-w-[950px] mx-auto flex flex-col md:flex-row  items-stretch">
                    
                    {/* Left Column (Negative / Other Offers) */}
                    <div 
                        className="w-full md:w-1/2 border border-gray-200 border-b-0 md:border-b md:border-r-0 p-8 md:p-10 lg:p-12 rounded-t-[22px] md:rounded-t-none md:rounded-l-[22px]"
                        style={{ backgroundColor: data.leftBg }}
                    >
                        <h3 
                            className="font-medium text-[24px] leading-[1.3] tracking-[-0.7px] mb-6"
                            style={{ color: data.leftText }}
                        >
                            Other offers
                        </h3>
                        <ul className="flex flex-col">
                            {data.otherOffers?.map((item: string, index: number) => (
                                <li key={index} className="flex items-center gap-4 py-[18px] border-b border-gray-200/50 last:border-b-0">
                                    <XCircle 
                                        className="w-5 h-5 flex-shrink-0 stroke-[1.5]" 
                                        style={{ color: data.leftIcon }} 
                                    />
                                    <span 
                                        className="text-[15px] md:text-[16px] leading-[1.6] opacity-90"
                                        style={{ color: data.leftText }}
                                    >
                                        {item}
                                    </span>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* VS Badge */}
                    <div className="absolute md:mt-0 -mt-8 left-1/2 -rotate-10 top-1/2 -translate-x-1/2 -translate-y-1/2 z-20 flex items-center justify-center">
                        <div 
                            className="rounded-full w-[60px] h-[60px] md:w-[64px] md:h-[64px] border-[4px] flex items-center justify-center shadow-md"
                            style={{ 
                                backgroundColor: data.vsBg, 
                                color: data.vsText,
                                borderColor: data.bg || '#ffffff' // dynamically match the section bg so it seamlessly sits on top
                            }}
                        >
                            <span className="font-medium text-[20px] md:text-[22px] tracking-[-1px] uppercase">
                                vs
                            </span>
                        </div>
                    </div>

                    {/* Right Column (Positive / Your Offers) */}
                    <div 
                        className="w-full md:w-1/2 p-8 md:p-10 lg:p-12 rounded-b-[22px] md:rounded-r-[22px]"
                        style={{ backgroundColor: data.rightBg }}
                    >
                        <h3 
                            className="font-medium text-[24px] leading-[1.3] tracking-[-0.7px] mb-6"
                            style={{ color: data.rightText }}
                        >
                            Your Offers
                        </h3>
                        <ul className="flex flex-col">
                            {data.petocareOffers?.map((item: string, index: number) => (
                                <li key={index} className="flex items-center gap-4 py-[18px] border-b border-white/20 last:border-b-0">
                                    <CheckCircle 
                                        className="w-5 h-5 flex-shrink-0 stroke-[1.5]" 
                                        style={{ color: data.rightIcon }} 
                                    />
                                    <span 
                                        className="text-[15px] md:text-[16px] leading-[1.6]"
                                        style={{ color: data.rightText }}
                                    >
                                        {item}
                                    </span>
                                </li>
                            ))}
                        </ul>
                    </div>

                </div>
            </div>
        </section>
    );
}