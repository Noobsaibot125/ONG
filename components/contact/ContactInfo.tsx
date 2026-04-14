import React from 'react';
import { Phone, Mail } from 'lucide-react';
import { useContent } from '../../context/ContentContext';

export const ContactInfo: React.FC = () => {
  const { get } = useContent();

  const phone    = get('contact', 'info',  'phone',    '+33 1 23 45 67 89 | +33 1 23 45 67 89');
  const email    = get('contact', 'info',  'email',    'contact@lamourduprochain.org');

  return (
    <section className="py-16 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Email Card */}
          <div className="bg-[#E6F7F1]/50 rounded-2xl p-8 flex flex-col items-center justify-center text-center shadow-sm border border-green-100 hover:shadow-md transition-shadow">
            <div className="w-16 h-16 bg-green-500 rounded-full flex items-center justify-center text-white mb-6">
              <Mail size={28} />
            </div>
            <h3 className="text-2xl font-bold text-gray-900 mb-2">Email</h3>
            <p className="text-gray-700 font-medium text-lg">{email}</p>
          </div>

          {/* Phone Card */}
          <div className="bg-[#E6F7F1]/50 rounded-2xl p-8 flex flex-col items-center justify-center text-center shadow-sm border border-green-100 hover:shadow-md transition-shadow">
            <div className="w-16 h-16 bg-green-500 rounded-full flex items-center justify-center text-white mb-6">
              <Phone size={28} />
            </div>
            <h3 className="text-2xl font-bold text-gray-900 mb-2">Téléphone</h3>
            <p className="text-gray-700 font-medium text-lg">{phone}</p>
          </div>
        </div>
      </div>
    </section>
  );
};

