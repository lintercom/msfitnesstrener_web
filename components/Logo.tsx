
import React from 'react';
import { useData } from '../context/DataProvider';

const Logo: React.FC<{ className?: string, style?: React.CSSProperties }> = ({ className, style }) => {
  const { data } = useData();
  const { logo, companyName } = data.general;

  // Get base URL from env or use root
  const baseUrl = import.meta.env.VITE_BASE_URL || '';

  let logoUrl = logo;
  // Fallback for missing logo or legacy .svg path that doesn't exist
  if (!logoUrl || logoUrl.includes('logo-light.svg')) {
    logoUrl = `${baseUrl}/images/logo.png`;
  }

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

