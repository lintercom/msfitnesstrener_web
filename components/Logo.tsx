
import React from 'react';
import { useData } from '../context/DataProvider';

const Logo: React.FC<{ className?: string, variant?: 'light' | 'dark', style?: React.CSSProperties }> = ({ className, variant = 'dark', style }) => {
  const { data } = useData();
  const { logo, companyName } = data.general;

  // Select logo based on variant
  const logoUrl = variant === 'light' ? logo.light : logo.dark;

  if (logoUrl) {
    return (
      <img
        src={logoUrl}
        alt={`${companyName} Logo`}
        className={`${className} object-contain`}
        style={style}
      />
    );
  }

  // If no logo is provided, return null
  return null;
};

export default Logo;
