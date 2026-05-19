// /Users/yanis/Programming/vstack-template/web/src/mocks/index.ts
import { toast } from 'starling-components';
import { NuiEvent } from '@/types/index';
import { registerAppHandlers } from './handlers/app.handlers';
import { debugEvent } from './nui.mocks';
import { mockStore } from './store';

/**
 * Hydrates the development UI with mock data.
 * This simulates the data push normally sent by the Lua client on startup.
 */
const hydrate = () => {
  const { state } = mockStore;

  // 1. Initial Visibility
  debugEvent(NuiEvent.setVisible, true);

  // 2. Initial Data Push
  debugEvent(NuiEvent.updateData, {
    id: 1,
    label: state.items[0].label,
    value: state.items[0].value,
  });

  toast.info('[MOCK] Development environment hydrated from MockStore');
};

/**
 * Registers all NUI mocks for development environment.
 * This is the single entry point for development environment setup.
 */
export const initMocks = () => {
  if (import.meta.env.PROD) return;

  // --- Register Domain Handlers ---
  registerAppHandlers();

  // --- Self-Synchronizing Bootstrap Sequence ---
  // Instead of a race-prone timer, we wait for the App to notify us that it is mounted.
  const win = window as unknown as { __PEFCL_MOCKS_READY__?: () => void };
  win.__PEFCL_MOCKS_READY__ = () => {
    console.log('[Mock Server] App mounted, starting hydration...');
    hydrate();
  };

  console.log('%c[VStack Mocks] Initialized', 'color: #ef4444; font-weight: bold;');
};
