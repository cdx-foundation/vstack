// /Users/yanis/Programming/vstack-template/web/src/controllers/player.controller.ts
import { createRoot } from 'solid-js';
import { createStore } from 'solid-js/store';

/**
 * PlayerController manages searches and metadata for other players.
 */
function createPlayerController() {
  const [state, setState] = createStore({
    searchQuery: '',
    searchResults: [] as unknown[],
  });

  const setSearchQuery = (query: string) => setState('searchQuery', query);

  return {
    state,
    setSearchQuery,
  };
}

export const playerController = createRoot(createPlayerController);
