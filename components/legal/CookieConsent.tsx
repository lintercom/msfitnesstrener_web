
import React, { useState, useEffect } from 'react';
import { useData } from '../../context/DataProvider';
import * as ReactRouterDom from 'react-router-dom';

const CookieConsent: React.FC = () => {
    const { data } = useData();
    const [isVisible, setIsVisible] = useState(false);

    const config = data.legal?.cookieConsent;

    useEffect(() => {
        if (!config || !config.enabled) return;

        const consent = localStorage.getItem('ms-cookie-consent');
        if (!consent) {
            // Small delay for better UX
            const timer = setTimeout(() => setIsVisible(true), 1500);
            return () => clearTimeout(timer);
        }
    }, [config]);

    const handleAccept = () => {
        localStorage.setItem('ms-cookie-consent', 'accepted');
        setIsVisible(false);
    };

    if (!isVisible || !config || !config.enabled) return null;

    return (
        <div className="fixed inset-x-0 bottom-10 flex justify-center z-[200] px-6 animate-in slide-in-from-bottom-10 duration-500">
            <div className="bg-white rounded-[2.5rem] border border-surface-dark/5 shadow-2xl p-6 md:p-7 flex flex-col md:flex-row items-center gap-6 max-w-2xl relative overflow-hidden group">
                {/* Background Decoration */}
                <div className="absolute -right-4 -top-4 w-24 h-24 bg-neon-gradient opacity-[0.03] rounded-full blur-2xl group-hover:opacity-[0.08] transition-opacity"></div>

                <div className="flex items-start gap-4 relative z-10">
                    <div className="w-10 h-10 rounded-xl bg-orange-50 border border-orange-100 flex items-center justify-center flex-shrink-0 text-neon-orange">
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                    </div>
                    <div>
                        <h4 className="text-sm font-black text-surface-dark uppercase tracking-widest mb-1">Cookies & Soukromí</h4>
                        <p className="text-xs text-surface-dark/60 leading-relaxed">
                            {config.text}
                            {config.linkText && config.linkUrl && (
                                <ReactRouterDom.Link to={config.linkUrl} className="ml-1 text-neon-blaze hover:underline underline-offset-2 font-bold transition-all">
                                    {config.linkText}
                                </ReactRouterDom.Link>
                            )}
                        </p>
                    </div>
                </div>

                <div className="flex gap-3 relative z-10">
                    <button
                        onClick={handleAccept}
                        className="flex-1 px-8 py-3.5 neon-gradient text-white rounded-2xl text-[11px] font-black uppercase tracking-[0.2em] shadow-lg hover:shadow-neon-glow transition-all active:scale-95 whitespace-nowrap"
                    >
                        {config.buttonText || 'Rozumím'}
                    </button>
                    <button
                        onClick={() => setIsVisible(false)}
                        className="px-8 py-3.5 bg-gray-50 text-surface-dark/40 rounded-2xl text-[11px] font-black uppercase tracking-[0.2em] hover:bg-gray-100 hover:text-surface-dark transition-all whitespace-nowrap"
                    >
                        Zavřít
                    </button>
                </div>
            </div>
        </div>
    );
};

export default CookieConsent;
