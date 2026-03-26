import React from 'react';
import { QSNHero } from '../components/qsn/QSNHero';
import { QSNIntro } from '../components/qsn/QSNIntro';
import { QSNTeam } from '../components/qsn/QSNTeam';
import { QSNPresence } from '../components/qsn/QSNPresence';

export const QSN: React.FC = () => {
  return (
    <main className="bg-white">
      <QSNHero />
      <QSNIntro />
      <QSNTeam />
      <QSNPresence />
    </main>
  );
};
