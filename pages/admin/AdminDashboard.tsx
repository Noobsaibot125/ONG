import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Home, Users, ImageIcon, Phone, LogOut, Loader2, Plus, Trash2, Upload, Zap, CheckCircle2, Heart } from 'lucide-react';

type Tab = 'accueil' | 'qsn' | 'actions' | 'galerie' | 'contact';
const API = 'http://localhost:5000';

// --- Composants utilitaires ---

const Field: React.FC<{
  label: string;
  value: string;
  onChange: (v: string) => void;
  multiline?: boolean;
  rows?: number;
}> = ({ label, value, onChange, multiline, rows = 3 }) => (
  <div className="flex flex-col gap-1.5">
    <label className="text-xs font-semibold uppercase tracking-widest text-slate-400">{label}</label>
    {multiline ? (
      <textarea
        rows={rows}
        value={value}
        onChange={e => onChange(e.target.value)}
        className="w-full bg-slate-50 border border-slate-200 rounded-lg px-4 py-3 text-sm text-slate-800 outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 resize-none transition-all placeholder:text-slate-300"
      />
    ) : (
      <input
        type="text"
        value={value}
        onChange={e => onChange(e.target.value)}
        className="w-full bg-slate-50 border border-slate-200 rounded-lg px-4 py-3 text-sm text-slate-800 outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 transition-all placeholder:text-slate-300"
      />
    )}
  </div>
);

const ImageUploader: React.FC<{
  label: string;
  currentUrl: string;
  onUpload: (url: string) => void;
  token: string;
}> = ({ label, currentUrl, onUpload, token }) => {
  const [uploading, setUploading] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleFile = async (file: File) => {
    setUploading(true);
    const fd = new FormData();
    fd.append('image', file);
    try {
      const resp = await fetch(`${API}/api/upload-image`, {
        method: 'POST',
        headers: { Authorization: `Bearer ${token}` },
        body: fd,
      });
      const data = await resp.json();
      onUpload(data.url);
    } finally {
      setUploading(false);
    }
  };

  const previewSrc = currentUrl
    ? currentUrl.startsWith('/uploads/') ? `${API}${currentUrl}` : currentUrl
    : '';

  return (
    <div className="flex flex-col gap-1.5">
      <label className="text-xs font-semibold uppercase tracking-widest text-slate-400">{label}</label>
      <div className="flex items-center gap-4">
        {previewSrc ? (
          <div className="relative w-28 h-18 rounded-lg overflow-hidden border border-slate-200 shadow-sm">
            <img src={previewSrc} alt={label} className="w-28 h-18 object-cover" />
          </div>
        ) : (
          <div className="w-28 h-18 flex items-center justify-center rounded-lg border-2 border-dashed border-slate-200 bg-slate-50">
            <ImageIcon size={20} className="text-slate-300" />
          </div>
        )}
        <button
          type="button"
          onClick={() => inputRef.current?.click()}
          disabled={uploading}
          className="flex items-center gap-2 px-4 py-2.5 bg-white border border-slate-200 hover:border-emerald-400 hover:bg-emerald-50 rounded-lg text-sm font-medium text-slate-600 hover:text-emerald-700 transition-all disabled:opacity-50 shadow-sm"
        >
          {uploading ? <Loader2 size={15} className="animate-spin" /> : <Upload size={15} />}
          {uploading ? 'Envoi…' : "Changer l'image"}
        </button>
        <input
          ref={inputRef}
          type="file"
          accept="image/*"
          className="hidden"
          onChange={e => e.target.files?.[0] && handleFile(e.target.files[0])}
        />
      </div>
    </div>
  );
};

// --- Dashboard principal ---

