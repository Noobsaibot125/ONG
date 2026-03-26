import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';

export const API_URL = 'http://localhost:5000';

export interface GalleryItem {
  id: number;
  title: string;
  image_url: string;
  category: string;
}

interface ContentContextType {
  get: (page: string, section: string, key: string, fallback?: string) => string;
  imgSrc: (url: string, staticFallback: string) => string;
  gallery: GalleryItem[];
  loading: boolean;
  refresh: () => void;
}

const ContentContext = createContext<ContentContextType>({
  get: (_, __, ___, fallback = '') => fallback,
  imgSrc: (_, s) => s,
  gallery: [],
  loading: true,
  refresh: () => {},
});

export const ContentProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [contentMap, setContentMap] = useState<Record<string, string>>({});
  const [gallery, setGallery] = useState<GalleryItem[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchAll = useCallback(async () => {
    try {
      const [contentRes, galleryRes] = await Promise.all([
        fetch(`${API_URL}/api/content`),
        fetch(`${API_URL}/api/gallery`),
      ]);
      const contentData = await contentRes.json();
      const galleryData = await galleryRes.json();

      const map: Record<string, string> = {};
      contentData.forEach((item: any) => {
        map[`${item.page_name}|${item.section_name}|${item.content_key}`] = item.content_value;
      });

      setContentMap(map);
      setGallery(galleryData);
    } catch {
      // backend non disponible — les composants utiliseront leurs valeurs par défaut
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchAll(); }, [fetchAll]);

  const get = (page: string, section: string, key: string, fallback = '') =>
    contentMap[`${page}|${section}|${key}`] || fallback;

  // Retourne l'URL correcte : préfixe API si c'est un upload, sinon l'URL statique
  const imgSrc = (url: string, staticFallback: string) => {
    if (!url) return staticFallback;
    if (url.startsWith('/uploads/')) return `${API_URL}${url}`;
    return url;
  };

  return (
    <ContentContext.Provider value={{ get, imgSrc, gallery, loading, refresh: fetchAll }}>
      {children}
    </ContentContext.Provider>
  );
};

export const useContent = () => useContext(ContentContext);
