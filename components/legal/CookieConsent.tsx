import React, { useState, useEffect } from 'react';
import { useData } from '../../context/DataProvider';
import * as ReactRouterDom from 'react-router-dom';

type CookieCategory = 'necessary' | 'analytics' | 'marketing' | 'preferences';

interface CookiePreferences {
    necessary: boolean;
    analytics: boolean;
    marketing: boolean;
    preferences: boolean;
}

const CookieConsent: React.FC = () => {
    const { data } = useData();
    const [isVisible, setIsVisible] = useState(false);
    const [showDetails, setShowDetails] = useState(false);

    // Default settings: necessary always true, others false
    const [preferences, setPreferences] = useState<CookiePreferences>({
        necessary: true,
        analytics: false,
        marketing: false,
        preferences: false
    });

    const config = data.legal?.cookieConsent;

    // Event listener for reopening settings
    useEffect(() => {
        const handleOpenSettings = () => {
            setIsVisible(true);
            setShowDetails(true);
        };

        window.addEventListener('open-cookie-settings', handleOpenSettings);
        return () => window.removeEventListener('open-cookie-settings', handleOpenSettings);
    }, []);

    useEffect(() => {
        if (!config || !config.enabled) return;

        // Check if user has already made a choice
        const storedConsent = localStorage.getItem('ms-cookie-consent-settings');
        if (!storedConsent) {
            // Check for legacy single-string consent and migrate if possible, otherwise show banner
            const legacyConsent = localStorage.getItem('ms-cookie-consent');
            if (legacyConsent === 'accepted') {
                // If previously accepted all (legacy), map to all true
                setPreferences({
                    necessary: true,
                    analytics: true,
                    marketing: true,
                    preferences: true
                });
                // But still might want to confirm? 
                // Let's treat legacy 'accepted' as 'Accept All' for now and save it in new format, 
                // so banner doesn't show up again.
                localStorage.setItem('ms-cookie-consent-settings', JSON.stringify({
                    necessary: true,
                    analytics: true,
                    marketing: true,
                    preferences: true
                }));
                return;
            }

            // Small delay for better UX
            const timer = setTimeout(() => setIsVisible(true), 1500);
            return () => clearTimeout(timer);
        } else {
            // Already configured
            try {
                setPreferences(JSON.parse(storedConsent));
            } catch (e) {
                // Error parsing, show banner
                setIsVisible(true);
            }
        }
    }, [config]);

    const savePreferences = (prefs: CookiePreferences) => {
        localStorage.setItem('ms-cookie-consent-settings', JSON.stringify(prefs));
        localStorage.setItem('ms-cookie-consent', 'accepted'); // Keep legacy for compatibility just in case
        setPreferences(prefs);
        setIsVisible(false);

        // Trigger window event if other scripts need to know
        window.dispatchEvent(new CustomEvent('cookie-consent-updated', { detail: prefs }));
    };

    const handleAcceptAll = () => {
        savePreferences({
            necessary: true,
            analytics: true,
            marketing: true,
            preferences: true
        });
    };

    const handleAcceptNecessary = () => {
        savePreferences({
            necessary: true,
            analytics: false,
            marketing: false,
            preferences: false
        });
    };

    const handleSaveSelected = () => {
        savePreferences(preferences);
    };

    const togglePreference = (category: CookieCategory) => {
        if (category === 'necessary') return; // Cannot toggle necessary
        setPreferences(prev => ({
            ...prev,
            [category]: !prev[category]
        }));
    };

    if (!isVisible || !config || !config.enabled) return null;

    return (
        <div className="fixed inset-x-0 bottom-0 sm:bottom-6 flex justify-center z-[200] sm:px-6 animate-in slide-in-from-bottom-10 duration-500">
            <div className={`bg-white sm:rounded-[2rem] border-t sm:border border-surface-dark/5 shadow-2xl p-6 md:p-8 flex flex-col gap-6 max-w-4xl relative overflow-hidden transition-all duration-300 ${showDetails ? 'w-full' : 'md:flex-row md:items-center'}`}>

                {/* Background Decoration */}
                <div className="absolute -right-20 -top-20 w-64 h-64 bg-neon-gradient opacity-[0.03] rounded-full blur-3xl pointer-events-none"></div>

                {/* Main Content Area */}
                <div className="flex-1 relative z-10 flex gap-5">
                    <div className="hidden md:flex w-12 h-12 rounded-2xl bg-orange-50 border border-orange-100 items-center justify-center flex-shrink-0 text-neon-orange">
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                    </div>

                    <div className="space-y-3">
                        <div className="flex items-center justify-between md:hidden">
                            <h4 className="text-base font-black text-surface-dark uppercase tracking-widest">Nastavení Cookies</h4>
                            <button onClick={() => setIsVisible(false)} className="text-surface-dark/40 hover:text-surface-dark">
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
                            </button>
                        </div>

                        <h4 className="hidden md:block text-sm font-black text-surface-dark uppercase tracking-widest">
                            {showDetails ? 'Podrobné nastavení soukromí' : 'Vážíme si vašeho soukromí'}
                        </h4>

                        <p className="text-sm text-surface-dark/70 leading-relaxed max-w-2xl">
                            {showDetails
                                ? 'Zde si můžete upravit nastavení jednotlivých typů cookies. Nezbytné cookies jsou nutné pro správné fungování webu.'
                                : config.text || 'Používáme cookies k optimalizaci našich stránek a služeb. Kliknutím na "Přijmout vše" souhlasíte s použitím všech cookies.'}
                        </p>

                        <div className="flex flex-wrap gap-x-6 gap-y-2 text-xs font-bold text-surface-dark/50">
                            <ReactRouterDom.Link to="/ochrana-soukromi" className="hover:text-neon-orange transition-colors underline decoration-dotted underline-offset-4">
                                Zásady ochrany osobních údajů
                            </ReactRouterDom.Link>
                            <ReactRouterDom.Link to="/obchodni-podminky" className="hover:text-neon-orange transition-colors underline decoration-dotted underline-offset-4">
                                Obchodní podmínky
                            </ReactRouterDom.Link>
                        </div>
                    </div>
                </div>

                {/* Details / Toggles */}
                {showDetails && (
                    <div className="w-full grid grid-cols-1 md:grid-cols-2 gap-4 py-4 border-y border-surface-dark/5 relative z-10">
                        {/* Necessary */}
                        <div className="flex items-start gap-3 p-3 rounded-xl bg-gray-50/50 border border-gray-100 opacity-70">
                            <div className="mt-0.5 text-neon-orange">
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
                            </div>
                            <div>
                                <div className="flex items-center gap-2 mb-1">
                                    <span className="text-xs font-black uppercase tracking-wider text-surface-dark">Nezbytné</span>
                                    <span className="px-1.5 py-0.5 rounded text-[9px] font-bold bg-gray-200 text-gray-500">VŽDY AKTIVNÍ</span>
                                </div>
                                <p className="text-[11px] text-surface-dark/60 leading-snug">Technické cookies nutné pro základní funkce webu (např. navigace, ukládání preferencí).</p>
                            </div>
                        </div>

                        {/* Analytics */}
                        <div
                            onClick={() => togglePreference('analytics')}
                            className={`flex items-start gap-3 p-3 rounded-xl border cursor-pointer transition-all ${preferences.analytics ? 'bg-orange-50/30 border-orange-100' : 'bg-white border-gray-100 hover:border-orange-100'}`}
                        >
                            <div className={`mt-0.5 w-5 h-5 rounded border flex items-center justify-center transition-colors ${preferences.analytics ? 'bg-neon-orange border-neon-orange text-white' : 'border-gray-300'}`}>
                                {preferences.analytics && <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" /></svg>}
                            </div>
                            <div>
                                <div className="flex items-center gap-2 mb-1">
                                    <span className="text-xs font-black uppercase tracking-wider text-surface-dark">Analytické</span>
                                </div>
                                <p className="text-[11px] text-surface-dark/60 leading-snug">Pomáhají nám pochopit, jak web používáte, abychom ho mohli zlepšovat.</p>
                            </div>
                        </div>

                        {/* Marketing */}
                        <div
                            onClick={() => togglePreference('marketing')}
                            className={`flex items-start gap-3 p-3 rounded-xl border cursor-pointer transition-all ${preferences.marketing ? 'bg-orange-50/30 border-orange-100' : 'bg-white border-gray-100 hover:border-orange-100'}`}
                        >
                            <div className={`mt-0.5 w-5 h-5 rounded border flex items-center justify-center transition-colors ${preferences.marketing ? 'bg-neon-orange border-neon-orange text-white' : 'border-gray-300'}`}>
                                {preferences.marketing && <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" /></svg>}
                            </div>
                            <div>
                                <div className="flex items-center gap-2 mb-1">
                                    <span className="text-xs font-black uppercase tracking-wider text-surface-dark">Marketingové</span>
                                </div>
                                <p className="text-[11px] text-surface-dark/60 leading-snug">Používají se k zobrazení relevantní reklamy a sledování účinnosti kampaní.</p>
                            </div>
                        </div>

                        {/* Preferences */}
                        <div
                            onClick={() => togglePreference('preferences')}
                            className={`flex items-start gap-3 p-3 rounded-xl border cursor-pointer transition-all ${preferences.preferences ? 'bg-orange-50/30 border-orange-100' : 'bg-white border-gray-100 hover:border-orange-100'}`}
                        >
                            <div className={`mt-0.5 w-5 h-5 rounded border flex items-center justify-center transition-colors ${preferences.preferences ? 'bg-neon-orange border-neon-orange text-white' : 'border-gray-300'}`}>
                                {preferences.preferences && <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" /></svg>}
                            </div>
                            <div>
                                <div className="flex items-center gap-2 mb-1">
                                    <span className="text-xs font-black uppercase tracking-wider text-surface-dark">Preferenční</span>
                                </div>
                                <p className="text-[11px] text-surface-dark/60 leading-snug">Umožňují webu zapamatovat si vaše volby (např. jazyk, region).</p>
                            </div>
                        </div>
                    </div>
                )}


                {/* Buttons Actions */}
                <div className={`flex flex-col sm:flex-row gap-3 relative z-10 ${showDetails ? 'w-full pt-2' : ''} md:w-auto md:min-w-[300px]`}>
                    {!showDetails ? (
                        <>
                            <div className="flex gap-3 w-full">
                                <button
                                    onClick={handleAcceptNecessary}
                                    className="flex-1 py-3 px-4 bg-gray-100 text-surface-dark/70 rounded-xl text-[10px] sm:text-xs font-black uppercase tracking-widest hover:bg-gray-200 hover:text-surface-dark transition-all whitespace-nowrap"
                                >
                                    Jen nezbytné
                                </button>
                                <button
                                    onClick={() => setShowDetails(true)}
                                    className="flex-1 py-3 px-4 bg-white border-2 border-surface-dark/5 text-surface-dark rounded-xl text-[10px] sm:text-xs font-black uppercase tracking-widest hover:border-surface-dark/20 transition-all whitespace-nowrap"
                                >
                                    Nastavení
                                </button>
                            </div>
                            <button
                                onClick={handleAcceptAll}
                                className="w-full py-3 neon-gradient text-white rounded-xl text-xs font-black uppercase tracking-[0.2em] shadow-lg hover:shadow-neon-glow transition-all active:scale-95"
                            >
                                {config.buttonText || 'Přijmout vše'}
                            </button>
                        </>
                    ) : (
                        <>
                            <button
                                onClick={() => setShowDetails(false)}
                                className="w-full sm:w-auto py-3 px-6 bg-gray-50 text-surface-dark/60 rounded-xl text-xs font-black uppercase tracking-widest hover:bg-gray-100 hover:text-surface-dark transition-all"
                            >
                                Zpět
                            </button>
                            <div className="flex-1 flex gap-3">
                                <button
                                    onClick={handleSaveSelected}
                                    className="flex-1 py-3 px-4 bg-white border-2 border-surface-dark/10 text-surface-dark rounded-xl text-xs font-black uppercase tracking-widest hover:border-neon-orange hover:text-neon-orange transition-all active:scale-95"
                                >
                                    Uložit vybrané
                                </button>
                                <button
                                    onClick={handleAcceptAll}
                                    className="flex-1 py-3 px-4 neon-gradient text-white rounded-xl text-xs font-black uppercase tracking-widest shadow-lg hover:shadow-neon-glow transition-all active:scale-95"
                                >
                                    Přijmout vše
                                </button>
                            </div>
                        </>
                    )}
                </div>
            </div>
        </div>
    );
};

export default CookieConsent;
