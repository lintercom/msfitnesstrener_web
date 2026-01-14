
import React from 'react';
import { useData } from '../context/DataProvider';

const Logo: React.FC<{ className?: string; style?: React.CSSProperties; variant?: 'light' | 'dark' }> = ({ className, style }) => {
  const { data } = useData();
  const { logo, companyName } = data.general;

  const baseUrl = import.meta.env.BASE_URL || '/';

  const normalizeAssetUrl = (url: string) => {
    if (!url) return url;
    if (url.startsWith('http://') || url.startsWith('https://') || url.startsWith('data:')) return url;

    // Legacy z GitHub Pages /msfitnesstrener_web/... → na hostingu v rootu to neexistuje
    if (baseUrl === '/' && url.startsWith('/msfitnesstrener_web/')) {
      return url.replace('/msfitnesstrener_web/', '/');
    }

    // Absolutní cesta z rootu ("/images/...") → předsadit BASE_URL, pokud je web v podadresáři
    if (url.startsWith('/')) {
      return `${baseUrl}${url.slice(1)}`;
    }

    // Relativní cesta ("images/...") → také předsadit BASE_URL
    return `${baseUrl}${url}`;
  };

  let logoUrl = logo;
  // Fallback for missing logo or legacy .svg path that doesn't exist
  if (!logoUrl || logoUrl.includes('logo-light.svg')) {
    logoUrl = '/images/logo.png';
  }

  logoUrl = normalizeAssetUrl(logoUrl);

  if (logoUrl) {
    return (
      <img
        src={logoUrl}
        alt={`${companyName} Logo`}
        className={`${className} object-contain`}
        style={style}
        loading="eager"
        fetchPriority="high"
      />
    );
  }

  // If no logo is provided, return null
  return null;
};

export default Logo;

