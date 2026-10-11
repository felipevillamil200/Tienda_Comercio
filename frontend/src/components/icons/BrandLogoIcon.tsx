'use client';

import React from 'react';
import { CustomIconProps } from './types';

export default function BrandLogoIcon({
  size = 32,
  className = '',
  style,
  ...props
}: CustomIconProps) {
  return (
    <svg 
      xmlns="http://www.w3.org/2000/svg" 
      viewBox="0 0 32 32" 
      width={size} 
      height={size} 
      className={className}
      style={style}
      {...props}
    >
      <rect width="32" height="32" rx="6" fill="#0d0d0d" stroke="rgba(255, 255, 255, 0.15)" strokeWidth="1" />
      <text 
        x="16" 
        y="23" 
        fontFamily="'Archivo', 'Impact', sans-serif" 
        fontSize="20" 
        fontWeight="900" 
        fill="#f0ede6" 
        textAnchor="middle" 
        letterSpacing="-1"
      >
        N
      </text>
      <circle cx="25" cy="8" r="2.5" fill="#ff5500" />
    </svg>
  );
}
