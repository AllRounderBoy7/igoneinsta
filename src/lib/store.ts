import { db, auth, DbUser, DbAutomation, DbContact, DbFlow, DbSequence, DbBroadcast, DbGrowthTool, DbPayment, DbCoupon, DbPlatformSettings, DbActivity } from './supabase';

// Event system for real-time updates
type EventCallback = () => void;
class EventEmitter {
  private listeners: Map<string, Set<EventCallback>> = new Map();
  
  on(event: string, callback: EventCallback) {
    if (!this.listeners.has(event)) {
      this.listeners.set(event, new Set());
    }
    this.listeners.get(event)!.add(callback);
    return () => this.off(event, callback);
  }
  
  off(event: string, callback: EventCallback) {
    this.listeners.get(event)?.delete(callback);
  }
  
  emit(event: string) {
    this.listeners.get(event)?.forEach(cb => cb());
    this.listeners.get('*')?.forEach(cb => cb());
  }
}

export const storeEvents = new EventEmitter();

// Plan configuration
export interface PlanConfig {
  price: number;
  yearlyPrice: number;
  messages: number;
  automations: number;
  contacts: number;
}

export interface Plans {
  free: PlanConfig;
  pro: PlanConfig;
  master: PlanConfig;
  legend: PlanConfig;
}

// Store state
interface StoreState {
  // Auth
  isLoggedIn: boolean;
  isAdmin: boolean;
  user: DbUser | null;
  loading: boolean;
  
  // Data
  automations: DbAutomation[];
  contacts: DbContact[];
  flows: DbFlow[];
  sequences: DbSequence[];
  broadcasts: DbBroadcast[];
  growthTools: DbGrowthTool[];
  activities: DbActivity[];
  
  // Admin
  allUsers: DbUser[];
  allPayments: DbPayment[];
  coupons: DbCoupon[];
  platformSettings: DbPlatformSettings | null;
}

// Default state
const defaultState: StoreState = {
  isLoggedIn: false,
  isAdmin: false,
  user: null,
  loading: true,
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
  platformSettings: null
};

// Store class
class Store {
  private state: StoreState = { ...defaultState };
  private initialized = false;
  
  // Initialize store and set up real-time subscriptions
  async initialize() {
    if (this.initialized) return;
    this.initialized = true;
    
    try {
      // Check existing session
      const session = await auth.getSession();
      if (session?.user) {
        await this.handleUserLogin(session.user.email!, session.user.user_metadata?.full_name || session.user.email!, session.user.user_metadata?.avatar_url || '');
      }
      
      // Load platform settings
      await this.loadPlatformSettings();
      
      // Set up auth state listener
      auth.onAuthStateChange(async (event, session) => {
        if (event === 'SIGNED_IN' && session?.user) {
          await this.handleUserLogin(session.user.email!, session.user.user_metadata?.full_name || session.user.email!, session.user.user_metadata?.avatar_url || '');
        } else if (event === 'SIGNED_OUT') {
          this.logout();
        }
      });
      
      // Set up real-time subscriptions
      this.setupRealtimeSubscriptions();
      
    } catch (error) {
      console.error('Store initialization error:', error);
    } finally {
      this.state.loading = false;
      storeEvents.emit('auth');
    }
  }
  
  private setupRealtimeSubscriptions() {
    // Subscribe to user changes
    db.subscribe.toUsers(() => {
      if (this.state.isAdmin) {
        this.loadAllUsers();
      }
      if (this.state.user) {
        this.loadUserData();
      }
    });
    
    // Subscribe to payment changes
    db.subscribe.toPayments(() => {
      if (this.state.isAdmin) {
        this.loadAllPayments();
      }
    });
    
    // Subscribe to coupon changes
    db.subscribe.toCoupons(() => {
      this.loadCoupons();
    });
    
    // Subscribe to platform settings changes
    db.subscribe.toSettings(() => {
      this.loadPlatformSettings();
    });
  }
  
  // Auth methods
  async loginWithGoogle() {
    try {
      await auth.signInWithGoogle();
    } catch (error) {
      console.error('Google login error:', error);
      throw error;
    }
  }
  
