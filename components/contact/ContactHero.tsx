import React from 'react';

export const ContactHero: React.FC = () => {
  return (
    <section className="relative pt-32 pb-24 lg:pt-48 lg:pb-36 flex items-center justify-center overflow-hidden">
      {/* Background Image with Blur */}
      <div 
        className="absolute inset-0 z-0"
        style={{
          backgroundImage: 'url("/images/gallery_gala_1767601463921.png")',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          filter: 'blur(4px) brightness(0.4)'
        }}
      />
      
      {/* Content */}
      <div className="relative z-10 text-center px-4 max-w-4xl mx-auto">
        <h1 className="text-5xl md:text-7xl font-extrabold text-white mb-6">
          <span className="text-green-500">Contactez</span>-nous
        </h1>
        <div className="w-24 h-1 bg-green-500 mx-auto mb-8"></div>
        <p className="text-xl md:text-2xl text-gray-200 font-medium leading-relaxed">
          Vous avez une question, un projet ou vous souhaitez devenir bénévole ? 
          Notre équipe est à votre écoute.
        </p>
      </div>
    </section>
  );
};
