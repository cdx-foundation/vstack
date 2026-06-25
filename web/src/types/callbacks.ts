export const NuiCallback = {
  hideUI: 'hideUI',
  getLocales: 'getLocales',
  getTheme: 'getTheme',
} as const;

export type NuiCallback = (typeof NuiCallback)[keyof typeof NuiCallback];

export interface NuiCallbackContract {
  [NuiCallback.hideUI]: {
    request: undefined;
    response: 'ok';
  };
  [NuiCallback.getLocales]: {
    request: undefined;
    response: string | Record<string, string>;
  };
  [NuiCallback.getTheme]: {
    request: undefined;
    /**
     * DualThemeConfig { light: {...}, dark: {...} } or flat Partial<Theme>.
     * Passed directly to useTheme().setTheme().
     */
    response: Record<string, unknown>;
  };
}
