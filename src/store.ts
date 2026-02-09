import { v4 as uuidv4 } from 'uuid';
import { Database, automationEngine } from './lib/config';

// Types
export interface User {
  id: string;
  email: string;
  name: string;
  avatar: string;
  plan: 'free' | 'pro' | 'business' | 'enterprise';
  instagramConnected: boolean;
  instagramUsername?: string;
  instagramFollowers?: number;
  instagramProfilePic?: string;
  instagramAccessToken?: string;
  instagramUserId?: string;
  createdAt: string;
  isActive: boolean;
  messagesSent: number;
  messagesLimit: number;
  automationsCount: number;
  automationsLimit: number;
  contactsCount: number;
  contactsLimit: number;
}

export interface Plan {
  id: string;
  name: string;
  price: number;
  interval: 'month' | 'year';
  messagesLimit: number;
  automationsLimit: number;
  contactsLimit: number;
  features: string[];
  isPopular?: boolean;
}

export interface Automation {
  id: string;
  name: string;
  type: 'dm_reply' | 'comment_reply' | 'story_reply' | 'welcome_message' | 'keyword_trigger' | 'flow' | 'broadcast' | 'sequence';
  status: 'active' | 'paused' | 'draft';
  trigger: string;
  responses: AutomationResponse[];
  conditions: AutomationCondition[];
  createdAt: string;
  updatedAt: string;
  stats: {
    triggered: number;
    replied: number;
    conversions: number;
  };
}

export interface AutomationResponse {
  id: string;
  type: 'text' | 'image' | 'button' | 'quick_reply' | 'carousel' | 'delay' | 'condition';
  content: string;
  buttons?: { text: string; url?: string; action?: string }[];
  delay?: number;
}

export interface AutomationCondition {
  id: string;
  field: 'keyword' | 'follower_count' | 'is_follower' | 'time' | 'tag';
  operator: 'equals' | 'contains' | 'greater_than' | 'less_than';
  value: string;
}

export interface Contact {
  id: string;
  username: string;
  name: string;
  avatar: string;
  isFollower: boolean;
  tags: string[];
  lastInteraction: string;
  messageCount: number;
  source: string;
  email?: string;
  phone?: string;
  notes: string;
  subscribedAt: string;
}

export interface BroadcastMessage {
  id: string;
  name: string;
  content: string;
  status: 'draft' | 'scheduled' | 'sent' | 'sending';
  scheduledAt?: string;
  sentAt?: string;
  recipients: number;
  delivered: number;
  opened: number;
  clicked: number;
  targetTags: string[];
}

export interface FlowNode {
  id: string;
  type: 'trigger' | 'message' | 'condition' | 'action' | 'delay' | 'split';
  position: { x: number; y: number };
  data: Record<string, unknown>;
  connections: string[];
}

export interface GrowthTool {
  id: string;
  name: string;
  type: 'comment_trigger' | 'story_mention' | 'bio_link' | 'qr_code' | 'ref_link' | 'live_comment';
  status: 'active' | 'paused';
  settings: Record<string, unknown>;
  stats: { impressions: number; clicks: number; conversions: number };
}

export interface AdminSettings {
  platformName: string;
  plans: Plan[];
  totalUsers: number;
  activeUsers: number;
  totalRevenue: number;
  monthlyRevenue: number;
  maintenanceMode: boolean;
  registrationEnabled: boolean;
  announcements: { id: string; message: string; type: 'info' | 'warning' | 'success'; active: boolean }[];
  paymentUPI: string;
  paymentPhone: string;
  coupons: Coupon[];
  paymentRequests: PaymentRequest[];
}

// Activity Log
export interface ActivityLog {
  id: string;
  type: 'dm_sent' | 'comment_replied' | 'story_replied' | 'broadcast_sent' | 'automation_triggered' | 'contact_added' | 'user_action';
  message: string;
  timestamp: string;
  automationId?: string;
  contactId?: string;
}

// Coupon interface
export interface Coupon {
  id: string;
  code: string;
  planId: string;
  usageLimit: number;
  usedCount: number;
  expiresAt: string;
  isActive: boolean;
  createdAt: string;
}

