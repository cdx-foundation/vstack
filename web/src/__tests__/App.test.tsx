import { render, screen } from '@solidjs/testing-library';
import { describe, expect, it, vi } from 'vitest';
import { appController } from '@/controllers/app.controller';
import App from '../App';

// Mock matchMedia for JSDOM
Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: vi.fn().mockImplementation((query) => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: vi.fn(), // Deprecated
    removeListener: vi.fn(), // Deprecated
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
    dispatchEvent: vi.fn(),
  })),
});

// Mock dependencies
vi.mock('../hooks/useLocales', () => ({
  useLocales: () => ({
    t: (_key: string, def: string) => def,
    isLoading: () => false,
  }),
}));

vi.mock('../hooks/useResponsive', () => ({
  useResponsive: () => ({
    isMobile: () => false,
    width: () => 1920,
  }),
}));

describe('App Component', () => {
  it('should not render when not visible', () => {
    // Set controller state
    appController.setState('visible', false);

    const { container } = render(() => <App />);
    expect(container.innerHTML).toBe('');
  });

  it('should render main title when visible', () => {
    // Set controller state
    appController.setState('visible', true);

    render(() => <App />);

    // We mocked 't' to return the default value
    expect(screen.getByText('VStack + Solid')).toBeDefined();
  });

  it('should increment counter when button is clicked', async () => {
    appController.setState('visible', true);

    render(() => <App />);

    const button = screen.getByText('Increment Counter');
    const _badge = screen.getByText('0');

    button.click();

    expect(screen.getByText('1')).toBeDefined();
  });
});
