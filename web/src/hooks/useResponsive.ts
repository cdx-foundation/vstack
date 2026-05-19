// src/hooks/useResponsive.ts
import { createMemo, createRoot, createSignal } from 'solid-js';

/**
 * Breakpoints matching Tailwind's default configuration
 */
export const BREAKPOINTS = {
  sm: 640,
  md: 768,
  lg: 1024,
  xl: 1280,
  '2xl': 1536,
} as const;

export type Breakpoint = keyof typeof BREAKPOINTS;

function createResponsiveCoordinator() {
  const [width, setWidth] = createSignal(window.innerWidth);

  if (typeof window !== 'undefined') {
    const handleResize = () => {
      setWidth(window.innerWidth);
    };
    window.addEventListener('resize', handleResize);
  }

  const isSm = createMemo(() => width() >= BREAKPOINTS.sm);
  const isMd = createMemo(() => width() >= BREAKPOINTS.md);
  const isLg = createMemo(() => width() >= BREAKPOINTS.lg);
  const isXl = createMemo(() => width() >= BREAKPOINTS.xl);
  const is2xl = createMemo(() => width() >= BREAKPOINTS['2xl']);

  const isMobile = createMemo(() => width() < BREAKPOINTS.md);
  const isTablet = createMemo(() => width() >= BREAKPOINTS.md && width() < BREAKPOINTS.lg);
  const isDesktop = createMemo(() => width() >= BREAKPOINTS.lg);

  function responsiveValue<T>(values: { base: T; sm?: T; md?: T; lg?: T; xl?: T; '2xl'?: T }): T {
    if (is2xl() && values['2xl'] !== undefined) return values['2xl'];
    if (isXl() && values.xl !== undefined) return values.xl;
    if (isLg() && values.lg !== undefined) return values.lg;
    if (isMd() && values.md !== undefined) return values.md;
    if (isSm() && values.sm !== undefined) return values.sm;
    return values.base;
  }

  return {
    width,
    isSm,
    isMd,
    isLg,
    isXl,
    is2xl,
    isMobile,
    isTablet,
    isDesktop,
    responsiveValue,
  };
}

export const responsiveCoordinator = createRoot(createResponsiveCoordinator);

/**
 * useResponsive Hook
 *
 * A high-performance responsive hook for SolidJS.
 * Consumes the centralized responsiveCoordinator, sharing a single
 * window resize event listener to prevent duplicate DOM event bindings.
 */
export function useResponsive() {
  return responsiveCoordinator;
}
