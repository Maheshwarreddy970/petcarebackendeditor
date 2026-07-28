import { ArrowDown } from 'lucide-react';

export default function GallerySection({ data }: { data: any }) {
    if (!data || !data.items) return null;

    return (
        <section className="bg-[var(--bgAlt)] py-20 w-full overflow-hidden">
            <div className="mx-auto px-6 md:px-12 flex flex-col items-center">

                {/* Header Block */}
                <div className="flex flex-col items-center text-center max-w-[628px] mb-16 lg:mb-[94px]">
                    <h2 className="text-[var(--text)] font-medium text-4xl md:text-[48px] leading-[1.2] tracking-[-1.5px] mb-4">
                        {data.heading}
                    </h2>
                    <p className="text-[var(--textMuted)] text-base md:text-[18px] leading-[1.6] max-w-[537px]">
                        {data.description}
                    </p>
                </div>

                {/* 🔥 FIXED: Gallery Matrix Wrapper - Now scrolls horizontally infinitely */}
                <div className="w-full overflow-x-auto pb-6 scrollbar-hide">
                    {/* We use min-w-max so it stretches as long as it needs to fit 4+ items */}
                    <div className="min-w-max mx-auto flex flex-col pl-6 pr-12 md:pl-12">

                        {/* ROW 1: BEFORE */}
                        <div className="relative flex items-center w-full">
                            <div className="absolute left-[100px] right-0 h-px bg-[var(--border)] top-1/2 -translate-y-1/2 z-0" />

                            {/* Sticky label stays visible while scrolling */}
                            <div className="w-[120px] flex-shrink-0 z-20 sticky left-0 bg-[var(--bgAlt)] py-2">
                                <div className="bg-[var(--bg)] border border-[var(--border)] rounded-xl px-4 py-2 text-center text-[var(--textMuted)] font-semibold text-[16px] inline-block">
                                    Before
                                </div>
                            </div>

                            {/* Images stay in a single row without wrapping */}
                            <div className="flex flex-nowrap gap-8 z-10 pl-8">
                                {data.items.map((item: any, index: number) => (
                                    <div key={`before-${item.id || index}`} className="w-[280px] md:w-[320px] shrink-0">
                                        <div className="relative aspect-square rounded-2xl overflow-hidden bg-[var(--bg)] shadow-sm border border-[var(--border)]">
                                            {item.before && (
                                                <img
                                                    src={item.before}
                                                    alt={`Before ${item.alt || ''}`}
                                                    className="object-cover"
                                                    sizes="320px"
                                                />
                                            )}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* ROW 2: ARROWS */}
                        <div className="flex w-full py-8">
                            <div className="w-[120px] flex-shrink-0 sticky left-0 bg-[var(--bgAlt)]" />
                            <div className="flex flex-nowrap gap-8 pl-8">
                                {data.items.map((item: any, index: number) => (
                                    <div key={`arrow-${item.id || index}`} className="w-[280px] md:w-[320px] shrink-0 flex justify-center items-center">
                                        <ArrowDown className="text-[var(--accent)] w-5 h-5 stroke-[2]" />
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* ROW 3: AFTER */}
                        <div className="relative flex items-center w-full">
                            <div className="absolute left-[100px] right-0 h-px bg-[var(--border)] top-1/2 -translate-y-1/2 z-0" />

                            {/* Sticky label stays visible while scrolling */}
                            <div className="w-[120px] flex-shrink-0 z-20 sticky left-0 bg-[var(--bgAlt)] py-2">
                                <div className="bg-[var(--bg)] border border-[var(--border)] rounded-xl px-4 py-2 text-center text-[var(--textMuted)] font-semibold text-[16px] inline-block">
                                    After
                                </div>
                            </div>

                            {/* Images stay in a single row without wrapping */}
                            <div className="flex flex-nowrap gap-8 z-10 pl-8">
                                {data.items.map((item: any, index: number) => (
                                    <div key={`after-${item.id || index}`} className="w-[280px] md:w-[320px] shrink-0">
                                        <div className="relative aspect-square rounded-2xl overflow-hidden bg-[var(--bg)] shadow-sm border border-[var(--border)]">
                                            {item.after && (
                                                <img
                                                    src={item.after}
                                                    alt={`After ${item.alt || ''}`}
                                                    className="object-cover"
                                                    sizes="320px"
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