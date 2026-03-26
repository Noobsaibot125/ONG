import { LucideIcon } from 'lucide-react';

export interface TeamMember {
  name: string;
  role: string;
  location: string;
  image: string;
}

export interface ActionItem {
  title: string;
  description: string;
  icon: LucideIcon;
  color: string;
}

export interface Statistic {
  value: string;
  label: string;
}

export interface NavLink {
  label: string;
  href: string;
}