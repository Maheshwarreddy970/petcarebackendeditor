import React from 'react';
import PetIcon from '@/icons/PetIcon';
import Bath from '@/icons/Bath';
import Scissors from '@/icons/Scissors';
import ScissorsLineDashed from '@/icons/ScissorsLineDashed';
import { ArrowRight } from 'lucide-react';
import { cn } from '@/lib/utils';

const iconMappings = [
    { keywords: ['bath', 'wash', 'clean', 'soap', 'shampoo'], component: Bath },
    { keywords: ['grooming', 'groom', 'pet', 'full-service'], component: PetIcon },
    { keywords: ['cut', 'trim', 'style', 'haircut', 'scissor'], component: Scissors },
    { keywords: ['nail', 'claw', 'paw'], component: ScissorsLineDashed }
];
const fallbackIcons = [PetIcon, Bath, Scissors, ScissorsLineDashed];

const getIconForService = (service: any) => {
    const searchString = `${service.title || ''} ${service.description || ''} ${service.iconKey || ''}`.toLowerCase();
    for (const mapping of iconMappings) {
        if (mapping.keywords.some(keyword => searchString.includes(keyword))) {
            return mapping.component;
        }
    }
    const randomIndex = (service.title?.length || 0) % fallbackIcons.length;
    return fallbackIcons[randomIndex];
};

export default function ServicesSection({ data }: { data: any }) {
    if (!data) return null;

    const services = data.items || [];
    const totalServices = services.length;

    const getGridClasses = (count: number) => {
        switch (count) {
            case 1: return "grid-cols-1 max-w-md mx-auto";
            case 2: return "grid-cols-1 sm:grid-cols-2 max-w-3xl mx-auto";
            case 3: return "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 max-w-6xl mx-auto";
            case 4: default: return "grid-cols-1 sm:grid-cols-2 lg:grid-cols-4";
        }
    };

    return (
        <section 
        id='#services'
            className="py-20 w-full overflow-hidden"
            style={{ backgroundColor: data.bg }}
        >
            <div className="max-w-7xl mx-auto px-6 flex flex-col items-center">

                <div className="flex flex-col items-center text-center max-w-[560px] mb-12 lg:mb-[72px]">
                    <h2 
                        className="font-medium text-4xl md:text-[48px] leading-[1.2] tracking-[-1.5px] mb-4"
                        style={{ color: data.headingColor }}
                        dangerouslySetInnerHTML={{ __html: data.heading || "" }}
                    />
                    <p 
                        className="text-base md:text-[18px] leading-[1.6]"
                        style={{ color: data.descColor }}
                        dangerouslySetInnerHTML={{ __html: data.description || "" }}
                    />
                </div>

                <div className={cn("grid gap-6 w-full mb-12", getGridClasses(totalServices))}>
                    {services.map((service: any, index: number) => {
                        const Icon = getIconForService(service);

                        return (
                            <div key={index} className="h-full">
                                <div 
                                    className="group flex flex-col h-full border rounded-2xl p-7 transition-all duration-300 hover:shadow-md hover:-translate-y-1"
                                    style={{ backgroundColor: data.cardBg, borderColor: data.cardBorder }}
                                >
                                    <div className="mb-[37px]">
                                        <Icon 
                                            className="w-11 h-11 stroke-[1.5]" 
                                            style={{ color: data.iconColor }} 
                                        />
                                    </div>

                                    <div className="flex flex-col flex-grow justify-between gap-[30px]">
                                        <div>
                                            <h3 
                                                className="font-medium text-[20px] leading-[1.2] tracking-[-0.5px] mb-[10px]"
                                                style={{ color: data.titleColor }}
                                            >
                                                {service.title || "Pet Service"}
                                            </h3>
                                            <p 
                                                className="text-[14px] leading-[1.48]"
                                                style={{ color: data.descColor }}
                                            >
                                                {service.description}
                                            </p>
                                        </div>

                                        {service.priceLabel && (
                                            <div 
                                                className="font-semibold text-sm mb-2"
                                                style={{ color: data.priceColor }}
                                            >
                                                {service.priceLabel}
                                            </div>
                                        )}

                                        <a 
                                            href="#" 
                                            className="inline-flex items-center gap-2 font-medium text-[16px] transition-colors mt-auto opacity-90 hover:opacity-100"
                                            style={{ color: data.titleColor }}
                                        >
                                            Learn More
                                            <ArrowRight className="w-5 h-5 transition-transform group-hover:translate-x-1" />
                                        </a>
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>

                {data.cta && (
                    <div>
                        <a 
                            href={data.cta.href || "#"} 
                            className="group relative rounded-2xl py-3.5 px-6 flex items-center justify-center gap-2.5 w-fit overflow-hidden transition-all duration-300 shadow-sm hover:opacity-90"
                            style={{ backgroundColor: data.cta.bg, color: data.cta.text }}
                        >
                            <span className="font-medium text-[16px] whitespace-nowrap">
                                {data.cta.label}
                            </span>
                            <ArrowRight className="w-5 h-5 flex-shrink-0 group-hover:translate-x-1 transition-transform duration-300" />
                        </a>
                    </div>
                )}

            </div>
        </section >
    );
}