// Payment Request interface
export interface PaymentRequest {
  id: string;
  oderId: string
  usersId: string;
  userName: string;
  userEmail: string;
  planId: string;
  planName: string;
  amount: number;
  utrNumber: string;
  paymentMethod: 'upi' | 'phone';
  status: 'pending' | 'approved' | 'rejected';
  createdAt: string;
  processedAt?: string;
  processedBy?: string;
  rejectionReason?: string;
}

// Default Plans - Updated with ₹ pricing
export const defaultPlans: Plan[] = [
  {
    id: 'free',
    name: 'Free',
    price: 0,
    interval: 'month',
    messagesLimit: 100,
    automationsLimit: 3,
    contactsLimit: 50,
    features: ['Basic DM Auto-Reply', 'Comment Auto-Reply', '3 Automations', '50 Contacts', 'Basic Analytics'],
  },
  {
    id: 'pro',
    name: 'Pro',
    price: 99,
    interval: 'month',
    messagesLimit: 5000,
    automationsLimit: 25,
    contactsLimit: 2000,
    features: ['Everything in Free', 'Advanced Flows', 'Story Reply', 'Broadcast Messages', 'Sequences', 'Priority Support', '25 Automations', '2K Contacts'],
    isPopular: true,
  },
  {
    id: 'master',
    name: 'Master',
    price: 199,
    interval: 'month',
    messagesLimit: 25000,
    automationsLimit: 100,
    contactsLimit: 15000,
    features: ['Everything in Pro', 'A/B Testing', 'Custom Fields', 'API Access', 'Team Members', 'Advanced Analytics', '100 Automations', '15K Contacts'],
  },
  {
    id: 'legend',
    name: 'Legend',
    price: 299,
    interval: 'month',
    messagesLimit: 999999,
    automationsLimit: 999999,
    contactsLimit: 999999,
    features: ['Everything in Master', 'Unlimited Everything', '24/7 VIP Support', 'Dedicated Manager', 'Custom Integrations', 'White Label', 'SLA'],
  },
];

// Yearly Plans
export const yearlyPlans: Plan[] = [
  { ...defaultPlans[0], id: 'free-yearly', interval: 'year' as const },
  { ...defaultPlans[1], id: 'pro-yearly', price: 999, interval: 'year' as const },
  { ...defaultPlans[2], id: 'master-yearly', price: 1999, interval: 'year' as const },
  { ...defaultPlans[3], id: 'legend-yearly', price: 2999, interval: 'year' as const },
];

// Default Coupons
export const defaultCoupons: Coupon[] = [
  {
    id: '1',
    code: 'FREEMASTER',
    planId: 'master',
    usageLimit: 50,
    usedCount: 0,
    expiresAt: '2025-12-31',
    isActive: true,
    createdAt: new Date().toISOString(),
  },
];

// Demo contacts
export const demoContacts: Contact[] = [
  { id: '1', username: 'sarah_designs', name: 'Sarah Johnson', avatar: '', isFollower: true, tags: ['customer', 'vip'], lastInteraction: '2024-01-15', messageCount: 45, source: 'dm', email: 'sarah@email.com', phone: '', notes: 'VIP customer, interested in premium products', subscribedAt: '2023-12-01' },
  { id: '2', username: 'mike_photo', name: 'Mike Chen', avatar: '', isFollower: true, tags: ['lead', 'interested'], lastInteraction: '2024-01-14', messageCount: 12, source: 'comment', email: '', phone: '', notes: 'Asked about pricing', subscribedAt: '2024-01-10' },
  { id: '3', username: 'emma.style', name: 'Emma Wilson', avatar: '', isFollower: false, tags: ['new'], lastInteraction: '2024-01-13', messageCount: 3, source: 'story', email: 'emma@email.com', phone: '', notes: '', subscribedAt: '2024-01-13' },
  { id: '4', username: 'alex_fitness', name: 'Alex Rivera', avatar: '', isFollower: true, tags: ['customer', 'active'], lastInteraction: '2024-01-15', messageCount: 67, source: 'dm', email: 'alex@fitness.com', phone: '+1234567890', notes: 'Repeat buyer', subscribedAt: '2023-11-15' },
  { id: '5', username: 'priya_art', name: 'Priya Patel', avatar: '', isFollower: true, tags: ['influencer', 'partner'], lastInteraction: '2024-01-12', messageCount: 23, source: 'comment', email: 'priya@art.com', phone: '', notes: 'Potential brand ambassador', subscribedAt: '2023-10-20' },
];

