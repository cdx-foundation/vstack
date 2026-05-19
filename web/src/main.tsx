// /Users/yanis/Programming/vstack-template/web/src/main.tsx
import { ErrorBoundary } from 'solid-js';
import { render } from 'solid-js/web';
import './index.css';

/**
 * Application Bootstrap
 * Ensures all essential services (mocks, locales, etc.) are initialized
 * before the reactive tree is mounted.
 *
 * Separates development mocks from production logic to optimize bundle size
 * and ensure clean separation of concerns.
 */
async function bootstrap() {
  try {
    // 1. Initialize mocks only in development environment
    if (import.meta.env.DEV) {
      // Load mock styles (e.g. game background mockup)
      await import('./mocks/mockup.css');

      // Initialize NUI event/callback intercepts
      const { initMocks } = await import('./mocks');
      initMocks();

      // Pre-warm mock assets
      const bg = new Image();
      bg.src = '/mock-bg.png';
    }

    // 2. Dynamically import App and Providers to ensure they load AFTER mocks
    // This prevents race conditions with NUI callbacks during initialization.
    const [{ default: App }, { Providers }] = await Promise.all([
      import('./App'),
      import('./components/providers'),
    ]);

    const root = document.getElementById('root');

    if (root) {
      render(
        () => (
          <ErrorBoundary
            fallback={(err) => {
              console.error('[Bootstrap:ErrorBoundary]', err);
              return (
                <div class="h-screen w-screen flex flex-col items-center justify-center bg-black text-white p-10">
                  <h1 class="text-2xl font-bold mb-4 text-red-500">NUI Crash Detected</h1>
                  <pre class="bg-zinc-900 p-4 rounded border border-white/10 max-w-full overflow-auto text-xs">
                    {err instanceof Error ? err.message : String(err)}
                  </pre>
                </div>
              );
            }}
          >
            <Providers>
              <App />
            </Providers>
          </ErrorBoundary>
        ),
        root,
      );
      console.log('[Bootstrap] Render complete.');
      const win = window as unknown as { __PEFCL_MOCKS_READY__?: () => void };
      if (win.__PEFCL_MOCKS_READY__) {
        win.__PEFCL_MOCKS_READY__();
      }
    } else {
      console.error('[Bootstrap] #root element not found!');
    }
  } catch (err) {
    console.error('[Bootstrap:CRITICAL]', err);
    const check = document.getElementById('mount-check');
    if (check) {
      check.style.background = 'black';
      check.innerText = `BOOTSTRAP FAILED: ${err instanceof Error ? err.message : String(err)}`;
    }
  }
}

bootstrap();
