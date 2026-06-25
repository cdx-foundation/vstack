import { createSignal, Show } from 'solid-js';
import { Badge, Button, Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle, Code, Separator, Toaster, useTheme } from '@cdx-foundation/cdx-solidjs-components';
import { appController } from '@/controllers/app.controller';
import { Background } from './components/Background';
import { useLocales } from './hooks/useLocales';
import { useNuiEvent } from './hooks/useNuiEvent';
import { useResponsive } from './hooks/useResponsive';
import { NuiEvent } from './types';

function App() {
  const { toggleTheme, isDark } = useTheme();
  const { t, isLoading } = useLocales();
  const { state, hideUI } = appController;
  const { isMobile } = useResponsive();
  const [count, setCount] = createSignal(0);
  const [_nuiData, setNuiData] = createSignal<{
    label: string;
    value: number;
  } | null>(null);

  useNuiEvent(NuiEvent.updateData, (data) => {
    setNuiData(data);
  });

  return (
    <Show when={state.visible}>
      <div class="relative h-screen w-full flex items-center justify-center p-6 sm:p-10 font-sans antialiased">
        <Background isLoading={isLoading()} />

        <Show
          when={!isLoading()}
          fallback={
            <div class="relative z-10 animate-pulse flex flex-col items-center gap-4">
              <div class="h-16 w-16 bg-(--primary-20) rounded-card" />
              <div class="h-8 w-48 bg-(--bg-surface-50) rounded-card" />
            </div>
          }
        >
          <Card class="relative z-10 w-full max-w-lg p-2 flex flex-col shadow-2xl animate-in fade-in zoom-in-95 duration-500 overflow-hidden">
            <div class="absolute top-6 right-6 z-20">
              <Button
                variant="ghost"
                class="text-[10px] h-7 font-bold uppercase tracking-widest text-muted hover:text-fg transition-colors"
                onClick={toggleTheme}
              >
                {isDark() ? t('common.light', 'Light') : t('common.dark', 'Dark')}
              </Button>
            </div>

            <CardHeader class="items-center text-center pt-10">
              <Show when={!isMobile()}>
                <div class="flex items-center gap-8 mb-8 animate-in fade-in zoom-in duration-700">
                  <LogoFS />
                  <div class="text-muted text-2xl font-light">+</div>
                  <LogoSolid />
                </div>
              </Show>

              <CardTitle class="text-3xl tracking-tight font-display">
                {t('app.title', 'VStack + Solid')}
              </CardTitle>
              <CardDescription class="max-w-sm leading-relaxed mt-4">
                {t(
                  'app.description',
                  'A premium starting point for your FiveM NUI applications. Built with speed and aesthetics in mind.',
                )}
              </CardDescription>
            </CardHeader>

            <CardContent class="flex flex-col items-center gap-6 w-full px-10 py-6">
              <div class="bg-(--bg-surface-50) border border-stroke rounded-card p-4 w-full flex flex-col gap-4">
                <div class="flex items-center justify-between">
                  <span class="text-xs font-bold uppercase tracking-widest text-muted">
                    {t('ui.test_reactivity', 'Test Reactivity')}
                  </span>
                  <Badge variant="outline" class="font-mono">
                    {count()}
                  </Badge>
                </div>
                <Button
                  variant="primary"
                  class="w-full py-4 text-xs font-bold uppercase tracking-widest btn-glow active:scale-[0.98] transition-all"
                  onClick={() => setCount((c) => c + 1)}
                >
                  {t('ui.increment_counter', 'Increment Counter')}
                </Button>
              </div>

              <Code
                code={t('app.edit_instruction', 'Edit src/App.tsx and save to test HMR')}
                fileName="App.tsx"
                language="typescript"
                showCopy={false}
                class="w-full shadow-inner"
              />

              <FooterBadges t={t} />
            </CardContent>

            <CardFooter class="flex flex-col w-full px-10 pb-10">
              <Separator class="mb-6 opacity-50" />
              <div class="w-full flex justify-between items-center">
                <StatusBadges t={t} />
                <Button
                  variant="ghost"
                  size="sm"
                  class="h-6 text-[10px] font-bold uppercase tracking-widest text-muted hover:text-red-500 transition-colors"
                  onClick={hideUI}
                >
                  {t('ui.close', 'Close')}
                </Button>
              </div>
            </CardFooter>
          </Card>
        </Show>
        <Toaster />
      </div>
    </Show>
  );
}

