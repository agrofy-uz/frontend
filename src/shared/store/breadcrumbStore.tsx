import { create } from 'zustand';

interface BreadcrumbItem {
  title: string;
  href: string;
}

interface BreadcrumbState {
  breadcrumbs: Array<BreadcrumbItem>;
  setBreadcrumbs: (breadcrumbs: Array<BreadcrumbItem>) => void;
}

export const useBreadcrumbStore = create<BreadcrumbState>()(set => ({
  breadcrumbs: [],
  setBreadcrumbs: breadcrumbs => set({ breadcrumbs }),
}));
