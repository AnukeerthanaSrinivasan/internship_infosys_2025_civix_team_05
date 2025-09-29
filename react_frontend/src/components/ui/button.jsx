import React from 'react';

// This is a simplified version of the Shadcn UI button component
// Normally, Shadcn UI uses Radix UI and other libraries for full functionality
export function Button({
  className = '',
  variant = 'default',
  size = 'default',
  children,
  ...props
}) {
  // Simplified styles based on variant
  const variantStyles = {
    default: 'bg-black text-white hover:bg-gray-800',
    destructive: 'bg-red-500 text-white hover:bg-red-600',
    outline: 'border border-gray-300 bg-white hover:bg-gray-100',
    secondary: 'bg-gray-200 text-gray-800 hover:bg-gray-300',
    ghost: 'bg-transparent hover:bg-gray-100',
    link: 'text-black underline',
  };

  // Simplified size styles
  const sizeStyles = {
    default: 'px-4 py-2',
    sm: 'px-3 py-1 text-sm',
    lg: 'px-6 py-3',
    icon: 'p-1',
  };

  // Simplified button styles
  const buttonStyles = `${variantStyles[variant]} ${sizeStyles[size]} ${className}`;

  return (
    <button className={buttonStyles} {...props}>
      {children}
    </button>
  );
}

export function Badge({
  className = '',
  variant = 'default',
  children,
  ...props
}) {
  // Button-like status indicator styles matching the screenshot
  const variantStyles = {
    default: 'bg-black text-white',
    secondary: 'bg-gray-200 text-gray-800',
    destructive: 'bg-red-500 text-white',
    outline: 'border border-gray-300 text-gray-800',
    active: 'bg-black text-white',
    'in-progress': 'bg-gray-400 text-white',
    completed: 'bg-green-600 text-white',
  };

  // Button-like badge styles with more padding and rounded corners
  const badgeStyles = `px-3 py-1 text-sm font-medium rounded-full ${variantStyles[variant]} ${className}`;

  return (
    <span className={badgeStyles} {...props}>
      {children}
    </span>
  );
}