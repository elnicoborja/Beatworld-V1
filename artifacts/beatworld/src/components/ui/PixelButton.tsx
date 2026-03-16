import { ButtonHTMLAttributes, forwardRef } from 'react';
import { cn } from '@/lib/utils';

export interface PixelButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'accent' | 'destructive' | 'default';
  size?: 'sm' | 'md' | 'lg';
}

export const PixelButton = forwardRef<HTMLButtonElement, PixelButtonProps>(
  ({ className, variant = 'default', size = 'md', ...props }, ref) => {
    
    const baseClasses = "relative inline-flex items-center justify-center font-pixel uppercase cursor-pointer select-none active:translate-y-1 transition-transform pixel-borders";
    
    const variants = {
      default: "bg-card text-foreground hover:bg-muted",
      primary: "bg-primary text-primary-foreground pixel-borders-primary hover:bg-white hover:text-primary",
      secondary: "bg-secondary text-secondary-foreground pixel-borders-secondary hover:bg-white hover:text-secondary",
      accent: "bg-accent text-accent-foreground hover:bg-white hover:text-accent",
      destructive: "bg-destructive text-destructive-foreground hover:bg-white hover:text-destructive",
    };

    const sizes = {
      sm: "text-[10px] px-3 py-2",
      md: "text-xs px-4 py-3",
      lg: "text-sm px-6 py-4",
    };

    return (
      <button
        ref={ref}
        className={cn(baseClasses, variants[variant], sizes[size], className)}
        {...props}
      />
    );
  }
);
PixelButton.displayName = 'PixelButton';
