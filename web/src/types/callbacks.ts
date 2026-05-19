/**
 * NUI Callbacks (JS -> Lua)
 * Define callbacks here that are triggered from the frontend using fetchNui.
 */
export const NuiCallback = {
  hideUI: 'hideUI',
  getItemData: 'getItemData',
  getLocales: 'getLocales',
} as const;

export type NuiCallback = (typeof NuiCallback)[keyof typeof NuiCallback];

/**
 * Mapping of NUI callbacks to their request/response contracts.
 */
export interface NuiCallbackContract {
  [NuiCallback.hideUI]: {
    request: undefined;
    response: 'ok';
  };
  [NuiCallback.getItemData]: {
    request: { id: number };
    response: { label: string; value: number } | null;
  };
  [NuiCallback.getLocales]: {
    request: undefined;
    response: string | Record<string, string>;
  };
}
