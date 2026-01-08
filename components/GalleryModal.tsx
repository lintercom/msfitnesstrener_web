
import React, { useState, useEffect } from 'react';
import * as ReactRouterDom from 'react-router-dom';
import { GalleryItem } from '../types';
import { useData } from '../context/DataProvider';

interface GalleryModalProps {
  item: GalleryItem;
  onClose: () => void;
  source?: 'home' | 'gallery';
  items?: GalleryItem[];
  currentIndex?: number;
  onNavigate?: (newIndex: number) => void;
  filterContext?: string | null;
}

const GalleryModal: React.FC<GalleryModalProps> = ({ 
    item, 
    onClose, 
    source = 'home',
    items = [],
    currentIndex = 0,
    onNavigate,
}) => {
    const { data } = useData();
    const [isVisible, setIsVisible] = useState(false);
    const [currentImageIndex, setCurrentImageIndex] = useState(0);
    const hasMultipleImages = item.imageUrls.length > 1;
    const canNavigateItems = items.length > 1 && !!onNavigate;

    const getServiceTypeParam = (serviceId: string) => {
        switch (serviceId) {
            case 's1': return 'coaching';
            case 's2': return 'mentoring';
            case 's3': return 'nutrition';
            case 's4': return 'transformation';
            default: return 'coaching';
        }
    };

    const primaryServiceParam = item.serviceIds && item.serviceIds.length > 0 
        ? getServiceTypeParam(item.serviceIds[0]) 
        : 'coaching';

    useEffect(() => {
        setCurrentImageIndex(0);
    }, [item.id]);

    const handleClose = () => {
        setIsVisible(false);
        setTimeout(onClose, 500);
    };

    const handleNavigateCards = (direction: 'next' | 'prev', e: React.MouseEvent) => {
        e.stopPropagation();
        if (!onNavigate || items.length === 0) return;
        
        let newIndex;
        if (direction === 'next') {
            newIndex = (currentIndex + 1) % items.length;
        } else {
            newIndex = (currentIndex - 1 + items.length) % items.length;
        }
        onNavigate(newIndex);
    };

    const goToNextImage = (e?: React.MouseEvent) => {
        e?.stopPropagation();
        setCurrentImageIndex((prevIndex) => (prevIndex + 1) % item.imageUrls.length);
    };

    const goToPreviousImage = (e?: React.MouseEvent) => {
        e?.stopPropagation();
        setCurrentImageIndex((prevIndex) => (prevIndex - 1 + item.imageUrls.length) % item.imageUrls.length);
    };

    useEffect(() => {
        const timer = setTimeout(() => setIsVisible(true), 10);
        // Lock body scroll
        document.body.style.overflow = 'hidden';
        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key === 'Escape') handleClose();
            if (e.key === 'ArrowRight') goToNextImage();
            if (e.key === 'ArrowLeft') goToPreviousImage();
        };
        window.addEventListener('keydown', handleKeyDown);
        return () => {
            window.removeEventListener('keydown', handleKeyDown);
            document.body.style.overflow = 'auto';
            clearTimeout(timer);
        };
    }, [item, currentIndex, items, currentImageIndex]);

    return (
        <div 
            className={`fixed inset-0 bg-background/95 backdrop-blur-2xl flex items-center justify-center z-[200] md:p-10 transition-all duration-500 ${isVisible ? 'opacity-100' : 'opacity-0'}`} 
            onClick={handleClose}
        >
            <div 
                className={`bg-surface-light md:border md:border-surface-dark/10 md:rounded-[3rem] w-full max-w-[1440px] h-full md:max-h-[75vh] overflow-hidden flex flex-col md:flex-row shadow-[0_40px_100px_rgba(0,0,0,0.6)] transform transition-all duration-500 cubic-bezier(0.4, 0, 0.2, 1) ${isVisible ? 'scale-100 translate-y-0 opacity-100' : 'scale-95 translate-y-8 opacity-0'}`} 
                onClick={e => e.stopPropagation()}
            >
                
                {/* IMAGE PANEL (ORDER 1 on Mobile) - Full edge-to-edge width */}
                <div className="h-[40vh] md:h-auto md:w-[60%] relative bg-black flex flex-col items-center justify-center overflow-hidden border-b md:border-b-0 md:border-r border-surface-dark/5 order-1">
                    <div className="relative w-full h-full flex items-center justify-center">
                        <img 
                            key={item.imageUrls[currentImageIndex]}
                            src={item.imageUrls[currentImageIndex]} 
                            alt={item.title} 
                            className="w-full h-full object-contain transition-transform duration-700" 
                        />
                        
                        {hasMultipleImages && (
                            <>
                                <button 
                                    onClick={goToPreviousImage} 
                                    className="absolute left-6 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-black/40 backdrop-blur-md text-white flex items-center justify-center border border-white/10 active:bg-neon-pink transition-all z-30 hover:scale-110" 
                                >
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}><path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" /></svg>
                                </button>
                                <button 
                                    onClick={goToNextImage} 
                                    className="absolute right-6 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-black/40 backdrop-blur-md text-white flex items-center justify-center border border-white/10 active:bg-neon-pink transition-all z-30 hover:scale-110" 
                                >
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}><path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" /></svg>
                                </button>
                            </>
                        )}
                    </div>

                    {hasMultipleImages && (
                        <div className="absolute bottom-6 flex flex-col items-center gap-3 z-30">
                            <div className="flex gap-2.5">
                                {item.imageUrls.map((_, idx) => (
                                    <button
                                        key={idx}
                                        onClick={(e) => { e.stopPropagation(); setCurrentImageIndex(idx); }}
                                        className={`h-1 rounded-full transition-all duration-500 ${idx === currentImageIndex ? 'bg-neon-pink w-8 shadow-neon-glow' : 'bg-white/30 w-2'}`}
                                    />
                                ))}
                            </div>
                        </div>
                    )}
                </div>

                {/* CONTENT PANEL (ORDER 2 on Mobile) */}
                <div className="flex-grow md:w-[40%] flex flex-col bg-surface-light relative order-2 overflow-hidden">
                    {/* Header with Navigation and Close */}
                    <div className="px-6 py-5 md:p-10 md:pb-4 flex justify-between items-center relative z-20 border-b md:border-b-0 border-gray-50">
                        <div className="flex items-center gap-2">
                            {canNavigateItems && (
                                <div className="flex items-center bg-surface-dark/[0.03] rounded-full border border-surface-dark/5 p-0.5">
                                    <button 
                                        onClick={(e) => handleNavigateCards('prev', e)} 
                                        className="w-10 h-10 md:w-9 md:h-9 rounded-full text-surface-dark/30 hover:text-surface-dark flex items-center justify-center transition-all"
                                    >
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}><path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" /></svg>
                                    </button>
                                    <button 
                                        onClick={(e) => handleNavigateCards('next', e)} 
                                        className="w-10 h-10 md:w-9 md:h-9 rounded-full text-surface-dark/30 hover:text-surface-dark flex items-center justify-center transition-all"
                                    >
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}><path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" /></svg>
                                    </button>
                                </div>
                            )}
                        </div>
                        <button 
                            onClick={handleClose} 
                            className="w-10 h-10 md:w-9 md:h-9 rounded-full border border-surface-dark/5 bg-surface-dark/5 text-surface-dark/40 flex items-center justify-center hover:bg-surface-dark hover:text-white transition-all"
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 md:h-4 md:w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}><path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" /></svg>
                        </button>
                    </div>

                    <div className="flex-grow overflow-y-auto custom-scrollbar px-6 md:px-10 pb-6 pt-4">
                        <h2 className="text-3xl md:text-5xl font-black text-surface-dark uppercase tracking-tighter leading-tight mb-4">{item.title}</h2>
                        <div className="w-10 h-1 neon-gradient rounded-full mb-6 opacity-60"></div>
                        <div className="space-y-4">
                            <p className="text-surface-dark/70 text-base md:text-lg leading-relaxed font-medium">
                                {item.description}
                            </p>
                        </div>
                        
                        {item.printTime && (
                            <div className="mt-8">
                                <div className="p-5 md:p-6 bg-gray-50 rounded-[1.5rem] inline-block min-w-[180px] border border-surface-dark/5">
                                    <span className="block text-[9px] md:text-[10px] font-black uppercase tracking-[0.4em] text-surface-dark/30 mb-1">Doba trvání</span>
                                    <span className="text-base md:text-lg font-black text-surface-dark uppercase tracking-tighter leading-none block">{item.printTime}</span>
                                </div>
                            </div>
                        )}
                    </div>

                    <div className="p-6 md:p-10 border-t border-surface-dark/5 bg-surface-light">
                        <ReactRouterDom.Link
                            to={`/objednat?service=${primaryServiceParam}`}
                            onClick={handleClose}
                            className="inline-flex items-center justify-center w-full px-8 py-4 md:py-5 neon-gradient text-white text-sm md:text-base font-black uppercase tracking-widest rounded-full shadow-lg hover:shadow-neon-glow hover:scale-[1.05] active:scale-95 transform will-change-transform transition-all"
                        >
                            Začít svůj příběh
                        </ReactRouterDom.Link>
                    </div>
                </div>
            </div>

            <style dangerouslySetInnerHTML={{ __html: `
                .custom-scrollbar::-webkit-scrollbar { width: 2px; }
                .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
                .custom-scrollbar::-webkit-scrollbar-thumb { background: rgba(15, 23, 42, 0.05); }
            `}} />
        </div>
    );
};

export default GalleryModal;
