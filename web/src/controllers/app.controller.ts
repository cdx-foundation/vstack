// /Users/yanis/Programming/vstack-template/web/src/controllers/app.controller.ts
import { createRoot } from 'solid-js';
import { createStore } from 'solid-js/store';
import { fetchNui } from '@/lib/nui';
import { NuiCallback } from '@/types';

/**
 * AppController manages visibility state and general NUI communication.
 */
function createAppController() {
  const [state, setState] = createStore({
    visible: false,
  });

  const show = () => setState('visible', true);
  const hide = () => setState('visible', false);
  const toggle = () => setState('visible', (v) => !v);

  const hideUI = async () => {
    hide();
    return fetchNui(NuiCallback.hideUI);
  };

  const getItemData = async (id: number) => {
    return fetchNui(NuiCallback.getItemData, { id });
  };

  return {
    state,
    setState,
    show,
    hide,
    toggle,
    hideUI,
    getItemData,
  };
}

export const appController = createRoot(createAppController);
