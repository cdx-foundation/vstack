import { ErrorBoundary } from 'solid-js';
import { render } from 'solid-js/web';
import './index.css';

async function bootstrap() {
  try {
    if (import.meta.env.DEV) {
      await import('./mocks/mockup.css');

      const { initMocks } = await import('./mocks');
      initMocks();

      const bg = new Image();
      bg.src = '/mock-bg.png';
    }

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

      // NuiProvider is now mounted with useNuiEvent subscribers registered.
      // Hydrate mocks — safe to dispatch events now.
      if (import.meta.env.DEV) {
        const { hydrate } = await import('./mocks');
        hydrate();
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
