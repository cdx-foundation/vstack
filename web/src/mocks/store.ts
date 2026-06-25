import { createRoot } from 'solid-js';
import { createStore } from 'solid-js/store';
import { mockAppInfo } from './data';

function createMockServerStore() {
  const [state, setState] = createStore({
    app: { ...mockAppInfo },
    visible: false,
    count: 0,
  });

  return { state, setState };
}

export const mockStore = createRoot(createMockServerStore);
