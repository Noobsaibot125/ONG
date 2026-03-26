import React from 'react';
import { GalerieHero } from '../components/galerie/GalerieHero';
import { PhotoGrid } from '../components/galerie/PhotoGrid';
import { CallToAction } from '../components/galerie/CallToAction';

export const Galerie: React.FC = () => {
  return (
    <main className="bg-white">
      <GalerieHero />
      <PhotoGrid />
      <CallToAction />
    </main>
  );
};
