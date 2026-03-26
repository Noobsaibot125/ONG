import React from 'react';
import { useContent } from '../../context/ContentContext';

export const QSNHero: React.FC = () => {
  const { get, imgSrc } = useContent();

  const title    = get('qsn', 'hero', 'title',    'Qui sommes-nous ?');
  const subtitle = get('qsn', 'hero', 'subtitle', "Une organisation dévouée à l'Humain, née d'une volonté de partage et de solidarité sans frontières.");
  const bgImage  = imgSrc(get('qsn', 'hero', 'image'), '/images/about_action_1767601389660.png');

  return (
    <section className="relative pt-32 pb-24 lg:pt-48 lg:pb-36 overflow-hidden">
      <div
        className="absolute inset-0 z-0 bg-cover bg-center"
        style={{ backgroundImage: `url('${bgImage}')` }}
      ></div>
      <div className="absolute inset-0 bg-gray-900/70 z-10"></div>
      <div className="relative z-20 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <h1 className="text-4xl md:text-6xl font-extrabold text-white tracking-tight">
          {title.includes('sommes') ? (
            <>Qui <span className="text-green-500">sommes</span>-nous ?</>
          ) : title}
        </h1>
        <p className="text-lg md:text-xl text-gray-200 mt-6 max-w-3xl mx-auto font-medium leading-relaxed">
          {subtitle}
        </p>
      </div>
    </section>
  );
};
