import React from 'react';
import './badge.css';

function Badge({ children, variant }) {
  let className = 'badge';
  if (variant) className += ` ${variant.toLowerCase()}`;
  return <span className={className}>{children}</span>;
}

export default Badge;