// Demo automations
export const demoAutomations: Automation[] = [
  {
    id: '1',
    name: 'Welcome New Followers',
    type: 'welcome_message',
    status: 'active',
    trigger: 'new_follower',
    responses: [{ id: '1', type: 'text', content: 'Hey {{name}}! 👋 Welcome to our community! Thanks for following. Feel free to DM us anytime!' }],
    conditions: [],
    createdAt: '2024-01-01',
    updatedAt: '2024-01-15',
    stats: { triggered: 1250, replied: 1180, conversions: 340 },
  },
  {
    id: '2',
    name: 'Comment "INFO" Auto-Reply',
    type: 'comment_reply',
    status: 'active',
    trigger: 'keyword:INFO',
    responses: [
      { id: '1', type: 'text', content: 'Thanks for your interest! 🎉 I just sent you a DM with all the details!' },
      { id: '2', type: 'text', content: 'Hey {{name}}! Here are the details you requested:\n\n📌 Our premium plan starts at $29/mo\n📌 Free trial for 14 days\n📌 Cancel anytime\n\nWant to get started?' },
    ],
    conditions: [],
    createdAt: '2024-01-05',
    updatedAt: '2024-01-14',
    stats: { triggered: 890, replied: 845, conversions: 210 },
  },
  {
    id: '3',
    name: 'Story Mention Thank You',
    type: 'story_reply',
    status: 'active',
    trigger: 'story_mention',
    responses: [{ id: '1', type: 'text', content: 'OMG thank you for the mention! 🙏❤️ You\'re amazing! Use code THANKS15 for 15% off your next order!' }],
    conditions: [],
    createdAt: '2024-01-08',
    updatedAt: '2024-01-12',
    stats: { triggered: 156, replied: 150, conversions: 45 },
  },
  {
    id: '4',
    name: 'Product Inquiry Flow',
    type: 'keyword_trigger',
    status: 'paused',
    trigger: 'keyword:PRODUCT,BUY,SHOP,PRICE',
    responses: [
      { id: '1', type: 'text', content: 'Great question! What product are you interested in?' },
      { id: '2', type: 'button', content: 'Choose a category:', buttons: [{ text: '👕 Clothing' }, { text: '👟 Shoes' }, { text: '🎒 Accessories' }] },
    ],
    conditions: [],
    createdAt: '2024-01-10',
    updatedAt: '2024-01-15',
    stats: { triggered: 432, replied: 400, conversions: 120 },
  },
];

// Store class with localStorage persistence
// Event emitter for real-time sync across components
class EventEmitter {
  private listeners: Map<string, Set<() => void>> = new Map();
  
  on(event: string, callback: () => void) {
    if (!this.listeners.has(event)) {
      this.listeners.set(event, new Set());
    }
    this.listeners.get(event)!.add(callback);
    return () => this.listeners.get(event)?.delete(callback);
  }
  
  emit(event: string) {
    this.listeners.get(event)?.forEach(cb => cb());
    this.listeners.get('*')?.forEach(cb => cb()); // Wildcard for any change
  }
}

export const storeEvents = new EventEmitter();

class Store {
  private listeners: Set<() => void> = new Set();
  
  // Auth state
  isLoggedIn = false;
  isAdmin = false;
  currentUser: User | null = null;
  
  // App state
  currentPage: string = 'landing';
  sidebarOpen = true;
  showOnboarding = false;
  
  // Data
  automations: Automation[] = [];
  contacts: Contact[] = [];
  broadcasts: BroadcastMessage[] = [];
  growthTools: GrowthTool[] = [];
  plans: Plan[] = [...defaultPlans];
  activityLog: ActivityLog[] = [];
  
  // Admin
  adminSettings: AdminSettings = {
    platformName: 'IGOne',
    plans: [...defaultPlans],
    totalUsers: 15420,
    activeUsers: 8930,
    totalRevenue: 245000,
    monthlyRevenue: 42000,
    maintenanceMode: false,
    registrationEnabled: true,
    announcements: [],
    paymentUPI: '7321086174@ibl',
    paymentPhone: '7321086174',
    coupons: [...defaultCoupons],
    paymentRequests: [],
  };

