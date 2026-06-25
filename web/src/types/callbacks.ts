export const NuiCallback = {
  hideUI: 'hideUI',
  getItemData: 'getItemData',
  getLocales: 'getLocales',
} as const;

export type NuiCallback = (typeof NuiCallback)[keyof typeof NuiCallback];

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
