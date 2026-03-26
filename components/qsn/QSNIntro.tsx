import React from 'react';
import { Heart } from 'lucide-react';
import { useContent } from '../../context/ContentContext';

export const QSNIntro: React.FC = () => {
  const { get, imgSrc } = useContent();

  const p1  = get('qsn', 'intro', 'paragraph1', "L'ONG L'Amour Du Prochain a été créée le 1er novembre 2017 en France. Notre structure est régie par la loi du 1er juillet 1901 et le décret du 16 août 1901.");
  const p2  = get('qsn', 'intro', 'paragraph2', "Sous la présidence de M. Serge KADIO, l'association s'est donnée pour mission principale d'apporter un soutien concret aux populations les plus démunies, avec un focus particulier sur l'Afrique de l'Ouest.");
  const img1 = imgSrc(get('qsn', 'intro', 'image1'), '/images/gallery_volunteers_1767601495628.png');
  const img2 = imgSrc(get('qsn', 'intro', 'image2'), '/images/gallery_kids_1767601480524.png');
  const img3 = imgSrc(get('qsn', 'intro', 'image3'), '/images/gallery_school_1767601411654.png');

  return (
    <section className="py-24 bg-white relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">

          <div className="relative p-8 md:p-12 w-full isolate">
            <div className="absolute inset-0 bg-[#8FF1BE] rounded-3xl transform -rotate-3 z-[-1]" />
            <h2 className="text-3xl md:text-5xl font-extrabold text-slate-900 mb-6 tracking-tight">Qui sommes-nous ?</h2>
            <div className="text-slate-900 space-y-6 text-lg font-medium leading-relaxed">
              <p>{p1}</p>
              <p>{p2}</p>
            </div>
            <div className="mt-12 bg-white rounded-3xl p-6 md:p-8 shadow-xl">
              <div className="flex items-center gap-3 mb-6">
                <Heart className="text-emerald-500 fill-emerald-500 w-6 h-6" />
                <h3 className="text-2xl font-extrabold text-slate-900">Nos Valeurs</h3>
              </div>
              <div className="grid grid-cols-2 gap-y-6 gap-x-8 text-slate-600 font-medium text-lg">
                <span>Solidarité</span>
                <span>Transparence</span>
                <span>Engagement</span>
                <span>Dignité</span>
              </div>
            </div>
          </div>

          <div className="relative h-[650px] w-full hidden lg:block">
            <div className="absolute top-0 right-4 w-[75%] h-[40%] rounded-3xl overflow-hidden shadow-xl z-0 transform hover:scale-[1.02] transition duration-500">
              <img src={img1} alt="Community building" className="w-full h-full object-cover"
                onError={(e) => { e.currentTarget.src = "https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?auto=format&fit=crop&q=80&w=800"; }} />
            </div>
            <div className="absolute top-[35%] left-0 w-[55%] h-[60%] rounded-3xl overflow-hidden shadow-2xl z-20 transform hover:scale-[1.02] transition duration-500">
              <img src={img2} alt="Children smiling" className="w-full h-full object-cover"
                onError={(e) => { e.currentTarget.src = "https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?auto=format&fit=crop&q=80&w=800"; }} />
            </div>
            <div className="absolute top-[45%] right-0 w-[55%] h-[45%] rounded-3xl overflow-hidden shadow-xl z-10 transform hover:scale-[1.02] transition duration-500">
              <img src={img3} alt="Volunteers helping" className="w-full h-full object-cover"
                onError={(e) => { e.currentTarget.src = "https://images.unsplash.com/photo-1593113630400-ea4288922497?auto=format&fit=crop&q=80&w=800"; }} />
            </div>
          </div>

          <div className="flex flex-col gap-4 lg:hidden mt-8">
            <img src={img1} alt="Group"    className="w-full h-48 object-cover rounded-3xl shadow-md" onError={(e) => { e.currentTarget.src = "https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?auto=format&fit=crop&q=80&w=800"; }} />
            <img src={img2} alt="Children" className="w-full h-48 object-cover rounded-3xl shadow-md" onError={(e) => { e.currentTarget.src = "https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?auto=format&fit=crop&q=80&w=800"; }} />
          </div>

        </div>
      </div>
    </section>
  );
};
