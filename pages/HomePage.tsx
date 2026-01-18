
import React, { useEffect } from 'react';
import * as ReactRouterDom from 'react-router-dom';
import { useData } from '../context/DataProvider';
import { BlueprintGrid } from '../components/PageDecorations';
import SEO from '../components/SEO';

const HeroSection: React.FC = () => {
    const { data } = useData();
    const heroDecoration = data.homeDecorations?.hero;
    const heroText = data.homeDecorations?.heroText;

    const hexToRgba = (hex: string, alpha01: number) => {
        const clean = (hex || '').replace('#', '').trim();
        if (clean.length !== 6) return `rgba(15, 23, 42, ${alpha01})`;
        const r = parseInt(clean.slice(0, 2), 16);
        const g = parseInt(clean.slice(2, 4), 16);
        const b = parseInt(clean.slice(4, 6), 16);
        return `rgba(${r}, ${g}, ${b}, ${alpha01})`;
    };

    return (
        <div className="relative overflow-visible">
            {/* HERO SECTION */}
            <section className="relative pt-20 pb-20 sm:pt-28 sm:pb-24 md:pt-32 md:pb-16 lg:pt-40 lg:pb-20 overflow-hidden flex items-start md:items-center bg-noise bg-background min-h-[auto] md:min-h-[60vh] lg:min-h-[65vh] shadow-premium z-20">
                <BlueprintGrid className="opacity-[0.1]" />

                {/* Gradient overlays */}
                <div
                    className="absolute inset-0 pointer-events-none z-0"
                    style={{
                        background: `
                            radial-gradient(circle at 15% 25%, rgba(251, 146, 60, 0.08) 0%, transparent 45%),
                            radial-gradient(circle at 85% 75%, rgba(244, 63, 94, 0.05) 0%, transparent 45%)
                        `
                    }}
                />

                {/* Hero image - using admin settings */}
                {heroDecoration?.enabled && heroDecoration.imageUrl && (
                    <div
                        className="absolute z-0 pointer-events-none hidden md:block"
                        style={{
                            [heroDecoration.originX || 'right']: `${heroDecoration.offsetX || 0}px`,
                            [heroDecoration.originY || 'bottom']: `${heroDecoration.offsetY || 0}px`,
                            opacity: Math.min((heroDecoration.opacity || 100) / 100, 0.95),
                        }}
                    >
                        <img
                            src={heroDecoration.imageUrl}
                            alt="Hero dekorace"
                            fetchPriority="high"
                            className="w-auto object-contain select-none pointer-events-none"
                            style={{
                                // Base height is 55vh, scale adjusts it (100% = 55vh)
                                height: `calc(55vh * ${(heroDecoration.scale || 100) / 100})`,
                                maxHeight: '85vh',
                                transform: `rotate(${heroDecoration.rotation || 0}deg)`,
                                filter: heroDecoration.shadow === 'dark' 
                                    ? 'drop-shadow(0 25px 60px rgba(0,0,0,0.5))' 
                                    : heroDecoration.shadow === 'light'
                                        ? 'drop-shadow(0 15px 30px rgba(0,0,0,0.2))'
                                        : 'none',
                            }}
                        />
                    </div>
                )}

                {/* Main content */}
                <div className="w-full px-5 sm:px-6 md:px-12 2xl:px-0 2xl:pl-[12%] 3xl:pl-[15%] relative z-10 transition-all duration-700">
                    <div className="flex flex-col items-center md:items-start text-center md:text-left max-w-4xl">

                        {/* Headline */}
                        <div className="mb-6 md:mb-12 w-full relative">
                            <h1 className="text-5xl sm:text-6xl md:text-7xl lg:text-7xl xl:text-8xl font-black text-white leading-[1.1] tracking-tighter uppercase block w-full overflow-visible">
                                <span className="block md:inline-block md:mr-6">{data.general.heroHeadlinePart1 || 'MARTIN'}</span>
                                <span className="ms-gradient-text block md:inline-block pt-2 pb-1">{data.general.heroHeadlinePart3Accent || 'ŠŤASTNÝ'}</span>
                            </h1>

                            <div className="mt-4 md:mt-8 flex items-center gap-3 md:gap-4 justify-center md:justify-start">
                                <div className="h-[2px] w-8 md:w-12 neon-gradient rounded-full"></div>
                                <span className="text-[9px] sm:text-[10px] md:text-sm font-black uppercase tracking-[0.4em] md:tracking-[0.7em] text-white/40">
                                    {data.general.slogan || 'Fitness Coach'}
                                </span>
                            </div>
                        </div>

                        {/* CTA Button */}
                        <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto">
                            <ReactRouterDom.Link
                                to="/objednat"
                                className="px-8 sm:px-10 md:px-12 py-3.5 sm:py-4 md:py-5 neon-gradient text-white rounded-full font-black uppercase tracking-widest transition-all shadow-xl hover:shadow-neon-glow hover:scale-[1.05] active:scale-95 transform will-change-transform text-center text-sm md:text-lg"
                            >
                                Začít trénovat
                            </ReactRouterDom.Link>
                        </div>
                    </div>
                </div>
            </section>

            {/* TEXT BLOCK - positioned to overlap hero bottom edge, aligned with trainer image */}
            {heroText?.enabled && heroText.text && (
                <div 
                    className="absolute z-30 left-4 right-4 sm:left-auto sm:right-4 md:right-[2%] lg:right-[3%] xl:right-[4%] 2xl:right-[5%] w-auto sm:w-[90%] md:w-[44%] lg:w-[41%] xl:w-[39%] 2xl:w-[37%]"
                    style={{
                        // Pozice: polovina výšky bloku pod spodní hranou hero sekce
                        bottom: '0',
                        transform: 'translateY(50%)',
                    }}
                >
                    {/* Text block - clean design without avatar */}
                    <div
                        className="relative backdrop-blur-md border border-white/10 shadow-[0_20px_60px_rgba(0,0,0,0.4)] rounded-2xl sm:rounded-3xl px-5 py-4 sm:px-6 sm:py-5 md:px-7 md:py-6"
                        style={{
                            backgroundColor: hexToRgba(heroText.bgColor || '#1E293B', 0.92),
                            fontFamily: data.appearance.fonts.sans,
                        }}
                    >
                        {/* Decorative accent line */}
                        <div className="w-10 h-1 neon-gradient rounded-full mb-3 md:mb-4"></div>

                        {/* Message text */}
                        <p className="text-white/90 font-medium text-[13px] sm:text-sm md:text-[15px] lg:text-base leading-relaxed">
                            {heroText.text}
                        </p>
                    </div>
                </div>
            )}
        </div>
    );
};

