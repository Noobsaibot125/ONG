import React from 'react';

const partners = [
  { name: 'CAR 225', iconMode: true },
  { name: 'Partner 2', src: '/images/partner2.png' },
  { name: 'EMMA', src: '/images/emma.png' },
  { name: 'Partner 4', src: '/images/partner4.png' },
  { name: 'Partner 5', src: '/images/partner5.png' },
  { name: 'Volkswagen', src: '/images/vw.png' },
  { name: 'Partner 7', src: '/images/partner7.png' },
  { name: 'Partner 8', src: '/images/partner8.png' },
];

export const Partners: React.FC = () => {
  return (
    <section className="py-24 bg-white text-center">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-4xl font-extrabold text-black tracking-tight uppercase mb-4">Partenaires</h2>
        <p className="text-gray-500 max-w-2xl mx-auto mb-16 font-medium text-[15px]">
          Ils nous font confiance et nous accompagnent dans nos missions au quotidien pour un impact durable.
        </p>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-y-16 gap-x-8 items-center justify-items-center max-w-4xl mx-auto">
          {partners.map((p, idx) => (
            <div key={idx} className="flex justify-center items-center h-16 w-32 grayscale hover:grayscale-0 transition-all opacity-80 hover:opacity-100 cursor-pointer">
              {p.iconMode ? (
                <div className="flex flex-col items-center">
                  <span className="text-[#f97316] font-extrabold text-3xl leading-none">CAR</span>
                  <span className="text-[#10b981] font-extrabold text-3xl leading-none">225</span>
                </div>
              ) : (
                <>
                  <img 
                    src={p.src} 
                    alt={p.name} 
                    className="max-h-16 max-w-full object-contain"
                    onError={(e) => {
                      e.currentTarget.style.display = 'none';
                      e.currentTarget.nextElementSibling?.classList.remove('hidden');
                    }}
                  />
                  {/* Fallback box if image is missing so the layout doesn't break */}
                  <div className="hidden bg-gray-100 rounded-full h-16 w-16 flex items-center justify-center text-gray-400 font-bold uppercase overflow-hidden border-2 border-dashed border-gray-300">
                    Logo
                  </div>
                </>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
