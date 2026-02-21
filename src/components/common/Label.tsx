import React, { LabelHTMLAttributes } from 'react';

export type LabelProps = LabelHTMLAttributes<HTMLLabelElement>;

const Label = ({ className = '', children, ...props }: LabelProps) => (
  <label className={`text-sm text-slate-300 font-medium ${className}`} {...props}>
    {children}
  </label>
);

export default Label;
