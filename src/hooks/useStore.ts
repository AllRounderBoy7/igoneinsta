import { useState, useEffect, useCallback } from 'react';
import { store } from '../lib/store'; 

export function useStore() {
  const [, setTick] = useState(0);
  const forceUpdate = useCallback(() => setTick(t => t + 1), []);

  useEffect(() => {
    if (store && (store as any).subscribe) {
      const unsub = (store as any).subscribe(() => setTick(t => t + 1));
      return () => { if (typeof unsub === 'function') unsub(); };
    }
  }, []);

  return {
    store,
    forceUpdate,
    user: store.getUser?.() || null,
    automations: store.getAutomations?.() || [],
    contacts: store.getContacts?.() || [],
    flows: store.getFlows?.() || [],
    connectInstagram: (username: string, token: string) => store.connectInstagram?.(username, token),
  };
}