  private async handleUserLogin(email: string, name: string, avatar: string) {
    try {
      // Check if user exists
      let user = await db.users.getByEmail(email);
      
      if (!user) {
        // Create new user
        const authUser = await auth.getUser();
        user = await db.users.create({
          id: authUser?.id,
          email,
          name,
          avatar,
          plan: 'free',
          plan_interval: 'monthly',
          message_count: 0,
          contact_count: 0,
          automation_count: 0,
          instagram_connected: false,
          is_suspended: false
        });
      }
      
      this.state.user = user;
      this.state.isLoggedIn = true;
      
      // Load user's data
      await this.loadUserData();
      
      storeEvents.emit('auth');
    } catch (error) {
      console.error('Handle login error:', error);
      throw error;
    }
  }
  
  // For demo/development - login without Google OAuth
  async demoLogin(email: string, name: string) {
    const avatar = `https://api.dicebear.com/7.x/avataaars/svg?seed=${email}`;
    
    // Check if user exists in Supabase
    try {
      let user = await db.users.getByEmail(email);
      
      if (!user) {
        // Create new user
        user = await db.users.create({
          email,
          name,
          avatar,
          plan: 'free',
          plan_interval: 'monthly',
          message_count: 0,
          contact_count: 0,
          automation_count: 0,
          instagram_connected: false,
          is_suspended: false
        });
      }
      
      this.state.user = user;
      this.state.isLoggedIn = true;
      
      await this.loadUserData();
      storeEvents.emit('auth');
    } catch (error) {
      // Fallback to local storage if Supabase fails
      console.warn('Supabase unavailable, using local storage:', error);
      this.state.user = {
        id: crypto.randomUUID(),
        email,
        name,
        avatar,
        plan: 'free',
        plan_interval: 'monthly',
        plan_expires_at: null,
        message_count: 0,
        contact_count: 0,
        automation_count: 0,
        instagram_connected: false,
        instagram_username: null,
        instagram_token: null,
        is_suspended: false,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      };
      this.state.isLoggedIn = true;
      storeEvents.emit('auth');
    }
  }
  
  logout() {
    this.state = { ...defaultState, loading: false, platformSettings: this.state.platformSettings };
    auth.signOut().catch(console.error);
    storeEvents.emit('auth');
  }
  
  // Admin methods
  setAdmin(isAdmin: boolean) {
    this.state.isAdmin = isAdmin;
    if (isAdmin) {
      this.loadAdminData();
    }
    storeEvents.emit('admin');
  }
  
  async loadAdminData() {
    try {
      await Promise.all([
        this.loadAllUsers(),
        this.loadAllPayments(),
        this.loadCoupons(),
        this.loadPlatformSettings()
      ]);
    } catch (error) {
      console.error('Load admin data error:', error);
    }
  }
  
  // Load methods
  private async loadUserData() {
    if (!this.state.user?.id) return;
    
    try {
      const [automations, contacts, flows, sequences, broadcasts, growthTools, activities] = await Promise.all([
        db.automations.getByUser(this.state.user.id),
        db.contacts.getByUser(this.state.user.id),
        db.flows.getByUser(this.state.user.id),
        db.sequences.getByUser(this.state.user.id),
        db.broadcasts.getByUser(this.state.user.id),
        db.growthTools.getByUser(this.state.user.id),
        db.activity.getByUser(this.state.user.id)
      ]);
      
      this.state.automations = automations;
      this.state.contacts = contacts;
      this.state.flows = flows;
      this.state.sequences = sequences;
      this.state.broadcasts = broadcasts;
      this.state.growthTools = growthTools;
      this.state.activities = activities;
      
      storeEvents.emit('data');
    } catch (error) {
      console.error('Load user data error:', error);
    }
  }
  
  private async loadAllUsers() {
    try {
      this.state.allUsers = await db.users.getAll();
      storeEvents.emit('users');
    } catch (error) {
      console.error('Load all users error:', error);
    }
  }
  
  private async loadAllPayments() {
    try {
      this.state.allPayments = await db.payments.getAll();
      storeEvents.emit('payments');
    } catch (error) {
      console.error('Load all payments error:', error);
    }
  }
  
  async loadCoupons() {
    try {
      this.state.coupons = await db.coupons.getAll();
      storeEvents.emit('coupons');
    } catch (error) {
      console.error('Load coupons error:', error);
    }
  }
  
