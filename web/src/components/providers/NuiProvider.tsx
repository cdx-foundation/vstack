// /Users/yanis/Programming/vstack-template/web/src/components/providers/NuiProvider.tsx
import { type JSX, onCleanup, onMount } from 'solid-js';
import { appController } from '@/controllers/app.controller';
import { useNuiEvent } from '@/hooks/useNuiEvent';
import { NuiEvent } from '@/types/index';

/**
 * NuiProvider manages the global lifecycle of NUI event listeners
 * and common keyboard interactions.
 */
export const NuiProvider = (props: { children: JSX.Element }) => {
  const { state, hide, hideUI, setState } = appController;

  // Handle Visibility Events
  useNuiEvent(NuiEvent.setVisible, (data) => {
    setState('visible', data);
  });

  // Global Escape Key Listener
  const handleKeydown = (e: KeyboardEvent) => {
    if (state.visible && e.key === 'Escape') {
      const target = e.target as HTMLElement;
      if (target.tagName === 'INPUT' || target.tagName === 'TEXTAREA' || target.isContentEditable) {
        return;
      }

      // Optimistic hide
      hide();
      hideUI();
    }
  };

  onMount(() => window.addEventListener('keydown', handleKeydown));
  onCleanup(() => window.removeEventListener('keydown', handleKeydown));

  return props.children;
};
