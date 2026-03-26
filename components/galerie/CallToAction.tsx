import React from 'react';
import { Camera } from 'lucide-react';

export const CallToAction: React.FC = () => {
  return (
    <section className="pt-0 pb-24 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-[#1C2331] rounded-[2.5rem] py-12 px-6 lg:py-16 text-center text-white shadow-2xl relative overflow-hidden">
          <div className="relative z-10 flex flex-col items-center">
            <h2 className="text-3xl md:text-5xl font-bold mb-8 tracking-tight">
              Vous êtes photographe ?
            </h2>
            
            <p className="text-sm md:text-base font-medium text-gray-300 mb-10 max-w-2xl mx-auto leading-relaxed uppercase tracking-wider">
              Rejoignez notre équipe de photographes bénévoles et aidez-nous à documenter nos actions sur le terrain. Votre talent peut faire la différence !
            </p>
            
            <a 
              href="#footer" 
              className="inline-flex items-center gap-2 bg-[#10B981] hover:bg-[#059669] text-white font-bold py-3 px-10 rounded-full transition-all shadow-lg hover:scale-105 text-sm md:text-base"
            >
              Contactez-nous
            </a>
          </div>
        </div>
      </div>
    </section>
  );
};
