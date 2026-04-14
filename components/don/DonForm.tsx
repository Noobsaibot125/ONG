import React, { useState } from 'react';
import { Heart, CreditCard, Send, ShieldCheck, Mail, Phone, User, AlertCircle } from 'lucide-react';

export const DonForm: React.FC = () => {
  const [selectedAmount, setSelectedAmount] = useState('500 000 FCFA');
  const [paymentMethod, setPaymentMethod] = useState<'card' | 'paypal'>('card');
  const [formData, setFormData] = useState({
    name: 'Moussa Lenaze',
    email: 'Moussa@gmail.com',
    phone: '+225 01 02 345 678',
    type: 'Don Foncier',
    message: ''
  });

  const amounts = ['10 000 FCFA', '100 000 FCFA', '500 000 FCFA', '1 000 000 FCFA'];

  return (
    <section className="py-24 bg-gray-50 flex items-center justify-center">
      <div className="max-w-4xl w-full px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-[40px] shadow-2xl overflow-hidden">
          {/* Header Card */}
          <div className="bg-[#1EB881] p-12 text-white text-center relative">
            <div className="flex justify-center mb-6">
              <Heart fill="white" className="text-white" size={48} />
            </div>
            <h2 className="text-4xl md:text-5xl font-extrabold mb-4">Soutenez nos projets</h2>
            <p className="text-white text-lg font-medium">Choisissez le montant de votre contribution</p>
          </div>

          <div className="p-8 md:p-12 space-y-12">
            {/* Personal Info Section */}
            <div>
              <h3 className="text-2xl font-bold text-[#1EB881] mb-2">
                Information personnel
              </h3>
              <div className="w-full h-[1px] bg-gray-100 mb-8"></div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-6">
                <div className="space-y-3">
                  <label className="text-lg font-bold text-gray-900 block">Nom Complet</label>
                  <input
                    type="text"
                    className="w-full bg-white border border-gray-200 rounded-2xl px-6 py-5 text-gray-700 outline-none focus:border-[#1EB881] transition-all placeholder-gray-300 text-lg"
                    placeholder="Moussa Lenaze"
                    value={formData.name}
                    onChange={(e) => setFormData({...formData, name: e.target.value})}
                  />
                </div>
                <div className="space-y-3">
                  <label className="text-lg font-bold text-gray-900 block">Email</label>
                  <input
                    type="email"
                    className="w-full bg-white border border-gray-200 rounded-2xl px-6 py-5 text-gray-700 outline-none focus:border-[#1EB881] transition-all placeholder-gray-300 text-lg"
                    placeholder="Moussa@gmail.com"
                    value={formData.email}
                    onChange={(e) => setFormData({...formData, email: e.target.value})}
                  />
                </div>
                <div className="space-y-3">
                  <label className="text-lg font-bold text-gray-900 block">Téléphone</label>
                  <input
                    type="tel"
                    className="w-full bg-white border border-gray-200 rounded-2xl px-6 py-5 text-gray-700 outline-none focus:border-[#1EB881] transition-all placeholder-gray-300 text-lg"
                    placeholder="+225 01 02 345 678"
                    value={formData.phone}
                    onChange={(e) => setFormData({...formData, phone: e.target.value})}
                  />
                </div>
                <div className="space-y-3">
                  <label className="text-lg font-bold text-gray-900 block">Type de don souhaité</label>
                  <div className="relative">
                    <select
                      className="w-full bg-white border border-[#1EB881] rounded-2xl px-6 py-5 text-gray-900 outline-none appearance-none text-lg font-medium"
                      value={formData.type}
                      onChange={(e) => setFormData({...formData, type: e.target.value})}
                    >
                      <option>Don Foncier</option>
                      <option>Don Financier</option>
                      <option>Don de Matériel</option>
                    </select>
                    <div className="absolute right-6 top-1/2 -translate-y-1/2 pointer-events-none">
                      <svg className="w-6 h-6 text-[#1EB881]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="19 9l-7 7-7-7" />
                      </svg>
                    </div>
                  </div>
                </div>
              </div>

              <div className="mt-8 space-y-3">
                <label className="text-lg font-bold text-gray-900 block">Votre message (optionnel)</label>
                <textarea
                  className="w-full bg-white border border-gray-200 rounded-2xl px-6 py-5 text-gray-700 outline-none focus:border-[#1EB881] transition-all resize-none h-40 placeholder-gray-300 text-lg"
                  placeholder="Comment souhaité vous nous aider ?"
                  value={formData.message}
                  onChange={(e) => setFormData({...formData, message: e.target.value})}
                ></textarea>
              </div>
            </div>

            {/* Payment Info Section */}
            <div>
              <h3 className="text-2xl font-bold text-[#1EB881] mb-2">
                Informations de paiement
              </h3>
              <div className="w-full h-[1px] bg-gray-100 mb-8"></div>
              
              {/* Amount Selection */}
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-10 mt-6">
                {amounts.map((amount) => (
                  <button
                    key={amount}
                    onClick={() => setSelectedAmount(amount)}
                    className={`py-5 px-4 rounded-2xl border border-gray-200 font-bold transition-all text-lg ${
                      selectedAmount === amount
                        ? 'bg-[#1EB881] text-white border-[#1EB881]'
                        : 'bg-white text-gray-600 hover:border-[#1EB881]/50'
                    }`}
                  >
                    {amount}
                  </button>
                ))}
              </div>

              {/* Payment Methods */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-10">
                <button
                  onClick={() => setPaymentMethod('card')}
                  className={`flex items-center justify-between p-6 rounded-2xl border ${
                    paymentMethod === 'card' ? 'border-[#1EB881] bg-[#1EB881]/5' : 'border-[#1EB881] bg-white'
                  } transition-all`}
                >
                  <div className="flex items-center gap-5">
                    <div className="text-[#1EB881]">
                      <svg viewBox="0 0 24 24" className="w-10 h-10 fill-current">
                        <path d="M20 4H4c-1.11 0-1.99.89-1.99 2L2 18c0 1.11.89 2 2 2h16c1.11 0 2-.89 2-2V6c0-1.11-.89-2-2-2zm0 14H4v-6h16v6zm0-10H4V6h16v2z" />
                      </svg>
                    </div>
                    <div className="text-left">
                      <p className="font-extrabold text-gray-900 text-lg">Paiement par Carte</p>
                      <p className="text-sm text-gray-500 font-medium">Sécurisé via Stripe</p>
                    </div>
                  </div>
                  <div className={`w-8 h-8 rounded-full border-2 flex items-center justify-center ${
                    paymentMethod === 'card' ? 'border-[#1EB881] bg-[#1EB881]' : 'border-gray-200 bg-white'
                  }`}>
                    {paymentMethod === 'card' && <div className="w-4 h-4 bg-white rounded-full" />}
                  </div>
                </button>

                <button
                  onClick={() => setPaymentMethod('paypal')}
                  className={`flex items-center justify-between p-6 rounded-2xl border border-[#1EB881] ${
                    paymentMethod === 'paypal' ? 'border-[#1EB881] bg-[#1EB881]/5' : 'bg-white'
                  } transition-all`}
                >
                  <div className="flex items-center gap-5">
                    <div className="flex">
                      <img 
                        src="/images/df7990916584c5ec799f80cfc0b5d3aac0babf41.png" 
                        alt="PayPal" 
                        className="w-10 h-auto object-contain"
                      />
                    </div>
                    <div className="text-left">
                      <p className="font-extrabold text-gray-900 text-lg">PayPal</p>
                      <p className="text-sm text-gray-500 font-medium">Rapide et sécurisé</p>
                    </div>
                  </div>

                  <div className={`w-8 h-8 rounded-full border-2 flex items-center justify-center ${
                    paymentMethod === 'paypal' ? 'border-[#1EB881] bg-[#1EB881]' : 'border-gray-200 bg-white'
                  }`}>
                    {paymentMethod === 'paypal' && <div className="w-4 h-4 bg-white rounded-full" />}
                  </div>
                </button>
              </div>

              {/* Tax Deduction Info */}
              <div className="bg-[#FEF2F2] border border-[#FECACA] rounded-[32px] p-8 flex gap-6 items-start">
                <div className="text-[#B91C1C] mt-1">
                  <AlertCircle size={32} />
                </div>
                <div>
                  <h4 className="text-2xl font-bold text-[#991B1B] mb-2">Déduction fiscale</h4>
                  <p className="text-lg text-gray-800 leading-relaxed font-medium">
                    En tant qu'association loi 1901, vos dons sont déductibles de vos impôts à hauteur de 66% (pour les particuliers en France). Un reçu fiscal vous sera envoyé automatiquement.
                  </p>
                </div>
              </div>
            </div>
            
            {/* Submit Button */}
            <div className="pt-4">
              <button className="w-full bg-[#1EB881] hover:bg-[#199d6d] text-white font-extrabold py-6 rounded-3xl text-2xl shadow-xl shadow-green-200 transition-all flex items-center justify-center gap-3 active:scale-95">
                Confirmer le don de {selectedAmount}
                <Heart size={28} fill="white" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

