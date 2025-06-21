'use client'

import * as React from 'react'
import { cn } from '@/lib/utils' // We'll define this utility below

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'default' | 'outline' | 'ghost'
  size?: 'default' | 'sm' | 'lg'
}

const variantClasses = {
  default: 'bg-blue-600 text-white hover:bg-blue-700',
  outline: 'border border-blue-600 text-blue-600 hover:bg-blue-50',
  ghost: 'text-blue-600 hover:bg-blue-100',
}

const sizeClasses = {
  default: 'px-4 py-2 text-sm',
  sm: 'px-3 py-1 text-xs',
  lg: 'px-5 py-3 text-base',
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = 'default', size = 'default', ...props }, ref) => {
    return (
      <button
        ref={ref}
        className={cn(
          'rounded-md font-medium transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed',
          variantClasses[variant],
          sizeClasses[size],
          className
        )}
        {...props}
      />
    )
  }
)

Button.displayName = 'Button'
