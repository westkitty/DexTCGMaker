import React, { useState } from 'react';

// Exported for backward compatibility but using the brand centralized system
export { DexLogoMark as DexLogo, DexLogoMark } from '../brand/DexLogoMark';

export const Button: React.FC<{
  onClick?: () => void;
  children: React.ReactNode;
  variant?: 'primary' | 'secondary' | 'danger' | 'ghost';
  className?: string;
  disabled?: boolean;
}> = ({ onClick, children, variant = 'primary', className = '', disabled = false }) => {
  const base = "px-6 py-3 rounded-xl font-bold transition-all duration-200 active:scale-95 disabled:opacity-40 disabled:cursor-not-allowed flex items-center justify-center gap-2 text-sm";
  const variants = {
    primary: "bg-blue-600 hover:bg-blue-500 text-white shadow-xl shadow-blue-900/30 border border-blue-400/20",
    secondary: "bg-slate-800 hover:bg-slate-700 text-slate-100 border border-slate-700",
    danger: "bg-red-600 hover:bg-red-500 text-white shadow-lg shadow-red-900/20",
    ghost: "bg-transparent hover:bg-slate-800 text-slate-400 hover:text-slate-100"
  };

  return (
    <button onClick={onClick} disabled={disabled} className={`${base} ${variants[variant]} ${className}`}>
      {children}
    </button>
  );
};

export const CardWrapper: React.FC<{ children: React.ReactNode; className?: string }> = ({ children, className = '' }) => (
  <div className={`bg-slate-900/60 border border-slate-800 rounded-3xl p-6 shadow-2xl backdrop-blur-sm ${className}`}>
    {children}
  </div>
);

export const Tooltip: React.FC<{ text: string; children: React.ReactNode }> = ({ text, children }) => {
  const [visible, setVisible] = useState(false);
  return (
    <div className="relative inline-block" onMouseEnter={() => setVisible(true)} onMouseLeave={() => setVisible(false)}>
      {children}
      {visible && (
        <div className="absolute z-[300] bottom-full mb-3 left-1/2 -translate-x-1/2 w-56 p-3 bg-slate-950 border border-slate-700 rounded-xl shadow-[0_20px_50px_rgba(0,0,0,0.5)] animate-in fade-in zoom-in-95 duration-200">
          <p className="text-[11px] font-medium text-slate-200 leading-relaxed whitespace-normal break-words overflow-wrap-anywhere">{text}</p>
          <div className="absolute top-full left-1/2 -translate-x-1/2 border-8 border-transparent border-t-slate-700"></div>
        </div>
      )}
    </div>
  );
};

export const Input: React.FC<{
  label?: string;
  value: string | number;
  onChange: (val: string) => void;
  type?: string;
  className?: string;
  placeholder?: string;
}> = ({ label, value, onChange, type = 'text', className = '', placeholder }) => (
  <div className={`flex flex-col gap-2 ${className}`}>
    {label && <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">{label}</label>}
    <input
      type={type}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder}
      className="bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-slate-100 focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-all placeholder:text-slate-700 text-sm font-medium"
    />
  </div>
);

export const Badge: React.FC<{ children: React.ReactNode; color?: string }> = ({ children, color = 'bg-blue-600/10 text-blue-400 border border-blue-500/20' }) => (
  <span className={`text-[9px] font-black uppercase tracking-[0.15em] px-3 py-1 rounded-full whitespace-nowrap ${color}`}>
    {children}
  </span>
);