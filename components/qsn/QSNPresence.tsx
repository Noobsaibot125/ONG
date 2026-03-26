import React from 'react';
import { MapPin } from 'lucide-react';

export const QSNPresence: React.FC = () => {
  return (
    <section className="py-24 bg-white px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      <div className="relative rounded-[2.5rem] overflow-hidden bg-slate-900 shadow-2xl">
        {/* Background Image & Overlay */}
        <div 
          className="absolute inset-0 z-0 bg-cover bg-center opacity-40"
          style={{ backgroundImage: "url('/images/gallery_kids_1767601480524.png')" }}
        ></div>
        
        {/* Content */}
        <div className="relative z-10 p-12 md:p-16 text-center">
          <h2 className="text-3xl md:text-5xl font-extrabold text-white mb-16">
            Notre présence internationale
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-10 text-left">
            {/* France */}
            <div className="flex items-start gap-4">
              <div className="bg-emerald-500 p-3 rounded-xl flex-shrink-0">
                <MapPin className="text-white w-8 h-8" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-white">France (Siège)</h3>
                <p className="text-emerald-400 font-semibold mb-2">Argenteuil</p>
                <p className="text-slate-300 text-sm leading-relaxed">
                  Coordination générale et levée de fonds.
                </p>
              </div>
            </div>

            {/* Côte d'Ivoire */}
            <div className="flex items-start gap-4">
              <div className="bg-emerald-500 p-3 rounded-xl flex-shrink-0">
                <MapPin className="text-white w-8 h-8" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-white">Côte d'Ivoire</h3>
                <p className="text-emerald-400 font-semibold mb-2">Abidjan et régions</p>
                <p className="text-slate-300 text-sm leading-relaxed">
                  Antenne opérationnelle pour les projets de santé.
                </p>
              </div>
            </div>

            {/* Burkina Faso */}
            <div className="flex items-start gap-4">
              <div className="bg-emerald-500 p-3 rounded-xl flex-shrink-0">
                <MapPin className="text-white w-8 h-8" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-white">Burkina Faso</h3>
                <p className="text-emerald-400 font-semibold mb-2">Ouagadougou et zones rurales</p>
                <p className="text-slate-300 text-sm leading-relaxed">
                  Antenne opérationnelle pour l'éducation et l'aide alimentaire.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
