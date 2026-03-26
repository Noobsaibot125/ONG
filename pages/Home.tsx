import React from 'react';
import { Hero } from '../components/Hero';
import { About } from '../components/About';
import { Actions } from '../components/Actions';
import { Stats } from '../components/Stats';
import { Partners } from '../components/Partners';

export const Home: React.FC<{ onOpenDonation: () => void }> = ({ onOpenDonation }) => {
  return (
    <main>
      <Hero onOpenDonation={onOpenDonation} />
      <About />
      <Actions />
      <Stats />
      <Partners />
    </main>
  );
};
