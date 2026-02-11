export const store: any = {
  state: {
    user: { name: "Admin", instagram_connected: false, message_count: 0, username: "" },
    automations: [],
    contacts: [],
    flows: [],
    sequences: [],
    broadcasts: [],
    growthTools: [],
    activities: [],
    allUsers: [],
    allPayments: [],
    coupons: [],
    platformSettings: {},
    plans: [],
    planLimits: {},
    isLoggedIn: true,
    isAdmin: true,
    isLoading: false,
  },
  
  subscribers: [] as any[],
  
  subscribe(fn: any) {
    this.subscribers.push(fn);
    return () => { this.subscribers = this.subscribers.filter((s: any) => s !== fn); };
  },
  
  notify() {
    this.subscribers.forEach((fn: any) => { if(typeof fn === 'function') fn(); });
  },

  // Auth & Getters
  isLoggedIn() { return this.state.isLoggedIn; },
  isAdmin() { return this.state.isAdmin; },
  isLoading() { return this.state.isLoading; },
  getUser() { return this.state.user; },
  getAutomations() { return this.state.automations; },
  getContacts() { return this.state.contacts; },
  getFlows() { return this.state.flows; },
  getSequences() { return []; },
  getBroadcasts() { return []; },
  getGrowthTools() { return []; },
  getActivities() { return []; },
  getAllUsers() { return []; },
  getAllPayments() { return []; },
  getCoupons() { return []; },
  getPlatformSettings() { return {}; },
  getPlans() { return []; },
  getPlanLimits() { return {}; },
  getUserStats() { return {}; },
  getPaymentStats() { return {}; },

  // Actions
  connectInstagram(username: string, token: string) {
    this.state.user.instagram_connected = true;
    this.state.user.username = username;
    this.notify();
  },
  
  updateUser(updates: any) {
    this.state.user = { ...this.state.user, ...updates };
    this.notify();
  },

  // Empty placeholders to satisfy build
  setAdmin() {}, loginWithGoogle() {}, logout() {}, demoLogin() {},
  createAutomation() {}, updateAutomation() {}, deleteAutomation() {}, toggleAutomation() {},
  createContact() {}, updateContact() {}, deleteContact() {},
  createFlow() {}, updateFlow() {}, deleteFlow() {},
  submitPayment() {}, approvePayment() {}, rejectPayment() {},
  applyCoupon() {}, createCoupon() {}, updateCoupon() {}, deleteCoupon() {},
  loadAdminData() {}, adminUpdateUser() {}, adminDeleteUser() {},
  updatePlatformSettings() {}, updatePlanPricing() {}
};
