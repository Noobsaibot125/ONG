import React, { useEffect } from 'react';
import { DonHero } from '../components/don/DonHero';
import { DonForm } from '../components/don/DonForm';

export const Don: React.FC = () => {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="bg-white">
      <DonHero />
      <DonForm />
    </div>
  );
};
