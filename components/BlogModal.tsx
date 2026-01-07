
import React, { useState, useEffect } from 'react';
import * as ReactRouterDom from 'react-router-dom';
import { BlogPost } from '../types';
import { BlueprintGrid } from './PageDecorations';

interface BlogModalProps {
  post: BlogPost;
  posts: BlogPost[];
  currentIndex: number;
  onClose: () => void;
  onNavigate: (newIndex: number) => void;
}

const BlogModal: React.FC<BlogModalProps> = ({ 
    post, 
    posts, 
    currentIndex, 
    onClose, 
    onNavigate 
}) => {
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        // Krátká prodleva pro zajištění startu animace po mountu
        const timer = setTimeout(() => setIsVisible(true), 10);
        document.body.style.overflow = 'hidden';
        
        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key === 'Escape') handleClose();
            if (e.key === 'ArrowRight') handleNavigate('next');
            if (e.key === 'ArrowLeft') handleNavigate('prev');
        };
        window.addEventListener('keydown', handleKeyDown);
        return () => {
            window.removeEventListener('keydown', handleKeyDown);
            document.body.style.overflow = 'auto';
            clearTimeout(timer);
        };
    }, [currentIndex]);

    const handleClose = () => {
        setIsVisible(false);
        // Čas musí přesně odpovídat duration-500 v CSS
        setTimeout(onClose, 500);
    };

    const handleNavigate = (direction: 'next' | 'prev') => {
        let newIndex;
        if (direction === 'next') {
            newIndex = (currentIndex + 1) % posts.length;
        } else {
            newIndex = (currentIndex - 1 + posts.length) % posts.length;
        }
        onNavigate(newIndex);
    };

    return (
        <div 
            className={`fixed inset-0 z-[200] flex items-center justify-center transition-all duration-500 ${isVisible ? 'opacity-100' : 'opacity-0'}`}
            onClick={handleClose}
        >
            {/* Backdrop Blur */}
            <div className={`absolute inset-0 bg-background transition-opacity duration-500 ${isVisible ? 'opacity-100' : 'opacity-0'}`}></div>

            {/* Full-Page Article Container */}
            <div 
                className={`relative w-full h-full bg-surface-light shadow-2xl flex flex-col md:flex-row overflow-hidden transform transition-all duration-500 cubic-bezier(0.4, 0, 0.2, 1) ${isVisible ? 'scale-100 translate-y-0 opacity-100' : 'scale-95 translate-y-8 opacity-0'}`}
                onClick={e => e.stopPropagation()}
            >
                {/* Left Artistic Spine (22% width, full height) */}
                <div className="hidden md:block md:w-[22%] h-full relative overflow-hidden bg-background border-r border-white/5">
                    <BlueprintGrid className="opacity-[0.1]" />
                    
                    <div className="absolute inset-0 bg-gradient-to-br from-neon-blaze/20 via-transparent to-neon-pink/10 z-10 opacity-60"></div>
                    <div className="absolute inset-0 bg-surface-dark/40 z-10"></div>
                    
                    <img 
                        src={post.imageUrl} 
                        className="w-full h-full object-cover grayscale opacity-60 scale-150 origin-center transition-all duration-1000 blur-[2px]" 
                        alt="" 
                    />

                    {/* Vertical Metadata Bar with Fixed Identity Text */}
                    <div className="absolute inset-y-0 left-0 w-16 md:w-24 flex flex-col justify-between items-center py-24 z-20 border-r border-white/5">
                        <span className="text-white/20 text-[9px] font-black uppercase tracking-[0.6em] rotate-180 [writing-mode:vertical-lr] whitespace-nowrap">
                            MARTIN ŠŤASTNÝ
                        </span>
                        <div className="w-px h-32 neon-gradient opacity-30"></div>
                        <span className="text-white/40 text-[10px] font-black uppercase tracking-[0.7em] [writing-mode:vertical-lr] whitespace-nowrap">
                            FITNESS COACH
                        </span>
                    </div>
                </div>

                {/* Main Content Area */}
                <div className="flex-grow flex flex-col overflow-hidden bg-surface-light md:w-[78%]">
                    {/* Integrated Header - Full Width Stickiness */}
                    <div className="px-6 md:px-16 py-6 border-b border-surface-dark/5 flex justify-between items-center relative z-20 bg-surface-light/80 backdrop-blur-md">
                        <div className="flex items-center gap-8">
                            <ReactRouterDom.Link 
                                to="/" 
                                onClick={handleClose}
                                className="hidden lg:block group"
                            >
                                <span className="text-[10px] font-black text-surface-dark/30 group-hover:text-neon-pink transition-colors uppercase tracking-[0.4em]">Zpět na web</span>
                            </ReactRouterDom.Link>
                            <div className="hidden lg:block h-4 w-px bg-surface-dark/10"></div>
                            <span className="ms-gradient-text text-[10px] font-black uppercase tracking-[0.4em]">
                                {post.date} / {post.readTime}
                            </span>
                        </div>

                        <div className="flex items-center gap-6">
                            {/* Inner Navigation */}
                            <div className="flex items-center bg-gray-50 rounded-full border border-gray-100 p-1">
                                <button 
                                    onClick={() => handleNavigate('prev')} 
                                    className="w-12 h-12 rounded-full text-surface-dark/30 hover:text-surface-dark hover:bg-surface-light flex items-center justify-center transition-all"
                                    title="Předchozí článek"
                                >
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}><path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" /></svg>
                                </button>
                                <button 
                                    onClick={() => handleNavigate('next')} 
                                    className="w-12 h-12 rounded-full text-surface-dark/30 hover:text-surface-dark hover:bg-surface-light flex items-center justify-center transition-all"
                                    title="Další článek"
                                >
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}><path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" /></svg>
                                </button>
                            </div>

                            <button 
                                onClick={handleClose} 
                                className="w-14 h-14 rounded-full bg-surface-dark text-white flex items-center justify-center hover:neon-gradient hover:shadow-neon-glow transition-all active:scale-90 shadow-xl"
                                title="Zavřít článek"
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3.5}><path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" /></svg>
                            </button>
                        </div>
                    </div>

                    {/* Content Scroll Area */}
                    <div className="flex-grow overflow-y-auto custom-scrollbar bg-surface-light scroll-smooth">
                        <div className="max-w-4xl mx-auto px-6 md:px-12 py-12 md:py-24 lg:py-32">
                            {/* Titulek */}
                            <h1 className="text-4xl md:text-6xl font-black text-surface-dark uppercase tracking-tighter leading-[0.95] mb-10">
                                {post.title}
                            </h1>

                            <div className="prose prose-slate max-w-none">
                                {/* Perex */}
                                <p className="text-xl md:text-2xl text-surface-dark/80 font-bold mb-14 leading-tight italic border-l-8 border-neon-blaze/20 pl-8">
                                    {post.excerpt}
                                </p>
                                
                                {/* Obsah článku */}
                                <div className="text-surface-dark/70 text-lg md:text-xl leading-relaxed space-y-10 font-medium pb-20">
                                    {post.content.split('\n').map((para, i) => (
                                        para.trim() ? <p key={i}>{para}</p> : null
                                    ))}
                                </div>
                            </div>

                            {/* Zjednodušená patička - Tlačítko VYZKOUŠET */}
                            <div className="mt-12 py-20 border-t border-surface-dark/5 flex flex-col items-center">
                                <div className="w-16 h-1 neon-gradient rounded-full mb-12 opacity-30"></div>
                                <ReactRouterDom.Link 
                                    to="/objednat"
                                    onClick={handleClose}
                                    className="px-20 py-6 neon-gradient text-white rounded-full font-black uppercase tracking-[0.2em] shadow-2xl hover:shadow-neon-glow hover:scale-[1.05] active:scale-95 transition-all text-base min-w-[300px] text-center"
                                >
                                    VYZKOUŠET
                                </ReactRouterDom.Link>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <style dangerouslySetInnerHTML={{ __html: `
                .custom-scrollbar::-webkit-scrollbar { width: 6px; }
                .custom-scrollbar::-webkit-scrollbar-track { background: #f8fafc; }
                .custom-scrollbar::-webkit-scrollbar-thumb { background: #0F172A; border-radius: 0px; }
                .custom-scrollbar::-webkit-scrollbar-thumb:hover { background: #FB923C; }
            `}} />
        </div>
    );
};

export default BlogModal;
