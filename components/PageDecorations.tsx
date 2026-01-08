
import React from 'react';
import { useData } from '../context/DataProvider';

export const DecorativeImagesContainer: React.FC = () => {
    return null;
};

export const BlueprintGrid: React.FC<{ className?: string }> = ({ className }) => (
    <div className={`absolute inset-0 z-0 pointer-events-none overflow-hidden ${className}`}>
        {/* Zjednodušená mřížka s přímým vykreslením */}
        <div 
            className="absolute inset-0 opacity-[0.03]"
            style={{
                backgroundImage: 'radial-gradient(rgba(255,255,255,0.5) 1px, transparent 1px)',
                backgroundSize: '40px 40px',
                backgroundPosition: 'center top'
            }}
        ></div>
    </div>
);

export const PageHero: React.FC<{ 
    titlePart1: string; 
    titlePart2Accent: string; 
    description: string;
    subTitle?: string;
    children?: React.ReactNode;
}> = ({ titlePart1, titlePart2Accent, description, subTitle = "Performance Hub", children }) => (
    <section className="relative pt-28 pb-0 lg:pt-36 lg:pb-0 flex items-center bg-noise bg-background min-h-[30vh] border-b border-white/5 overflow-hidden shadow-premium z-20">
        {/* Mřížka jako statická vrstva */}
        <BlueprintGrid className="opacity-[0.15]" />
        
        {/* Ambient Glows - Nahrazeno radial-gradientem bez rozmazávání (blur) */}
        <div 
            className="absolute inset-0 pointer-events-none -z-10"
            style={{
                background: `
                    radial-gradient(circle at 80% 20%, rgba(251, 146, 60, 0.08) 0%, transparent 40%),
                    radial-gradient(circle at 20% 80%, rgba(244, 63, 94, 0.04) 0%, transparent 35%)
                `
            }}
        ></div>

        <div className="container mx-auto px-6 relative z-10">
            <div className="flex flex-col items-center md:items-start text-center md:text-left max-w-6xl mx-auto md:mx-0">
                
                <div className="mb-6 w-full relative">
                    <h1 className="text-5xl sm:text-6xl md:text-5xl lg:text-7xl xl:text-7xl font-black text-white leading-[1.2] tracking-tight uppercase block w-full overflow-visible">
                        <span className="block sm:inline">{titlePart1}</span>
                        <span className="ms-gradient-text inline-block pt-2 pb-1 ml-0 sm:ml-3 md:ml-4">{titlePart2Accent}</span>
                    </h1>
                    
                    <div className="mt-4 flex items-center gap-4 justify-center md:justify-start">
                        <div className="h-[2px] w-10 md:w-12 neon-gradient rounded-full flex-shrink-0"></div>
                        <span className="text-[10px] md:text-xs font-black uppercase tracking-[0.5em] text-white/40">{subTitle}</span>
                    </div>
                </div>
                
                {description && (
                    <p className="text-base md:text-lg lg:text-xl font-medium text-white/50 max-w-2xl mb-8 leading-relaxed">
                        {description}
                    </p>
                )}
                
                {children && (
                    <div className="w-full mt-6">
                        {children}
                    </div>
                )}
            </div>
        </div>
    </section>
);
