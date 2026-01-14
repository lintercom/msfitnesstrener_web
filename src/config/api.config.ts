/**
 * Konfigurace API pro frontend
 * Přepíná mezi PHP backendem a EmailJS
 */
export const apiConfig = {
    // Použít PHP backend jako primární metodu (true na produkci)
    usePHP: true,

    // API endpointy
    endpoints: {
        // Použijeme BASE_URL, aby to fungovalo i když je web v podadresáři (např. /nejaky-web/)
        sendEmail: `${import.meta.env.BASE_URL}api/send-email`,
        saveContent: `${import.meta.env.BASE_URL}api/save-content`
    },

    // Timeout pro requesty (ms)
    timeout: 15000,

    // Admin token pro ukládání obsahu (mělo by být v .env souboru)
    adminToken: import.meta.env.VITE_ADMIN_TOKEN || ''
};
