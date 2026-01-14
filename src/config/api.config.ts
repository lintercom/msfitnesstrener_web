/**
 * Konfigurace API pro frontend
 * Přepíná mezi PHP backendem a EmailJS
 */
export const apiConfig = {
    // Použít PHP backend jako primární metodu (true na produkci)
    usePHP: true,

    // API endpointy
    endpoints: {
        sendEmail: '/api/send-email'
    },

    // Timeout pro requesty (ms)
    timeout: 15000
};