  allUsers: User[] = [
    { id: '1', email: 'john@example.com', name: 'John Doe', avatar: '', plan: 'pro', instagramConnected: true, instagramUsername: 'johndoe', instagramFollowers: 15000, createdAt: '2024-01-01', isActive: true, messagesSent: 3200, messagesLimit: 5000, automationsCount: 12, automationsLimit: 25, contactsCount: 890, contactsLimit: 2000 },
    { id: '2', email: 'jane@example.com', name: 'Jane Smith', avatar: '', plan: 'business', instagramConnected: true, instagramUsername: 'janesmith', instagramFollowers: 52000, createdAt: '2023-12-15', isActive: true, messagesSent: 18500, messagesLimit: 25000, automationsCount: 45, automationsLimit: 100, contactsCount: 8900, contactsLimit: 15000 },
    { id: '3', email: 'bob@example.com', name: 'Bob Wilson', avatar: '', plan: 'free', instagramConnected: false, createdAt: '2024-01-10', isActive: true, messagesSent: 45, messagesLimit: 100, automationsCount: 2, automationsLimit: 3, contactsCount: 12, contactsLimit: 50 },
    { id: '4', email: 'alice@example.com', name: 'Alice Brown', avatar: '', plan: 'enterprise', instagramConnected: true, instagramUsername: 'alicebrown', instagramFollowers: 250000, createdAt: '2023-11-01', isActive: true, messagesSent: 95000, messagesLimit: 999999, automationsCount: 200, automationsLimit: 999999, contactsCount: 45000, contactsLimit: 999999 },
    { id: '5', email: 'charlie@example.com', name: 'Charlie Davis', avatar: '', plan: 'pro', instagramConnected: true, instagramUsername: 'charlied', instagramFollowers: 8500, createdAt: '2024-01-05', isActive: false, messagesSent: 1200, messagesLimit: 5000, automationsCount: 8, automationsLimit: 25, contactsCount: 450, contactsLimit: 2000 },
  ];

  constructor() {
    this.loadFromStorage();
  }

  private loadFromStorage() {
    const savedUser = Database.load<User | null>('user_data', null);
    if (savedUser) {
      this.currentUser = savedUser;
      this.isLoggedIn = true;
      this.currentPage = 'dashboard';
    }

    const savedAdmin = Database.load<boolean>('is_admin', false);
    if (savedAdmin) {
      this.isAdmin = true;
      this.currentPage = 'admin-dashboard';
    }

    this.automations = Database.load('automations', [...demoAutomations]);
    this.contacts = Database.load('contacts', [...demoContacts]);
    this.broadcasts = Database.load('broadcasts', []);
    this.growthTools = Database.load('growth_tools', []);
    this.plans = Database.load('plans', [...defaultPlans]);
    this.activityLog = Database.load('activity_log', []);
    this.adminSettings = Database.load('admin_settings', this.adminSettings);

    // Load automation rules
    automationEngine.loadRules(this.automations);
  }

  private saveToStorage() {
    if (this.currentUser) {
      Database.save('user_data', this.currentUser);
    }
    Database.save('is_admin', this.isAdmin);
    Database.save('automations', this.automations);
    Database.save('contacts', this.contacts);
    Database.save('broadcasts', this.broadcasts);
    Database.save('growth_tools', this.growthTools);
    Database.save('plans', this.plans);
    Database.save('activity_log', this.activityLog);
    Database.save('admin_settings', this.adminSettings);
  }

  subscribe(listener: () => void) {
    this.listeners.add(listener);
    return () => this.listeners.delete(listener);
  }

  private notify() {
    this.saveToStorage();
    this.listeners.forEach(l => l());
    // Emit events for real-time sync
    storeEvents.emit('*');
  }
  
  // Emit specific event
  emitEvent(event: string) {
    storeEvents.emit(event);
  }

  // Activity logging
  logActivity(type: ActivityLog['type'], message: string, automationId?: string, contactId?: string) {
    this.activityLog.unshift({
      id: uuidv4(),
      type,
      message,
      timestamp: new Date().toISOString(),
      automationId,
      contactId,
    });
    // Keep only last 100 activities
    if (this.activityLog.length > 100) {
      this.activityLog = this.activityLog.slice(0, 100);
    }
  }

