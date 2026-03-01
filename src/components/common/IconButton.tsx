import * as React from 'react';
import { Button, ButtonProps } from './Button';

export interface IconButtonProps extends ButtonProps {
    icon: React.ElementType;
}

const IconButton = React.forwardRef<HTMLButtonElement, IconButtonProps>(
    ({ className, icon: Icon, size = 'icon', ...props }, ref) => {
        return (
            <Button
                variant="ghost"
                size={size}
                className={className}
                ref={ref}
                {...props}
            >
                <Icon className="w-4 h-4 shrink-0" />
            </Button>
        );
    }
);
IconButton.displayName = 'IconButton';

export { IconButton };
