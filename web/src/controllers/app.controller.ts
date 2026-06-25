import { createRoot } from 'solid-js';
import { createStore } from 'solid-js/store';
import { fetchNui } from '@/lib/nui';
import { NuiCallback } from '@/types';

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

  return {
    state,
    setState,
    show,
    hide,
    toggle,
    hideUI,
  };
}

export const appController = createRoot(createAppController);
