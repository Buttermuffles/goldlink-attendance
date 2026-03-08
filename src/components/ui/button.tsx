import * as React from 'react';
import { cn } from '@/lib/utils';

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'default' | 'destructive' | 'outline' | 'secondary' | 'ghost' | 'link';
  size?: 'default' | 'sm' | 'lg' | 'icon';
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = 'default', size = 'default', ...props }, ref) => {
    const variants: Record<string, string> = {
      default: 'bg-brand-primary text-[#1A1A1A] hover:bg-brand-deep font-semibold',
      destructive: 'bg-red-500 text-white hover:bg-red-600',
      outline: 'border border-[rgb(55,55,55)] bg-transparent hover:bg-[rgb(36,36,36)] text-[#FAFAFA]',
      secondary: 'bg-[rgb(55,55,55)] text-[#FAFAFA] hover:bg-[rgb(75,75,75)]',
      ghost: 'hover:bg-[rgb(55,55,55)] text-[#FAFAFA]',
      link: 'text-brand-primary underline-offset-4 hover:underline',
    };

    const sizes: Record<string, string> = {
      default: 'h-10 px-4 py-2',
      sm: 'h-9 rounded-md px-3 text-sm',
      lg: 'h-11 rounded-md px-8',
      icon: 'h-10 w-10',
    };

    return (
      <button
        className={cn(
          'inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-primary focus-visible:ring-offset-2 focus-visible:ring-offset-[#1A1A1A] disabled:pointer-events-none disabled:opacity-50',
          variants[variant],
          sizes[size],
          className
        )}
        ref={ref}
        {...props}
      />
    );
  }
);
Button.displayName = 'Button';

export { Button };
