// /Users/yanis/Programming/vstack-template/web/src/lib/nui.ts
import type { NuiCallbackContract } from '@/types/index';

/**
 * Environment detection for FiveM.
 * `invokeNative` only exists within the CEF context of the game.
 */
export const isBrowser = !(window as unknown as { invokeNative: unknown }).invokeNative;

/**
 * The name of the resource, used in the fetch URL.
 */
export const resourceName =
  (window as unknown as { GetParentResourceName?: () => string }).GetParentResourceName?.() ||
  'nui-res';

/**
 * Sends a message to the FiveM client (Lua).
 * In browser mode (dev), it dynamically imports and intercepts calls with mock responses.
 *
 * @param action - The NUI callback name.
 * @param data - Optional request payload.
 * @returns The response from Lua or the mock handler.
 */
export async function fetchNui<C extends keyof NuiCallbackContract>(
  action: C,
  data?: NuiCallbackContract[C]['request'],
): Promise<NuiCallbackContract[C]['response'] | null> {
  // 1. Check for mock environment
  if (isBrowser && !import.meta.env.PROD) {
    try {
      const { mockResponses } = await import('../mocks/nui.mocks');
      const handler = mockResponses.get(action);

      if (handler) {
        return (await handler(data as never)) as NuiCallbackContract[C]['response'];
      }
    } catch (err) {
      console.warn(`[NUI:MOCK] Failed to load mocks for ${action}:`, err);
    }

    // Fallback if no mock is found in browser
    return null;
  }

  // 2. Production / In-game Fetch
  try {
    const response = await fetch(`https://${resourceName}/${action}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json; charset=UTF-8',
      },
      body: JSON.stringify(data ?? {}),
    });

    if (!response.ok) {
      throw new Error(`NUI Fetch failed: ${response.status} ${response.statusText}`);
    }

    return await response.json();
  } catch (error) {
    console.error(`[NUI:ERROR] Failed to fetch ${action}:`, error);
    throw error;
  }
}
