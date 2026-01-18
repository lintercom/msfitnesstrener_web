
import React, { useState, useEffect, useMemo } from 'react';
import * as ReactRouterDom from 'react-router-dom';
import Header from '../Header';
import Footer from '../Footer';
import { useData } from '../../context/DataProvider';
import Logo from '../Logo';
import CookieConsent from '../legal/CookieConsent';
import Analytics from '../Analytics';

const LoadingSpinner: React.FC = () => (
    <div className="fixed inset-0 bg-background flex flex-col items-center justify-center z-[200]">
        <div className="animate-pulse mb-4">
            <Logo className="h-16 w-auto" variant="light" />
        </div>
        <div className="w-16 h-1 bg-white/10 rounded-full overflow-hidden mt-4">
            <div className="w-full h-full bg-neon-gradient animate-[loading_1.5s_infinite_ease-in-out]"></div>
        </div>
    </div>
);

const DynamicStyles: React.FC = () => {
    const { data } = useData();
    const { appearance, localization } = data;

    const styles = useMemo(() => `
        :root {
          --color-background: ${appearance.colors.background};
          --color-surface: ${appearance.colors.surface};
          --color-primary-text: ${appearance.colors.primaryText};
          --color-secondary-text: ${appearance.colors.secondaryText};
          --color-accent: ${appearance.colors.accent};
          --color-accent-hover: ${appearance.colors.accentHover};
          --color-border: ${appearance.colors.border};
          --color-footer-bg: ${appearance.colors.footerBg};
          --color-footer-text: ${appearance.colors.footerText};
          --color-footer-text-secondary: ${appearance.colors.footerTextSecondary};

          --font-sans: ${appearance.fonts.sans};
          --font-heading: ${appearance.fonts.heading};

          --radius-global: ${appearance.components.globalRadius};
          --shadow-global: ${appearance.components.globalShadow};
          
          --layout-base-font-size: ${appearance.layout.baseFontSize};
          --layout-content-max-width: ${appearance.layout.contentMaxWidth};
        }

        @keyframes loading {
          0% { transform: translateX(-100%); }
          50% { transform: translateX(0); }
          100% { transform: translateX(100%); }
        }
    `, [appearance]);

    useEffect(() => {
        document.documentElement.lang = localization.defaultLang;
        const styleId = 'dynamic-app-styles';
        let styleTag = document.getElementById(styleId) as HTMLStyleElement;
        if (!styleTag) {
            styleTag = document.createElement('style');
            styleTag.id = styleId;
            document.head.appendChild(styleTag);
        }
        if (styleTag.innerHTML !== styles) {
            styleTag.innerHTML = styles;
        }
    }, [styles, localization.defaultLang]);

    return null;
}

const FloatingControls: React.FC = () => {
    const [isScrollVisible, setIsScrollVisible] = useState(false);
    const [isOverFooter, setIsOverFooter] = useState(false);
    const [windowWidth, setWindowWidth] = useState(typeof window !== 'undefined' ? window.innerWidth : 1200);
    const location = ReactRouterDom.useLocation();
    const isHomePage = location.pathname === '/';

    useEffect(() => {
        const handleResize = () => setWindowWidth(window.innerWidth);
        const handleScroll = () => {
            const scrollPos = window.scrollY;
            setIsScrollVisible(scrollPos > 400);

            const footer = document.querySelector('footer');
            if (footer) {
                const footerRect = footer.getBoundingClientRect();
                setIsOverFooter(footerRect.top < window.innerHeight - 80);
            }
        };

        window.addEventListener('resize', handleResize);
        window.addEventListener('scroll', handleScroll, { passive: true });
        handleScroll();
        return () => {
            window.removeEventListener('resize', handleResize);
            window.removeEventListener('scroll', handleScroll);
        };
    }, []);

    const scrollToTop = () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    const offset = windowWidth < 768 ? 80 : 100;

    return (
        <div className="fixed bottom-8 right-8 md:bottom-10 md:right-10 z-[60] flex flex-col items-center">
            {/* Tlačítko Domů */}
            {!isHomePage && (
                <ReactRouterDom.Link
                    to="/"
                    style={{
                        transform: isScrollVisible
                            ? `translateY(-${offset}px)`
                            : 'translateY(0)'
                    }}
                    className={`absolute bottom-0 w-16 h-16 md:w-20 md:h-20 rounded-full flex items-center justify-center transition-all duration-500 ease-[cubic-bezier(0.25,1,0.5,1)] group shadow-xl ${isOverFooter ? 'shadow-neon-glow' : 'hover:shadow-neon-glow'} transform-gpu`}
                >
                    <div className="absolute inset-0 bg-background/80 backdrop-blur-md border border-white/5 group-hover:border-transparent transition-colors duration-500 rounded-full"></div>
                    <div className={`absolute inset-0 neon-gradient transition-opacity duration-500 rounded-full ${isOverFooter ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'
                        }`}></div>

                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-8 w-8 md:h-9 md:w-9 text-white relative z-10 transition-transform duration-500 group-hover:scale-110"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                        strokeWidth={2}
                    >
                        <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 12l8.954-8.955c.44-.439 1.152-.439 1.591 0L21.75 12M4.5 9.75v10.125c0 .621.504 1.125 1.125 1.125H9.75v-4.875c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21h4.125c.621 0 1.125-.504 1.125-1.125V9.75M8.25 21h8.25" />
                    </svg>
                </ReactRouterDom.Link>
            )}

            {/* Tlačítko Rolovat nahoru */}
            <button
                type="button"
                onClick={scrollToTop}
                className={`w-16 h-16 md:w-20 md:h-20 rounded-full flex items-center justify-center transition-all duration-500 ease-in-out transform-gpu ${isScrollVisible ? 'opacity-100 scale-100 translate-y-0' : 'opacity-0 scale-50 translate-y-4 pointer-events-none'
                    } group shadow-xl ${isOverFooter ? 'shadow-neon-glow' : 'hover:shadow-neon-glow'}`}
            >
                <div className="absolute inset-0 bg-background/80 backdrop-blur-md border border-white/5 group-hover:border-transparent transition-colors duration-500 rounded-full"></div>

                <div className={`absolute inset-0 neon-gradient transition-opacity duration-500 rounded-full ${isOverFooter ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'
                    }`}></div>

                <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className={`h-8 w-8 md:h-9 md:w-9 text-white relative z-10 transition-transform duration-500 ${isOverFooter ? '-translate-y-0.5 scale-110' : 'group-hover:-translate-y-1'}`}
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth={2}
                >
                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 15l7-7 7 7" />
                </svg>
            </button>
        </div>
    );
};

const MainLayout: React.FC = () => {
    const { loading } = useData();

    if (loading) return <LoadingSpinner />;

    return (
        <div className="bg-background text-primary-text font-sans flex flex-col min-h-screen relative overflow-x-hidden">
            <DynamicStyles />
            <Analytics />
            <Header />
            <main className="flex-grow isolation-auto">
                <ReactRouterDom.Outlet />
            </main>
            <Footer />
            <FloatingControls />
            <CookieConsent />
        </div>
    );
};

export default MainLayout;
