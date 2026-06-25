import type { NuiCallbackContract } from '@/types/index';

const isBrowser = !(window as unknown as { invokeNative: unknown }).invokeNative;

const resourceName =
  (window as unknown as { GetParentResourceName?: () => string }).GetParentResourceName?.() ||
  'nui-res';

export async function fetchNui<C extends keyof NuiCallbackContract>(
  action: C,
  data?: NuiCallbackContract[C]['request'],
): Promise<NuiCallbackContract[C]['response'] | null> {
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
    return null;
  }

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
