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
                rows={4}
                className="w-full bg-[#1A1A1A]/40 border border-white/20 rounded-lg px-6 py-4 text-white outline-none focus:border-green-500 transition-colors placeholder-gray-400 resize-none"
              ></textarea>
              <button
                type="submit"
                className="w-full flex items-center justify-center gap-2 bg-green-500 hover:bg-green-600 text-white font-bold py-4 rounded-lg transition-colors mt-2"
              >
                Envoyer <Send size={20} />
              </button>
            </form>
          </div>

          {/* Opening Hours */}
          <div className="bg-green-500 rounded-lg p-10 text-white flex flex-col justify-between">
            <div>
              <h3 className="text-3xl font-bold mb-10">Horaires d'ouverture</h3>
              <div className="space-y-6">
                <div className="flex justify-between border-b border-white/20 pb-2">
                  <span className="font-medium text-lg">Lundi - Vendredi</span>
                  <span className="font-bold text-lg">08h00 - 18h00</span>
                </div>
                <div className="flex justify-between border-b border-white/20 pb-2">
                  <span className="font-medium text-lg">Samedi</span>
                  <span className="font-bold text-lg">09h00 - 13h00</span>
                </div>
                <div className="flex justify-between">
                  <span className="font-medium text-lg">Dimanche</span>
                  <span className="font-bold text-lg">Fermé</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
