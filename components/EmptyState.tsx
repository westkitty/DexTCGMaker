import React from 'react';
import { DexLogoMark } from '../brand/DexLogoMark';

interface EmptyStateProps {
  message: string;
  submessage?: string;
  icon?: React.ReactNode;
}

/**
 * REQUIRED LOCATION C: Empty / Loading / Zero-State Component
 */
const EmptyState: React.FC<EmptyStateProps> = ({ message, submessage, icon }) => {
  return (
    <div className="flex flex-col items-center justify-center py-24 px-8 text-center animate-in fade-in duration-700 overflow-visible">
      <div className="mb-12 overflow-visible">
        <DexLogoMark className="w-32 h-32 md:w-40 md:h-40" />
      </div>
      
      {icon && <div className="mb-4 text-slate-700">{icon}</div>}
      
      <h3 className="text-xl font-black text-slate-400 uppercase tracking-[0.3em] mb-4">
        {message}
      </h3>
      
      {submessage && (
        <p className="text-sm font-bold text-slate-600 max-w-md mx-auto leading-relaxed overflow-wrap-anywhere whitespace-normal">
          {submessage}
        </p>
      )}
    </div>
  );
};

export default EmptyState;
