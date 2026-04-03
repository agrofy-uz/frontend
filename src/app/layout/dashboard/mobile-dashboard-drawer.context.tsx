import { createContext, useContext } from 'react';

export type MobileDashboardDrawerContextValue = {
  closeMobileDrawer: () => void;
  isMobile: boolean;
};

export const MobileDashboardDrawerContext =
  createContext<MobileDashboardDrawerContextValue | null>(null);

export function useMobileDashboardDrawer() {
  return useContext(MobileDashboardDrawerContext);
}
