'use client';

import React from 'react';
import { CustomIconProps } from './types';

export default function WompiLogoIcon({
  size = 24,
  className = '',
  style,
  ...props
}: CustomIconProps) {
  return (
    <svg 
      viewBox="0 0 48 48" 
      width={size} 
      height={size} 
      className={className}
      style={style}
      fill="none" 
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <rect width="48" height="48" rx="8" fill="#1e1e24" />
      <path d="M12 16L18 32L24 16L30 32L36 16" stroke="#ff5500" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
      <circle cx="38" cy="14" r="3" fill="#ff5500" />
    </svg>
  );
}
