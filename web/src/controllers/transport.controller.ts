// /Users/yanis/Programming/vstack-template/web/src/controllers/transport.controller.ts
import { createRoot, createSignal } from 'solid-js';
import { fetchNui } from '@/lib/nui';
import type { NuiCallback } from '@/types/index';

/**
 * TransportController
 * The single source of truth for NUI communication.
 */
function createTransportController() {
  const [pendingRequests, setPendingRequests] = createSignal(0);

  const isLoading = () => pendingRequests() > 0;

  const request = async <T = unknown>(
    cb: string,
    data?: unknown,
  ): Promise<{ success: boolean; data?: T; error?: string }> => {
    setPendingRequests((prev) => prev + 1);

    try {
      const response = await fetchNui(cb as NuiCallback, data);

      return { success: true, data: response as T };
    } catch (err: unknown) {
      const errorMessage = (err as Error)?.message || 'Connection to backend lost';

      if (import.meta.env.DEV) {
        console.error(`[NUI Error] ${cb}`, err);
      }

      return { success: false, error: errorMessage };
    } finally {
      setPendingRequests((prev) => Math.max(0, prev - 1));
    }
  };

  return {
    isLoading,
    request,
  };
}

export const transportController = createRoot(createTransportController);
