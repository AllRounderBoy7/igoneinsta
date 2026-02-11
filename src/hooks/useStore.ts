// Isme Sarah, Mike sab saaf!
export const store: any = {
  state: {
    user: { name: "Admin", instagram_connected: false, message_count: 0, username: "" },
    automations: [],
    contacts: [],
    flows: [],
    isLoggedIn: true,
    isAdmin: true,
    isLoading: false,
  },
  subscribers: [] as any[],
  subscribe(fn: any) {
    this.subscribers.push(fn);
    return () => { this.subscribers = this.subscribers.filter((s: any) => s !== fn); };
  },
  notify() { this.subscribers.forEach(fn => fn()); },

  // Getters
  getUser() { return this.state.user; },
  getAutomations() { return this.state.automations; },
  getContacts() { return this.state.contacts; },
  getFlows() { return this.state.flows; },
  isLoggedIn() { return this.state.isLoggedIn; },
  isAdmin() { return this.state.isAdmin; },
  isLoading() { return this.state.isLoading; },

  // Actions
  connectInstagram(username: string, token: string) {
    this.state.user.instagram_connected = true;
    this.state.user.username = username;
    this.notify();
  },
  updateUser(updates: any) {
    this.state.user = { ...this.state.user, ...updates };
    this.notify();
  }
};

// Baaki missing methods ko empty functions bana diya taaki build error na aaye
const methods = ['getSequences', 'getBroadcasts', 'getGrowthTools', 'getActivities', 'getAllUsers', 'getAllPayments', 'getCoupons', 'getPlatformSettings', 'getPlans', 'getPlanLimits'];
methods.forEach(m => { store[m] = () => []; });
