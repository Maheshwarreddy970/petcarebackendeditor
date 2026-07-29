import React from 'react';
import { ArrowDown } from 'lucide-react';

export default function GallerySection({ data }: { data: any }) {
    if (!data || !data.items) return null;

    return (
        <section 
        id='#gallery'
            className="py-20 w-full overflow-hidden"
            style={{ backgroundColor: data.bg || '#fffaf8' }}
        >
            <div className="mx-auto px-6 md:px-12 flex flex-col items-center">

                {/* Header Block */}
                <div className="flex flex-col items-center text-center max-w-[628px] mb-16 lg:mb-[94px]">
                    <h2 
                        className="font-medium text-4xl md:text-[48px] leading-[1.2] tracking-[-1.5px] mb-4"
                        style={{ color: data.headingColor }}
                    >
                        {data.heading}
                    </h2>
                    <p 
                        className="text-base md:text-[18px] leading-[1.6] max-w-[537px]"
                        style={{ color: data.descColor }}
                    >
                        {data.description}
                    </p>
                </div>

                {/* Gallery Matrix Wrapper - Horizontally Scrollable */}
                <div className="w-full overflow-x-auto pb-6 scrollbar-hide">
                    <div className="min-w-max mx-auto flex flex-col pl-6 pr-12 md:pl-12">

                        {/* ROW 1: BEFORE */}
                        <div className="relative flex items-center w-full">
                            <div className="absolute left-[100px] right-0 h-px bg-gray-200 top-1/2 -translate-y-1/2 z-0" />

                            {/* Sticky label stays visible while scrolling */}
                            <div 
                                className="w-[120px] flex-shrink-0 z-20 sticky left-0 py-2"
                                style={{ backgroundColor: data.bg || '#fffaf8' }} // Matches section bg to hide scroll behind it
                            >
                                <div 
                                    className="border border-gray-200 rounded-xl px-4 py-2 text-center font-semibold text-[16px] inline-block shadow-sm"
                                    style={{ backgroundColor: data.badgeBg, color: data.badgeText }}
                                >
                                    Before
                                </div>
                            </div>

                            {/* Images */}
                            <div className="flex flex-nowrap gap-8 z-10 pl-8">
                                {data.items.map((item: any, index: number) => (
                                    <div key={`before-${item.id || index}`} className="w-[280px] md:w-[320px] shrink-0">
                                        <div 
                                            className="relative aspect-square rounded-2xl overflow-hidden shadow-sm border border-gray-200"
                                            style={{ backgroundColor: data.badgeBg }}
                                        >
                                            {item.before && (
                                                <img
                                                    src={item.before}
                                                    alt={`Before ${item.alt || ''}`}
                                                    className="absolute inset-0 w-full h-full object-cover"
                                                />
                                            )}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* ROW 2: ARROWS */}
                        <div className="flex w-full py-8">
                            <div 
                                className="w-[120px] flex-shrink-0 sticky left-0"
                                style={{ backgroundColor: data.bg || '#fffaf8' }}
                            />
                            <div className="flex flex-nowrap gap-8 pl-8">
                                {data.items.map((item: any, index: number) => (
                                    <div key={`arrow-${item.id || index}`} className="w-[280px] md:w-[320px] shrink-0 flex justify-center items-center">
                                        <ArrowDown 
                                            className="w-5 h-5 stroke-[2]" 
                                            style={{ color: data.arrowColor }} 
                                        />
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* ROW 3: AFTER */}
                        <div className="relative flex items-center w-full">
                            <div className="absolute left-[100px] right-0 h-px bg-gray-200 top-1/2 -translate-y-1/2 z-0" />

                            {/* Sticky label */}
                            <div 
                                className="w-[120px] flex-shrink-0 z-20 sticky left-0 py-2"
                                style={{ backgroundColor: data.bg || '#fffaf8' }}
                            >
                                <div 
                                    className="border border-gray-200 rounded-xl px-4 py-2 text-center font-semibold text-[16px] inline-block shadow-sm"
                                    style={{ backgroundColor: data.badgeBg, color: data.badgeText }}
                                >
                                    After
                                </div>
                            </div>

                            {/* Images */}
                            <div className="flex flex-nowrap gap-8 z-10 pl-8">
                                {data.items.map((item: any, index: number) => (
                                    <div key={`after-${item.id || index}`} className="w-[280px] md:w-[320px] shrink-0">
                                        <div 
                                            className="relative aspect-square rounded-2xl overflow-hidden shadow-sm border border-gray-200"
                                            style={{ backgroundColor: data.badgeBg }}
                                        >
                                            {item.after && (
                                                <img
                                                    src={item.after}
                                                    alt={`After ${item.alt || ''}`}
                                                    className="absolute inset-0 w-full h-full object-cover"
                                                />
                                            )}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                    </div>
                </div>

            </div>
        </section>
    );
}