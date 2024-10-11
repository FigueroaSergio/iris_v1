import { useCallback, useEffect, useState } from "react";
type stateAsyncType<T> = {
  loading: boolean;
  error: string | null;
  data: T | null;
};
type useAsyncType<T> = stateAsyncType<T> & {
  load: () => Promise<void>;
};

export const useAsync = <T>(
  cb: () => Promise<T>,
  autoLoad = false
): useAsyncType<T> => {
  const [state, setState] = useState<stateAsyncType<T>>({
    loading: true,
    error: null,
    data: null,
  });

  const load = useCallback(async () => {
    try {
      setState({ loading: true, error: null, data: null });
      const data = await cb();
      setState({ loading: false, error: null, data });
    } catch (e) {
      const error = e as Error;
      console.error(error);

      setState({ loading: false, error: error.message, data: null });
    }
  }, [cb]);

  useEffect(() => {
    if (!autoLoad) return;
    load();
  }, []);

  return { load, loading: state.loading, error: state.error, data: state.data };
};
