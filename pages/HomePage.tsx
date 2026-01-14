
import React, { useEffect } from 'react';
import * as ReactRouterDom from 'react-router-dom';
import { useData } from '../context/DataProvider';
import { BlueprintGrid } from '../components/PageDecorations';
import SEO from '../components/SEO';

const HeroSection: React.FC = () => {
    const { data } = useData();

    return (
        <section className="relative pt-32 pb-24 md:pt-40 md:pb-0 overflow-hidden flex items-center bg-noise bg-background min-h-[65vh] lg:min-h-[70vh] shadow-premium z-20">
            <BlueprintGrid className="opacity-[0.1]" />

            <div
                className="absolute inset-0 pointer-events-none z-0"
                style={{
                    background: `
                        radial-gradient(circle at 15% 25%, rgba(251, 146, 60, 0.08) 0%, transparent 45%),
                        radial-gradient(circle at 85% 75%, rgba(244, 63, 94, 0.05) 0%, transparent 45%)
                    `
                }}
            ></div>

            <div className="w-full px-6 md:px-12 2xl:px-0 2xl:pl-[12%] 3xl:pl-[15%] relative z-10 transition-all duration-700">
                <div className="flex flex-col items-center md:items-start text-center md:text-left max-w-4xl">

                    <div className="mb-8 md:mb-12 w-full relative">
                        <h1 className="text-6xl sm:text-7xl md:text-7xl lg:text-7xl xl:text-8xl font-black text-white leading-[1.2] tracking-tighter uppercase block w-full overflow-visible">
                            <span className="block md:inline-block md:mr-6">{data.general.heroHeadlinePart1 || 'MARTIN'}</span>
                            <span className="ms-gradient-text block md:inline-block pt-3 pb-1">{data.general.heroHeadlinePart3Accent || 'ŠŤASTNÝ'}</span>
                        </h1>

                        <div className="mt-6 md:mt-8 flex items-center gap-4 justify-center md:justify-start">
                            <div className="h-[2px] w-10 md:w-12 neon-gradient rounded-full"></div>
                            <span className="text-[10px] md:text-sm font-black uppercase tracking-[0.5em] md:tracking-[0.7em] text-white/40">
                                {data.general.slogan || 'Fitness Coach'}
                            </span>
                        </div>
                    </div>

                    <div className="flex flex-col sm:flex-row gap-5 w-full sm:w-auto mt-4">
                        <ReactRouterDom.Link
                            to="/objednat"
                            className="px-10 md:px-12 py-4 md:py-5 neon-gradient text-white rounded-full font-black uppercase tracking-widest transition-all shadow-xl hover:shadow-neon-glow hover:scale-[1.05] active:scale-95 transform will-change-transform text-center text-sm md:text-lg"
                        >
                            Začít trénovat
                        </ReactRouterDom.Link>
                    </div>
                </div>
            </div>
        </section>
    );
};

