export const NuiEvent = {
  setVisible: 'setVisible',
  updateData: 'updateData',
} as const;

export type NuiEvent = (typeof NuiEvent)[keyof typeof NuiEvent];

export interface NuiEventPayload {
  [NuiEvent.setVisible]: boolean;
  [NuiEvent.updateData]: {
    id: number;
    label: string;
    value: number;
  };
}
