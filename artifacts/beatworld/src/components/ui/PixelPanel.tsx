import { HTMLAttributes, forwardRef } from 'react';
import { cn } from '@/lib/utils';

export interface PixelPanelProps extends HTMLAttributes<HTMLDivElement> {
  variant?: 'default' | 'primary' | 'secondary';
}

export const PixelPanel = forwardRef<HTMLDivElement, PixelPanelProps>(
  ({ className, variant = 'default', ...props }, ref) => {
    
    const baseClasses = "relative p-4 pixel-borders";
    
    const variants = {
      default: "bg-card text-foreground",
      primary: "bg-primary/10 text-primary border-primary pixel-borders-primary",
      secondary: "bg-secondary/10 text-secondary border-secondary pixel-borders-secondary",
    };

    return (
      <div
        ref={ref}
        className={cn(baseClasses, variants[variant], className)}
        {...props}
      />
    );
  }
);
PixelPanel.displayName = 'PixelPanel';
