import { type JSX, onCleanup, onMount } from 'solid-js';
import { appController } from '@/controllers/app.controller';
import { useNuiEvent } from '@/hooks/useNuiEvent';
import { NuiEvent } from '@/types/index';

export const NuiProvider = (props: { children: JSX.Element }) => {
  const { state, hide, hideUI, setState } = appController;

  useNuiEvent(NuiEvent.setVisible, (data) => {
    setState('visible', data);
  });

  const handleKeydown = (e: KeyboardEvent) => {
    if (state.visible && e.key === 'Escape') {
      const target = e.target as HTMLElement;
      if (target.tagName === 'INPUT' || target.tagName === 'TEXTAREA' || target.isContentEditable) {
        return;
      }
      hide();
      hideUI();
    }
  };

  onMount(() => window.addEventListener('keydown', handleKeydown));
  onCleanup(() => window.removeEventListener('keydown', handleKeydown));

  return props.children;
};
