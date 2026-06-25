import { toast } from '@cdx-foundation/cdx-solidjs-components';
import { NuiEvent } from '@/types/index';
import { registerAppHandlers } from './handlers/app.handlers';
import { debugEvent } from './nui.mocks';

const hydrate = () => {
  debugEvent(NuiEvent.setVisible, true);
  toast.info('[MOCK] Development environment hydrated from MockStore');
};

export const initMocks = () => {
  console.log(import.meta.env.PROD);
  if (import.meta.env.PROD) return;

  registerAppHandlers();
  const win = window as unknown as { __PEFCL_MOCKS_READY__?: () => void };
  win.__PEFCL_MOCKS_READY__ = () => {
    console.log('[Mock Server] App mounted, starting hydration...');
    hydrate();
  };

  console.log('%c[VStack Mocks] Initialized', 'color: #ef4444; font-weight: bold;');
};
