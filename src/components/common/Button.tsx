import React, { ButtonHTMLAttributes, forwardRef } from 'react';

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  /**
   * The aesthetic variant of the button.
   * @default 'primary'
   */
  variant?: 'primary' | 'secondary';

  /**
   * Whether the button should take up the full width of its container.
   * @default false
   */
  fullWidth?: boolean;
}

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className = '', variant = 'primary', fullWidth = false, children, ...props }, ref) => {
    // Determine the variant utility class from globals.css
    const variantClass = variant === 'secondary' ? 'btn-secondary' : 'btn-primary';

    // Combine base class, variant, full width, and any user-provided classes
    const combinedClassName = `btn ${variantClass} ${
      fullWidth ? 'w-full' : ''
    } ${className}`.trim();

    return (
      <button ref={ref} className={combinedClassName} {...props}>
        {children}
      </button>
    );
  },
);

Button.displayName = 'Button';

export default Button;
