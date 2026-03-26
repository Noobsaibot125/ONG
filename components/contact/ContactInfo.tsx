import React from 'react';
import { MapPin, Phone, Mail, Clock } from 'lucide-react';
import { useContent } from '../../context/ContentContext';

export const ContactInfo: React.FC = () => {
  const { get } = useContent();

  const address  = get('contact', 'info',  'address',  'Cocody, Angré, Nelson Mandela');
  const phone    = get('contact', 'info',  'phone',    '');
  const email    = get('contact', 'info',  'email',    '');
  const weekHours = get('contact', 'hours', 'week',    '08h00 - 18h00');
  const weekendHours = get('contact', 'hours', 'weekend', '');

  const items = [
    { icon: MapPin, label: 'Adresse',          value: address,      show: true },
    { icon: Phone,  label: 'Téléphone',         value: phone,        show: !!phone },
    { icon: Mail,   label: 'Email',             value: email,        show: !!email },
    { icon: Clock,  label: 'Horaires (Semaine)', value: weekHours,   show: !!weekHours },
    { icon: Clock,  label: 'Horaires (Weekend)', value: weekendHours, show: !!weekendHours },
  ].filter(i => i.show);

  return (
    <section className="py-16 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {items.map((item, i) => (
            <div key={i} className="bg-[#E6F7F1] rounded-2xl p-8 flex items-center gap-6 shadow-sm border border-green-100">
              <div className="w-16 h-16 bg-green-500 rounded-full flex items-center justify-center text-white shrink-0">
                <item.icon size={28} />
              </div>
              <div className="text-left">
                <h3 className="text-xl font-bold text-gray-900 mb-1">{item.label}</h3>
                <p className="text-gray-700 font-medium">{item.value}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
