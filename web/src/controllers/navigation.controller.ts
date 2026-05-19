// /Users/yanis/Programming/vstack-template/web/src/controllers/navigation.controller.ts
import LayoutDashboard from 'lucide-solid/icons/layout-dashboard';
import { createMemo, createRoot, createSignal } from 'solid-js';
import { useLocales } from '@/hooks/useLocales';
import { appController } from './app.controller';

/**
 * NavigationController manages application routing and menu structure.
 */
function createNavigationController() {
  const [activePage, setInternalActivePage] = createSignal('dashboard');
  const _ui = appController;
  const { t } = useLocales();

  const navItems = createMemo(() => [
    { id: 'dashboard', label: t('nav.dashboard', 'Dashboard'), icon: LayoutDashboard },
  ]);

  const navigate = (pageId: string) => {
    setInternalActivePage(pageId);
  };

  const isPageActive = (pageId: string) => activePage() === pageId;

  return {
    activePage,
    navigate,
    isPageActive,
    navItems,
  };
}

export const navigationController = createRoot(createNavigationController);
