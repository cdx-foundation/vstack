import { onCleanup } from 'solid-js';
import type { NuiEvent, NuiEventPayload } from '@/types/index';

type Handler<T = unknown> = (data: T) => void;

/**
 * NuiEventGateway
 *
 * A deep, single-instance gateway module that manages a single global window
 * message listener. Distributes matching incoming NUI events to active subscribers.
 */
class NuiEventGateway {
  private handlers = new Map<string, Set<Handler>>();

  constructor() {
    if (typeof window !== 'undefined') {
      window.addEventListener('message', this.handleMessage);
    }
  }

  private handleMessage = (event: MessageEvent<{ action: string; data: unknown }>) => {
    if (!event.data || typeof event.data.action !== 'string') return;
    const { action, data } = event.data;

    const actionHandlers = this.handlers.get(action);
    if (actionHandlers) {
      for (const handler of actionHandlers) {
        try {
          handler(data);
        } catch (err) {
          console.error(`[NuiEventGateway] Error in handler for action "${action}":`, err);
        }
      }
    }
  };

  /**
   * Subscribes a handler to a specific NUI event action.
   * Returns a cleanup function to unsubscribe.
   */
  public subscribe<E extends NuiEvent>(
    action: E,
    handler: Handler<NuiEventPayload[E]>,
  ): () => void {
    let actionHandlers = this.handlers.get(action);
    if (!actionHandlers) {
      actionHandlers = new Set();
      this.handlers.set(action, actionHandlers);
    }

    actionHandlers.add(handler);

    return () => {
      const currentHandlers = this.handlers.get(action);
      if (currentHandlers) {
        currentHandlers.delete(handler);
        if (currentHandlers.size === 0) {
          this.handlers.delete(action);
        }
      }
    };
  }
}

// Instantiate the single event gateway adapter
export const nuiEventGateway = new NuiEventGateway();

/**
 * useNuiEvent Hook
 *
 * A high-performance SolidJS hook to listen for events dispatched from FiveM client scripts.
 * Consumes the single global NuiEventGateway seam to avoid duplicate DOM listeners.
 */
export function useNuiEvent<E extends NuiEvent>(
  action: E,
  handler: (data: NuiEventPayload[E]) => void,
) {
  const unsubscribe = nuiEventGateway.subscribe(action, handler);
  onCleanup(unsubscribe);
}