const DetailedServices: React.FC = () => {
    const { data } = useData();
    const services = [...data.services].sort((a, b) => a.order - b.order);

    return (
        <section id="sluzby" className="pt-24 pb-16 sm:pt-32 sm:pb-20 md:pt-40 md:pb-32 bg-surface relative overflow-hidden scroll-mt-20">
            <BlueprintGrid className="opacity-[0.03] grayscale invert" />

            <div className="flex flex-col gap-12 sm:gap-16 md:gap-32 relative z-10">
                {services.map((service, index) => {
                    const isEven = index % 2 === 0;

                    const words = service.title.split(' ');

                    const shadowClass = isEven
                        ? 'shadow-[0_30px_80px_-20px_rgba(0,0,0,0.1),0_15px_40px_-20px_rgba(0,0,0,0.06)] md:shadow-[0_60px_160px_-30px_rgba(0,0,0,0.12),0_30px_80px_-40px_rgba(0,0,0,0.08)]'
                        : 'shadow-[0_15px_30px_-5px_rgba(0,0,0,0.5),0_8px_15px_-8px_rgba(0,0,0,0.4)] md:shadow-[0_30px_60px_-10px_rgba(0,0,0,0.65),0_15px_30px_-15px_rgba(0,0,0,0.5)]';

                    // Logic to handle Czech accusative: "příprava" -> "přípravu"
                    const displayTitle = service.title.endsWith('a')
                        ? service.title.slice(0, -1) + 'u'
                        : service.title;

                    return (
                        <section
                            key={service.id}
                            id={service.id}
                            className={`group w-[96%] sm:w-[94%] lg:w-[92%] max-w-[1300px] relative transition-shadow duration-500 scroll-mt-24 ${shadowClass} ${isEven ? 'mr-auto rounded-r-[1.5rem] sm:rounded-r-[2rem] md:rounded-r-[3rem]' : 'ml-auto rounded-l-[1.5rem] sm:rounded-l-[2rem] md:rounded-l-[3rem]'
                                }`}
                        >
                            <div
                                className={`flex flex-col ${isEven ? 'md:flex-row' : 'md:flex-row-reverse'} min-h-0 md:min-h-[400px] lg:min-h-[480px] bg-surface-light border-none overflow-hidden ${isEven ? 'rounded-r-[1.5rem] sm:rounded-r-[2rem] md:rounded-r-[3rem]' : 'rounded-l-[1.5rem] sm:rounded-l-[2rem] md:rounded-l-[3rem]'
                                    }`}
                                style={{
                                    WebkitMaskImage: '-webkit-radial-gradient(white, black)',
                                    isolation: 'isolate',
                                    contain: 'paint'
                                }}
                            >

                                <div className="w-full md:w-[55%] lg:w-[60%] p-5 sm:p-7 md:p-10 lg:p-14 xl:p-16 flex flex-col relative z-20 bg-surface-light border-none">
                                    <div>
                                        <h2 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl xl:text-5xl font-black uppercase tracking-tighter leading-[1.2] mb-3 sm:mb-4 md:mb-6 text-pretty">
                                            <span className="text-surface-dark">{words[0]}</span>
                                            {words.length > 1 && (
                                                <span className="ms-gradient-text ml-1.5 sm:ml-2 md:ml-3">
                                                    {words.slice(1).join(' ')}
                                                </span>
                                            )}
                                            {service.subheading && (
                                                <span className="block mt-2 sm:mt-4 text-[11px] sm:text-[13px] font-black uppercase tracking-[0.4em] sm:tracking-[0.5em] text-surface-dark/40 leading-none">
                                                    ({service.subheading})
                                                </span>
                                            )}
                                        </h2>

                                        <p className="text-surface-dark/90 font-medium text-[13px] sm:text-sm lg:text-lg leading-relaxed mb-4 sm:mb-6 md:mb-8 max-w-2xl whitespace-pre-line">
                                            {service.description}
                                        </p>

                                        {/* LOKACE A CENÍK */}
                                        {(service.locations?.length || service.prices?.length) && (
                                            <div className="space-y-3 sm:space-y-4 pt-3 sm:pt-4 border-t border-surface-dark/10">
                                                {/* Místa konání */}
                                                {service.locations && service.locations.length > 0 && (
                                                    <div className="flex items-start gap-2 sm:gap-3">
                                                        <span className="text-base sm:text-lg flex-shrink-0">📍</span>
                                                        <div className="flex flex-wrap items-center gap-x-2 gap-y-1 text-xs sm:text-sm font-bold text-surface-dark/70">
                                                            {service.locations.map((loc, locIdx) => {
                                                                // Zpětná kompatibilita - podpora starého formátu (string) i nového (object)
                                                                const locationName = typeof loc === 'string' ? loc : loc.name;
                                                                const locationUrl = typeof loc === 'string' ? undefined : (loc.url && loc.url.trim() !== '' ? loc.url : undefined);
                                                                
                                                                return (
                                                                    <span key={locIdx} className="inline-flex items-center">
                                                                        {locationUrl ? (
                                                                            <a 
                                                                                href={locationUrl}
                                                                                target="_blank"
                                                                                rel="noopener noreferrer"
                                                                                className="cursor-pointer hover:text-surface-dark transition-colors"
                                                                                style={{ pointerEvents: 'auto' }}
                                                                            >
                                                                                {locationName}
                                                                            </a>
                                                                        ) : (
                                                                            <span>{locationName}</span>
                                                                        )}
                                                                        {locIdx < service.locations!.length - 1 && (
                                                                            <span className="mx-1.5 text-surface-dark/30">|</span>
                                                                        )}
                                                                    </span>
                                                                );
                                                            })}
                                                        </div>
                                                    </div>
                                                )}

                                                {/* Ceník */}
                                                {service.prices && service.prices.length > 0 && (
                                                    <div className="flex flex-wrap gap-1.5 sm:gap-2">
                                                        {service.prices.map((p) => (
                                                            <div key={`${service.id}-${p.label}-${p.price}`} className="inline-flex items-center gap-1.5 sm:gap-2 px-2.5 sm:px-4 py-1.5 sm:py-2 bg-surface-dark/5 rounded-full">
                                                                <span className="text-[9px] sm:text-[10px] font-black uppercase tracking-wider text-surface-dark/50">{p.label}</span>
                                                                <span className="text-xs sm:text-sm font-black text-surface-dark">{p.price}</span>
                                                            </div>
                                                        ))}
                                                    </div>
                                                )}
                                            </div>
                                        )}
                                    </div>

                                    <div className="flex flex-wrap items-center gap-4 sm:gap-6 md:gap-10 mt-auto pt-6 sm:pt-8 md:pt-10">
                                        <ReactRouterDom.Link
                                            to={service.ctaTab === 'existing'
                                                ? `/objednat?tab=existing`
                                                : `/objednat?service=${service.id}`}
                                            className="inline-flex items-center gap-3 sm:gap-4 md:gap-5 group/cta w-fit"
                                        >
                                            <div className="w-9 h-9 sm:w-10 sm:h-10 md:w-12 md:h-12 rounded-xl md:rounded-2xl bg-surface-dark text-white flex items-center justify-center border-0 transition-all duration-500 shadow-lg transform group-hover/cta:rotate-12 group-hover/cta:neon-gradient group-hover/cta:shadow-neon-glow group-hover/cta:scale-110">
                                                <svg className="w-3.5 h-3.5 sm:w-4 sm:h-4 md:w-5 md:h-5 transition-transform duration-500 group-hover/cta:translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={3.5}>
                                                    <path strokeLinecap="round" strokeLinejoin="round" d="M14 5l7 7-7 7" />
                                                </svg>
                                            </div>
                                            <span className="text-[9px] sm:text-[10px] md:text-sm font-black uppercase tracking-[0.25em] sm:tracking-[0.3em] ms-gradient-text transition-all duration-500 group-hover/cta:tracking-[0.35em] md:group-hover/cta:tracking-[0.4em]">
                                                Chci {displayTitle.toLowerCase()}
                                            </span>
                                        </ReactRouterDom.Link>
                                    </div>
                                </div>

                                <div className="w-full md:w-[45%] lg:w-[40%] relative overflow-hidden h-[180px] sm:h-[220px] md:h-auto md:min-h-full bg-transparent border-none isolation-isolate" style={{ contain: 'paint' }}>
                                    <img
                                        src={service.imageUrl}
                                        loading="lazy"
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
