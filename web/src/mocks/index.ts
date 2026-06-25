import { toast } from '@cdx-foundation/cdx-solidjs-components';
import { NuiEvent } from '@/types/index';
import { registerAppHandlers } from './handlers/app.handlers';
import { debugEvent } from './nui.mocks';

/**
 * Registers NUI callback handlers (getLocales, getTheme, hideUI).
 * Safe to call before render — handlers are looked up lazily via fetchNui.
 */
export const initMocks = () => {
  if (import.meta.env.PROD) return;

  registerAppHandlers();

  console.log('%c[VStack Mocks] Initialized', 'color: #ef4444; font-weight: bold;');
};

/**
 * Dispatches NUI events that require subscribers (NuiProvider/useNuiEvent)
 * to already be mounted. Call after render() completes.
 */
export const hydrate = () => {
  // Show the UI — NuiProvider's useNuiEvent handler is now listening
  debugEvent(NuiEvent.setVisible, true);

  toast.info('[MOCK] Development environment hydrated');
};
