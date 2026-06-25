import { createSignal } from 'solid-js';
import type { NuiCallbackContract } from '@/types/index';
import { fetchNui } from './nui';

export interface FetchOptions<TResponse> {
  onSuccess?: (data: TResponse) => void;
  onError?: (error: unknown) => void;
}

export function createNuiQuery<C extends keyof NuiCallbackContract>(
  action: C,
  options?: FetchOptions<NuiCallbackContract[C]['response']>,
) {
  const [loading, setLoading] = createSignal(false);
  const [error, setError] = createSignal<unknown>(null);
  const [data, setData] = createSignal<NuiCallbackContract[C]['response'] | null>(null);

  const execute = async (
    payload?: NuiCallbackContract[C]['request'],
  ): Promise<NuiCallbackContract[C]['response'] | null> => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetchNui(action, payload);
      setData(res);
      options?.onSuccess?.(res);
      return res;
    } catch (err) {
      setError(err);
      options?.onError?.(err);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return {
    loading,
    error,
    data,
    execute,
  };
}
