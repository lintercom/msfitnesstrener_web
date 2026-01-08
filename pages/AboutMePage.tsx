
import React from 'react';
import { useData } from '../context/DataProvider';
import { PageHero, BlueprintGrid } from '../components/PageDecorations';
import * as ReactRouterDom from 'react-router-dom';
import SEO from '../components/SEO';

const AboutMePage: React.FC = () => {
    const { data } = useData();

    // Rozdělení textu na odstavce pro lepší formátování
    const bioParagraphs = (data.general.heroText || '').split('\n').filter(p => p.trim() !== '');

    return (
        <div className="bg-background min-h-screen">
            <SEO
                title={data.seo.aboutMe.title}
                description={data.seo.aboutMe.description}
                keywords={data.seo.aboutMe.keywords}
            />
            <PageHero
                titlePart1={data.pageHeroes.aboutMe.titlePart1}
                titlePart2Accent={data.pageHeroes.aboutMe.titlePart2Accent}
                description=""
                subTitle={data.pageHeroes.aboutMe.description}
            />

            <div className="bg-surface pt-20 pb-20 md:pt-32 md:pb-32 relative overflow-hidden">
                <BlueprintGrid className="opacity-[0.03] grayscale invert" />

                <div className="w-full px-4 md:px-8 lg:px-12 relative z-10">
                    <div className="max-w-[1600px] mx-auto bg-surface-light rounded-[3rem] lg:rounded-[4rem] shadow-premium overflow-hidden transition-all duration-500">

                        <div className="flex flex-col lg:flex-row">
                            {/* Visual Side */}
                            <div className="lg:w-[35%] relative min-h-[500px] lg:min-h-0 bg-gray-50">
                                {data.general.heroImage ? (
                                    <img
                                        src={data.general.heroImage}
                                        className="absolute inset-0 w-full h-full object-cover grayscale opacity-90"
                                        alt={data.general.companyName}
                                    />
                                ) : (
                                    <div className="absolute inset-0 flex items-center justify-center bg-gray-200">
                                        <span className="text-surface-dark/10 font-black uppercase tracking-widest">Photo Missing</span>
                                    </div>
                                )}
                                <div className="absolute inset-0 bg-gradient-to-t from-white/20 via-transparent to-transparent"></div>
                            </div>

                            {/* Content Side */}
                            <div className="lg:w-[65%] p-8 md:p-16 lg:p-20 xl:p-28 flex flex-col justify-center">
                                <div className="mb-0">
                                    <h2 className="text-3xl md:text-5xl lg:text-5xl xl:text-6xl font-black text-surface-dark uppercase tracking-tighter leading-tight mb-12">
                                        Víc než jen <span className="ms-gradient-text">TRÉNINK</span>
                                    </h2>

                                    <div className="w-24 h-1.5 neon-gradient rounded-full mb-12"></div>

                                    <div className="prose prose-slate max-w-4xl space-y-8 mb-12">
                                        {bioParagraphs.length > 0 ? (
                                            <>
                                                {/* První odstavec jako zvýrazněný intro */}
                                                <p className="text-xl md:text-2xl text-surface-dark/90 font-bold leading-tight italic border-l-8 border-neon-blaze/20 pl-8">
                                                    {bioParagraphs[0]}
                                                </p>

                                                {/* Zbytek textu */}
                                                {bioParagraphs.slice(1).map((para, i) => (
                                                    <p key={i} className="text-base md:text-lg lg:text-xl text-surface-dark/75 leading-relaxed font-medium">
                                                        {para}
                                                    </p>
                                                ))}
                                            </>
                                        ) : (
                                            <p className="text-surface-dark/40 italic">Obsah životopisu zatím nebyl přidán v administraci.</p>
                                        )}
                                    </div>

                                    {/* Direct CTA Button after Biography */}
                                    <div className="flex items-center pt-8 border-t border-surface-dark/5">
                                        <ReactRouterDom.Link
                                            to="/objednat"
                                            className="px-12 py-5 neon-gradient text-white rounded-full text-[11px] font-black uppercase tracking-[0.4em] shadow-xl hover:shadow-neon-glow hover:scale-105 transition-all text-center"
                                        >
                                            ZAČÁTEK SPOLUPRÁCE
                                        </ReactRouterDom.Link>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AboutMePage;