const DetailedServices: React.FC = () => {
    const { data } = useData();
    const services = [...data.services].sort((a, b) => a.order - b.order);

    return (
        <section id="sluzby" className="pt-20 pb-20 md:pt-32 md:pb-32 bg-surface relative overflow-hidden scroll-mt-20">
            <BlueprintGrid className="opacity-[0.03] grayscale invert" />

            <div className="flex flex-col gap-20 md:gap-32 relative z-10">
                {services.map((service, index) => {
                    const isEven = index % 2 === 0;

                    const words = service.title.split(' ');

                    const shadowClass = isEven
                        ? 'shadow-[0_60px_160px_-30px_rgba(0,0,0,0.12),0_30px_80px_-40px_rgba(0,0,0,0.08)]'
                        : 'shadow-[0_30px_60px_-10px_rgba(0,0,0,0.65),0_15px_30px_-15px_rgba(0,0,0,0.5)]';

                    // Logic to handle Czech accusative: "příprava" -> "přípravu"
                    const displayTitle = service.title.endsWith('a')
                        ? service.title.slice(0, -1) + 'u'
                        : service.title;

                    return (
                        <section
                            key={service.id}
                            id={service.id}
                            className={`group w-[94%] lg:w-[92%] max-w-[1300px] relative transition-shadow duration-500 scroll-mt-24 ${shadowClass} ${isEven ? 'mr-auto rounded-r-[3rem]' : 'ml-auto rounded-l-[3rem]'
                                }`}
                        >
                            <div
                                className={`flex flex-col ${isEven ? 'md:flex-row' : 'md:flex-row-reverse'} min-h-0 md:min-h-[400px] lg:min-h-[480px] bg-surface-light border-none overflow-hidden ${isEven ? 'rounded-r-[3rem]' : 'rounded-l-[3rem]'
                                    }`}
                                style={{
                                    WebkitMaskImage: '-webkit-radial-gradient(white, black)',
                                    isolation: 'isolate',
                                    contain: 'paint'
                                }}
                            >

                                <div className="w-full md:w-[55%] lg:w-[60%] p-8 md:p-10 lg:p-14 xl:p-16 flex flex-col relative z-20 bg-surface-light border-none">
                                    <div>
                                        <h2 className="text-2xl md:text-3xl lg:text-4xl xl:text-5xl font-black uppercase tracking-tighter leading-[1.2] mb-4 md:mb-6 text-pretty">
                                            <span className="text-surface-dark">{words[0]}</span>
                                            {words.length > 1 && (
                                                <span className="ms-gradient-text ml-2 md:ml-3">
                                                    {words.slice(1).join(' ')}
                                                </span>
                                            )}
                                            {service.subheading && (
                                                <span className="block mt-4 text-[13px] font-black uppercase tracking-[0.5em] text-surface-dark/40 leading-none">
                                                    ({service.subheading})
                                                </span>
                                            )}
                                        </h2>

                                        <p className="text-surface-dark/90 font-medium text-sm lg:text-lg leading-relaxed mb-6 md:mb-8 max-w-2xl whitespace-pre-line">
                                            {service.description}
                                        </p>

                                        {/* LOKACE A CENÍK */}
                                        {(service.locations?.length || service.prices?.length) && (
                                            <div className="space-y-4 pt-4 border-t border-surface-dark/10">
                                                {/* Místa konání */}
                                                {service.locations && service.locations.length > 0 && (
                                                    <div className="flex items-start gap-3">
                                                        <span className="text-lg">📍</span>
                                                        <p className="text-sm font-bold text-surface-dark/70">
                                                            {service.locations.join(' | ')}
                                                        </p>
                                                    </div>
                                                )}

                                                {/* Ceník */}
                                                {service.prices && service.prices.length > 0 && (
                                                    <div className="flex flex-wrap gap-2">
                                                        {service.prices.map((p, idx) => (
                                                            <div key={idx} className="inline-flex items-center gap-2 px-4 py-2 bg-surface-dark/5 rounded-full">
                                                                <span className="text-[10px] font-black uppercase tracking-wider text-surface-dark/50">{p.label}</span>
                                                                <span className="text-sm font-black text-surface-dark">{p.price}</span>
                                                            </div>
                                                        ))}
                                                    </div>
                                                )}
                                            </div>
                                        )}
                                    </div>

                                    <div className="flex flex-wrap items-center gap-6 md:gap-10 mt-auto pt-10">
                                        <ReactRouterDom.Link
                                            to={service.id === 's-skupinovy-trenink'
                                                ? `/objednat?tab=existing`
                                                : `/objednat?service=${service.id}`}
                                            className="inline-flex items-center gap-4 md:gap-5 group/cta w-fit"
                                        >
                                            <div className="w-10 h-10 md:w-12 md:h-12 rounded-xl md:rounded-2xl bg-surface-dark text-white flex items-center justify-center border-0 transition-all duration-500 shadow-lg transform group-hover/cta:rotate-12 group-hover/cta:neon-gradient group-hover/cta:shadow-neon-glow group-hover/cta:scale-110">
                                                <svg className="w-4 h-4 md:w-5 md:h-5 transition-transform duration-500 group-hover/cta:translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={3.5}>
                                                    <path strokeLinecap="round" strokeLinejoin="round" d="M14 5l7 7-7 7" />
                                                </svg>
                                            </div>
                                            <span className="text-[10px] md:text-sm font-black uppercase tracking-[0.3em] ms-gradient-text transition-all duration-500 group-hover/cta:tracking-[0.4em]">
                                                Chci {displayTitle.toLowerCase()}
                                            </span>
                                        </ReactRouterDom.Link>
                                    </div>
                                </div>

                                <div className="w-full md:w-[45%] lg:w-[40%] relative overflow-hidden h-[240px] md:h-auto md:min-h-full bg-transparent border-none isolation-isolate" style={{ contain: 'paint' }}>
                                    <img
                                        src={service.imageUrl}
                                        className="absolute inset-0 w-full h-full object-cover grayscale opacity-70 group-hover:grayscale-0 group-hover:opacity-100 group-hover:scale-105 transition-all duration-[1000ms] ease-out transform-gpu"
                                        style={{
                                            backfaceVisibility: 'hidden',
                                            transformStyle: 'preserve-3d',
                                            outline: '1px solid transparent'
                                        }}
                                        alt={service.title}
                                    />

                                    <div
                                        className={`absolute inset-0 z-20 pointer-events-none transition-all duration-700 ${isEven
                                            ? 'bg-gradient-to-b md:bg-gradient-to-r'
                                            : 'bg-gradient-to-b md:bg-gradient-to-l'
                                            } from-surface-light via-surface-light/70 to-transparent`}
                                        style={{
                                            WebkitMaskImage: isEven
                                                ? 'linear-gradient(to bottom, black 0%, transparent 30%, transparent 100%), linear-gradient(to right, black 0%, transparent 50%, transparent 100%)'
                                                : 'linear-gradient(to bottom, black 0%, transparent 30%, transparent 100%), linear-gradient(to left, black 0%, transparent 50%, transparent 100%)'
                                        }}
                                    ></div>

                                    <div className="absolute inset-0 z-10 opacity-10 pointer-events-none bg-noise"></div>
                                </div>
                            </div>
                        </section>
                    );
                })}
            </div>
        </section>
    );
};

export const HomePage: React.FC = () => {
    const { data } = useData();
    const { pathname, hash } = ReactRouterDom.useLocation();

    useEffect(() => {
        if (hash) {
            // Remove the '#' to get the target ID
            const targetId = hash.replace('#', '');
            const element = document.getElementById(targetId);

            if (element) {
                setTimeout(() => {
                    const headerOffset = 80; // Adjust based on header height
                    const elementPosition = element.getBoundingClientRect().top;
                    const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

                    window.scrollTo({
                        top: offsetPosition,
                        behavior: 'smooth'
                    });
                }, 100);
            }
        }
    }, [pathname, hash]);

    return (
        <div className="flex flex-col bg-background">
            <SEO
                title={data.seo.home.title}
                description={data.seo.home.description}
                keywords={data.seo.home.keywords}
            />
            <HeroSection />
            <DetailedServices />
        </div>
    );
};
