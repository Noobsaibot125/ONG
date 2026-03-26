import React from 'react';

export const Legal: React.FC = () => {
    return (
        <section id="legal" className="py-20 bg-gray-50">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="text-center mb-12">
                    <h2 className="text-3xl font-bold text-gray-900 mb-4">Mentions Légales</h2>
                    <div className="w-20 h-1 bg-green-500 mx-auto rounded-full"></div>
                </div>

                <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100 prose max-w-none text-gray-600">
                    <div className="grid md:grid-cols-2 gap-12">
                        <div>
                            <h3 className="text-xl font-bold text-gray-900 mb-4">Identification de l'Association</h3>
                            <p><strong>Nom :</strong> ONG L'Amour Du Prochain</p>
                            <p><strong>Statut :</strong> Association loi 1901</p>
                            <p><strong>Date de création :</strong> 1er novembre 2017</p>
                            <p><strong>Siège social :</strong> 108 rue de Montigny, 95100 Argenteuil, France</p>
                            <p><strong>E-mail :</strong> lamourduprochain1@gmail.com</p>
                            <p><strong>Téléphone :</strong> +33 6 99 44 96 19</p>
                        </div>

                        <div>
                            <h3 className="text-xl font-bold text-gray-900 mb-4">Hébergement du site</h3>
                            <p>Ce site est hébergé par les services de déploiement GitHub Pages / Netlify / Vercel (à préciser selon le déploiement final).</p>

                            <h3 className="text-xl font-bold text-gray-900 mb-4 mt-8">Propriété Intellectuelle</h3>
                            <p>L'ensemble de ce site relève de la législation française et internationale sur le droit d'auteur et la propriété intellectuelle. Tous les droits de reproduction sont réservés, y compris pour les documents téléchargeables et les représentations iconographiques et photographiques.</p>
                        </div>
                    </div>

                    <div className="mt-12 pt-8 border-t border-gray-100">
                        <h3 className="text-xl font-bold text-gray-900 mb-4">Protection des données personnelles</h3>
                        <p>Conformément à la loi « Informatique et Libertés » et au RGPD, vous disposez d'un droit d'accès, de rectification et de suppression des données vous concernant. Pour l'exercer, contactez-nous par e-mail.</p>
                    </div>
                </div>
            </div>
        </section>
    );
};
