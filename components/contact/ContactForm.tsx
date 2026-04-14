import React from 'react';
import { Send, MapPin } from 'lucide-react';

export const ContactForm: React.FC = () => {
  return (
    <section className="relative py-24 overflow-hidden">
      {/* Background with Image and Dark Overlay */}
      <div 
        className="absolute inset-0 z-0"
        style={{
          backgroundImage: 'url("/images/gallery_school_1767601411654.png")',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }}
      >
        <div className="absolute inset-0 bg-gray-950/85"></div>
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* International Presence Title */}
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-white tracking-tight">
            Notre présence internationale
          </h2>
        </div>

        {/* Presence Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-24">
          {/* France */}
          <div className="flex items-start gap-4">
            <div className="bg-green-500 p-2.5 rounded-lg text-white shrink-0">
              <MapPin size={26} />
            </div>
            <div>
              <h4 className="text-xl font-bold text-white">France (Siège)</h4>
              <p className="text-green-500 font-bold text-sm">Argenteuil</p>
              <p className="text-gray-300 text-sm mt-1 leading-snug">Coordination générale et levée de fonds.</p>
            </div>
          </div>

          {/* Côte d'Ivoire */}
          <div className="flex items-start gap-4">
            <div className="bg-green-500 p-2.5 rounded-lg text-white shrink-0">
              <MapPin size={26} />
            </div>
            <div>
              <h4 className="text-xl font-bold text-white">Côte d'Ivoire</h4>
              <p className="text-green-500 font-bold text-sm">Abidjan et régions</p>
              <p className="text-gray-300 text-sm mt-1 leading-snug">Antenne opérationnelle pour les projets de santé.</p>
            </div>
          </div>

          {/* Burkina Faso */}
          <div className="flex items-start gap-4">
            <div className="bg-green-500 p-2.5 rounded-lg text-white shrink-0">
              <MapPin size={26} />
            </div>
            <div>
              <h4 className="text-xl font-bold text-white">Burkina Faso</h4>
              <p className="text-green-500 font-bold text-sm">Nagreongo et zones rurales</p>
              <p className="text-gray-300 text-sm mt-1 leading-snug">Antenne opérationnelle pour l'éducation et l'aide alimentaire.</p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
          {/* Form */}
          <div className="lg:col-span-2">
            <form className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <input
                  type="text"
                  placeholder="Nom & Prénom"
                  className="w-full bg-[#1A1A1A]/40 border border-white/20 rounded-lg px-6 py-4 text-white outline-none focus:border-green-500 transition-colors placeholder-gray-400"
                />
                <input
                  type="email"
                  placeholder="Adresse mail"
                  className="w-full bg-[#1A1A1A]/40 border border-white/20 rounded-lg px-6 py-4 text-white outline-none focus:border-green-500 transition-colors placeholder-gray-400"
                />
              </div>
              <input
                type="text"
                placeholder="Titre du sujet"
                className="w-full bg-[#1A1A1A]/40 border border-white/20 rounded-lg px-6 py-4 text-white outline-none focus:border-green-500 transition-colors placeholder-gray-400"
              />
              <textarea
                placeholder="Ecrivez votre message..."
                rows={6}
                className="w-full bg-[#1A1A1A]/40 border border-white/20 rounded-lg px-6 py-4 text-white outline-none focus:border-green-500 transition-colors placeholder-gray-400 resize-none"
              ></textarea>
              <button
                type="submit"
                className="w-full flex items-center justify-center gap-2 bg-green-500 hover:bg-green-600 text-white font-extrabold py-4 rounded-full transition-all mt-2 text-lg shadow-lg hover:shadow-green-500/20"
              >
                Envoyer <Send size={20} className="rotate-45 ml-1" />
              </button>
            </form>
          </div>

          {/* Opening Hours */}
          <div className="bg-green-500 rounded-2xl p-8 text-white flex flex-col items-center text-center">
            <h3 className="text-2xl font-bold mb-4">Horaires d'ouverture</h3>
            <p className="text-white/90 text-sm mb-8 max-w-[200px]">
              Nous sommes disponibles pour vous accueillir ou répondre à vos appels
            </p>
            <div className="w-full space-y-4">
              <div className="flex justify-between items-center text-sm">
                <span className="font-semibold">Lundi - Vendredi</span>
                <span className="font-bold">09:00 - 18:00</span>
              </div>
              <div className="flex justify-between items-center text-sm border-t border-white/20 pt-4">
                <span className="font-semibold">Samedi</span>
                <span className="font-bold">10:00 - 14:00</span>
              </div>
              <div className="flex justify-between items-center text-sm border-t border-white/20 pt-4">
                <span className="font-semibold">Dimanche</span>
                <span className="font-bold">Fermé</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

