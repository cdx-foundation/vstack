import type { NuiCallbackContract, NuiEvent, NuiEventPayload } from '@/types';

type MockHandler = (data: never) => unknown;

export const mockResponses = new Map<string, MockHandler>();

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

export const debugEvent = <E extends NuiEvent>(action: E, data: NuiEventPayload[E]) => {
  if (import.meta.env.PROD) return;
  setTimeout(() => {
    window.dispatchEvent(new MessageEvent('message', { data: { action, data } }));
  }, 0);
};