/**
 * Komponenta pro správu analytics skriptů s respektováním cookie souhlasu
 * 
 * Google Analytics je načteno v index.html s Consent Mode v2:
 * - Default consent je 'denied' (žádná data se nesbírají)
 * - Po souhlasu s cookies se consent změní na 'granted'
 * 
 * Tato komponenta slouží pouze pro případné rozšíření o další tracking služby
 * (např. Facebook Pixel, Hotjar, atd.)
 */

import { useEffect, useState } from 'react';
import { useData } from '../context/DataProvider';
import { getCookiePreferences, onCookieConsentChange, CookiePreferences } from '../utils/cookieConsent';

declare global {
    interface Window {
        dataLayer: any[];
        gtag: (...args: any[]) => void;
        fbq: (...args: any[]) => void;
    }
}

const Analytics: React.FC = () => {
    const { data } = useData();
    const [marketingLoaded, setMarketingLoaded] = useState(false);
    
    const fbPixelId = data.integrations?.analytics?.facebookPixelId;

    // Funkce pro načtení Facebook Pixel (pokud je nakonfigurován)
    const loadFacebookPixel = (id: string) => {
        if (marketingLoaded || !id) return;

        const script = document.createElement('script');
        script.innerHTML = `
            !function(f,b,e,v,n,t,s)
            {if(f.fbq)return;n=f.fbq=function(){n.callMethod?
            n.callMethod.apply(n,arguments):n.queue.push(arguments)};
            if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
            n.queue=[];t=b.createElement(e);t.async=!0;
            t.src=v;s=b.getElementsByTagName(e)[0];
            s.parentNode.insertBefore(t,s)}(window, document,'script',
            'https://connect.facebook.net/en_US/fbevents.js');
            fbq('init', '${id}');
            fbq('track', 'PageView');
        `;
        document.head.appendChild(script);

        setMarketingLoaded(true);
        console.log('✅ Facebook Pixel loaded:', id);
    };

    // Handler pro změnu preferencí
    const handlePreferencesChange = (prefs: CookiePreferences) => {
        // Facebook Pixel - načte se pouze pokud jsou povoleny marketingové cookies
        if (prefs.marketing && fbPixelId) {
            loadFacebookPixel(fbPixelId);
        }
    };

    useEffect(() => {
        // Zkontroluj existující preference při načtení
        const prefs = getCookiePreferences();
        if (prefs) {
            handlePreferencesChange(prefs);
        }

        // Poslouchej na změny preferencí
        const unsubscribe = onCookieConsentChange(handlePreferencesChange);

        return () => {
            unsubscribe();
        };
    }, [fbPixelId]);

    // Komponenta nic nevykresluje
    return null;
};

export default Analytics;
