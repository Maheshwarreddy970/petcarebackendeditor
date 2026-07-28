import React from 'react';


export default function ProcessSection({ data }: { data: any }) {
    if (!data) return null;

    return (
        <section className="bg-[var(--bgAlt)] py-20 w-full overflow-hidden">
            <div className="mx-auto px-6 md:px-12 flex flex-col items-center relative">

                <div>
                    <div className="flex flex-col items-center text-center max-w-[537px] mx-auto mb-16 lg:mb-[96px]">
                        <h2 className="text-[var(--text)] font-medium text-4xl md:text-[56px] leading-[1.3] tracking-[-2px] mb-4">
                            {data.heading}
                        </h2>
                        <p className="text-[var(--textMuted)] text-base md:text-[18px] leading-[1.6]">
                            {data.description}
                        </p>
                    </div>
                </div>

                <div className="relative w-full max-w-[1064px] mx-auto">
                    {/* Central Vertical Line (Desktop Only) using theme colors */}
                    <div className="hidden lg:block absolute left-1/2 top-0 bottom-0 w-[4px] bg-gradient-to-b from-[var(--primary)] via-[var(--primary)] to-[var(--border)] -translate-x-1/2 rounded-full" />

                    <div className="flex flex-col gap-16 lg:gap-[116px] relative">
                        {data.steps?.map((step: any, index: number) => {
                            const isEven = index % 2 !== 0;

                            return (
                                <div key={step.id || index} className={`flex flex-col lg:flex-row items-center gap-8 lg:gap-[116px] w-full ${isEven ? 'lg:flex-row-reverse' : ''}`}>

                                    <div className="w-full lg:w-1/2 flex justify-center lg:justify-end">
                                        <div className="w-full max-w-[474px]">
                                            <div className="relative w-full aspect-[474/284] rounded-2xl overflow-hidden shadow-sm bg-[var(--bg)] border border-[var(--border)]">
                                                {step.image && (
                                                    <img src={step.image} alt={step.title} className="object-cover w-full h-full" />
                                                )}
                                            </div>
                                        </div>
                                    </div>

                                    <div className="hidden lg:flex absolute left-1/2 -translate-x-1/2 w-5 h-5 bg-[var(--primary)] rounded-full z-10 border-4 border-[var(--bgAlt)] shadow-sm" />

                                    <div className={`w-full lg:w-1/2 flex flex-col justify-center ${isEven ? 'lg:items-end lg:text-right' : 'lg:items-start text-left'}`}>
                                        <div className="w-full max-w-[474px]">
                                            <div className="flex flex-col">
                                                <div className={`mb-4 inline-flex px-3 py-1.5 bg-[var(--bg)] border border-[var(--border)] rounded-[10px] w-fit ${isEven ? 'lg:ml-auto' : ''}`}>
                                                    <span className="text-[var(--text)] font-medium text-[14px]">
                                                        Step {step.id || index + 1}
                                                    </span>
                                                </div>
                                                <h3 className="text-[var(--text)] font-medium text-[24px] md:text-[30px] leading-[1.28] tracking-[-1px] mb-3">
                                                    {step.title}
                                                </h3>
                                                <p className="text-[var(--textMuted)] text-[16px] md:text-[18px] leading-[1.6]">
                                                    {step.description}
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div >
            </div >
        </section >
    );
}