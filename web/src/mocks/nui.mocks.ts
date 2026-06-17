import type { NuiCallbackContract, NuiEvent, NuiEventPayload } from '@/types';

/**
 * Type-safe mock handler signature.
 */
type MockHandler = (data: never) => unknown;

/**
 * Registry for mock responses.
 * Shared between the mock initializer and the fetchNui interceptor.
 */
export const mockResponses = new Map<string, MockHandler>();

/**
 * Registers a mock response for a NUI callback.
 * Used exclusively during development to simulate Lua responses.
 */
function registerMock<C extends keyof NuiCallbackContract>(
  action: C,
  handler: NuiCallbackContract[C]['request'] extends void
    ? () => NuiCallbackContract[C]['response'] | Promise<NuiCallbackContract[C]['response']>
    : (
        data: NuiCallbackContract[C]['request'],
      ) => NuiCallbackContract[C]['response'] | Promise<NuiCallbackContract[C]['response']>,
) {
  mockResponses.set(action as string, handler as MockHandler);
}

/**
 * Utility to define multiple handlers at once.
 */
export function defineHandlers(
  handlers: Partial<{
    [K in keyof NuiCallbackContract]: NuiCallbackContract[K]['request'] extends void
      ? () => NuiCallbackContract[K]['response'] | Promise<NuiCallbackContract[K]['response']>
      : (
          data: NuiCallbackContract[K]['request'],
        ) => NuiCallbackContract[K]['response'] | Promise<NuiCallbackContract[K]['response']>;
  }>,
) {
  for (const [action, handler] of Object.entries(handlers)) {
    registerMock(action as keyof NuiCallbackContract, handler as never);
  }
}

/**
 * Debug tool to simulate Lua events in the browser.
 * Dispatches a synthetic message event that useNuiEvent can listen to.
 */
export const debugEvent = <E extends NuiEvent>(action: E, data: NuiEventPayload[E]) => {
  if (import.meta.env.PROD) return;

  // why: Wrap in a small timeout to ensure event listeners are ready
  setTimeout(() => {
    window.dispatchEvent(new MessageEvent('message', { data: { action, data } }));
  }, 0);
};

/**
 * Simulate network latency for mock responses.
 */