  async loadPlatformSettings() {
    try {
      this.state.platformSettings = await db.settings.get();
      storeEvents.emit('settings');
    } catch (error) {
      console.error('Load platform settings error:', error);
    }
  }
  
  // Getters
  getState() {
    return this.state;
  }
  
  getUser() {
    return this.state.user;
  }
  
  isLoggedIn() {
    return this.state.isLoggedIn;
  }
  
  isAdmin() {
    return this.state.isAdmin;
  }
  
  isLoading() {
    return this.state.loading;
  }
  
  getAutomations() {
    return this.state.automations;
  }
  
  getContacts() {
    return this.state.contacts;
  }
  
  getFlows() {
    return this.state.flows;
  }
  
  getSequences() {
    return this.state.sequences;
  }
  
  getBroadcasts() {
    return this.state.broadcasts;
  }
  
  getGrowthTools() {
    return this.state.growthTools;
  }
  
  getActivities() {
    return this.state.activities;
  }
  
  getAllUsers() {
    return this.state.allUsers;
  }
  
  getAllPayments() {
    return this.state.allPayments;
  }
  
  getCoupons() {
    return this.state.coupons;
  }
  
  getPlatformSettings() {
    return this.state.platformSettings;
  }
  
  getPlans(): Plans {
    const defaultPlans: Plans = {
      free: { price: 0, yearlyPrice: 0, messages: 100, automations: 3, contacts: 50 },
      pro: { price: 99, yearlyPrice: 999, messages: 1000, automations: 10, contacts: 500 },
      master: { price: 199, yearlyPrice: 1999, messages: 5000, automations: 50, contacts: 2500 },
      legend: { price: 299, yearlyPrice: 2999, messages: -1, automations: -1, contacts: -1 }
    };
    
    if (this.state.platformSettings?.plans) {
      return this.state.platformSettings.plans as Plans;
    }
    
    return defaultPlans;
  }
  
  getPlanLimits() {
    const plans = this.getPlans();
    const userPlan = this.state.user?.plan || 'free';
    return plans[userPlan];
  }
  
  // User methods
  async updateUser(updates: Partial<DbUser>) {
    if (!this.state.user?.id) return;
    
    try {
      this.state.user = await db.users.update(this.state.user.id, updates);
      storeEvents.emit('user');
    } catch (error) {
      console.error('Update user error:', error);
      throw error;
    }
  }
  
  async connectInstagram(username: string, token: string) {
    await this.updateUser({
      instagram_connected: true,
      instagram_username: username,
      instagram_token: token
    });
  }
  
  async disconnectInstagram() {
    await this.updateUser({
      instagram_connected: false,
      instagram_username: null,
      instagram_token: null
    });
  }
  
  // Automation methods
  async createAutomation(automation: Partial<DbAutomation>) {
    if (!this.state.user?.id) return;
    
    try {
      const newAutomation = await db.automations.create({
        ...automation,
        user_id: this.state.user.id
      });
      this.state.automations.unshift(newAutomation);
      
      await this.logActivity('automation_created', `Created automation: ${automation.name}`);
      storeEvents.emit('automations');
      return newAutomation;
    } catch (error) {
      console.error('Create automation error:', error);
      throw error;
    }
  }
  
  async updateAutomation(id: string, updates: Partial<DbAutomation>) {
    try {
      const updated = await db.automations.update(id, updates);
      const index = this.state.automations.findIndex(a => a.id === id);
      if (index !== -1) {
        this.state.automations[index] = updated;
      }
      storeEvents.emit('automations');
      return updated;
    } catch (error) {
      console.error('Update automation error:', error);
      throw error;
    }
  }
  
  async deleteAutomation(id: string) {
    try {
      await db.automations.delete(id);
      this.state.automations = this.state.automations.filter(a => a.id !== id);
      storeEvents.emit('automations');
    } catch (error) {
      console.error('Delete automation error:', error);
      throw error;
    }
  }
  
  async toggleAutomation(id: string) {
    const automation = this.state.automations.find(a => a.id === id);
    if (automation) {
      await this.updateAutomation(id, { is_active: !automation.is_active });
    }
  }
  
