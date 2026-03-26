import React, { useState, useEffect } from 'react';
import { Menu, X, Heart } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';
import { NavLink } from '../types';

const navLinks: NavLink[] = [
  { label: 'Accueil', href: '/' },
  { label: 'Qui sommes-nous', href: '/qsn' },
  { label: 'Nos Actions', href: '/actions' },
  { label: 'Galerie', href: '/galerie' },
  { label: 'Contact', href: '/contact' },
];

export const Navbar: React.FC<{ onOpenDonation: () => void }> = ({ onOpenDonation }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <nav className={`absolute w-full z-50 transition-all duration-300 ${scrolled ? 'bg-white shadow-md py-4' : 'bg-transparent py-6'}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center">
          {/* Logo Section */}
          <div className="flex items-center flex-shrink-0">
            {/* REMARQUE : Placez votre fichier logo (Image 2) dans le dossier public et nommez-le 'logo.png' */}
            <img
              src="/images/logosansfondcontour.png"
              alt="Logo L'Amour Du Prochain"
              className="h-16 w-auto object-contain"
              onError={(e) => {
                e.currentTarget.style.display = 'none';
                e.currentTarget.nextElementSibling?.classList.remove('hidden');
              }}
            />
            {/* Fallback text au cas où l'image ne charge pas */}
            <span className={`hidden font-bold text-xl ml-2 ${scrolled ? 'text-gray-900' : 'text-white'}`}>L'Amour Du Prochain</span>
          </div>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center space-x-10">
            {navLinks.map((link) => {
              const isActive = location.pathname === link.href;
              return (
                <Link
                  key={link.label}
                  to={link.href}
                  className={`font-semibold text-base transition-colors ${
                    isActive
                      ? 'text-green-500'
                      : scrolled ? 'text-gray-700 hover:text-green-600' : 'text-white hover:text-green-300'
                  }`}
                >
                  {link.label}
                </Link>
              );
            })}
            <button
              onClick={onOpenDonation}
              className="bg-green-600 hover:bg-green-700 text-white px-6 py-2.5 rounded-full font-bold transition-colors flex items-center gap-2 shadow-sm"
            >
              <Heart size={18} fill="currentColor" />
              Faire un don
            </button>
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden flex items-center">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className={`${scrolled ? 'text-gray-900' : 'text-white'} hover:text-green-500 focus:outline-none transition-colors`}
            >
              {isOpen ? <X size={28} /> : <Menu size={28} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu Dropdown */}
      {isOpen && (
        <div className="md:hidden bg-white shadow-xl absolute w-full left-0 top-full border-t border-gray-100">
          <div className="px-4 pt-2 pb-6 space-y-2">
            {navLinks.map((link) => (
              <Link
                key={link.label}
                to={link.href}
                onClick={() => setIsOpen(false)}
                className={`block px-3 py-2 text-base font-semibold rounded-md ${
                  link.label === 'Accueil' ? 'text-green-600 bg-green-50' : 'text-gray-800 hover:bg-green-50'
                }`}
              >
                {link.label}
              </Link>
            ))}
            <button
              onClick={() => {
                setIsOpen(false);
                onOpenDonation();
              }}
              className="block w-full text-center mt-4 bg-green-600 text-white px-4 py-3 rounded-lg font-bold shadow-md"
            >
              Faire un don
            </button>
          </div>
        </div>
      )}
    </nav>
  );
};