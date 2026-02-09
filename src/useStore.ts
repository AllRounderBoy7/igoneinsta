import { useState, useEffect, useCallback } from 'react';
import { store } from './store';

export function useStore() {
  const [, setTick] = useState(0);
  
  useEffect(() => {
    const unsub = store.subscribe(() => setTick(t => t + 1));
    return () => { unsub(); };
  }, []);
  
  const forceUpdate = useCallback(() => setTick(t => t + 1), []);
  
  return { store, forceUpdate };
}
