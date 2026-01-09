
import React from 'react';
import { useData } from '../context/DataProvider';

const Logo: React.FC<{ className?: string, style?: React.CSSProperties }> = ({ className, style }) => {
  const { data } = useData();
  const { logo, companyName } = data.general;

  const logoUrl = logo;

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
