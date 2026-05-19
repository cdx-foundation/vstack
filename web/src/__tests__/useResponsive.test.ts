// /Users/yanis/Programming/vstack-template/web/src/__tests__/useResponsive.test.ts

import { createRoot } from 'solid-js';
import { beforeEach, describe, expect, it } from 'vitest';
import { BREAKPOINTS, useResponsive } from '../hooks/useResponsive';

describe('useResponsive', () => {
  const setWidth = (width: number) => {
    Object.defineProperty(window, 'innerWidth', {
      writable: true,
      configurable: true,
      value: width,
    });
    window.dispatchEvent(new Event('resize'));
  };

  beforeEach(() => {
    // Initial width
    setWidth(1024);
  });

  it('should detect mobile width', () => {
    setWidth(500);

    createRoot(() => {
      const { isMobile, isDesktop } = useResponsive();
      expect(isMobile()).toBe(true);
      expect(isDesktop()).toBe(false);
    });
  });

  it('should detect desktop width', () => {
    setWidth(BREAKPOINTS.lg + 100);

    createRoot(() => {
      const { isMobile, isDesktop } = useResponsive();
      expect(isMobile()).toBe(false);
      expect(isDesktop()).toBe(true);
    });
  });

  it('should update reactively when window is resized', () => {
    createRoot((dispose) => {
      const { isMobile, isDesktop } = useResponsive();

      setWidth(BREAKPOINTS.lg + 100); // Desktop
      expect(isDesktop()).toBe(true);

      setWidth(500); // Resize to mobile
      expect(isMobile()).toBe(true);
      expect(isDesktop()).toBe(false);

      dispose();
    });
  });

  it('should return correct responsive values', () => {
    createRoot((dispose) => {
      const { responsiveValue } = useResponsive();

      setWidth(500); // Mobile
      expect(responsiveValue({ base: 'm', lg: 'd' })).toBe('m');

      setWidth(BREAKPOINTS.lg + 100); // Desktop
      expect(responsiveValue({ base: 'm', lg: 'd' })).toBe('d');

      dispose();
    });
  });
});
