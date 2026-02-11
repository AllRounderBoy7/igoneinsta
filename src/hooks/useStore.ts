import { useState, useEffect, useCallback } from 'react';
import { store } from '../lib/store'; // Path check kar lena, store.ts lib mein honi chahiye

export function useStore() {
  // Force update logic jo tune manga tha
  const [, setTick] = useState(0);
  const forceUpdate = useCallback(() => setTick(t => t + 1), []);

  useEffect(() => {
    // Store subscribe logic
    if (store && (store as any).subscribe) {
      const unsub = (store as any).subscribe(() => setTick(t => t + 1));
      return () => { 
        if (typeof unsub === 'function') unsub(); 
      };
    }
  }, []);

  return {
    // 1. Direct Store Access
    store,
    forceUpdate,

    // 2. Auth & User Data
    user: store.getUser?.() || null,
    isLoggedIn: store.isLoggedIn?.() || false,
    isAdmin: store.isAdmin?.() || false,
    isLoading: store.isLoading?.() || false,

    // 3. Main Data (Sarah/Mike wala kachra ab nahi aayega agar store empty hai)
    automations: store.getAutomations?.() || [],
    contacts: store.getContacts?.() || [],
    flows: store.getFlows?.() || [],
    sequences: store.getSequences?.() || [],
    broadcasts: store.getBroadcasts?.() || [],
    growthTools: store.getGrowthTools?.() || [],

    // 4. Important Methods
    connectInstagram: useCallback((username: string, token: string) => 
      store.connectInstagram?.(username, token), []),
      
    updateUser: useCallback((updates: any) => 
      store.updateUser?.(updates), []),

    logout: useCallback(() => 
      store.logout?.(), []),

    // 5. Admin & Payments (Placeholders)
    allUsers: store.getAllUsers?.() || [],
    allPayments: store.getAllPayments?.() || [],
    platformSettings: store.getPlatformSettings?.() || {}
  };
}

export default useStore;
