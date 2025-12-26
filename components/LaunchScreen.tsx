import React from 'react';
import { Button } from './Common';
import { DexLogoMark } from '../brand/DexLogoMark';

interface LaunchScreenProps {
  onStart: () => void;
}

const LaunchScreen: React.FC<LaunchScreenProps> = ({ onStart }) => {
  return (
    <div className="fixed inset-0 z-[500] bg-slate-950 flex flex-col items-center justify-center p-8 overflow-y-auto">
      {/* Background Watermark */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none overflow-hidden opacity-[0.035]">
        <DexLogoMark className="w-[120%] h-[120%] grayscale invert blur-sm transform -translate-y-20" />
      </div>

      <div className="max-w-4xl w-full relative z-10 flex flex-col items-center text-center animate-in fade-in zoom-in-95 duration-1000">
        <div className="mb-12 relative group min-h-[200px] flex items-center justify-center">
          <div className="absolute inset-0 bg-blue-600/40 blur-[80px] rounded-full scale-125 opacity-40 group-hover:opacity-70 transition-opacity duration-700"></div>
          <DexLogoMark 
            className="w-56 h-56 md:w-80 md:h-80 relative z-20 drop-shadow-[0_20px_40px_rgba(0,0,0,0.6)] transform group-hover:scale-105 transition-transform duration-1000"
          />
        </div>

        <h1 className="text-6xl md:text-8xl font-black mb-6 tracking-tighter bg-gradient-to-r from-blue-400 via-indigo-400 to-blue-500 bg-clip-text text-transparent uppercase">
          DexTCGMaker
        </h1>
        
        <p className="text-2xl md:text-3xl font-black text-slate-100 max-w-2xl leading-tight mx-auto tracking-tight mb-12 drop-shadow-md">
          Professional TCG Design & Simulation Lab.
        </p>

        <Button 
          onClick={onStart} 
          className="px-20 py-7 text-2xl rounded-[2rem] bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 shadow-[0_20px_80px_rgba(59,130,246,0.5)] transform hover:scale-105 active:scale-95 transition-all font-black tracking-tighter uppercase relative z-20"
        >
          Begin Lab Session
        </Button>
        
        <p className="mt-12 text-slate-600 text-[10px] font-black uppercase tracking-[0.4em] opacity-50 relative z-20">
          Build 0.5.1 Alpha • Powered by Gemini & Google AI Studio
        </p>
      </div>
    </div>
  );
};

export default LaunchScreen;
