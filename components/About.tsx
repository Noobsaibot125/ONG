import React from 'react';
import { motion } from 'framer-motion';
import { MapPin, Users } from 'lucide-react';
import { useContent } from '../context/ContentContext';

export const About: React.FC = () => {
  const { get, imgSrc } = useContent();

  const p1    = get('accueil', 'about', 'paragraph1', "Fondée le 1er novembre 2017 sous la loi 1901 en France, l'ONG L'Amour Du Prochain est une organisation humanitaire présidée par M. Serge KADIO.");
  const p2    = get('accueil', 'about', 'paragraph2', "Nous œuvrons pour améliorer l'état de santé des populations, faciliter l'accès aux produits de première nécessité et fournir des soins médicaux de proximité en Afrique de l'Ouest.");
  const quote = get('accueil', 'about', 'quote',      '"Notre mission est de transformer la précarité en espoir par la solidarité active."');
  const image = imgSrc(get('accueil', 'about', 'image'), '/images/about_action_1767601389660.png');

  return (
    <section id="about" className="py-24 bg-[#FAFCFB] overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col lg:flex-row gap-20 items-center">

          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="lg:w-1/2"
          >
            <h2 className="text-4xl md:text-5xl font-extrabold text-gray-900 mb-6 tracking-tight">
              Qui sommes-nous ?
            </h2>
            <div className="w-24 h-2 bg-green-500 mb-10 rounded-full"></div>
            <div className="max-w-2xl space-y-6 mb-12">
              <p className="text-gray-500 font-medium leading-relaxed">{p1}</p>
              <p className="text-gray-500 font-medium leading-relaxed">{p2}</p>
            </div>
            <div className="flex flex-col sm:flex-row gap-6">
              <div className="flex-1 bg-white border border-gray-100 rounded-3xl p-6 shadow-sm">
                <div className="bg-[#E6F8F0] p-3 rounded-2xl text-[#10B981] w-fit mb-5">
                  <MapPin size={24} strokeWidth={2.5} />
                </div>
                <h4 className="font-extrabold text-gray-900 text-lg mb-2">Présence Locale</h4>
                <p className="text-gray-500 text-xs font-medium leading-relaxed">France (Siège) - Côte d'Ivoire - Burkina Faso.</p>
              </div>
              <div className="flex-1 bg-white border border-gray-100 rounded-3xl p-6 shadow-sm">
                <div className="bg-[#E6F8F0] p-3 rounded-2xl text-[#10B981] w-fit mb-5">
                  <Users size={24} strokeWidth={2.5} />
                </div>
                <h4 className="font-extrabold text-gray-900 text-lg mb-2">Engagement</h4>
                <p className="text-gray-500 text-xs font-medium leading-relaxed">Une équipe de bénévoles dévoués sur deux continents.</p>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="lg:w-1/2 relative mt-16 lg:mt-0 px-4 sm:px-10 lg:px-4"
          >
            <div className="relative">
              <div className="absolute -top-6 -right-3 w-[95%] h-[95%] bg-[#A1F0CE] rounded-[2.5rem] z-0"></div>
              <div className="relative rounded-[2.5rem] overflow-hidden shadow-2xl z-10 w-[95%]">
                <img src={image} alt="Action terrain humanitaire" className="w-full h-[400px] sm:h-[550px] object-cover" />
              </div>
              <motion.div
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="absolute -bottom-8 -left-4 sm:-bottom-12 sm:-left-8 bg-white p-6 sm:p-8 rounded-[2rem] shadow-[0_25px_60px_-15px_rgba(0,0,0,0.15)] max-w-[300px] sm:max-w-[340px] z-20"
              >
                <p className="text-gray-800 italic font-medium leading-relaxed mb-6 text-sm">{quote}</p>
                <div className="flex items-center gap-4">
                  <img src="https://picsum.photos/seed/kadio/150/150" alt="Avatar" className="w-12 h-12 rounded-full object-cover shadow-sm" />
                  <div>
                    <p className="font-extrabold text-gray-900 text-sm">M. Serge KADIO</p>
                    <p className="text-gray-400 font-extrabold text-[10px] sm:text-[11px] uppercase tracking-wide mt-0.5">Président Fondateur</p>
                  </div>
                </div>
              </motion.div>
            </div>
          </motion.div>

        </div>
      </div>
    </section>
  );
};
