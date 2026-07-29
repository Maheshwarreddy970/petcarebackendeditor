import React from 'react';

export default function ProcessSection({ data }: { data: any }) {
    if (!data) return null;

    return (
        <section 
        id='#process'
            className="py-20 w-full overflow-hidden"
            style={{ backgroundColor: data.bg }}
        >
            <div className="mx-auto px-6 md:px-12 flex flex-col items-center relative">

                <div>
                    <div className="flex flex-col items-center text-center max-w-[537px] mx-auto mb-16 lg:mb-[96px]">
                        <h2 
                            className="font-medium text-4xl md:text-[56px] leading-[1.3] tracking-[-2px] mb-4"
                            style={{ color: data.headingColor }}
                            dangerouslySetInnerHTML={{ __html: data.heading || "" }}
                        />
                        <p 
                            className="text-base md:text-[18px] leading-[1.6]"
                            style={{ color: data.descColor }}
                            dangerouslySetInnerHTML={{ __html: data.description || "" }}
                        />
                    </div>
                </div>

                <div className="relative w-full max-w-[1064px] mx-auto">
                    {/* Central Vertical Line (Desktop Only) mapped to data.lineColor */}
                    <div 
                        className="hidden lg:block absolute left-1/2 top-0 bottom-0 w-[4px] -translate-x-1/2 rounded-full" 
                        style={{ 
                            background: `linear-gradient(to bottom, ${data.lineColor}, ${data.lineColor} 90%, transparent)` 
                        }}
                    />

                    <div className="flex flex-col gap-16 lg:gap-[116px] relative">
                        {data.steps?.map((step: any, index: number) => {
                            const isEven = index % 2 !== 0;

                            return (
                                <div key={step.id || index} className={`flex flex-col lg:flex-row items-center gap-8 lg:gap-[116px] w-full ${isEven ? 'lg:flex-row-reverse' : ''}`}>

                                    <div className="w-full lg:w-1/2 flex justify-center lg:justify-end">
                                        <div className="w-full max-w-[474px]">
                                            <div 
                                                className="relative w-full aspect-[474/284] rounded-2xl overflow-hidden shadow-sm border border-black/5"
                                                style={{ backgroundColor: data.bg }}
                                            >
                                                {step.image && (
                                                    <img 
                                                        src={step.image} 
                                                        alt={step.title} 
                                                        className="object-cover absolute inset-0 w-full h-full" 
                                                    />
                                                )}
                                            </div>
                                        </div>
                                    </div>

                                    {/* Timeline Dot mapped to data.lineColor and data.bg */}
                                    <div 
                                        className="hidden lg:flex absolute left-1/2 -translate-x-1/2 w-5 h-5 rounded-full z-10 border-4 shadow-sm" 
                                        style={{ backgroundColor: data.lineColor, borderColor: data.bg }}
                                    />

                                    <div className={`w-full lg:w-1/2 flex flex-col justify-center ${isEven ? 'lg:items-end lg:text-right' : 'lg:items-start text-left'}`}>
                                        <div className="w-full max-w-[474px]">
                                            <div className="flex flex-col">
                                                <div 
                                                    className={`mb-4 inline-flex px-3 py-1.5 border border-black/10 rounded-[10px] w-fit shadow-sm ${isEven ? 'lg:ml-auto' : ''}`}
                                                    style={{ backgroundColor: data.bg }}
                                                >
                                                    <span 
                                                        className="font-medium text-[14px]"
                                                        style={{ color: step.titleColor }}
                                                    >
                                                        Step {step.id || index + 1}
                                                    </span>
                                                </div>
                                                <h3 
                                                    className="font-medium text-[24px] md:text-[30px] leading-[1.28] tracking-[-1px] mb-3"
                                                    style={{ color: step.titleColor }}
                                                >
                                                    {step.title}
                                                </h3>
                                                <p 
                                                    className="text-[16px] md:text-[18px] leading-[1.6]"
                                                    style={{ color: step.descColor }}
                                                    dangerouslySetInnerHTML={{ __html: step.description || "" }}
                                                />
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>
            </div>
        </section>
    );
}