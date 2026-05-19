// /Users/yanis/Programming/vstack-template/web/src/mocks/handlers/app.handlers.ts
import { toast } from 'starling-components';
import { NuiCallback } from '@/types/index';
import { defineHandlers } from '../nui.mocks';
import { mockStore } from '../store';

/**
 * Registers application-wide NUI handlers.
 */
export const registerAppHandlers = () => {
  const { state, setState } = mockStore;

  defineHandlers({
    [NuiCallback.getLocales]: () => {
      return 'en';
    },

    [NuiCallback.hideUI]: () => {
      setState('visible', false);
      toast.success('[MOCK] UI visibility set to false');
      return 'ok';
    },

    [NuiCallback.getItemData]: (_data) => {
      // Find item in mock store or return default
      const item = state.items.find((i) => i.id === 1);
      return item || { label: 'Unknown Item', value: 0 };
    },
  });
};
