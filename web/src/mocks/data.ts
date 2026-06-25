import type { ThemeFont } from '@cdx-foundation/cdx-solidjs-components';

export const mockAppInfo = {
  version: '1.0.0',
  author: 'CDX Foundation',
  environment: 'development',
};

type ThemeColorFields = {
  accent: string;
  bg: string;
  panel: string;
  surface: string;
  border: string;
  fg: string;
  muted: string;
  radius: string;
  font: ThemeFont;
  headerFont: ThemeFont;
  shadow: string;
  btnShadow: string;
};

/**
 * Mock theme matching the DualThemeConfig format the server sends.
 * The NUI's useTheme().setTheme() accepts { light, dark } natively.
 */
export const mockTheme: {
  light: ThemeColorFields;
  dark: ThemeColorFields;
} = {
  light: {
    accent: '#c62828',
    bg: '#f4f2ed',
    panel: '#ffffff',
    surface: '#f0ede8',
    border: '#e6e3dc',
    fg: '#1a1a18',
    muted: '#8c8984',
    radius: '12px',
    font: 'sans',
    headerFont: 'sans',
    shadow: 'md',
    btnShadow: 'md',
  },
  dark: {
    accent: '#c62828',
    bg: '#121214',
    panel: '#1c1c22',
    surface: '#24242a',
    border: '#323238',
    fg: '#efefed',
    muted: '#6b6b70',
    radius: '12px',
    font: 'sans',
    headerFont: 'sans',
    shadow: 'md',
    btnShadow: 'md',
  },
};
