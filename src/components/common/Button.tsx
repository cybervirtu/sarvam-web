import * as React from 'react';
import { Slot } from '@radix-ui/react-slot';
import { cn } from '../../lib/utils';

export interface ButtonProps
    extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    asChild?: boolean;
    variant?: 'default' | 'destructive' | 'outline' | 'secondary' | 'ghost' | 'link';
    size?: 'default' | 'sm' | 'lg' | 'icon';
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
    ({ className, variant = 'default', size = 'default', asChild = false, ...props }, ref) => {
        const Comp = asChild ? Slot : 'button';

        const baseStyles = 'inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-xl text-sm font-medium transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 active:scale-[0.98] select-none';

        const variants = {
            default: 'bg-primary text-primary-foreground shadow-soft hover:bg-primary/90',
            destructive: 'bg-destructive text-destructive-foreground shadow-soft hover:bg-destructive/90',
            outline: 'border border-input bg-background hover:bg-muted hover:text-accent-foreground',
            secondary: 'bg-secondary text-secondary-foreground hover:bg-secondary/80',
            ghost: 'hover:bg-muted hover:text-foreground text-muted-foreground',
            link: 'text-primary underline-offset-4 hover:underline',
        };

        const sizes = {
            default: 'h-10 px-4 py-2', // Standardized to 40px
            sm: 'h-8 px-3 text-xs',
            lg: 'h-11 px-8 text-base',
            icon: 'h-10 w-10 p-0', // Standardized icon button size
        };

        return (
            <Comp
                className={cn(baseStyles, variants[variant], sizes[size], className)}
                ref={ref}
                {...props}
            />
        );
    }
);
Button.displayName = 'Button';

export { Button };