function LogoFS() {
  return (
    <div class="relative group">
      <div class="absolute -inset-10 bg-[radial-gradient(circle,rgba(185,28,28,0.4)_0%,transparent_70%)] pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
      <div class="h-16 w-16 bg-primary rounded-card flex items-center justify-center shadow-[0_10px_15px_-3px_rgba(185,28,28,0.4)] ring-4 ring-(--primary-10) transition-all hover:scale-110 duration-300 relative z-10">
        <span class="font-bold text-white text-xl tracking-tighter">FS</span>
      </div>
    </div>
  );
}

function LogoSolid() {
  return (
    <div class="relative group">
      <div class="absolute -inset-10 bg-[radial-gradient(circle,rgba(185,28,28,0.4)_0%,transparent_70%)] pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
      <div class="h-16 w-16 bg-primary rounded-full flex items-center justify-center shadow-[0_10px_15px_-3px_rgba(185,28,28,0.4)] ring-4 ring-(--primary-10) transition-all hover:scale-110 duration-300 animate-[spin_10s_linear_infinite] relative z-10">
        <svg
          width="32"
          height="32"
          viewBox="0 0 256 256"
          fill="white"
          role="img"
          aria-label="VStack Logo"
        >
          <title>VStack Logo</title>
          <path d="M128 0C57.31 0 0 57.31 0 128s57.31 128 128 128 128-57.31 128-128S198.69 0 128 0zm0 241c-62.41 0-113-50.59-113-113S65.59 15 128 15s113 50.59 113 113-50.59 113-113 113z" />
          <path d="M190.5 86.5c-5.8-11.6-17.4-18.1-30.2-18.1-13.3 0-25.5 7.1-31.8 18.6L102 135.5c-3.1 5.6-8.9 9.1-15.3 9.1-3.6 0-7.1-1.1-10.1-3.2-5.4-3.8-8.6-10-8.6-16.7 0-9.2 6.1-17.1 14.7-19.1 1.4-.3 2.7-1.1 3.5-2.2 1.4-1.8.4-4.5-1.9-4.8-15.2-1.9-29.8 8.1-33.1 23.3-3.9 17.6 6.1 35.1 22.8 40.5 4.5 1.5 9.2 2.2 13.9 2.2 15.6 0 30.1-9.4 36.3-24.1l26.5-62.9c3.1-7.4 10.4-12.1 18.4-12.1 5.3 0 10.3 2.1 14 5.8 4.2 4.2 6.5 10 6.5 16 0 10.3-7.3 19.3-17.5 21.4-1.4.3-2.6 1.1-3.4 2.2-1.4 1.8-.4 4.5 1.9 4.8 18.2 2.3 35.3-9.5 38.6-27.7 3.9-21.7-12.1-42.3-33.7-45.7z" />
        </svg>
      </div>
    </div>
  );
}

function FooterBadges(props: { t: (key: string, defaultValue?: string) => string }) {
  return (
    <div class="flex gap-2 flex-wrap justify-center">
      <Badge
        as="a"
        class="hover:text-primary cursor-pointer transition-colors"
      >
        <span class="text-red-500 pr-1">❤️</span>
        {props.t('footer.made_with', 'Made with love by the Starling City Development team')}
        <span class="text-red-500 pl-1">❤️</span>
      </Badge>
    </div>
  );
}

function StatusBadges(props: { t: (key: string, defaultValue?: string) => string }) {
  return (
    <div class="flex gap-2">
      <Badge variant="outline" class="text-[10px] font-bold uppercase tracking-widest opacity-70">
        v1.0.0
      </Badge>
      <Badge
        variant="outline"
        class="text-[10px] font-bold uppercase tracking-widest text-emerald-500 border-emerald-500/20 bg-emerald-500/5"
      >
        {props.t('ui.production_ready', 'Production Ready')}
      </Badge>
    </div>
  );
}

export default App;
