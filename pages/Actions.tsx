import React from 'react';
import { ActionsHero } from '../components/actions/ActionsHero';
import { ActionBlocks } from '../components/actions/ActionBlocks';

export const Actions: React.FC = () => {
  return (
    <main className="bg-white">
      <ActionsHero />
      <ActionBlocks />
    </main>
  );
};
