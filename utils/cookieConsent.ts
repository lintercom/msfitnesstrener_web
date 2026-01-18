/**
 * Utility pro práci s cookie consent preferencemi
 */

export interface CookiePreferences {
    necessary: boolean;
    analytics: boolean;
    marketing: boolean;
    preferences: boolean;
}

const STORAGE_KEY = 'ms-cookie-consent-settings';

/**
 * Získá aktuální cookie preference z localStorage
 */
export function getCookiePreferences(): CookiePreferences | null {
    try {
        const stored = localStorage.getItem(STORAGE_KEY);
        if (stored) {
            return JSON.parse(stored);
        }
    } catch (e) {
        console.warn('Failed to parse cookie preferences');
    }
    return null;
}

/**
 * Zkontroluje, jestli je povolena konkrétní kategorie cookies
 */
export function isCookieCategoryAllowed(category: keyof CookiePreferences): boolean {
    const prefs = getCookiePreferences();
    if (!prefs) return false;
    return prefs[category] === true;
}

/**
 * Zkontroluje, jestli uživatel již udělil/odmítl souhlas
 */
export function hasUserConsented(): boolean {
    return getCookiePreferences() !== null;
}

/**
 * Listener pro změny cookie preferencí
 */
export function onCookieConsentChange(callback: (prefs: CookiePreferences) => void): () => void {
    const handler = (event: Event) => {
        const customEvent = event as CustomEvent<CookiePreferences>;
        callback(customEvent.detail);
    };
    
    window.addEventListener('cookie-consent-updated', handler);
    
    return () => {
        window.removeEventListener('cookie-consent-updated', handler);
    };
}