  // Auth
  loginWithGoogle() {
    this.currentUser = {
      id: uuidv4(),
      email: 'user@gmail.com',
      name: 'Instagram User',
      avatar: '',
      plan: 'free',
      instagramConnected: false,
      createdAt: new Date().toISOString(),
      isActive: true,
      messagesSent: 0,
      messagesLimit: 100,
      automationsCount: 0,
      automationsLimit: 3,
      contactsCount: 0,
      contactsLimit: 50,
    };
    this.isLoggedIn = true;
    this.isAdmin = false;
    this.currentPage = 'dashboard';
    this.showOnboarding = !Database.load('onboarding_done', false);
    this.logActivity('user_action', 'Logged in via Google');
    this.notify();
  }

  loginAsAdmin(password: string): boolean {
    if (password === 'sameer3745') {
      this.isAdmin = true;
      this.isLoggedIn = true;
      this.currentUser = {
        id: 'admin',
        email: 'admin@igone.com',
        name: 'Admin',
        avatar: '',
        plan: 'enterprise',
        instagramConnected: true,
        instagramUsername: 'igone_admin',
        createdAt: '2023-01-01',
        isActive: true,
        messagesSent: 0,
        messagesLimit: 999999,
        automationsCount: 0,
        automationsLimit: 999999,
        contactsCount: 0,
        contactsLimit: 999999,
      };
      this.currentPage = 'admin-dashboard';
      this.logActivity('user_action', 'Admin logged in');
      this.notify();
      return true;
    }
    return false;
  }

  logout() {
    this.isLoggedIn = false;
    this.isAdmin = false;
    this.currentUser = null;
    this.currentPage = 'landing';
    Database.remove('user_data');
    Database.remove('is_admin');
    Database.remove('instagram_token');
    this.notify();
  }

  setPage(page: string) {
    this.currentPage = page;
    this.notify();
  }

  toggleSidebar() {
    this.sidebarOpen = !this.sidebarOpen;
    this.notify();
  }

  dismissOnboarding() {
    this.showOnboarding = false;
    Database.save('onboarding_done', true);
    this.notify();
  }

  showOnboardingGuide() {
    this.showOnboarding = true;
    this.notify();
  }

  connectInstagram() {
    if (this.currentUser) {
      this.currentUser.instagramConnected = true;
      this.currentUser.instagramUsername = 'my_business_ig';
      this.currentUser.instagramFollowers = 5420;
      this.currentUser.instagramProfilePic = '';
      this.logActivity('user_action', 'Connected Instagram: @my_business_ig');
      this.notify();
    }
  }

  disconnectInstagram() {
    if (this.currentUser) {
      this.currentUser.instagramConnected = false;
      this.currentUser.instagramUsername = undefined;
      this.currentUser.instagramFollowers = undefined;
      this.currentUser.instagramAccessToken = undefined;
      this.currentUser.instagramUserId = undefined;
      Database.remove('instagram_token');
      this.logActivity('user_action', 'Disconnected Instagram');
      this.notify();
    }
  }

  // Real Instagram connection
  connectInstagramReal(accessToken: string, username: string, userId: string, followers: number) {
    if (this.currentUser) {
      this.currentUser.instagramConnected = true;
      this.currentUser.instagramUsername = username;
      this.currentUser.instagramFollowers = followers;
      this.currentUser.instagramAccessToken = accessToken;
      this.currentUser.instagramUserId = userId;
      Database.save('instagram_token', accessToken);
      this.logActivity('user_action', `Connected Instagram: @${username}`);
      this.notify();
    }
  }

  // Simulate incoming message (for testing automation)
  simulateIncomingMessage(senderName: string, message: string): string | null {
    const result = automationEngine.processMessage(message, senderName);
    if (result) {
      // Update automation stats
      const auto = this.automations.find(a => a.id === result.automationId);
      if (auto) {
        auto.stats.triggered++;
        auto.stats.replied++;
      }
      // Update user message count
      if (this.currentUser) {
        this.currentUser.messagesSent++;
      }
      this.logActivity('dm_sent', `Auto-replied to @${senderName}: "${message}"`, result.automationId);
      this.notify();
      return result.response;
    }
    return null;
  }