export const AdminDashboard: React.FC = () => {
  const [activeTab, setActiveTab] = useState<Tab>('accueil');
  const [content, setContent] = useState<Record<string, string>>({});
  const [gallery, setGallery] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [token, setToken] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const t = localStorage.getItem('admin_token') || '';
    if (!t) { navigate('/admin/login'); return; }
    setToken(t);
    fetchAll();
  }, [navigate]);

  const fetchAll = async () => {
    try {
      const [contentRes, galleryRes] = await Promise.all([
        fetch(`${API}/api/content`),
        fetch(`${API}/api/gallery`),
      ]);
      const contentData = await contentRes.json();
      const galleryData = await galleryRes.json();
      const map: Record<string, string> = {};
      contentData.forEach((item: any) => {
        map[`${item.page_name}|${item.section_name}|${item.content_key}`] = item.content_value;
      });
      setContent(map);
      setGallery(galleryData);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const get = (page: string, section: string, key: string, fallback = '') =>
    content[`${page}|${section}|${key}`] ?? fallback;

  const set = (page: string, section: string, key: string, value: string) =>
    setContent(prev => ({ ...prev, [`${page}|${section}|${key}`]: value }));

  const saveItems = async (items: { page: string; section: string; key: string }[]) => {
    setSaving(true);
    setSaveSuccess(false);
    try {
      await Promise.all(items.map(({ page, section, key }) =>
        fetch(`${API}/api/content`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
          body: JSON.stringify({
            page_name: page,
            section_name: section,
            content_key: key,
            content_value: content[`${page}|${section}|${key}`] ?? '',
          }),
        })
      ));
      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 2500);
    } finally {
      setSaving(false);
    }
  };

  const saveOne = (page: string, section: string, key: string) =>
    saveItems([{ page, section, key }]);

  // --- Galerie ---
  const [galleryTitle, setGalleryTitle] = useState('');
  const [galleryCategory, setGalleryCategory] = useState('general');
  const [galleryUploading, setGalleryUploading] = useState(false);
  const galleryInputRef = useRef<HTMLInputElement>(null);

  const handleGalleryUpload = async (file: File) => {
    setGalleryUploading(true);
    const fd = new FormData();
    fd.append('image', file);
    fd.append('title', galleryTitle);
    fd.append('category', galleryCategory);
    try {
      await fetch(`${API}/api/gallery`, {
        method: 'POST',
        headers: { Authorization: `Bearer ${token}` },
        body: fd,
      });
      setGalleryTitle('');
      fetchAll();
    } finally {
      setGalleryUploading(false);
    }
  };

  const deleteGalleryImage = async (id: number) => {
    await fetch(`${API}/api/gallery/${id}`, {
      method: 'DELETE',
      headers: { Authorization: `Bearer ${token}` },
    });
    fetchAll();
  };

  if (loading) return (
    <div className="flex h-screen items-center justify-center bg-slate-900">
      <div className="flex flex-col items-center gap-4">
        <div className="w-14 h-14 rounded-2xl bg-emerald-500/20 flex items-center justify-center">
          <Heart size={28} className="text-emerald-400 animate-pulse" />
        </div>
        <Loader2 className="animate-spin text-emerald-400" size={28} />
        <p className="text-slate-400 text-sm">Chargement du tableau de bord…</p>
      </div>
    </div>
  );

  const tabs: { id: Tab; icon: React.ElementType; label: string; desc: string }[] = [
    { id: 'accueil', icon: Home, label: 'Accueil', desc: 'Hero, À propos, Stats' },
    { id: 'qsn', icon: Users, label: 'Qui sommes-nous', desc: 'Présentation, Équipe' },
    { id: 'actions', icon: Zap, label: 'Actions', desc: 'Santé, Éducation, Social' },
    { id: 'galerie', icon: ImageIcon, label: 'Galerie', desc: `${gallery.length} image${gallery.length > 1 ? 's' : ''}` },
    { id: 'contact', icon: Phone, label: 'Contact', desc: 'Coordonnées, Horaires' },
  ];

  const SectionCard: React.FC<{
    title: string;
    subtitle?: string;
    children: React.ReactNode;
    onSave: () => void;
  }> = ({ title, subtitle, children, onSave }) => (
    <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
      <div className="px-8 py-5 border-b border-slate-100 flex items-center justify-between">
        <div>
          <h3 className="text-base font-bold text-slate-800">{title}</h3>
          {subtitle && <p className="text-xs text-slate-400 mt-0.5">{subtitle}</p>}
        </div>
        <button
          onClick={onSave}
          disabled={saving}
          className="flex items-center gap-2 px-5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-sm font-semibold rounded-lg transition-all disabled:opacity-50 shadow-sm shadow-emerald-200"
        >
          {saving ? <Loader2 size={14} className="animate-spin" /> : null}
          Sauvegarder
        </button>
      </div>
      <div className="px-8 py-6 space-y-5">
        {children}
      </div>
    </div>
  );

  const StatBlock: React.FC<{ n: number; defaults: { v: string; s: string; l: string } }> = ({ n, defaults }) => (
    <div className="bg-slate-50 rounded-xl border border-slate-100 p-5">
      <div className="flex items-center gap-2 mb-4">
        <span className="w-6 h-6 rounded-full bg-emerald-100 text-emerald-700 text-xs font-bold flex items-center justify-center">{n}</span>
        <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Statistique {n}</span>
      </div>
      <div className="grid grid-cols-3 gap-3">
        <Field label="Valeur" value={get('accueil', 'stats', `stat${n}_value`, defaults.v)} onChange={v => set('accueil', 'stats', `stat${n}_value`, v)} />
        <Field label="Suffixe" value={get('accueil', 'stats', `stat${n}_suffix`, defaults.s)} onChange={v => set('accueil', 'stats', `stat${n}_suffix`, v)} />
        <Field label="Libellé" value={get('accueil', 'stats', `stat${n}_label`, defaults.l)} onChange={v => set('accueil', 'stats', `stat${n}_label`, v)} />
      </div>
    </div>
  );

  return (
    <div className="flex min-h-screen bg-slate-50">

      {/* ===== SIDEBAR ===== */}
      <aside className="w-72 bg-slate-900 flex flex-col flex-shrink-0 min-h-screen">

        {/* Logo */}
        <div className="px-6 pt-8 pb-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-500 flex items-center justify-center shadow-lg shadow-emerald-900/40">
              <Heart size={20} className="text-white" />
            </div>
            <div>
              <p className="text-white font-bold text-sm leading-tight">L'Amour du</p>
              <p className="text-emerald-400 font-bold text-sm leading-tight">Prochain</p>
            </div>
          </div>
          <div className="mt-5 pt-5 border-t border-slate-800">
            <p className="text-xs text-slate-500 uppercase tracking-widest font-semibold">Tableau de bord</p>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 px-3 space-y-1">
          {tabs.map(item => {
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`w-full flex items-center gap-3.5 px-4 py-3.5 rounded-xl transition-all text-left group ${
                  isActive
                    ? 'bg-emerald-600 shadow-lg shadow-emerald-900/30'
                    : 'hover:bg-slate-800'
                }`}
              >
                <div className={`w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 transition-all ${
                  isActive ? 'bg-white/20' : 'bg-slate-800 group-hover:bg-slate-700'
                }`}>
                  <item.icon size={16} className={isActive ? 'text-white' : 'text-slate-400'} />
                </div>
                <div className="min-w-0">
                  <p className={`text-sm font-semibold truncate ${isActive ? 'text-white' : 'text-slate-300'}`}>
                    {item.label}
                  </p>
                  <p className={`text-xs truncate mt-0.5 ${isActive ? 'text-emerald-200' : 'text-slate-500'}`}>
                    {item.desc}
                  </p>
                </div>
              </button>
            );
          })}
        </nav>

        {/* Déconnexion */}
        <div className="p-4 border-t border-slate-800">
          <button
            onClick={() => { localStorage.removeItem('admin_token'); navigate('/admin/login'); }}
            className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-slate-400 hover:text-red-400 hover:bg-red-500/10 transition-all group"
          >
            <div className="w-8 h-8 rounded-lg bg-slate-800 group-hover:bg-red-500/20 flex items-center justify-center transition-all">
              <LogOut size={16} />
            </div>
            <span className="text-sm font-medium">Déconnexion</span>
          </button>
        </div>
      </aside>

      {/* ===== CONTENU PRINCIPAL ===== */}
      <div className="flex-1 flex flex-col min-h-screen overflow-hidden">

        {/* Header */}
        <header className="bg-white border-b border-slate-200 px-10 py-5 flex items-center justify-between flex-shrink-0">
          <div>
            <h2 className="text-xl font-bold text-slate-900">
              {tabs.find(t => t.id === activeTab)?.label}
            </h2>
            <p className="text-sm text-slate-400 mt-0.5">
              {tabs.find(t => t.id === activeTab)?.desc}
            </p>
          </div>

          <div className="flex items-center gap-3">
            {saveSuccess && (
              <div className="flex items-center gap-2 px-4 py-2 bg-emerald-50 border border-emerald-200 rounded-lg text-emerald-700 text-sm font-medium animate-pulse">
                <CheckCircle2 size={16} />
                Sauvegardé
              </div>
            )}
            {saving && (
              <div className="flex items-center gap-2 px-4 py-2 bg-slate-100 rounded-lg text-slate-500 text-sm">
                <Loader2 size={15} className="animate-spin" />
                Sauvegarde…
              </div>
            )}
            <div className="w-9 h-9 rounded-xl bg-emerald-100 flex items-center justify-center">
              <span className="text-emerald-700 text-sm font-bold">A</span>
            </div>
          </div>
        </header>

        {/* Contenu scrollable */}
        <main className="flex-1 overflow-y-auto px-10 py-8">
          <div className="max-w-3xl mx-auto space-y-6">

            {/* ===== ACCUEIL ===== */}
            {activeTab === 'accueil' && (
              <>
                <SectionCard
                  title="Section Hero"
                  subtitle="Titre et sous-titre affichés en première page"
                  onSave={() => saveItems([
                    { page: 'accueil', section: 'hero', key: 'title' },
                    { page: 'accueil', section: 'hero', key: 'subtitle' },
                  ])}
                >
                  <Field label="Titre principal" value={get('accueil', 'hero', 'title', 'Promouvoir la Solidarité en France et en Afrique')} onChange={v => set('accueil', 'hero', 'title', v)} />
                  <Field label="Sous-titre" value={get('accueil', 'hero', 'subtitle', "Aider les veuves, les orphelins et les populations vulnérables par des actions concrètes et durables sur le terrain.")} onChange={v => set('accueil', 'hero', 'subtitle', v)} multiline rows={3} />
                  <ImageUploader
                    label="Image de fond"
                    currentUrl={get('accueil', 'hero', 'image')}
                    onUpload={url => { set('accueil', 'hero', 'image', url); saveOne('accueil', 'hero', 'image'); }}
                    token={token}
                  />
                </SectionCard>

                <SectionCard
                  title="Section À propos"
                  subtitle="Textes et image de la section de présentation"
                  onSave={() => saveItems([
                    { page: 'accueil', section: 'about', key: 'paragraph1' },
                    { page: 'accueil', section: 'about', key: 'paragraph2' },
                    { page: 'accueil', section: 'about', key: 'quote' },
                  ])}
                >
                  <Field label="Paragraphe 1" value={get('accueil', 'about', 'paragraph1', "Fondée le 1er novembre 2017 sous la loi 1901 en France, l'ONG L'Amour Du Prochain est une organisation humanitaire présidée par M. Serge KADIO.")} onChange={v => set('accueil', 'about', 'paragraph1', v)} multiline rows={3} />
                  <Field label="Paragraphe 2" value={get('accueil', 'about', 'paragraph2', "Nous œuvrons pour améliorer l'état de santé des populations, faciliter l'accès aux produits de première nécessité et fournir des soins médicaux de proximité en Afrique de l'Ouest.")} onChange={v => set('accueil', 'about', 'paragraph2', v)} multiline rows={3} />
                  <Field label="Citation" value={get('accueil', 'about', 'quote', '"Notre mission est de transformer la précarité en espoir par la solidarité active."')} onChange={v => set('accueil', 'about', 'quote', v)} multiline rows={2} />
                  <ImageUploader
                    label="Image À propos"
                    currentUrl={get('accueil', 'about', 'image')}
                    onUpload={url => { set('accueil', 'about', 'image', url); saveOne('accueil', 'about', 'image'); }}
                    token={token}
                  />
                </SectionCard>

                <SectionCard
                  title="Statistiques clés"
                  subtitle="Chiffres affichés dans la bande de statistiques"
                  onSave={() => saveItems(
                    [1, 2, 3, 4].flatMap(n => [
                      { page: 'accueil', section: 'stats', key: `stat${n}_value` },
                      { page: 'accueil', section: 'stats', key: `stat${n}_suffix` },
                      { page: 'accueil', section: 'stats', key: `stat${n}_label` },
                    ])
                  )}
                >
                  <StatBlock n={1} defaults={{ v: '7509', s: '+', l: 'Kits scolaires distribués' }} />
                  <StatBlock n={2} defaults={{ v: '7', s: '', l: 'Conteneurs médicaux envoyés' }} />
                  <StatBlock n={3} defaults={{ v: '5', s: '', l: "Pays d'intervention" }} />
                  <StatBlock n={4} defaults={{ v: '507', s: '+', l: 'Bénévoles actifs' }} />
                </SectionCard>
              </>
            )}

            {/* ===== QSN ===== */}
            {activeTab === 'qsn' && (
              <>
                <SectionCard
                  title="Section Hero"
                  subtitle="En-tête de la page Qui sommes-nous"
                  onSave={() => saveItems([
                    { page: 'qsn', section: 'hero', key: 'title' },
                    { page: 'qsn', section: 'hero', key: 'subtitle' },
                  ])}
                >
                  <Field label="Titre" value={get('qsn', 'hero', 'title', 'Qui sommes-nous ?')} onChange={v => set('qsn', 'hero', 'title', v)} />
                  <Field label="Sous-titre" value={get('qsn', 'hero', 'subtitle', "Une organisation dévouée à l'Humain, née d'une volonté de partage et de solidarité sans frontières.")} onChange={v => set('qsn', 'hero', 'subtitle', v)} multiline rows={2} />
                  <ImageUploader
                    label="Image de fond"
                    currentUrl={get('qsn', 'hero', 'image')}
                    onUpload={url => { set('qsn', 'hero', 'image', url); saveOne('qsn', 'hero', 'image'); }}
                    token={token}
                  />
                </SectionCard>

                <SectionCard
                  title="Présentation"
                  subtitle="Textes de la section d'introduction"
                  onSave={() => saveItems([
                    { page: 'qsn', section: 'intro', key: 'paragraph1' },
                    { page: 'qsn', section: 'intro', key: 'paragraph2' },
                  ])}
                >
                  <Field label="Paragraphe 1" value={get('qsn', 'intro', 'paragraph1', "L'ONG L'Amour Du Prochain a été créée le 1er novembre 2017 en France. Notre structure est régie par la loi du 1er juillet 1901 et le décret du 16 août 1901.")} onChange={v => set('qsn', 'intro', 'paragraph1', v)} multiline rows={4} />
                  <Field label="Paragraphe 2" value={get('qsn', 'intro', 'paragraph2', "Sous la présidence de M. Serge KADIO, l'association s'est donnée pour mission principale d'apporter un soutien concret aux populations les plus démunies, avec un focus particulier sur l'Afrique de l'Ouest.")} onChange={v => set('qsn', 'intro', 'paragraph2', v)} multiline rows={4} />
                </SectionCard>

                <SectionCard
                  title="Images de la présentation"
                  subtitle="Ces 3 images apparaissent en collage dans la section présentation"
                  onSave={() => {}}
                >
                  <div className="grid grid-cols-3 gap-4">
                    {(['image1', 'image2', 'image3'] as const).map((key, i) => (
                      <ImageUploader
                        key={key}
                        label={`Image ${i + 1}`}
                        currentUrl={get('qsn', 'intro', key)}
                        onUpload={url => { set('qsn', 'intro', key, url); saveOne('qsn', 'intro', key); }}
                        token={token}
                      />
                    ))}
                  </div>
                </SectionCard>

                <SectionCard
                  title="Équipe dirigeante"
                  subtitle="Nom, rôle et photo des membres de l'équipe"
                  onSave={() => saveItems(
                    [1, 2, 3].flatMap(n => [
                      { page: 'qsn', section: 'team', key: `member${n}_name` },
                      { page: 'qsn', section: 'team', key: `member${n}_role` },
                    ])
                  )}
                >
                  {([
                    { name: 'M. KADIO Kouame Serge', role: 'Président Fondateur' },
                    { name: 'M. Ilo Faustin Kouadio', role: 'Président Fondateur' },
                    { name: 'M. KERE Dakelgaba Charles', role: 'Président Fondateur' },
                  ] as const).map((d, i) => {
                    const n = i + 1;
                    return (
                      <div key={n} className="bg-slate-50 rounded-xl border border-slate-100 p-5">
                        <div className="flex items-center gap-2 mb-4">
                          <span className="w-6 h-6 rounded-full bg-slate-200 text-slate-600 text-xs font-bold flex items-center justify-center">{n}</span>
                          <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Membre {n}</span>
                        </div>
                        <div className="grid grid-cols-2 gap-4 mb-4">
                          <Field label="Nom complet" value={get('qsn', 'team', `member${n}_name`, d.name)} onChange={v => set('qsn', 'team', `member${n}_name`, v)} />
                          <Field label="Rôle" value={get('qsn', 'team', `member${n}_role`, d.role)} onChange={v => set('qsn', 'team', `member${n}_role`, v)} />
                        </div>
                        <ImageUploader
                          label="Photo"
                          currentUrl={get('qsn', 'team', `member${n}_image`)}
                          onUpload={url => { set('qsn', 'team', `member${n}_image`, url); saveOne('qsn', 'team', `member${n}_image`); }}
                          token={token}
                        />
                      </div>
                    );
                  })}
                </SectionCard>
              </>
            )}

            {/* ===== ACTIONS ===== */}
            {activeTab === 'actions' && (
              <>
                {([
                  {
                    title: 'Santé & Médical',
                    description: "L'accès aux soins est un droit fondamental. Nous collectons et acheminons du matériel médical de pointe vers les zones qui en manquent cruellement.",
                    points: ["Don de lits d'hôpitaux et équipements spécialisés.", "Acheminement de médicaments essentiels.", "Campagnes de dépistage et de vaccination.", "Soutien aux infrastructures de santé locales."],
                    color: 'text-rose-600 bg-rose-50',
                  },
                  {
                    title: 'Éducation pour tous',
                    description: "L'éducation est la clé d'un avenir meilleur. Nous fournissons des outils pour permettre aux enfants d'étudier dans de bonnes conditions.",
                    points: ["Distribution de kits scolaires.", "Bourses d'études pour les plus démunis.", "Réhabilitation de salles de classe.", "Soutien au corps enseignant."],
                    color: 'text-blue-600 bg-blue-50',
                  },
                  {
                    title: 'Soutien Social',
                    description: "En période de crise ou dans le besoin au quotidien, nous apportons un soutien moral et matériel aux populations vulnérables.",
                    points: ["Distributions alimentaires d'urgence.", "Fourniture de vêtements et produits d'hygiène.", "Accompagnement psychologique.", "Activités de réinsertion sociale."],
                    color: 'text-amber-600 bg-amber-50',
                  },
                ] as const).map((d, idx) => {
                  const ak = (['action1', 'action2', 'action3'] as const)[idx];
                  return (
                    <SectionCard
                      key={ak}
                      title={`Action ${idx + 1} — ${d.title}`}
                      subtitle="Titre, description, points clés et image"
                      onSave={() => saveItems([
                        { page: 'actions', section: ak, key: 'title' },
                        { page: 'actions', section: ak, key: 'description' },
                        { page: 'actions', section: ak, key: 'point1' },
                        { page: 'actions', section: ak, key: 'point2' },
                        { page: 'actions', section: ak, key: 'point3' },
                        { page: 'actions', section: ak, key: 'point4' },
                      ])}
                    >
                      <Field label="Titre" value={get('actions', ak, 'title', d.title)} onChange={v => set('actions', ak, 'title', v)} />
                      <Field label="Description" value={get('actions', ak, 'description', d.description)} onChange={v => set('actions', ak, 'description', v)} multiline rows={3} />
                      <div>
                        <p className="text-xs font-semibold uppercase tracking-widest text-slate-400 mb-3">Points clés</p>
                        <div className="grid grid-cols-2 gap-3">
                          {([0, 1, 2, 3] as const).map(i => (
                            <Field key={i} label={`Point ${i + 1}`} value={get('actions', ak, `point${i + 1}`, d.points[i])} onChange={v => set('actions', ak, `point${i + 1}`, v)} />
                          ))}
                        </div>
                      </div>
                      <ImageUploader
                        label="Image"
                        currentUrl={get('actions', ak, 'image')}
                        onUpload={url => { set('actions', ak, 'image', url); saveOne('actions', ak, 'image'); }}
                        token={token}
                      />
                    </SectionCard>
                  );
                })}
              </>
            )}

            {/* ===== GALERIE ===== */}
            {activeTab === 'galerie' && (
              <div className="space-y-6">
                {/* Ajout d'image */}
                <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
                  <div className="px-8 py-5 border-b border-slate-100">
                    <h3 className="text-base font-bold text-slate-800">Ajouter une image</h3>
                    <p className="text-xs text-slate-400 mt-0.5">Renseigner les informations puis sélectionner le fichier</p>
                  </div>
                  <div className="px-8 py-6">
                    <div className="grid grid-cols-2 gap-4 mb-5">
                      <Field label="Titre de l'image" value={galleryTitle} onChange={setGalleryTitle} />
                      <div className="flex flex-col gap-1.5">
                        <label className="text-xs font-semibold uppercase tracking-widest text-slate-400">Catégorie</label>
                        <select
                          value={galleryCategory}
                          onChange={e => setGalleryCategory(e.target.value)}
                          className="w-full bg-slate-50 border border-slate-200 rounded-lg px-4 py-3 text-sm text-slate-800 outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 transition-all"
                        >
                          <option value="general">Général</option>
                          <option value="medical">Médical</option>
                          <option value="education">Éducation</option>
                          <option value="social">Social</option>
                          <option value="evenement">Évènement</option>
                        </select>
                      </div>
                    </div>
                    <button
                      onClick={() => galleryInputRef.current?.click()}
                      disabled={galleryUploading}
                      className="flex items-center gap-2.5 px-6 py-3 bg-emerald-600 hover:bg-emerald-700 text-white text-sm font-semibold rounded-xl transition-all disabled:opacity-50 shadow-sm shadow-emerald-200"
                    >
                      {galleryUploading ? <Loader2 size={16} className="animate-spin" /> : <Plus size={16} />}
                      {galleryUploading ? 'Upload en cours…' : 'Sélectionner et uploader une image'}
                    </button>
                    <input
                      ref={galleryInputRef}
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={e => e.target.files?.[0] && handleGalleryUpload(e.target.files[0])}
                    />
                  </div>
                </div>

                {/* Grille des images */}
                <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
                  <div className="px-8 py-5 border-b border-slate-100 flex items-center justify-between">
                    <div>
                      <h3 className="text-base font-bold text-slate-800">Médiathèque</h3>
                      <p className="text-xs text-slate-400 mt-0.5">Toutes les images de la galerie publique</p>
                    </div>
                    <span className="px-3 py-1 bg-slate-100 text-slate-600 text-sm font-semibold rounded-full">
                      {gallery.length} image{gallery.length > 1 ? 's' : ''}
                    </span>
                  </div>
                  <div className="px-8 py-6">
                    {gallery.length === 0 ? (
                      <div className="flex flex-col items-center justify-center py-16 text-center">
                        <div className="w-16 h-16 rounded-2xl bg-slate-100 flex items-center justify-center mb-4">
                          <ImageIcon size={28} className="text-slate-300" />
                        </div>
                        <p className="text-slate-400 font-medium">Aucune image pour l'instant</p>
                        <p className="text-slate-300 text-sm mt-1">Ajoutez votre première photo ci-dessus</p>
                      </div>
                    ) : (
                      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                        {gallery.map((img: any) => (
                          <div key={img.id} className="group relative rounded-xl overflow-hidden border border-slate-100 shadow-sm hover:shadow-md transition-shadow bg-white">
                            <div className="relative overflow-hidden">
                              <img
                                src={`${API}${img.image_url}`}
                                alt={img.title}
                                className="w-full h-44 object-cover group-hover:scale-105 transition-transform duration-300"
                              />
                              <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                              <button
                                onClick={() => deleteGalleryImage(img.id)}
                                className="absolute top-2.5 right-2.5 w-8 h-8 bg-red-500 hover:bg-red-600 text-white rounded-lg flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all shadow-md"
                              >
                                <Trash2 size={13} />
                              </button>
                            </div>
                            <div className="p-3">
                              <p className="text-sm font-semibold text-slate-800 truncate">{img.title || 'Sans titre'}</p>
                              <span className="inline-block mt-1 px-2 py-0.5 bg-slate-100 text-slate-500 text-xs rounded-md capitalize">{img.category}</span>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}

            {/* ===== CONTACT ===== */}
            {activeTab === 'contact' && (
              <SectionCard
                title="Coordonnées & Horaires"
                subtitle="Informations affichées sur la page de contact"
                onSave={() => saveItems([
                  { page: 'contact', section: 'info', key: 'address' },
                  { page: 'contact', section: 'info', key: 'phone' },
                  { page: 'contact', section: 'info', key: 'email' },
                  { page: 'contact', section: 'hours', key: 'week' },
                  { page: 'contact', section: 'hours', key: 'weekend' },
                ])}
              >
                <div className="grid grid-cols-2 gap-4">
                  <div className="col-span-2">
                    <Field label="Adresse" value={get('contact', 'info', 'address', 'Cocody, Angré, Nelson Mandela')} onChange={v => set('contact', 'info', 'address', v)} />
                  </div>
                  <Field label="Téléphone" value={get('contact', 'info', 'phone', '')} onChange={v => set('contact', 'info', 'phone', v)} />
                  <Field label="Email de contact" value={get('contact', 'info', 'email', '')} onChange={v => set('contact', 'info', 'email', v)} />
                </div>
                <div className="pt-2 border-t border-slate-100">
                  <p className="text-xs font-semibold uppercase tracking-widest text-slate-400 mb-4">Horaires d'ouverture</p>
                  <div className="grid grid-cols-2 gap-4">
                    <Field label="Semaine (Lun – Ven)" value={get('contact', 'hours', 'week', '08h00 - 18h00')} onChange={v => set('contact', 'hours', 'week', v)} />
                    <Field label="Weekend (Sam – Dim)" value={get('contact', 'hours', 'weekend', '')} onChange={v => set('contact', 'hours', 'weekend', v)} />
                  </div>
                </div>
              </SectionCard>
            )}

          </div>
        </main>
      </div>
    </div>
  );
};
