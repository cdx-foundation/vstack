// /Users/yanis/Programming/vstack-template/web/src/mocks/store.ts
import { createRoot } from 'solid-js';
import { createStore } from 'solid-js/store';
import { mockAppInfo, mockItems } from './data';

/**
 * MockServerStore
 *
 * This store represents the global state of the "Mock Backend".
 * It persists data during the development session, allowing for
 * realistic interactions without a live server.
 */
function createMockServerStore() {
  const [state, setState] = createStore({
    app: { ...mockAppInfo },
    items: [...mockItems],
    visible: false,
    count: 0,
  });

  return { state, setState };
}

export const mockStore = createRoot(createMockServerStore);
