import type { JSX } from 'solid-js';
import { NuiProvider } from './NuiProvider';

export const Providers = (props: { children: JSX.Element }) => {
  return <NuiProvider>{props.children}</NuiProvider>;
};
