import { toast } from '@cdx-foundation/cdx-solidjs-components';
import { NuiCallback } from '@/types/index';
import { defineHandlers } from '../nui.mocks';
import { mockStore } from '../store';
import { mockTheme } from '../data';

export const registerAppHandlers = () => {
  const { setState } = mockStore;

  defineHandlers({
    [NuiCallback.getLocales]: () => {
      return 'en';
    },

    [NuiCallback.getTheme]: () => {
      return mockTheme;
    },

    [NuiCallback.hideUI]: () => {
      setState('visible', false);
      toast.success('[MOCK] UI visibility set to false');
      return 'ok';
    },
  });
};
