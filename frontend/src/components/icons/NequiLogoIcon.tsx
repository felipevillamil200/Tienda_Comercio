'use client';

import React from 'react';
import { CustomIconProps } from './types';

export default function NequiLogoIcon({
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
      <rect width="48" height="48" rx="10" fill="#200020" />
      <path d="M14 34V14L28 34V14" stroke="#da0081" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" />
      <circle cx="34" cy="34" r="2.5" fill="#da0081" />
    </svg>
  );
}