  // Contact methods
  async createContact(contact: Partial<DbContact>) {
    if (!this.state.user?.id) return;
    
    try {
      const newContact = await db.contacts.create({
        ...contact,
        user_id: this.state.user.id
      });
      this.state.contacts.unshift(newContact);
      storeEvents.emit('contacts');
      return newContact;
    } catch (error) {
      console.error('Create contact error:', error);
      throw error;
    }
  }
  
  async updateContact(id: string, updates: Partial<DbContact>) {
    try {
      const updated = await db.contacts.update(id, updates);
      const index = this.state.contacts.findIndex(c => c.id === id);
      if (index !== -1) {
        this.state.contacts[index] = updated;
      }
      storeEvents.emit('contacts');
      return updated;
    } catch (error) {
      console.error('Update contact error:', error);
      throw error;
    }
  }
  
  async deleteContact(id: string) {
    try {
      await db.contacts.delete(id);
      this.state.contacts = this.state.contacts.filter(c => c.id !== id);
      storeEvents.emit('contacts');
    } catch (error) {
      console.error('Delete contact error:', error);
      throw error;
    }
  }
  
  // Flow methods
  async createFlow(flow: Partial<DbFlow>) {
    if (!this.state.user?.id) return;
    
    try {
      const newFlow = await db.flows.create({
        ...flow,
        user_id: this.state.user.id
      });
      this.state.flows.unshift(newFlow);
      storeEvents.emit('flows');
      return newFlow;
    } catch (error) {
      console.error('Create flow error:', error);
      throw error;
    }
  }
  
  async updateFlow(id: string, updates: Partial<DbFlow>) {
    try {
      const updated = await db.flows.update(id, updates);
      const index = this.state.flows.findIndex(f => f.id === id);
      if (index !== -1) {
        this.state.flows[index] = updated;
      }
      storeEvents.emit('flows');
      return updated;
    } catch (error) {
      console.error('Update flow error:', error);
      throw error;
    }
  }
  
  async deleteFlow(id: string) {
    try {
      await db.flows.delete(id);
      this.state.flows = this.state.flows.filter(f => f.id !== id);
      storeEvents.emit('flows');
    } catch (error) {
      console.error('Delete flow error:', error);
      throw error;
    }
  }
  
  // Sequence methods
  async createSequence(sequence: Partial<DbSequence>) {
    if (!this.state.user?.id) return;
    
    try {
      const newSequence = await db.sequences.create({
        ...sequence,
        user_id: this.state.user.id
      });
      this.state.sequences.unshift(newSequence);
      storeEvents.emit('sequences');
      return newSequence;
    } catch (error) {
      console.error('Create sequence error:', error);
      throw error;
    }
  }
  
  async updateSequence(id: string, updates: Partial<DbSequence>) {
    try {
      const updated = await db.sequences.update(id, updates);
      const index = this.state.sequences.findIndex(s => s.id === id);
      if (index !== -1) {
        this.state.sequences[index] = updated;
      }
      storeEvents.emit('sequences');
      return updated;
    } catch (error) {
      console.error('Update sequence error:', error);
      throw error;
    }
  }
  
  async deleteSequence(id: string) {
    try {
      await db.sequences.delete(id);
      this.state.sequences = this.state.sequences.filter(s => s.id !== id);
      storeEvents.emit('sequences');
    } catch (error) {
      console.error('Delete sequence error:', error);
      throw error;
    }
  }
  
  // Broadcast methods
  async createBroadcast(broadcast: Partial<DbBroadcast>) {
    if (!this.state.user?.id) return;
    
    try {
      const newBroadcast = await db.broadcasts.create({
        ...broadcast,
        user_id: this.state.user.id
      });
      this.state.broadcasts.unshift(newBroadcast);
      storeEvents.emit('broadcasts');
      return newBroadcast;
    } catch (error) {
      console.error('Create broadcast error:', error);
      throw error;
    }
  }
  
  async updateBroadcast(id: string, updates: Partial<DbBroadcast>) {
    try {
      const updated = await db.broadcasts.update(id, updates);
      const index = this.state.broadcasts.findIndex(b => b.id === id);
      if (index !== -1) {
        this.state.broadcasts[index] = updated;
      }
      storeEvents.emit('broadcasts');
      return updated;
    } catch (error) {
      console.error('Update broadcast error:', error);
      throw error;
    }
  }
  
