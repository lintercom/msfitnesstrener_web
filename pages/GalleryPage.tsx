
import React, { useState, useMemo, useEffect } from 'react';
import * as ReactRouterDom from 'react-router-dom';
import { useData } from '../context/DataProvider';
import GalleryModal from '../components/GalleryModal';
import { PageHero, BlueprintGrid } from '../components/PageDecorations';
import SEO from '../components/SEO';

const GalleryPage: React.FC = () => {
    const { data } = useData();
    const [searchTerm, setSearchTerm] = useState<string>('');
    const [selectedItemIndex, setSelectedItemIndex] = useState<number | null>(null);

    const [searchParams] = ReactRouterDom.useSearchParams();

    const filteredItems = useMemo(() => {
        return data.gallery.filter(item => {
            return searchTerm === '' ||
                item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                item.description.toLowerCase().includes(searchTerm.toLowerCase());
        });
    }, [data.gallery, searchTerm]);

    useEffect(() => {
        const projectId = searchParams.get('project');
        if (projectId && filteredItems.length > 0) {
            const index = filteredItems.findIndex(item => item.id === projectId);
            if (index !== -1) {
                setSelectedItemIndex(index);
            }
        }
    }, [searchParams, filteredItems]);

    const handleCloseModal = () => {
        setSelectedItemIndex(null);
    };

    return (
        <div className="bg-background min-h-screen">
            <SEO
                title={data.seo.gallery.title}
                description={data.seo.gallery.description}
                keywords={data.seo.gallery.keywords}
            />
            <PageHero
                titlePart1={data.pageHeroes.gallery.titlePart1}
                titlePart2Accent={data.pageHeroes.gallery.titlePart2Accent}
                description=""
                subTitle={data.pageHeroes.gallery.description}
            />

            <div className="bg-surface pt-20 pb-20 md:pt-32 md:pb-32 relative overflow-hidden">
                <BlueprintGrid className="opacity-[0.03] grayscale invert" />

                <div className="container mx-auto px-6 relative z-10">
                    {/* Grid layout ensures uniform height for all cards in a row */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 gap-y-16 md:gap-y-24 lg:gap-y-32">
                        {filteredItems.map((item, index) => {
                            return (
                                <div
                                    key={item.id}
                                    className="group relative flex flex-col bg-surface-light rounded-card overflow-hidden transition-all duration-700 cursor-pointer shadow-premium hover:shadow-premium-hover h-full"
                                    onClick={() => setSelectedItemIndex(index)}
                                >
                                    {/* Image Container - No padding, flush to edges */}
                                    <div className="relative aspect-[4/3] overflow-hidden bg-gray-100 flex-shrink-0">
                                        <div className="absolute top-4 left-4 w-6 h-6 border-t-2 border-l-2 border-white/20 z-20 group-hover:border-[#F43F5E] transition-colors"></div>
                                        <div className="absolute bottom-4 right-4 w-6 h-6 border-b-2 border-r-2 border-white/20 z-20 group-hover:border-[#F43F5E] transition-colors"></div>

                                        <img
                                            src={item.imageUrls[0]}
                                            alt={item.title}
                                            className="w-full h-full object-cover grayscale-[0.2] brightness-95 transition-all duration-1000 group-hover:grayscale-0 group-hover:brightness-105 group-hover:scale-110"
                                        />

                                        <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent opacity-60 group-hover:opacity-20 transition-opacity"></div>
                                    </div>

                                    <div className="p-10 flex flex-col flex-grow relative bg-surface-light">
                                        <div className="w-12 h-1 bg-surface-dark/5 mb-6 group-hover:w-full group-hover:neon-gradient transition-all duration-700 rounded-full"></div>

                                        <div className="flex flex-col gap-1 mb-6">
                                            <h3 className="text-2xl font-black uppercase tracking-tighter text-surface-dark group-hover:ms-gradient-text transition-colors leading-[0.9]">
                                                {item.title}
                                            </h3>
                                        </div>

                                        <p className="text-surface-dark/75 font-medium text-base line-clamp-3 mb-10 leading-relaxed">
                                            {item.description}
                                        </p>

                                        <div className="mt-auto pt-8 border-t border-surface-dark/5 flex items-center gap-4 group/action">
                                            <div
                                                className="w-10 h-10 md:w-12 md:h-12 rounded-xl md:rounded-2xl bg-surface-dark text-white flex items-center justify-center border border-surface-dark/10 transition-all duration-500 shadow-lg transform group-hover/action:rotate-6 group-hover/action:neon-gradient group-hover/action:shadow-neon-glow group-hover/action:border-transparent"
                                            >
                                                <svg className="w-5 h-5 transition-transform duration-500 group-hover/action:translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={3}>
                                                    <path strokeLinecap="round" strokeLinejoin="round" d="M14 5l7 7-7 7" />
                                                </svg>
                                            </div>
                                            <span className="text-[10px] md:text-sm font-black uppercase tracking-[0.2em] ms-gradient-text transition-all duration-500 group-hover/action:tracking-[0.3em]">
                                                ZOBRAZIT PŘÍBĚH
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>
            </div>
            {selectedItemIndex !== null && (
                <GalleryModal
                    item={filteredItems[selectedItemIndex]}
                    onClose={handleCloseModal}
                    source="gallery"
                    items={filteredItems}
                    currentIndex={selectedItemIndex}
                    onNavigate={setSelectedItemIndex}
                    filterContext={null}
                />
            )}
        </div>
    );
};

export default GalleryPage;
