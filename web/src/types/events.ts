export const NuiEvent = {
  setVisible: 'setVisible',
  updateData: 'updateData',
  updateTheme: 'updateTheme',
} as const;

export type NuiEvent = (typeof NuiEvent)[keyof typeof NuiEvent];

export interface NuiEventPayload {
  [NuiEvent.setVisible]: boolean;
  [NuiEvent.updateData]: {
    id: number;
    label: string;
    value: number;
  };
  /** Accepts both flat Partial<Theme> and DualThemeConfig { light, dark } shapes.
   *  Passed directly to useTheme().setTheme(). */
  [NuiEvent.updateTheme]: Record<string, unknown>;
}
