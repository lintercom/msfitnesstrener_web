
// TENTO SOUBOR OBSAHUJE OBRÁZKY PŘÍMO JAKO KÓD (Base64 Data URI).
// Tímto se obchází problémy s načítáním souborů v různých prostředích.

// Funkce pro vytvoření SVG placeholderu
const createPlaceholder = (width: number, height: number, text: string, bgColor: string, textColor: string = '#1e293b') => {
  const svg = `
  <svg width="${width}" height="${height}" xmlns="http://www.w3.org/2000/svg">
    <rect width="100%" height="100%" fill="${bgColor}"/>
    <line x1="0" y1="0" x2="100%" y2="100%" stroke="${textColor}" stroke-width="2" opacity="0.1"/>
    <line x1="100%" y1="0" x2="0" y2="100%" stroke="${textColor}" stroke-width="2" opacity="0.1"/>
    <text x="50%" y="50%" font-family="sans-serif" font-size="24" font-weight="bold" fill="${textColor}" dy=".3em" text-anchor="middle">${text}</text>
  </svg>
  `;
  
  // FIX: btoa natively crashes on Unicode strings (Czech accents).
  // We must encode the string to UTF-8 before converting to Base64.
  const encodedSvg = window.btoa(unescape(encodeURIComponent(svg)));
  return `data:image/svg+xml;base64,${encodedSvg}`;
};

// --- HERO SEKCE ---
export const heroMainImage = ''; 
export const heroDecorationImage = createPlaceholder(600, 600, 'Tiskárna', '#e0f2fe', '#0ea5e9'); 

// --- SLUŽBY ---
export const servicePrintImage = createPlaceholder(800, 600, '3D Tisk', '#fef9c3', '#ca8a04');
export const serviceModelingImage = createPlaceholder(800, 600, '3D Modelování', '#fee2e2', '#dc2626');
export const serviceRepairImage = createPlaceholder(800, 600, 'Opravy', '#dcfce7', '#16a34a');
export const serviceDevImage = createPlaceholder(800, 600, 'Vývoj', '#ede9fe', '#7c3aed');

// --- TECHNOLOGIE ---
export const machineBambuLabP1S = createPlaceholder(600, 600, 'Bambu Lab P1S', '#f1f5f9', '#475569');

// --- OSTATNÍ ---
export const heroProductImage = createPlaceholder(400, 400, 'Produkt', '#f3f4f6');

// Obrázky pro galerii
export const gallery_g1_1 = createPlaceholder(800, 600, 'Převodovka 1', '#f8fafc');
export const gallery_g1_2 = createPlaceholder(800, 600, 'Převodovka 2', '#f1f5f9');
export const gallery_g1_3 = createPlaceholder(800, 600, 'Převodovka 3', '#e2e8f0');
export const gallery_g2_1 = createPlaceholder(800, 600, 'Drak 1', '#fffbeb');
export const gallery_g2_2 = createPlaceholder(800, 600, 'Drak 2', '#fef3c7');
export const gallery_g3_1 = createPlaceholder(800, 600, 'Organizér', '#eff6ff');
export const gallery_g4_1 = createPlaceholder(800, 600, 'Držák kamery', '#f0fdf4');
export const gallery_g5_1 = createPlaceholder(800, 600, 'Vila model', '#faf5ff');
export const gallery_g5_2 = createPlaceholder(800, 600, 'Vila detail', '#f3e8ff');
export const gallery_g6_1 = createPlaceholder(800, 600, 'Projekt 6', '#f8fafc');

// Obrázky pro stránku "O nás"
export const aboutStoryImage = createPlaceholder(800, 1000, 'Náš příběh', '#e2e8f0', '#64748b');
export const aboutValuesImage = createPlaceholder(800, 600, 'Naše hodnoty', '#f1f5f9');
