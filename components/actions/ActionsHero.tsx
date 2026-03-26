import React from 'react';

export const ActionsHero: React.FC = () => {
  return (
    <section className="relative pt-32 pb-24 lg:pt-48 lg:pb-36 overflow-hidden">
      {/* Background Image & Overlay */}
      <div 
        className="absolute inset-0 z-0 bg-cover bg-center"
        style={{ backgroundImage: "url('/images/hero_bg_1767601371786.png')" }}
      ></div>
      <div className="absolute inset-0 bg-gray-900/70 z-10"></div>
      
      {/* Content */}
      <div className="relative z-20 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center flex flex-col items-center">
        <h1 className="text-4xl md:text-6xl font-extrabold text-white tracking-tight">
          Nos <span className="text-green-500">Actions</span>
        </h1>
        <p className="text-lg md:text-xl text-gray-200 mt-6 max-w-3xl font-medium leading-relaxed">
          Découvrez comment nous transformons vos dons en actions concrètes sur le terrain.
        </p>
      </div>
    </section>
  );
};
