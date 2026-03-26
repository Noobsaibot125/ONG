import React from 'react';
import { useContent } from '../../context/ContentContext';

const DEFAULTS = [
  { name: 'M. KADIO Kouame Serge',     role: 'Président Fondateur', image: '/images/Serge.png' },
  { name: 'M. Ilo Faustin Kouadio',    role: 'Président Fondateur', image: '/images/Faustin.png' },
  { name: 'M. KERE Dakelgaba Charles', role: 'Président Fondateur', image: '/images/Charles.png' },
];

const FALLBACK = 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=400';

export const QSNTeam: React.FC = () => {
  const { get, imgSrc } = useContent();

  const members = DEFAULTS.map((d, i) => ({
    name:  get('qsn', 'team', `member${i + 1}_name`,  d.name),
    role:  get('qsn', 'team', `member${i + 1}_role`,  d.role),
    image: imgSrc(get('qsn', 'team', `member${i + 1}_image`), d.image),
  }));

  return (
    <section className="py-24 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center text-slate-800">
        <h2 className="text-3xl md:text-5xl font-extrabold mb-4">Notre équipe dirigeante</h2>
        <p className="text-lg text-slate-500 mb-16 max-w-2xl mx-auto">
          Nous intervenons sur plusieurs fronts pour garantir un impact durable auprès des populations cibles.
        </p>
        <div className="flex flex-col md:flex-row justify-center items-center gap-12 md:gap-24">
          {members.map((member, index) => (
            <div key={index} className="flex flex-col items-center">
              <div className="w-48 h-48 md:w-56 md:h-56 rounded-full overflow-hidden mb-6 border-4 border-slate-100 shadow-lg">
                <img
                  src={member.image}
                  alt={member.name}
                  onError={(e) => { e.currentTarget.src = FALLBACK; }}
                  className="w-full h-full object-cover grayscale"
                />
              </div>
              <h3 className="text-xl font-bold">{member.name}</h3>
              <p className="text-emerald-600 font-semibold">{member.role}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
