
import React from 'react';
import * as ReactRouterDom from 'react-router-dom';
import { BlueprintGrid } from '../components/PageDecorations';
import SEO from '../components/SEO';

const NotFoundPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-background relative flex flex-col justify-center items-center py-12 px-6 overflow-hidden bg-noise">
      <SEO title="404 - Stránka nenalezena" description="Omlouváme se, ale hledaná stránka neexistuje." />
      {/* Background Decorations */}
      <BlueprintGrid className="opacity-[0.15]" />

      {/* Ambient Lighting */}
      <div className="absolute top-[-10%] left-[-10%] w-[60vw] h-[60vw] bg-neon-blaze/10 rounded-full blur-[200px] pointer-events-none"></div>
      <div className="absolute bottom-[-10%] right-[-10%] w-[50vw] h-[50vw] bg-neon-pink/5 rounded-full blur-[180px] pointer-events-none"></div>

      <div className="relative z-10 w-full max-w-4xl text-center flex flex-col items-center">
        {/* Technical Label */}
        <div className="flex items-center justify-center gap-4 mb-4 md:mb-8 animate-pulse">
          <div className="h-px w-6 md:w-8 neon-gradient"></div>
          <span className="text-[8px] md:text-[10px] font-black uppercase tracking-[0.4em] md:tracking-[0.8em] text-neon-pink">SIGNAL LOST / 404</span>
          <div className="h-px w-6 md:w-8 neon-gradient"></div>
        </div>

        {/* Adjusted 404 Heading - Reduced size and removed overlap risk */}
        <h1 className="text-8xl md:text-[15rem] font-black leading-[0.8] tracking-tighter ms-gradient-text opacity-90 drop-shadow-[0_0_30px_rgba(244,63,94,0.2)] select-none mb-4 md:mb-8">
          404
        </h1>

        {/* Error Message - Removed negative margins to fix overlapping */}
        <div className="mb-10 md:mb-16">
          <h2 className="text-2xl md:text-5xl font-black text-white uppercase tracking-tight mb-4 leading-tight">
            TRÉNINK <span className="ms-gradient-text">PŘERUŠEN</span>
          </h2>
          <p className="text-white/40 font-medium text-base md:text-xl max-w-xl mx-auto leading-relaxed px-4">
            Stránka, kterou hledáte, se nachází mimo vaši aktuální zónu výkonu. Pravděpodobně byla přesunuta nebo smazána.
          </p>
        </div>

        {/* Action Buttons - Optimized for mobile tap targets */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 md:gap-6 w-full sm:w-auto">
          <ReactRouterDom.Link
            to="/"
            className="px-10 md:px-12 py-4 md:py-5 neon-gradient text-white rounded-full font-black uppercase tracking-widest shadow-2xl hover:shadow-neon-glow hover:scale-[1.05] active:scale-95 transform will-change-transform transition-all text-center w-full sm:w-auto text-sm md:text-base"
          >
            Zpět na základnu
          </ReactRouterDom.Link>

          <button
            onClick={() => window.history.back()}
            className="px-10 md:px-12 py-4 md:py-5 border border-white/10 text-white/40 rounded-full font-black uppercase tracking-widest hover:bg-white/5 hover:text-white transition-all backdrop-blur-sm text-center w-full sm:w-auto text-sm md:text-base"
          >
            Předchozí krok
          </button>
        </div>

        {/* Decoration Marker - Hidden on very small screens */}
        <div className="mt-12 md:mt-20 hidden sm:flex justify-center opacity-20">
          <div className="grid grid-cols-3 gap-2">
            {[...Array(9)].map((_, i) => (
              <div key={i} className="w-1.5 h-1.5 rounded-full bg-white"></div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default NotFoundPage;
