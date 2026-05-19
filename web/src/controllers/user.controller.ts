// /Users/yanis/Programming/vstack-template/web/src/controllers/user.controller.ts
import { batch, createRoot } from 'solid-js';
import { createStore } from 'solid-js/store';

/**
 * UserController manages the player's personal state and identity.
 */
function createUserController() {
  const [state, setState] = createStore({
    player_name: '',
    identifier: '',
    balance: 0,
  });

  const hydrate = (data: { player_name?: string; identifier?: string; balance?: number }) => {
    batch(() => {
      setState({
        player_name: data.player_name || '',
        identifier: data.identifier || '',
        balance: data.balance || 0,
      });
    });
  };

  return {
    state,
    setState,
    hydrate,
  };
}

export const userController = createRoot(createUserController);
