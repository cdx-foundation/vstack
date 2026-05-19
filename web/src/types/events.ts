/**
 * NUI Event (Lua -> JS)
 * It contains all the events that are sent from the client/server to the NUI (JS).
 */

export const NuiEvent = {
  setVisible: 'setVisible',
  updateData: 'updateData',
} as const;

export type NuiEvent = (typeof NuiEvent)[keyof typeof NuiEvent];

// Define payloads for each event
export interface NuiEventPayload {
  [NuiEvent.setVisible]: boolean;
  [NuiEvent.updateData]: {
    id: number;
    label: string;
    value: number;
  };
}
