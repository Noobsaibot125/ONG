import React from 'react';
import { motion } from 'framer-motion';
import { useContent } from '../context/ContentContext';

export const Hero: React.FC<{ onOpenDonation: () => void }> = ({ onOpenDonation }) => {
  const { get, imgSrc } = useContent();

  const title    = get('accueil', 'hero', 'title',    'Promouvoir la Solidarité en France et en Afrique');
  const subtitle = get('accueil', 'hero', 'subtitle', 'Aider les veuves, les orphelins et les populations vulnérables par des actions concrètes et durables sur le terrain.');
  const bgImage  = imgSrc(get('accueil', 'hero', 'image'), '/images/hero_bg_1767601371786.png');

  return (
    <div id="hero" className="relative h-screen min-h-[600px] flex items-center justify-center overflow-hidden">
      <div className="absolute inset-0 z-0">
        <img src={bgImage} alt="Bénévoles humanitaires" className="w-full h-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-r from-black/80 to-black/40"></div>
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <h1 className="text-5xl md:text-7xl font-bold text-white mb-6 leading-[1.2]">
            {title}
          </h1>
          <div className="w-24 h-1.5 bg-green-500 mx-auto rounded-full mb-8"></div>
          <p className="text-lg md:text-2xl text-gray-200 mb-10 max-w-4xl mx-auto font-medium leading-relaxed">
            {subtitle}
          </p>
          <div className="flex flex-col sm:flex-row gap-5 justify-center">
            <a
              href="#actions"
              className="px-8 py-3.5 bg-green-600 hover:bg-green-700 text-white rounded-full font-bold text-lg transition-colors shadow-lg"
            >
              Notre Mission
            </a>
            <button
              onClick={onOpenDonation}
              className="px-8 py-3.5 bg-white text-green-700 hover:bg-gray-100 rounded-full font-bold text-lg transition-colors shadow-lg"
            >
              Nous Rejoindre
            </button>
          </div>
        </motion.div>
      </div>
    </div>
  );
};
