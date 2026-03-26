import React from 'react';
import { HeartPulse, GraduationCap, Users, CheckCircle2 } from 'lucide-react';
import { useContent } from '../../context/ContentContext';

const DEFAULTS = [
  {
    title: 'Santé & Médical',
    description: "L'accès aux soins est un droit fondamental. Nous collectons et acheminons du matériel médical de pointe vers les zones qui en manquent cruellement.",
    points: ["Don de lits d'hôpitaux et équipements spécialisés.", "Acheminement de médicaments essentiels.", "Campagnes de dépistage et de vaccination.", "Soutien aux infrastructures de santé locales."],
    icon: <HeartPulse className="w-8 h-8 text-green-500" />,
    image: '/images/gallery_medical_1767601428468.png',
  },
  {
    title: 'Éducation pour tous',
    description: "L'éducation est la clé d'un avenir meilleur. Nous fournissons des outils pour permettre aux enfants d'étudier dans de bonnes conditions.",
    points: ["Distribution de kits scolaires.", "Bourses d'études pour les plus démunis.", "Réhabilitation de salles de classe.", "Soutien au corps enseignant."],
    icon: <GraduationCap className="w-8 h-8 text-blue-500" />,
    image: '/images/gallery_school_1767601411654.png',
  },
  {
    title: 'Soutien Social',
    description: "En période de crise ou dans le besoin au quotidien, nous apportons un soutien moral et matériel aux populations vulnérables.",
    points: ["Distributions alimentaires d'urgence.", "Fourniture de vêtements et produits d'hygiène.", "Accompagnement psychologique.", "Activités de réinsertion sociale."],
    icon: <Users className="w-8 h-8 text-green-500" />,
    image: '/images/gallery_food_1767601442503.png',
  },
];

export const ActionBlocks: React.FC = () => {
  const { get, imgSrc } = useContent();

  const actions = (['action1', 'action2', 'action3'] as const).map((ak, idx) => {
    const d = DEFAULTS[idx];
    return {
      title:       get('actions', ak, 'title',       d.title),
      description: get('actions', ak, 'description', d.description),
      points: [1, 2, 3, 4].map(n => get('actions', ak, `point${n}`, d.points[n - 1] ?? '')).filter(Boolean),
      icon:  d.icon,
      image: imgSrc(get('actions', ak, 'image'), d.image),
    };
  });

  return (
    <section className="py-20 bg-white" id="actions-content">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-20">
          <h2 className="text-3xl font-extrabold text-gray-900 mb-4">Nos Actions</h2>
          <p className="text-gray-600 max-w-2xl mx-auto text-lg">
            Nous intervenons sur plusieurs fronts pour garantir un impact durable auprès des populations cibles.
          </p>
        </div>

        <div className="space-y-24">
          {actions.map((action, index) => {
            const isEven = index % 2 === 0;
            return (
              <div key={action.title} className={`flex flex-col ${isEven ? 'lg:flex-row' : 'lg:flex-row-reverse'} gap-12 items-center`}>
                <div className="flex-1 space-y-6">
                  <div className="w-16 h-16 bg-green-50 rounded-2xl flex items-center justify-center">{action.icon}</div>
                  <h3 className="text-3xl font-bold text-gray-900">{action.title}</h3>
                  <p className="text-gray-600 text-lg leading-relaxed">{action.description}</p>
                  <ul className="space-y-4 pt-4">
                    {action.points.map((point, idx) => (
                      <li key={idx} className="flex items-start gap-3">
                        <CheckCircle2 className="w-6 h-6 text-green-500 flex-shrink-0 mt-0.5" />
                        <span className="text-gray-600 font-medium">{point}</span>
                      </li>
                    ))}
                  </ul>
                </div>
                <div className="flex-1 relative w-full">
                  <div className="relative rounded-3xl overflow-hidden shadow-2xl aspect-[4/3]">
                    <img src={action.image} alt={action.title} className="w-full h-full object-cover"
                      onError={(e) => { e.currentTarget.src = "https://images.unsplash.com/photo-1593113563332-caef88d86dc8?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"; }} />
                  </div>
                  <div className={`absolute -bottom-8 ${isEven ? '-right-8' : '-left-8'} bg-green-500 text-white rounded-full w-32 h-32 flex flex-col items-center justify-center shadow-xl z-10 border-4 border-white transform transition duration-500 hover:scale-105`}>
                    <span className="font-bold text-lg leading-tight text-center">Impact<br/>Réel</span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