  // Simulate incoming comment
  simulateIncomingComment(commenterName: string, comment: string): { commentReply: string; dmResponse: string } | null {
    const result = automationEngine.processComment(comment, commenterName);
    if (result) {
      const auto = this.automations.find(a => a.id === result.automationId);
      if (auto) {
        auto.stats.triggered++;
        auto.stats.replied++;
      }
      if (this.currentUser) {
        this.currentUser.messagesSent += 2; // comment reply + DM
      }
      this.logActivity('comment_replied', `Comment trigger fired for @${commenterName}: "${comment}"`, result.automationId);
      this.notify();
      return { commentReply: result.commentReply, dmResponse: result.dmResponse };
    }
    return null;
  }

  // Automations
  addAutomation(auto: Omit<Automation, 'id' | 'createdAt' | 'updatedAt' | 'stats'>) {
    const newAuto: Automation = {
      ...auto,
      id: uuidv4(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      stats: { triggered: 0, replied: 0, conversions: 0 },
    };
    this.automations.push(newAuto);
    if (this.currentUser) this.currentUser.automationsCount++;
    automationEngine.loadRules(this.automations);
    this.logActivity('user_action', `Created automation: ${auto.name}`);
    this.notify();
  }

  updateAutomation(id: string, updates: Partial<Automation>) {
    const idx = this.automations.findIndex(a => a.id === id);
    if (idx !== -1) {
      this.automations[idx] = { ...this.automations[idx], ...updates, updatedAt: new Date().toISOString() };
      automationEngine.loadRules(this.automations);
      this.notify();
    }
  }

  deleteAutomation(id: string) {
    const auto = this.automations.find(a => a.id === id);
    this.automations = this.automations.filter(a => a.id !== id);
    if (this.currentUser && this.currentUser.automationsCount > 0) this.currentUser.automationsCount--;
    automationEngine.loadRules(this.automations);
    if (auto) this.logActivity('user_action', `Deleted automation: ${auto.name}`);
    this.notify();
  }

  toggleAutomation(id: string) {
    const auto = this.automations.find(a => a.id === id);
    if (auto) {
      auto.status = auto.status === 'active' ? 'paused' : 'active';
      automationEngine.loadRules(this.automations);
      this.logActivity('user_action', `${auto.status === 'active' ? 'Activated' : 'Paused'} automation: ${auto.name}`);
      this.notify();
    }
  }

  // Contacts
  addContact(contact: Omit<Contact, 'id' | 'subscribedAt'>) {
    this.contacts.push({ ...contact, id: uuidv4(), subscribedAt: new Date().toISOString() });
    if (this.currentUser) this.currentUser.contactsCount++;
    this.logActivity('contact_added', `Added contact: @${contact.username}`);
    this.notify();
  }

  deleteContact(id: string) {
    this.contacts = this.contacts.filter(c => c.id !== id);
    if (this.currentUser && this.currentUser.contactsCount > 0) this.currentUser.contactsCount--;
    this.notify();
  }

  addTagToContact(id: string, tag: string) {
    const contact = this.contacts.find(c => c.id === id);
    if (contact && !contact.tags.includes(tag)) {
      contact.tags.push(tag);
      this.notify();
    }
  }

  removeTagFromContact(id: string, tag: string) {
    const contact = this.contacts.find(c => c.id === id);
    if (contact) {
      contact.tags = contact.tags.filter(t => t !== tag);
      this.notify();
    }
  }

  // Broadcasts
  addBroadcast(broadcast: Omit<BroadcastMessage, 'id'>) {
    this.broadcasts.push({ ...broadcast, id: uuidv4() });
    this.logActivity('user_action', `Created broadcast: ${broadcast.name}`);
    this.notify();
  }

  sendBroadcast(id: string) {
    const bc = this.broadcasts.find(b => b.id === id);
    if (bc) {
      bc.status = 'sending';
      this.notify();
      
      // Simulate sending with progress
      setTimeout(() => {
        bc.status = 'sent';
        bc.sentAt = new Date().toISOString();
        bc.delivered = Math.floor(bc.recipients * 0.95);
        bc.opened = Math.floor(bc.recipients * 0.65);
        bc.clicked = Math.floor(bc.recipients * 0.23);
        if (this.currentUser) {
          this.currentUser.messagesSent += bc.delivered;
        }
        this.logActivity('broadcast_sent', `Broadcast "${bc.name}" sent to ${bc.delivered} contacts`);
        this.notify();
      }, 2000);
    }
  }

  // Admin functions
  updatePlan(planId: string, updates: Partial<Plan>) {
    const idx = this.plans.findIndex(p => p.id === planId);
    if (idx !== -1) {
      this.plans[idx] = { ...this.plans[idx], ...updates };
      this.adminSettings.plans = [...this.plans];
      this.notify();
    }
  }

  updateUserPlan(userId: string, plan: User['plan']) {
    const user = this.allUsers.find(u => u.id === userId);
    if (user) {
      const planData = this.plans.find(p => p.id === plan);
      if (planData) {
        user.plan = plan;
        user.messagesLimit = planData.messagesLimit;
        user.automationsLimit = planData.automationsLimit;
        user.contactsLimit = planData.contactsLimit;
      }
      this.notify();
    }
  }

  toggleUserActive(userId: string) {
    const user = this.allUsers.find(u => u.id === userId);
    if (user) {
      user.isActive = !user.isActive;
      this.logActivity('user_action', `${user.isActive ? 'Activated' : 'Suspended'} user: ${user.name}`);
      this.notify();
    }
  }

  deleteUser(userId: string) {
    const user = this.allUsers.find(u => u.id === userId);
    this.allUsers = this.allUsers.filter(u => u.id !== userId);
    this.adminSettings.totalUsers--;
    if (user) this.logActivity('user_action', `Deleted user: ${user.name}`);
    this.notify();
  }

  updateAdminSettings(updates: Partial<AdminSettings>) {
    this.adminSettings = { ...this.adminSettings, ...updates };
    this.notify();
  }

  changePlan(planId: string) {
    if (this.currentUser) {
      const plan = this.plans.find(p => p.id === planId || p.id === planId.replace('-yearly', ''));
      if (plan) {
        this.currentUser.plan = planId.replace('-yearly', '') as User['plan'];
        this.currentUser.messagesLimit = plan.messagesLimit;
        this.currentUser.automationsLimit = plan.automationsLimit;
        this.currentUser.contactsLimit = plan.contactsLimit;
        this.logActivity('user_action', `Changed plan to: ${plan.name}`);
        this.notify();
      }
    }
  }

  // Payment System
  submitPayment(planId: string, amount: number, utrNumber: string, paymentMethod: 'upi' | 'phone') {
    if (!this.currentUser) return null;
    
    const plan = this.plans.find(p => p.id === planId);
    if (!plan) return null;

    const paymentRequest: PaymentRequest = {
      id: uuidv4(),
      oderId: `ORD${Date.now()}`,
      usersId: this.currentUser.id,
      userName: this.currentUser.name,
      userEmail: this.currentUser.email,
      planId: planId,
      planName: plan.name,
      amount: amount,
      utrNumber: utrNumber,
      paymentMethod: paymentMethod,
      status: 'pending',
      createdAt: new Date().toISOString(),
    };

    this.adminSettings.paymentRequests.push(paymentRequest);
    this.logActivity('user_action', `Payment submitted: ₹${amount} for ${plan.name} plan`);
    this.notify();
    return paymentRequest;
  }

  // Admin: Approve Payment
  approvePayment(paymentId: string) {
    const payment = this.adminSettings.paymentRequests.find(p => p.id === paymentId);
    if (!payment) return false;

    payment.status = 'approved';
    payment.processedAt = new Date().toISOString();
    payment.processedBy = 'admin';

    // Find user and upgrade their plan
    const user = this.allUsers.find(u => u.id === payment.usersId);
    if (user) {
      const plan = this.plans.find(p => p.id === payment.planId);
      if (plan) {
        user.plan = payment.planId as User['plan'];
        user.messagesLimit = plan.messagesLimit;
        user.automationsLimit = plan.automationsLimit;
        user.contactsLimit = plan.contactsLimit;
      }
    }

    // Also update current user if it's them
    if (this.currentUser && this.currentUser.id === payment.usersId) {
      const plan = this.plans.find(p => p.id === payment.planId);
      if (plan) {
        this.currentUser.plan = payment.planId as User['plan'];
        this.currentUser.messagesLimit = plan.messagesLimit;
        this.currentUser.automationsLimit = plan.automationsLimit;
        this.currentUser.contactsLimit = plan.contactsLimit;
      }
    }

    this.logActivity('user_action', `Payment approved for ${payment.userName}: ${payment.planName}`);
    this.notify();
    return true;
  }

  // Admin: Reject Payment
  rejectPayment(paymentId: string, reason: string = 'Invalid UTR') {
    const payment = this.adminSettings.paymentRequests.find(p => p.id === paymentId);
    if (!payment) return false;

    payment.status = 'rejected';
    payment.processedAt = new Date().toISOString();
    payment.processedBy = 'admin';
    payment.rejectionReason = reason;

    // Reset user to free plan
    const user = this.allUsers.find(u => u.id === payment.usersId);
    if (user) {
      user.plan = 'free';
      user.messagesLimit = 100;
      user.automationsLimit = 3;
      user.contactsLimit = 50;
    }

    if (this.currentUser && this.currentUser.id === payment.usersId) {
      this.currentUser.plan = 'free';
      this.currentUser.messagesLimit = 100;
      this.currentUser.automationsLimit = 3;
      this.currentUser.contactsLimit = 50;
    }

    this.logActivity('user_action', `Payment rejected for ${payment.userName}: ${reason}`);
    this.notify();
    return true;
  }

  // Get user's pending payment
  getUserPendingPayment(): PaymentRequest | null {
    if (!this.currentUser) return null;
    return this.adminSettings.paymentRequests.find(
      p => p.usersId === this.currentUser?.id && p.status === 'pending'
    ) || null;
  }

  // Coupon System
  applyCoupon(couponCode: string): { success: boolean; message: string; planId?: string } {
    if (!this.currentUser) return { success: false, message: 'Not logged in' };

    const coupon = this.adminSettings.coupons.find(
      c => c.code.toUpperCase() === couponCode.toUpperCase() && c.isActive
    );

    if (!coupon) {
      return { success: false, message: 'Invalid coupon code' };
    }

    if (new Date(coupon.expiresAt) < new Date()) {
      return { success: false, message: 'Coupon has expired' };
    }

    if (coupon.usedCount >= coupon.usageLimit) {
      return { success: false, message: 'Coupon usage limit reached' };
    }

    // Apply coupon - upgrade user to the plan
    const plan = this.plans.find(p => p.id === coupon.planId);
    if (!plan) {
      return { success: false, message: 'Invalid coupon plan' };
    }

    // Update user
    this.currentUser.plan = coupon.planId as User['plan'];
    this.currentUser.messagesLimit = plan.messagesLimit;
    this.currentUser.automationsLimit = plan.automationsLimit;
    this.currentUser.contactsLimit = plan.contactsLimit;

    // Increment coupon usage
    coupon.usedCount++;

    this.logActivity('user_action', `Applied coupon ${couponCode}: Upgraded to ${plan.name}`);
    this.notify();

    return { success: true, message: `🎉 Congrats! Upgraded to ${plan.name} plan!`, planId: plan.id };
  }

  // Admin: Create Coupon
  createCoupon(code: string, planId: string, usageLimit: number, expiresAt: string) {
    const coupon: Coupon = {
      id: uuidv4(),
      code: code.toUpperCase(),
      planId,
      usageLimit,
      usedCount: 0,
      expiresAt,
      isActive: true,
      createdAt: new Date().toISOString(),
    };
    this.adminSettings.coupons.push(coupon);
    this.notify();
    return coupon;
  }

  // Admin: Delete Coupon
  deleteCoupon(couponId: string) {
    this.adminSettings.coupons = this.adminSettings.coupons.filter(c => c.id !== couponId);
    this.notify();
  }

  // Admin: Toggle Coupon
  toggleCoupon(couponId: string) {
    const coupon = this.adminSettings.coupons.find(c => c.id === couponId);
    if (coupon) {
      coupon.isActive = !coupon.isActive;
      this.notify();
    }
  }

  // Update payment settings
  updatePaymentSettings(upi: string, phone: string) {
    this.adminSettings.paymentUPI = upi;
    this.adminSettings.paymentPhone = phone;
    this.notify();
  }
}

export const store = new Store();
