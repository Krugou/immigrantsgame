import React, { HTMLAttributes } from 'react';

export interface TextProps extends HTMLAttributes<HTMLParagraphElement | HTMLSpanElement> {
  as?: 'p' | 'span';
  variant?: 'base' | 'muted' | 'title' | 'subtitle' | 'error';
}

const Text = ({
  as: Component = 'p',
  variant = 'base',
  className = '',
  children,
  ...props
}: TextProps) => {
  const baseClasses = {
    base: 'text-white',
    muted: 'text-slate-400',
    title: 'text-xl font-bold text-white',
    subtitle: 'text-sm font-bold text-slate-200 uppercase tracking-wider',
    error: 'text-sm text-brand-danger',
  };

  return (
    <Component className={`${baseClasses[variant]} ${className}`.trim()} {...props}>
      {children}
    </Component>
  );
};

export default Text;
