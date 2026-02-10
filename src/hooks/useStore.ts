import { useState, useEffect, useCallback } from 'react';
import { store } from '../lib/store'; // Check kar ye path sahi hai na?

export function useStore() {
  const [, setTick] = useState(0);
  
  useEffect(() => {
    // Store subscribe logic
    if (store && (store as any).subscribe) {
      const unsub = (store as any).subscribe(() => setTick(t => t + 1));
      return () => { if (unsub) unsub(); };
    }
  }, []);
  
  const forceUpdate = useCallback(() => setTick(t => t + 1), []);
  
  return { 
    // Data
    user: (store as any).getUser?.() || null,
    automations: (store as any).getAutomations?.() || [],
    contacts: (store as any).getContacts?.() || [],
    flows: (store as any).getFlows?.() || [],
    
    // Auth & Actions
    isLoggedIn: (store as any).isLoggedIn?.() || false,
    connectInstagram: (username: string, token: string) => (store as any).connectInstagram?.(username, token),
    updateUser: (updates: any) => (store as any).updateUser?.(updates),
    
    // Core helpers
    store, 
    forceUpdate 
  };
}

export default useStore;
