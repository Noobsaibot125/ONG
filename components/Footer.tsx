import React from 'react';
import { Linkedin, Instagram, Facebook } from 'lucide-react';
import { Link } from 'react-router-dom';

export const Footer: React.FC<{ onOpenDonation: () => void }> = ({ onOpenDonation }) => {
  return (
    <>

      <footer id="footer" className="bg-[#278655] text-white pt-16 pb-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-16">

            {/* Column 1: About */}
            <div className="col-span-1 pr-4">
              <div className="flex items-center space-x-3 mb-6">
                <img src="/images/logosansfondcontour.png" alt="Logo" className="h-10 w-auto filter brightness-0 invert" 
                  onError={(e) => {
                    e.currentTarget.style.display = 'none';
                    e.currentTarget.nextElementSibling?.classList.remove('hidden');
                  }} 
                />
                <span className="font-extrabold text-2xl tracking-tight">L'Amour Du Prochain</span>
              </div>
              <p className="text-sm leading-relaxed mb-8 text-green-50 font-medium">
                Association humanitaire loi 1901 œuvrant pour l'amélioration des conditions de vie des populations vulnérables en France et en Afrique de l'Ouest.
              </p>
              <div className="flex space-x-5">
                <a href="#" className="text-white hover:text-green-200 transition-colors">
                  <Linkedin size={22} fill="currentColor" strokeWidth={0} />
                </a>
                <a href="#" className="text-white hover:text-green-200 transition-colors">
                  <Instagram size={22} />
                </a>
                <a href="#" className="text-white hover:text-green-200 transition-colors">
                  <Facebook size={22} fill="currentColor" strokeWidth={0} />
                </a>
              </div>
            </div>

            {/* Column 2: Quick Links */}
            <div>
              <h3 className="font-extrabold text-lg mb-6 tracking-wide">Liens Rapides</h3>
              <ul className="space-y-3 text-sm text-green-50 font-medium">
                <li><Link to="/" className="hover:text-white transition-colors">Accueil</Link></li>
                <li><Link to="/qsn" className="hover:text-white transition-colors">Qui sommes-nous</Link></li>
                <li><a href="/#actions" className="hover:text-white transition-colors">Nos Actions</a></li>
                <li><a href="/#gallery" className="hover:text-white transition-colors">Galerie</a></li>
                <li><button onClick={onOpenDonation} className="hover:text-white transition-colors">Faire un don</button></li>
              </ul>
            </div>

            {/* Column 3: Actions */}
            <div>
              <h3 className="font-extrabold text-lg mb-6 tracking-wide">Nos Actions</h3>
              <ul className="space-y-3 text-sm text-green-50 font-medium">
                <li><a href="/#actions" className="hover:text-white transition-colors">Santé & Médical</a></li>
                <li><a href="/#actions" className="hover:text-white transition-colors">Éducation pour tous</a></li>
                <li><a href="/#actions" className="hover:text-white transition-colors">Soutien Social</a></li>
                <li><a href="/#actions" className="hover:text-white transition-colors">Urgences Humanitaires</a></li>
              </ul>
            </div>

            {/* Column 4: Contact */}
            <div id="contact">
              <h3 className="font-extrabold text-lg mb-6 tracking-wide">Nous Contacter</h3>
              <ul className="space-y-3 text-sm text-green-50 font-medium leading-relaxed">
                <li>108 rue de Montigny,<br />95100 Argenteuil, France</li>
                <li><a href="mailto:lamourduprochain1@gmail.com" className="hover:text-white transition-colors">lamourduprochain1@gmail.com</a></li>
                <li><a href="tel:+33699449619" className="hover:text-white transition-colors">+33 6 99 44 96 19 m.ci</a></li>
              </ul>
            </div>
          </div>

          <div className="border-t border-green-600/50 pt-8 flex flex-col md:flex-row justify-between items-center text-xs text-green-100 font-medium">
            <p>&copy; {new Date().getFullYear()} ONG L'Amour Du Prochain. Tous droits réservés.</p>
            <div className="flex gap-6 mt-4 md:mt-0">
              <a href="#" className="hover:text-white transition-colors">Mentions Légales</a>
              <a href="#" className="hover:text-white transition-colors">Confidentialité</a>
              <a href="#" className="hover:text-white transition-colors">Cookies</a>
            </div>
          </div>
        </div>
      </footer>
    </>
  );
};