  async deleteBroadcast(id: string) {
    try {
      await db.broadcasts.delete(id);
      this.state.broadcasts = this.state.broadcasts.filter(b => b.id !== id);
      storeEvents.emit('broadcasts');
    } catch (error) {
      console.error('Delete broadcast error:', error);
      throw error;
    }
  }
  
  // Growth Tool methods
  async createGrowthTool(tool: Partial<DbGrowthTool>) {
    if (!this.state.user?.id) return;
    
    try {
      const newTool = await db.growthTools.create({
        ...tool,
        user_id: this.state.user.id
      });
      this.state.growthTools.unshift(newTool);
      storeEvents.emit('growthTools');
      return newTool;
    } catch (error) {
      console.error('Create growth tool error:', error);
      throw error;
    }
  }
  
  async updateGrowthTool(id: string, updates: Partial<DbGrowthTool>) {
    try {
      const updated = await db.growthTools.update(id, updates);
      const index = this.state.growthTools.findIndex(t => t.id === id);
      if (index !== -1) {
        this.state.growthTools[index] = updated;
      }
      storeEvents.emit('growthTools');
      return updated;
    } catch (error) {
      console.error('Update growth tool error:', error);
      throw error;
    }
  }
  
  async deleteGrowthTool(id: string) {
    try {
      await db.growthTools.delete(id);
      this.state.growthTools = this.state.growthTools.filter(t => t.id !== id);
      storeEvents.emit('growthTools');
    } catch (error) {
      console.error('Delete growth tool error:', error);
      throw error;
    }
  }
  
  // Payment methods
  async submitPayment(plan: string, interval: 'monthly' | 'yearly', amount: number, utr: string) {
    if (!this.state.user) return;
    
    try {
      const payment = await db.payments.create({
        user_id: this.state.user.id,
        user_email: this.state.user.email,
        user_name: this.state.user.name,
        plan,
        interval,
        amount,
        utr,
        status: 'pending'
      });
      
      await this.logActivity('payment_submitted', `Submitted payment for ${plan} plan`);
      storeEvents.emit('payments');
      return payment;
    } catch (error) {
      console.error('Submit payment error:', error);
      throw error;
    }
  }
  
  // Admin: Approve payment
  async approvePayment(paymentId: string) {
    try {
      const payment = this.state.allPayments.find(p => p.id === paymentId);
      if (!payment) throw new Error('Payment not found');
      
      // Update payment status
      await db.payments.update(paymentId, { status: 'approved' });
      
      // Update user's plan
      const expiresAt = new Date();
      if (payment.interval === 'yearly') {
        expiresAt.setFullYear(expiresAt.getFullYear() + 1);
      } else {
        expiresAt.setMonth(expiresAt.getMonth() + 1);
      }
      
      await db.users.update(payment.user_id, {
        plan: payment.plan as 'free' | 'pro' | 'master' | 'legend',
        plan_interval: payment.interval,
        plan_expires_at: expiresAt.toISOString()
      });
      
      await this.loadAllPayments();
      await this.loadAllUsers();
      storeEvents.emit('payments');
    } catch (error) {
      console.error('Approve payment error:', error);
      throw error;
    }
  }
  
  // Admin: Reject payment
  async rejectPayment(paymentId: string) {
    try {
      const payment = this.state.allPayments.find(p => p.id === paymentId);
      if (!payment) throw new Error('Payment not found');
      
      await db.payments.update(paymentId, { status: 'rejected' });
      
      // Reset user to free plan
      await db.users.update(payment.user_id, {
        plan: 'free',
        plan_interval: 'monthly',
        plan_expires_at: null
      });
      
      await this.loadAllPayments();
      await this.loadAllUsers();
      storeEvents.emit('payments');
    } catch (error) {
      console.error('Reject payment error:', error);
      throw error;
    }
  }
  
