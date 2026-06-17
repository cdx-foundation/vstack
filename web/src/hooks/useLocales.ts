// src/hooks/useLocales.ts
import { createMemo, createRoot, createSignal, onMount } from 'solid-js';
import { createNuiQuery } from '@/lib/fetchClient';
import { NuiCallback } from '@/types/callbacks';

// Dynamically discover and load all JSON locales at the root level using Vite glob imports
const modules = import.meta.glob<Record<string, unknown>>('../../../locales/*.json', {
  eager: true,
});

const LOCALES: Record<string, Record<string, unknown>> = {};

for (const path in modules) {
  const fileName = path.split('/').pop()?.replace('.json', '');
  if (fileName) {
    const mod = modules[path] as Record<string, unknown>;
    LOCALES[fileName] = (mod.default as Record<string, unknown>) || mod;
  }
}

function createLocaleCoordinator() {
  const [locale, setLocale] = createSignal<string>('en');
  const [loading, setLoading] = createSignal(true);

  const localesQuery = createNuiQuery(NuiCallback.getLocales, {
    onSuccess: (res) => {
      if (typeof res === 'string') {
        const normalized = res.toLowerCase().split('-')[0];
        if (normalized in LOCALES) {
          setLocale(normalized);
        } else {
          setLocale('en');
        }
      }
      setLoading(false);
    },
    onError: () => {
      setLocale('en');
      setLoading(false);
    },
  });

  onMount(() => {
    localesQuery.execute().catch(() => {
      setLocale('en');
      setLoading(false);
    });
  });

  const translations = createMemo<Record<string, unknown>>(() => {
    return LOCALES[locale()] || LOCALES.en || {};
  });

  const t = (key: string, defaultValue?: string): string => {
    const keys = key.split('.');
    let value: unknown = translations();
    for (const k of keys) {
      if (value && typeof value === 'object' && k in value) {
        value = (value as Record<string, unknown>)[k];
      } else {
        value = undefined;
        break;
      }
    }
    if (typeof value === 'string') {
      return value;
    }
    return defaultValue ?? key;
  };

  return {
    locale,
    setLocale,
    isLoading: loading,
    t,
  };
}

const localeCoordinator = createRoot(createLocaleCoordinator);

export function useLocales() {
  return localeCoordinator;
}
