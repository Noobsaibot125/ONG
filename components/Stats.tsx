import React, { useState, useEffect, useRef } from 'react';
import { useContent } from '../context/ContentContext';

const DEFAULTS = [
  { value: 7509, suffix: '+', label: 'Kits scolaires distribués' },
  { value: 7,    suffix: '',  label: 'Conteneurs médicaux envoyés' },
  { value: 5,    suffix: '',  label: "Pays d'intervention" },
  { value: 507,  suffix: '+', label: 'Bénévoles actifs' },
];

const AnimatedNumber: React.FC<{ end: number; suffix: string }> = ({ end, suffix }) => {
  const [count, setCount] = useState(0);
  const ref = useRef<HTMLDivElement>(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) { setIsVisible(true); observer.disconnect(); } },
      { threshold: 0.1 }
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (!isVisible) return;
    let startTimestamp: number | null = null;
    const duration = 2000;
    const step = (timestamp: number) => {
      if (!startTimestamp) startTimestamp = timestamp;
      const progress = Math.min((timestamp - startTimestamp) / duration, 1);
      const ease = progress === 1 ? 1 : 1 - Math.pow(2, -10 * progress);
      setCount(Math.floor(ease * end));
      if (progress < 1) window.requestAnimationFrame(step);
    };
    window.requestAnimationFrame(step);
  }, [end, isVisible]);

  return <div ref={ref} className="text-4xl md:text-5xl font-bold mb-3 tracking-tight">{count}{suffix}</div>;
};

export const Stats: React.FC = () => {
  const { get } = useContent();

  const stats = DEFAULTS.map((d, i) => ({
    value:  parseInt(get('accueil', 'stats', `stat${i + 1}_value`,  String(d.value)), 10) || d.value,
    suffix: get('accueil', 'stats', `stat${i + 1}_suffix`, d.suffix),
    label:  get('accueil', 'stats', `stat${i + 1}_label`,  d.label),
  }));

  return (
    <div className="bg-green-600 py-16 text-white border-y border-green-500">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center divide-x divide-green-500/50">
          {stats.map((stat, index) => (
            <div key={index} className="px-2">
              <AnimatedNumber end={stat.value} suffix={stat.suffix} />
              <div className="text-green-50 text-sm font-semibold uppercase tracking-wide opacity-90">{stat.label}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
