import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Home, Users, ImageIcon, Phone, LogOut, Loader2, Plus, Trash2,
  Upload, CheckCircle2, LayoutDashboard, Rocket, Contact,
  AlertTriangle, RotateCcw, WifiOff, Save
} from 'lucide-react';

type Tab = 'dashboard' | 'accueil' | 'qsn' | 'actions' | 'galerie' | 'contact' | 'maintenance';
const API = 'https://amourduprochain.kks-technologies.com';

// --- Composants utilitaires ---

const Field: React.FC<{
  label: string;
  value: string;
  onChange: (v: string) => void;
  multiline?: boolean;
  rows?: number;
}> = ({ label, value, onChange, multiline, rows = 3 }) => (
  <div className="flex flex-col gap-2">
    <label className="text-lg font-bold text-gray-900">{label}</label>
    {multiline ? (
      <textarea
        rows={rows}
        value={value}
        onChange={e => onChange(e.target.value)}
        className="w-full bg-white border border-gray-200 rounded-xl px-5 py-4 text-lg text-gray-800 outline-none focus:border-[#10B981] transition-all placeholder:text-gray-300"
      />
    ) : (
      <input
        type="text"
        value={value}
        onChange={e => onChange(e.target.value)}
        className="w-full bg-white border border-gray-200 rounded-xl px-5 py-4 text-lg text-gray-800 outline-none focus:border-[#10B981] transition-all placeholder:text-gray-300"
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
      if (data.url) onUpload(data.url);
    } finally {
      setUploading(false);
    }
  };

  const previewSrc = currentUrl
    ? currentUrl.startsWith('/uploads/') ? `${API}${currentUrl}` : currentUrl
    : '';

  return (
    <div className="flex flex-col gap-2">
      <label className="text-lg font-bold text-gray-900">{label}</label>
      <div className="flex items-center gap-4">
        {previewSrc && (
          <img src={previewSrc} alt="preview" className="w-16 h-16 object-cover rounded-lg border border-gray-200 flex-shrink-0" />
        )}
        <input
          type="text"
          value={currentUrl}
          readOnly
          className="flex-1 bg-white border border-gray-200 rounded-xl px-5 py-4 text-lg text-gray-500 outline-none"
          placeholder="Aucune image sélectionnée"
        />
        <button
          type="button"
          onClick={() => inputRef.current?.click()}
          disabled={uploading}
          className="flex items-center justify-center w-20 h-16 bg-white border border-gray-200 hover:border-[#10B981] rounded-xl transition-all disabled:opacity-50"
        >
          {uploading ? <Loader2 size={24} className="animate-spin text-[#10B981]" /> : <Upload size={24} className="text-gray-400" />}
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

  // Maintenance
  const [maintenanceEnabled, setMaintenanceEnabled] = useState(false);
  const [maintenanceMessage, setMaintenanceMessage] = useState('Site en maintenance. Nous revenons bientôt !');
  const [savingMaintenance, setSavingMaintenance] = useState(false);
  const [maintenanceSaved, setMaintenanceSaved] = useState(false);

  // Reset
  const [showResetConfirm, setShowResetConfirm] = useState(false);
  const [resetting, setResetting] = useState(false);

  const navigate = useNavigate();

  useEffect(() => {
    const t = localStorage.getItem('admin_token') || '';
    if (!t) { navigate('/admin/login'); return; }
    setToken(t);
    fetchAll(t);
  }, [navigate]);

  const fetchAll = async (tk?: string) => {
    const authToken = tk || token;
    try {
      const [contentRes, galleryRes, maintenanceRes] = await Promise.all([
        fetch(`${API}/api/content`),
        fetch(`${API}/api/gallery`),
        fetch(`${API}/api/maintenance`),
      ]);
      const contentData = await contentRes.json();
      const galleryData = await galleryRes.json();
      const maintenanceData = await maintenanceRes.json();
      const map: Record<string, string> = {};
      contentData.forEach((item: any) => {
        map[`${item.page_name}|${item.section_name}|${item.content_key}`] = item.content_value;
      });
      setContent(map);
      setGallery(galleryData);
      setMaintenanceEnabled(maintenanceData.enabled || false);
      setMaintenanceMessage(maintenanceData.message || 'Site en maintenance. Nous revenons bientôt !');
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

  // Sauvegarde avec valeur immédiate (corrige le bug de closure stale pour les images)
  const saveDirectValue = async (page: string, section: string, key: string, value: string) => {
    setSaving(true);
    setSaveSuccess(false);
    try {
      await fetch(`${API}/api/content`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify({ page_name: page, section_name: section, content_key: key, content_value: value }),
      });
      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 2500);
    } finally {
      setSaving(false);
    }
  };

  // Sauvegarde de plusieurs items depuis le state courant
  const saveItems = async (items: { page: string; section: string; key: string }[]) => {
    if (items.length === 0) return;
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

  // Items correspondant à chaque onglet pour le bouton "Enregistrer" global
  const getTabItems = (): { page: string; section: string; key: string }[] => {
    switch (activeTab) {
      case 'accueil': return [
        { page: 'accueil', section: 'hero', key: 'title' },
        { page: 'accueil', section: 'hero', key: 'subtitle' },
        { page: 'accueil', section: 'about', key: 'paragraph1' },
        { page: 'accueil', section: 'about', key: 'paragraph2' },
        { page: 'accueil', section: 'about', key: 'quote' },
        ...[1, 2, 3, 4].flatMap(n => [
          { page: 'accueil', section: 'stats', key: `stat${n}_value` },
          { page: 'accueil', section: 'stats', key: `stat${n}_suffix` },
          { page: 'accueil', section: 'stats', key: `stat${n}_label` },
        ]),
      ];
      case 'qsn': return [
        { page: 'qsn', section: 'hero', key: 'title' },
        { page: 'qsn', section: 'hero', key: 'subtitle' },
        { page: 'qsn', section: 'intro', key: 'paragraph1' },
        { page: 'qsn', section: 'intro', key: 'paragraph2' },
        ...[1, 2, 3].flatMap(n => [
          { page: 'qsn', section: 'team', key: `member${n}_name` },
          { page: 'qsn', section: 'team', key: `member${n}_role` },
        ]),
      ];
      case 'actions': return [
        ...(['action1', 'action2', 'action3'] as const).flatMap(ak => [
          { page: 'actions', section: ak, key: 'title' },
          { page: 'actions', section: ak, key: 'description' },
          { page: 'actions', section: ak, key: 'point1' },
          { page: 'actions', section: ak, key: 'point2' },
          { page: 'actions', section: ak, key: 'point3' },
          { page: 'actions', section: ak, key: 'point4' },
        ]),
      ];
      case 'contact': return [
        { page: 'contact', section: 'info', key: 'address' },
        { page: 'contact', section: 'info', key: 'phone' },
        { page: 'contact', section: 'info', key: 'email' },
        { page: 'contact', section: 'hours', key: 'week' },
        { page: 'contact', section: 'hours', key: 'weekend' },
      ];
      default: return [];
    }
  };

  const handleGlobalSave = () => saveItems(getTabItems());

  // Maintenance save
  const saveMaintenance = async () => {
    setSavingMaintenance(true);
    setMaintenanceSaved(false);
    try {
      await fetch(`${API}/api/maintenance`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify({ enabled: maintenanceEnabled, message: maintenanceMessage }),
      });
      setMaintenanceSaved(true);
      setTimeout(() => setMaintenanceSaved(false), 3000);
    } finally {
      setSavingMaintenance(false);
    }
  };

  // Reset content
  const handleReset = async () => {
    setResetting(true);
    try {
      await fetch(`${API}/api/content/reset`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` },
      });
      setContent({});
      setShowResetConfirm(false);
    } finally {
      setResetting(false);
    }
  };

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
    <div className="flex h-screen items-center justify-center" style={{ background: 'linear-gradient(to bottom, #0D4A23, #1A7A3C)' }}>
      <div className="flex flex-col items-center gap-4">
        <img src="/images/logosansfondcontour.png" alt="Logo" className="w-16 h-16 object-contain" />
        <Loader2 className="animate-spin text-white/80" size={28} />
        <p className="text-white/60 text-sm">Chargement du tableau de bord…</p>
      </div>
    </div>
  );

  const tabs: { id: Tab; icon: React.ElementType; label: string }[] = [
    { id: 'dashboard', icon: LayoutDashboard, label: 'Tableau de bord' },
    { id: 'accueil', icon: Home, label: 'Accueil' },
    { id: 'qsn', icon: Users, label: 'Qui sommes-nous' },
    { id: 'actions', icon: Rocket, label: 'Nos Actions' },
    { id: 'galerie', icon: ImageIcon, label: 'Galerie' },
    { id: 'contact', icon: Contact, label: 'Contacts' },
    { id: 'maintenance', icon: WifiOff, label: 'Maintenance' },
  ];

  const SectionCard: React.FC<{
    title: string;
    icon?: React.ElementType;
    children: React.ReactNode;
    onSave?: () => void;
  }> = ({ title, icon: Icon = LayoutDashboard, children, onSave }) => (
    <div className="bg-white rounded-[32px] border border-gray-100 shadow-sm overflow-hidden p-10">
      <div className="flex items-center justify-between gap-4 mb-10">
        <div className="flex items-center gap-4">
          <div className="text-[#10B981]">
            <Icon size={32} />
          </div>
          <h3 className="text-3xl font-bold text-gray-900">{title}</h3>
        </div>
        {onSave && (
          <button
            onClick={onSave}
            className="flex items-center gap-2 px-4 py-2 bg-emerald-50 text-emerald-700 font-semibold rounded-xl hover:bg-emerald-100 transition-all text-sm border border-emerald-200"
          >
            <Save size={16} />
            Enregistrer
          </button>
        )}
      </div>
      <div className="space-y-8">
        {children}
      </div>
    </div>
  );

  const StatBlock: React.FC<{ n: number; defaults: { v: string; s: string; l: string } }> = ({ n, defaults }) => (
    <div className="bg-gray-50 rounded-[24px] border border-gray-100 p-8">
      <div className="flex items-center gap-3 mb-6">
        <span className="w-8 h-8 rounded-full bg-emerald-100 text-[#10B981] text-sm font-extrabold flex items-center justify-center">{n}</span>
        <span className="text-sm font-bold text-gray-400 uppercase tracking-widest">Statistique {n}</span>
      </div>
      <div className="grid grid-cols-3 gap-6">
        <Field label="Valeur" value={get('accueil', 'stats', `stat${n}_value`, defaults.v)} onChange={v => set('accueil', 'stats', `stat${n}_value`, v)} />
        <Field label="Suffixe" value={get('accueil', 'stats', `stat${n}_suffix`, defaults.s)} onChange={v => set('accueil', 'stats', `stat${n}_suffix`, v)} />
        <Field label="Libellé" value={get('accueil', 'stats', `stat${n}_label`, defaults.l)} onChange={v => set('accueil', 'stats', `stat${n}_label`, v)} />
      </div>
    </div>
  );

  const showGlobalSave = ['accueil', 'qsn', 'actions', 'contact'].includes(activeTab);

  return (
    <div className="flex min-h-screen bg-[#F1F5F9]">

      {/* ===== SIDEBAR ===== */}
      <aside className="w-72 flex flex-col flex-shrink-0 min-h-screen shadow-xl z-20" style={{ background: 'linear-gradient(to bottom, #0D4A23 0%, #145C2D 40%, #1A7A3C 100%)' }}>
        {/* Brand Section */}
        <div className="px-6 pt-8 pb-6 text-center text-white border-b border-white/15">
          <div className="flex justify-center mb-3">
            <img src="/images/logosansfondcontour.png" alt="Logo" className="w-20 h-20 object-contain" />
          </div>
          <p className="text-sm font-medium opacity-85 mb-1">L'amour du prochain</p>
          <h1 className="text-2xl font-extrabold tracking-wide">ADMIN</h1>
          <div className="mt-4 border-t border-white/20" />
        </div>

        {/* Navigation */}
        <nav className="flex-1 mt-4 px-3 space-y-1">
          {tabs.map(item => {
            const isActive = activeTab === item.id;
            const isMaintenance = item.id === 'maintenance';
            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`w-full flex items-center gap-3 px-5 py-3 rounded-lg transition-all font-semibold text-sm ${
                  isActive
                    ? isMaintenance
                      ? 'bg-orange-500 text-white shadow-md'
                      : 'bg-white text-[#145C2D] shadow-md'
                    : isMaintenance
                      ? 'text-orange-300 hover:bg-orange-500/20'
                      : 'text-white/90 hover:bg-white/10'
                }`}
              >
                <item.icon size={20} className={isActive ? (isMaintenance ? 'text-white' : 'text-[#145C2D]') : isMaintenance ? 'text-orange-300' : 'text-white/80'} />
                <span>{item.label}</span>
                {isMaintenance && maintenanceEnabled && (
                  <span className="ml-auto w-2 h-2 rounded-full bg-orange-400 animate-pulse" />
                )}
              </button>
            );
          })}
        </nav>

        {/* Logout at bottom */}
        <div className="p-4 border-t border-white/15">
          <button
            onClick={() => { localStorage.removeItem('admin_token'); navigate('/admin/login'); }}
            className="w-full flex items-center justify-center gap-3 px-5 py-3 rounded-lg bg-white/10 text-white hover:bg-red-500/80 transition-all font-semibold text-sm border border-white/10"
          >
            <LogOut size={18} />
            <span>Déconnexion</span>
          </button>
        </div>
      </aside>

      {/* ===== CONTENU PRINCIPAL ===== */}
      <div className="flex-1 flex flex-col min-h-screen overflow-hidden">

        {/* Header / Topbar */}
        <header className="bg-white px-10 py-8 flex items-center justify-between flex-shrink-0 border-b border-gray-100">
          <div>
            <h2 className="text-4xl font-extrabold text-[#111827] tracking-tight mb-1">
              Gestion du site
            </h2>
            <p className="text-gray-500 text-lg font-medium opacity-80">
              Modifiez le contenu de votre site en temps réel
            </p>
          </div>

          <div className="flex items-center gap-3">
            {/* Reset button */}
            <button
              onClick={() => setShowResetConfirm(true)}
              className="flex items-center gap-2 px-5 py-3 border-2 border-red-300 text-red-500 font-bold rounded-xl hover:bg-red-50 transition-all text-sm"
              title="Réinitialiser le contenu par défaut"
            >
              <RotateCcw size={18} />
              Réinitialiser
            </button>

            <button
              onClick={() => window.open('/', '_blank')}
              className="flex items-center gap-2 px-5 py-3 border-2 border-emerald-500 text-emerald-600 font-bold rounded-xl hover:bg-emerald-50 transition-all text-sm"
            >
              <Home size={18} />
              Voir le site
            </button>

            {showGlobalSave && (
              <button
                onClick={handleGlobalSave}
                disabled={saving}
                className={`flex items-center gap-2 px-6 py-3 font-extrabold rounded-xl transition-all shadow-lg text-sm ${
                  saveSuccess
                    ? 'bg-emerald-400 text-white shadow-emerald-200'
                    : 'bg-[#10B981] text-white hover:bg-emerald-600 shadow-emerald-200'
                }`}
              >
                {saving ? (
                  <Loader2 size={20} className="animate-spin" />
                ) : saveSuccess ? (
                  <CheckCircle2 size={20} />
                ) : (
                  <Save size={20} />
                )}
                {saveSuccess ? 'Enregistré !' : 'Enregistrer'}
              </button>
            )}
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
                  icon={Home}
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
                    onUpload={url => { set('accueil', 'hero', 'image', url); saveDirectValue('accueil', 'hero', 'image', url); }}
                    token={token}
                  />
                </SectionCard>

                <SectionCard
                  title="Section À propos"
                  icon={Users}
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
                    onUpload={url => { set('accueil', 'about', 'image', url); saveDirectValue('accueil', 'about', 'image', url); }}
                    token={token}
                  />
                </SectionCard>

                <SectionCard
                  title="Statistiques clés"
                  icon={LayoutDashboard}
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
                  icon={Home}
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
                    onUpload={url => { set('qsn', 'hero', 'image', url); saveDirectValue('qsn', 'hero', 'image', url); }}
                    token={token}
                  />
                </SectionCard>

                <SectionCard
                  title="Présentation"
                  icon={Contact}
                  onSave={() => saveItems([
                    { page: 'qsn', section: 'intro', key: 'paragraph1' },
                    { page: 'qsn', section: 'intro', key: 'paragraph2' },
                  ])}
                >
                  <Field label="Paragraphe 1" value={get('qsn', 'intro', 'paragraph1', "L'ONG L'Amour Du Prochain a été créée le 1er novembre 2017 en France. Notre structure est régie par la loi du 1er juillet 1901 et le décret du 16 août 1901.")} onChange={v => set('qsn', 'intro', 'paragraph1', v)} multiline rows={4} />
                  <Field label="Paragraphe 2" value={get('qsn', 'intro', 'paragraph2', "Sous la présidence de M. Serge KADIO, l'association s'est donnée pour mission principale d'apporter un soutien concret aux populations les plus démunies, avec un focus particulier sur l'Afrique de l'Ouest.")} onChange={v => set('qsn', 'intro', 'paragraph2', v)} multiline rows={4} />
                </SectionCard>

                <SectionCard title="Images de la présentation" icon={ImageIcon}>
                  <div className="grid grid-cols-3 gap-4">
                    {(['image1', 'image2', 'image3'] as const).map((key, i) => (
                      <ImageUploader
                        key={key}
                        label={`Image ${i + 1}`}
                        currentUrl={get('qsn', 'intro', key)}
                        onUpload={url => { set('qsn', 'intro', key, url); saveDirectValue('qsn', 'intro', key, url); }}
                        token={token}
                      />
                    ))}
                  </div>
                </SectionCard>

                <SectionCard
                  title="Équipe dirigeante"
                  icon={Users}
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
                          onUpload={url => { set('qsn', 'team', `member${n}_image`, url); saveDirectValue('qsn', 'team', `member${n}_image`, url); }}
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
                      icon={Rocket}
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
                        onUpload={url => { set('actions', ak, 'image', url); saveDirectValue('actions', ak, 'image', url); }}
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
                icon={Phone}
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

            {/* ===== MAINTENANCE ===== */}
            {activeTab === 'maintenance' && (
              <div className="space-y-6">
                {/* Status Card */}
                <div className={`rounded-[32px] border-2 p-10 ${maintenanceEnabled ? 'bg-orange-50 border-orange-300' : 'bg-white border-gray-100'} shadow-sm transition-all`}>
                  <div className="flex items-center gap-4 mb-8">
                    <div className={`p-3 rounded-2xl ${maintenanceEnabled ? 'bg-orange-500' : 'bg-gray-100'}`}>
                      <WifiOff size={28} className={maintenanceEnabled ? 'text-white' : 'text-gray-400'} />
                    </div>
                    <div>
                      <h3 className="text-3xl font-bold text-gray-900">Mode Maintenance</h3>
                      <p className="text-gray-500 mt-1">Lorsqu'activé, les visiteurs verront une page de maintenance</p>
                    </div>
                  </div>

                  {/* Toggle */}
                  <div className={`flex items-center justify-between p-6 rounded-2xl border-2 mb-8 ${maintenanceEnabled ? 'border-orange-300 bg-orange-100/50' : 'border-gray-200 bg-gray-50'}`}>
                    <div>
                      <p className="text-xl font-bold text-gray-800">Site en maintenance</p>
                      <p className={`text-sm mt-1 font-medium ${maintenanceEnabled ? 'text-orange-600' : 'text-gray-400'}`}>
                        {maintenanceEnabled ? '⚠️ Le site est actuellement inaccessible aux visiteurs' : '✅ Le site est accessible au public'}
                      </p>
                    </div>
                    <button
                      onClick={() => setMaintenanceEnabled(!maintenanceEnabled)}
                      className={`relative w-16 h-8 rounded-full transition-all duration-300 focus:outline-none ${maintenanceEnabled ? 'bg-orange-500' : 'bg-gray-300'}`}
                    >
                      <span className={`absolute top-1 left-1 w-6 h-6 bg-white rounded-full shadow transition-transform duration-300 ${maintenanceEnabled ? 'translate-x-8' : 'translate-x-0'}`} />
                    </button>
                  </div>

                  {/* Message personnalisé */}
                  <div className="mb-6">
                    <label className="text-lg font-bold text-gray-900 block mb-3">Message affiché aux visiteurs</label>
                    <textarea
                      rows={4}
                      value={maintenanceMessage}
                      onChange={e => setMaintenanceMessage(e.target.value)}
                      placeholder="Ex : Notre site est en cours de maintenance. Nous serons de retour très bientôt. Merci pour votre patience !"
                      className="w-full bg-white border-2 border-gray-200 rounded-xl px-5 py-4 text-lg text-gray-800 outline-none focus:border-orange-400 transition-all"
                    />
                  </div>

                  {/* Preview */}
                  {maintenanceEnabled && (
                    <div className="mb-6 rounded-2xl overflow-hidden border-2 border-orange-200">
                      <div className="bg-orange-500 px-4 py-2 flex items-center gap-2">
                        <div className="w-3 h-3 rounded-full bg-white/50" />
                        <div className="w-3 h-3 rounded-full bg-white/50" />
                        <div className="w-3 h-3 rounded-full bg-white/50" />
                        <span className="text-white/70 text-xs ml-2 font-mono">Aperçu — page visiteurs</span>
                      </div>
                      <div className="bg-gradient-to-br from-gray-900 to-gray-800 px-8 py-12 text-center">
                        <div className="w-16 h-16 rounded-full bg-orange-500/20 flex items-center justify-center mx-auto mb-4">
                          <WifiOff size={32} className="text-orange-400" />
                        </div>
                        <h2 className="text-2xl font-bold text-white mb-3">Site en maintenance</h2>
                        <p className="text-gray-400 text-base max-w-md mx-auto">{maintenanceMessage}</p>
                      </div>
                    </div>
                  )}

                  {/* Save button */}
                  <button
                    onClick={saveMaintenance}
                    disabled={savingMaintenance}
                    className={`flex items-center gap-3 px-8 py-4 font-bold rounded-xl transition-all text-lg w-full justify-center ${
                      maintenanceSaved
                        ? 'bg-emerald-500 text-white'
                        : maintenanceEnabled
                          ? 'bg-orange-500 hover:bg-orange-600 text-white shadow-lg shadow-orange-200'
                          : 'bg-[#10B981] hover:bg-emerald-600 text-white shadow-lg shadow-emerald-200'
                    }`}
                  >
                    {savingMaintenance ? (
                      <Loader2 size={22} className="animate-spin" />
                    ) : maintenanceSaved ? (
                      <CheckCircle2 size={22} />
                    ) : (
                      <Save size={22} />
                    )}
                    {maintenanceSaved ? 'Paramètres sauvegardés !' : 'Enregistrer les paramètres'}
                  </button>
                </div>

                {/* Info card */}
                <div className="bg-blue-50 border border-blue-200 rounded-2xl p-6 flex gap-4">
                  <AlertTriangle size={22} className="text-blue-500 flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="font-bold text-blue-800 mb-1">Comment ça fonctionne ?</p>
                    <p className="text-blue-600 text-sm">Lorsque le mode maintenance est activé, tous les visiteurs verront une page indiquant que le site est en cours de maintenance. Les administrateurs peuvent toujours accéder au dashboard via <span className="font-mono font-bold">/admin</span>.</p>
                  </div>
                </div>
              </div>
            )}

          </div>
        </main>
      </div>

      {/* ===== MODAL RÉINITIALISATION ===== */}
      {showResetConfirm && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-6">
          <div className="bg-white rounded-3xl shadow-2xl max-w-md w-full p-8">
            <div className="flex items-center justify-center w-16 h-16 bg-red-100 rounded-2xl mx-auto mb-6">
              <AlertTriangle size={32} className="text-red-500" />
            </div>
            <h3 className="text-2xl font-extrabold text-gray-900 text-center mb-3">Réinitialiser le contenu ?</h3>
            <p className="text-gray-500 text-center mb-8">
              Cette action supprimera <strong>tout le contenu personnalisé</strong> du site (textes, images, etc.) et restaurera les valeurs par défaut. Cette action est <strong>irréversible</strong>.
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => setShowResetConfirm(false)}
                className="flex-1 px-6 py-3 border-2 border-gray-200 text-gray-700 font-bold rounded-xl hover:bg-gray-50 transition-all"
              >
                Annuler
              </button>
              <button
                onClick={handleReset}
                disabled={resetting}
                className="flex-1 px-6 py-3 bg-red-500 hover:bg-red-600 text-white font-bold rounded-xl transition-all flex items-center justify-center gap-2"
              >
                {resetting ? <Loader2 size={18} className="animate-spin" /> : <RotateCcw size={18} />}
                {resetting ? 'Réinitialisation…' : 'Réinitialiser'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
