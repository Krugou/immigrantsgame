import React, { InputHTMLAttributes, ReactNode } from 'react';

export interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  icon?: ReactNode;
}

const Input = ({ icon, className = '', ...props }: InputProps) => (
  <div
    className={`flex items-center bg-cinematic-surface rounded-md px-3 border border-cinematic-border focus-within:border-brand-primary focus-within:ring-1 focus-within:ring-brand-primary transition-all ${className}`}
  >
    {icon && <div className="text-slate-400 mr-2">{icon}</div>}
    <input
      className="w-full p-3 bg-transparent border-none text-white outline-none placeholder:text-slate-600"
      {...props}
    />
  </div>
);

export default Input;