  // Coupon methods
  async applyCoupon(code: string) {
    try {
      const coupon = await db.coupons.getByCode(code);
      
      if (!coupon) {
        throw new Error('Invalid coupon code');
      }
      
      if (!coupon.is_active) {
        throw new Error('This coupon is no longer active');
      }
      
      if (coupon.used_count >= coupon.max_uses) {
        throw new Error('This coupon has reached its usage limit');
      }
      
      if (coupon.expires_at && new Date(coupon.expires_at) < new Date()) {
        throw new Error('This coupon has expired');
      }
      
      // Use the coupon
      await db.coupons.use(coupon.id);
      
      // Upgrade user's plan
      const expiresAt = new Date();
      expiresAt.setMonth(expiresAt.getMonth() + 1);
      
      await this.updateUser({
        plan: coupon.plan as 'free' | 'pro' | 'master' | 'legend',
        plan_interval: 'monthly',
        plan_expires_at: expiresAt.toISOString()
      });
      
      await this.logActivity('coupon_applied', `Applied coupon: ${code} for ${coupon.plan} plan`);
      await this.loadCoupons();
      
      return coupon;
    } catch (error) {
      console.error('Apply coupon error:', error);
      throw error;
    }
  }
  
  // Admin: Create coupon
  async createCoupon(coupon: Partial<DbCoupon>) {
    try {
      const newCoupon = await db.coupons.create(coupon);
      this.state.coupons.unshift(newCoupon);
      storeEvents.emit('coupons');
      return newCoupon;
    } catch (error) {
      console.error('Create coupon error:', error);
      throw error;
    }
  }
  
  // Admin: Update coupon
  async updateCoupon(id: string, updates: Partial<DbCoupon>) {
    try {
      const updated = await db.coupons.update(id, updates);
      const index = this.state.coupons.findIndex(c => c.id === id);
      if (index !== -1) {
        this.state.coupons[index] = updated;
      }
      storeEvents.emit('coupons');
      return updated;
    } catch (error) {
      console.error('Update coupon error:', error);
      throw error;
    }
  }
  
  // Admin: Delete coupon
  async deleteCoupon(id: string) {
    try {
      await db.coupons.delete(id);
      this.state.coupons = this.state.coupons.filter(c => c.id !== id);
      storeEvents.emit('coupons');
    } catch (error) {
      console.error('Delete coupon error:', error);
      throw error;
    }
  }
  
  // Admin: Update user
  async adminUpdateUser(userId: string, updates: Partial<DbUser>) {
    try {
      const updated = await db.users.update(userId, updates);
      const index = this.state.allUsers.findIndex(u => u.id === userId);
      if (index !== -1) {
        this.state.allUsers[index] = updated;
      }
      storeEvents.emit('users');
      return updated;
    } catch (error) {
      console.error('Admin update user error:', error);
      throw error;
    }
  }
  
  // Admin: Delete user
  async adminDeleteUser(userId: string) {
    try {
      await db.users.delete(userId);
      this.state.allUsers = this.state.allUsers.filter(u => u.id !== userId);
      storeEvents.emit('users');
    } catch (error) {
      console.error('Admin delete user error:', error);
      throw error;
    }
  }
  
  // Admin: Update platform settings
  async updatePlatformSettings(updates: Partial<DbPlatformSettings>) {
    try {
      this.state.platformSettings = await db.settings.update(updates);
      storeEvents.emit('settings');
    } catch (error) {
      console.error('Update platform settings error:', error);
      throw error;
    }
  }
  
  // Admin: Update plan pricing
  async updatePlanPricing(planName: string, updates: Partial<PlanConfig>) {
    try {
      const plans = this.getPlans();
      const updatedPlans = {
        ...plans,
        [planName]: { ...plans[planName as keyof Plans], ...updates }
      };
      
      await this.updatePlatformSettings({ plans: updatedPlans });
    } catch (error) {
      console.error('Update plan pricing error:', error);
      throw error;
    }
  }
  
  // Activity logging
  async logActivity(type: string, message: string, metadata: Record<string, unknown> = {}) {
    if (!this.state.user?.id) return;
    
    try {
      await db.activity.create({
        user_id: this.state.user.id,
        type,
        message,
        metadata
      });
    } catch (error) {
      console.error('Log activity error:', error);
    }
  }
  
  // Stats
  async getUserStats() {
    return await db.users.getStats();
  }
  
  async getPaymentStats() {
    return await db.payments.getStats();
  }
}

// Export singleton instance
export const store = new Store();

// Initialize store
store.initialize();

export default store;
