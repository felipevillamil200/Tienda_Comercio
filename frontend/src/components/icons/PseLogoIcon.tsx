'use client';

import React from 'react';
import { CustomIconProps } from './types';

export default function PseLogoIcon({
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
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <circle cx="24" cy="24" r="22" fill="#002b49" stroke="rgba(255,255,255,0.2)" strokeWidth="1" />
      <text 
        x="24" 
        y="29" 
        fontFamily="sans-serif" 
        fontSize="13" 
        fontWeight="900" 
        fill="#ffcc00" 
        textAnchor="middle" 
        letterSpacing="0.5"
      >
        PSE
      </text>
    </svg>
  );
}
