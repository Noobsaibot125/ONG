import React from 'react';
import { Activity, GraduationCap, Heart, AlertCircle, ChevronRight } from 'lucide-react';
import { motion } from 'framer-motion';

const actions = [
  {
    title: 'Santé',
    description: "Don de matériel médical (lits d'hôpitaux, ambulances) à l'Hôpital Zoe Bruno et au Burkina Faso.",
    icon: Activity,
    innerIconBg: 'bg-cyan-100',
    iconColor: 'text-cyan-500',
    borderColor: 'border-cyan-400',
    lineBg: 'bg-cyan-400',
    glowHover: 'hover:shadow-[0_0_35px_rgba(34,211,238,0.45)]'
  },
  {
    title: 'Éducation',
    description: "Distribution de kits scolaires et de vivres à l'Association El-Hadj Saidou Bikienga. Rénovation de classes.",
    icon: GraduationCap,
    innerIconBg: 'bg-orange-100',
    iconColor: 'text-orange-500',
    borderColor: 'border-orange-400',
    lineBg: 'bg-orange-400',
    glowHover: 'hover:shadow-[0_0_35px_rgba(251,146,60,0.45)]'
  },
  {
    title: 'Social',
    description: 'Accompagnement des personnes atteintes du VIH, distribution de vivres et soutien financier aux familles.',
    icon: Heart,
    innerIconBg: 'bg-emerald-100',
    iconColor: 'text-emerald-500',
    borderColor: 'border-emerald-400',
    lineBg: 'bg-emerald-400',
    glowHover: 'hover:shadow-[0_0_35px_rgba(52,211,153,0.45)]'
  },
  {
    title: 'Urgences',
    description: "Don de matériel médical (lits d'hôpitaux, ambulances) à l'Hôpital Zoe Bruno et au Burkina Faso.",
    icon: AlertCircle,
    innerIconBg: 'bg-red-100',
    iconColor: 'text-red-500',
    borderColor: 'border-red-400',
    lineBg: 'bg-red-400',
    glowHover: 'hover:shadow-[0_0_35px_rgba(248,113,113,0.45)]'
  },
];

export const Actions: React.FC = () => {
  return (
    <section id="actions" className="py-24 bg-[#FAFCFB]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-20">
          <h2 className="text-4xl font-extrabold text-gray-900 mb-4 tracking-tight">Nos Actions</h2>
          <div className="w-16 h-2 bg-green-500 mx-auto rounded-full mb-8"></div>
          <p className="text-gray-500 max-w-2xl mx-auto text-lg leading-relaxed font-medium">
            Découvrez comment nous transformons votre solidarité en des actions concrètes sur le terrain.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 xl:gap-8">
          {actions.map((action, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              className={`bg-white rounded-[1.5rem] p-8 transition-shadow duration-300 border-[1.5px] ${action.borderColor} ${action.glowHover} flex flex-col items-start text-left`}
            >
              <div className={`p-3.5 rounded-2xl ${action.innerIconBg} ${action.iconColor} mb-6`}>
                <action.icon size={36} strokeWidth={2.5} />
              </div>
              <h3 className="text-[1.35rem] font-extrabold text-gray-900 mb-4 tracking-tight">{action.title}</h3>
              <p className="text-gray-500 leading-relaxed text-[13px] xl:text-sm font-medium mb-8 flex-grow">
                {action.description}
              </p>
              
              {/* Colored Line exactly matching the border */}
              <div className={`w-full h-[1.5px] ${action.lineBg} mb-5`}></div>
              
              {/* Black / Dark Gray Details Link */}
              <a href="#gallery" className="text-sm font-extrabold flex items-center gap-1 text-gray-900 hover:opacity-70 transition-opacity tracking-wide">
                Détails
                <ChevronRight size={18} strokeWidth={3} className="mt-0.5" />
              </a>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};