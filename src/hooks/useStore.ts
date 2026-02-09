import { useState, useEffect, useCallback } from 'react';
import { store, storeEvents } from '../lib/store';

// Hook to subscribe to store updates
export function useStore() {
  const [, forceUpdate] = useState({});

  useEffect(() => {
    const refresh = () => forceUpdate({});
    
    // Subscribe to all store events
    const unsub = storeEvents.on('*', refresh);
    
    return () => {
      unsub();
    };
  }, []);

  return {
    // Auth
    isLoggedIn: store.isLoggedIn(),
    isAdmin: store.isAdmin(),
    isLoading: store.isLoading(),
    user: store.getUser(),
    
    // Data
    automations: store.getAutomations(),
    contacts: store.getContacts(),
    flows: store.getFlows(),
    sequences: store.getSequences(),
    broadcasts: store.getBroadcasts(),
    growthTools: store.getGrowthTools(),
    activities: store.getActivities(),
    
    // Admin
    allUsers: store.getAllUsers(),
    allPayments: store.getAllPayments(),
    coupons: store.getCoupons(),
    platformSettings: store.getPlatformSettings(),
    plans: store.getPlans(),
    planLimits: store.getPlanLimits(),
    
    // Methods
    loginWithGoogle: useCallback(() => store.loginWithGoogle(), []),
    demoLogin: useCallback((email: string, name: string) => store.demoLogin(email, name), []),
    logout: useCallback(() => store.logout(), []),
    setAdmin: useCallback((isAdmin: boolean) => store.setAdmin(isAdmin), []),
    
    // User methods
    updateUser: useCallback((updates: Parameters<typeof store.updateUser>[0]) => store.updateUser(updates), []),
    connectInstagram: useCallback((username: string, token: string) => store.connectInstagram(username, token), []),
    disconnectInstagram: useCallback(() => store.disconnectInstagram(), []),
    
    // Automation methods
    createAutomation: useCallback((automation: Parameters<typeof store.createAutomation>[0]) => store.createAutomation(automation), []),
    updateAutomation: useCallback((id: string, updates: Parameters<typeof store.updateAutomation>[1]) => store.updateAutomation(id, updates), []),
    deleteAutomation: useCallback((id: string) => store.deleteAutomation(id), []),
    toggleAutomation: useCallback((id: string) => store.toggleAutomation(id), []),
    
    // Contact methods
    createContact: useCallback((contact: Parameters<typeof store.createContact>[0]) => store.createContact(contact), []),
    updateContact: useCallback((id: string, updates: Parameters<typeof store.updateContact>[1]) => store.updateContact(id, updates), []),
    deleteContact: useCallback((id: string) => store.deleteContact(id), []),
    
    // Flow methods
    createFlow: useCallback((flow: Parameters<typeof store.createFlow>[0]) => store.createFlow(flow), []),
    updateFlow: useCallback((id: string, updates: Parameters<typeof store.updateFlow>[1]) => store.updateFlow(id, updates), []),
    deleteFlow: useCallback((id: string) => store.deleteFlow(id), []),
    
    // Sequence methods
    createSequence: useCallback((sequence: Parameters<typeof store.createSequence>[0]) => store.createSequence(sequence), []),
    updateSequence: useCallback((id: string, updates: Parameters<typeof store.updateSequence>[1]) => store.updateSequence(id, updates), []),
    deleteSequence: useCallback((id: string) => store.deleteSequence(id), []),
    
    // Broadcast methods
    createBroadcast: useCallback((broadcast: Parameters<typeof store.createBroadcast>[0]) => store.createBroadcast(broadcast), []),
    updateBroadcast: useCallback((id: string, updates: Parameters<typeof store.updateBroadcast>[1]) => store.updateBroadcast(id, updates), []),
    deleteBroadcast: useCallback((id: string) => store.deleteBroadcast(id), []),
    
    // Growth Tool methods
    createGrowthTool: useCallback((tool: Parameters<typeof store.createGrowthTool>[0]) => store.createGrowthTool(tool), []),
    updateGrowthTool: useCallback((id: string, updates: Parameters<typeof store.updateGrowthTool>[1]) => store.updateGrowthTool(id, updates), []),
    deleteGrowthTool: useCallback((id: string) => store.deleteGrowthTool(id), []),
    
    // Payment methods
    submitPayment: useCallback((plan: string, interval: 'monthly' | 'yearly', amount: number, utr: string) => store.submitPayment(plan, interval, amount, utr), []),
    approvePayment: useCallback((id: string) => store.approvePayment(id), []),
    rejectPayment: useCallback((id: string) => store.rejectPayment(id), []),
    
    // Coupon methods
    applyCoupon: useCallback((code: string) => store.applyCoupon(code), []),
    createCoupon: useCallback((coupon: Parameters<typeof store.createCoupon>[0]) => store.createCoupon(coupon), []),
    updateCoupon: useCallback((id: string, updates: Parameters<typeof store.updateCoupon>[1]) => store.updateCoupon(id, updates), []),
    deleteCoupon: useCallback((id: string) => store.deleteCoupon(id), []),
    
    // Admin methods
    loadAdminData: useCallback(() => store.loadAdminData(), []),
    adminUpdateUser: useCallback((userId: string, updates: Parameters<typeof store.adminUpdateUser>[1]) => store.adminUpdateUser(userId, updates), []),
    adminDeleteUser: useCallback((userId: string) => store.adminDeleteUser(userId), []),
    updatePlatformSettings: useCallback((updates: Parameters<typeof store.updatePlatformSettings>[0]) => store.updatePlatformSettings(updates), []),
    updatePlanPricing: useCallback((planName: string, updates: Parameters<typeof store.updatePlanPricing>[1]) => store.updatePlanPricing(planName, updates), []),
    
    // Stats
    getUserStats: useCallback(() => store.getUserStats(), []),
    getPaymentStats: useCallback(() => store.getPaymentStats(), [])
  };
}

export default useStore;
