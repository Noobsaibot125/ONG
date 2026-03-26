import React from 'react';
import { motion } from 'framer-motion';
import { useContent, API_URL } from '../context/ContentContext';

const STATIC_IMAGES = [
  { url: '/images/gallery_school_1767601411654.png',     caption: 'Distribution de kits scolaires', location: 'Nagreongo, BF' },
  { url: '/images/gallery_medical_1767601428468.png',    caption: 'Réception de lits médicalisés',  location: 'Abidjan, CI' },
  { url: '/images/gallery_food_1767601442503.png',       caption: 'Aide alimentaire aux veuves',    location: 'Banfora, BF' },
  { url: '/images/gallery_gala_1767601463921.png',       caption: 'Gala de charité 2023',           location: 'Argenteuil, FR' },
  { url: '/images/gallery_kids_1767601480524.png',       caption: "Sourires d'enfants",             location: 'Bouaké, CI' },
  { url: '/images/gallery_volunteers_1767601495628.png', caption: 'Nos bénévoles en action',        location: 'Paris, FR' },
];

export const Gallery: React.FC = () => {
  const { gallery } = useContent();

  const images = gallery.length > 0
    ? gallery.map(img => ({
        url: `${API_URL}${img.image_url}`,
        caption: img.title || '',
        location: img.category,
      }))
    : STATIC_IMAGES;

  return (
    <section id="gallery" className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row justify-between items-end mb-12">
          <div className="text-left">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">Galerie Photos</h2>
            <div className="w-20 h-1 bg-green-500 rounded-full"></div>
          </div>
          <p className="text-gray-500 mt-4 md:mt-0 max-w-md text-right">
            Découvrez en images l'impact de vos dons et le sourire de nos bénéficiaires.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {images.map((img, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              className="group relative h-64 rounded-xl overflow-hidden cursor-pointer shadow-md"
            >
              <img src={img.url} alt={img.caption} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-6">
                <span className="text-green-400 text-xs font-bold uppercase tracking-wider mb-1">{img.location}</span>
                <h3 className="text-white font-bold text-lg">{img.caption}</h3>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};
