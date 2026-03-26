import React from 'react';

export const GalerieHero: React.FC = () => {
  return (
    <section className="relative pt-32 pb-24 lg:pt-48 lg:pb-36 overflow-hidden">
      {/* Background Image & Overlay */}
      <div 
        className="absolute inset-0 z-0 bg-cover bg-center"
        style={{ backgroundImage: "url('/images/gallery_gala_1767601463921.png')" }}
      ></div>
      <div className="absolute inset-0 bg-gray-900/60 z-10"></div>
      
      {/* Content */}
      <div className="relative z-20 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center flex flex-col items-center">
        <h1 className="text-4xl md:text-6xl font-extrabold text-white tracking-tight">
          Galerie <span className="text-green-500">Photos</span>
        </h1>
        <p className="text-lg md:text-xl text-gray-200 mt-6 max-w-3xl font-medium leading-relaxed">
          Découvrez en images l'impact de vos dons et le sourire de nos bénéficiaires.
        </p>
      </div>
    </section>
  );
};
