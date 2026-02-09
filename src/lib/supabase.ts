import { createClient } from '@supabase/supabase-js';

// Get credentials from environment variables (Vercel)
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || '';
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY || '';

// Validate environment variables
if (!supabaseUrl || !supabaseKey) {
  console.error('Missing Supabase environment variables. Please set VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY in Vercel.');
}

// Create Supabase client
export const supabase = createClient(supabaseUrl, supabaseKey);

// Database types
export interface DbUser {
  id: string;
  email: string;
  name: string;
  avatar: string;
  plan: 'free' | 'pro' | 'master' | 'legend';
  plan_interval: 'monthly' | 'yearly';
  plan_expires_at: string | null;
  instagram_connected: boolean;
  instagram_username: string | null;
  instagram_token: string | null;
  message_count: number;
  contact_count: number;
  automation_count: number;
  is_suspended: boolean;
  created_at: string;
  updated_at: string;
}

export interface DbAutomation {
  id: string;
  user_id: string;
  name: string;
  type: 'dm_reply' | 'comment_reply' | 'story_mention' | 'welcome';
  keywords: string[];
  response: string;
  post_url: string | null;
  reply_to_comment: boolean;
  send_dm: boolean;
  is_active: boolean;
  trigger_count: number;
  created_at: string;
  updated_at: string;
}

export interface DbContact {
  id: string;
  user_id: string;
  name: string;
  username: string;
  email: string | null;
  phone: string | null;
  tags: string[];
  instagram_id: string | null;
  last_interaction: string;
  created_at: string;
}

export interface DbFlow {
  id: string;
  user_id: string;
  name: string;
  steps: any[];
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface DbSequence {
  id: string;
  user_id: string;
  name: string;
  steps: any[];
  is_active: boolean;
  subscriber_count: number;
  created_at: string;
  updated_at: string;
}

export interface DbBroadcast {
  id: string;
  user_id: string;
  name: string;
  message: string;
  target_tags: string[];
  status: 'draft' | 'scheduled' | 'sending' | 'sent';
  scheduled_at: string | null;
  sent_count: number;
  total_count: number;
  created_at: string;
}

export interface DbGrowthTool {
  id: string;
  user_id: string;
  name: string;
  type: 'comment_trigger' | 'story_mention' | 'bio_link' | 'qr_code' | 'ref_link' | 'live_comment';
  config: any;
  is_active: boolean;
  clicks: number;
  conversions: number;
  created_at: string;
}

export interface DbPayment {
  id: string;
  user_id: string;
  user_email: string;
  user_name: string;
  plan: string;
  interval: 'monthly' | 'yearly';
  amount: number;
  utr: string;
  status: 'pending' | 'approved' | 'rejected';
  created_at: string;
  reviewed_at: string | null;
}

export interface DbCoupon {
  id: string;
  code: string;
  plan: string;
  max_uses: number;
  used_count: number;
  expires_at: string | null;
  is_active: boolean;
  created_at: string;
}

export interface DbPlatformSettings {
  id: string;
  upi_id: string;
  phone_number: string;
  maintenance_mode: boolean;
  registration_enabled: boolean;
  meta_app_id: string;
  meta_app_secret: string;
  plans: any;
  created_at: string;
  updated_at: string;
}

export interface DbActivity {
  id: string;
  user_id: string;
  type: string;
  message: string;
  metadata: any;
  created_at: string;
}

// Auth functions
export const auth = {
  signInWithGoogle: async () => {
    const { data, error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: window.location.origin + '/dashboard'
      }
    });
    if (error) throw error;
    return data;
  },

  signOut: async () => {
    const { error } = await supabase.auth.signOut();
    if (error) throw error;
  },

  getSession: async () => {
    const { data, error } = await supabase.auth.getSession();
    if (error) throw error;
    return data.session;
  },

  getUser: async () => {
    const { data, error } = await supabase.auth.getUser();
    if (error) throw error;
    return data.user;
  },

  onAuthStateChange: (callback: (event: string, session: any) => void) => {
    return supabase.auth.onAuthStateChange(callback);
  }
};

// Database functions
export const db = {
  // Users
  users: {
    get: async (id: string) => {
      const { data, error } = await supabase
        .from('users')
        .select('*')
        .eq('id', id)
        .single();
      if (error) throw error;
      return data as DbUser;
    },

    getByEmail: async (email: string) => {
      const { data, error } = await supabase
        .from('users')
        .select('*')
        .eq('email', email)
        .single();
      if (error && error.code !== 'PGRST116') throw error;
      return data as DbUser | null;
    },

    getAll: async () => {
      const { data, error } = await supabase
        .from('users')
        .select('*')
        .order('created_at', { ascending: false });
      if (error) throw error;
      return data as DbUser[];
    },

    create: async (user: Partial<DbUser>) => {
      const { data, error } = await supabase
        .from('users')
        .insert(user)
        .select()
        .single();
      if (error) throw error;
      return data as DbUser;
    },

    update: async (id: string, updates: Partial<DbUser>) => {
      const { data, error } = await supabase
        .from('users')
        .update({ ...updates, updated_at: new Date().toISOString() })
        .eq('id', id)
        .select()
        .single();
      if (error) throw error;
      return data as DbUser;
    },

    delete: async (id: string) => {
      const { error } = await supabase
        .from('users')
        .delete()
        .eq('id', id);
      if (error) throw error;
    },

    getStats: async () => {
      const { data, error } = await supabase
        .from('users')
        .select('plan, created_at');
      if (error) throw error;
      
      const total = data.length;
      const byPlan = data.reduce((acc: Record<string, number>, u: { plan: string }) => {
        acc[u.plan] = (acc[u.plan] || 0) + 1;
        return acc;
      }, {});
      
      const today = new Date().toISOString().split('T')[0];
      const newToday = data.filter((u: { created_at: string }) => u.created_at.startsWith(today)).length;
      
      return { total, byPlan, newToday };
    }
  },

  // Automations
  automations: {
    getByUser: async (userId: string) => {
      const { data, error } = await supabase
        .from('automations')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false });
      if (error) throw error;
      return data as DbAutomation[];
    },

    create: async (automation: Partial<DbAutomation>) => {
      const { data, error } = await supabase
        .from('automations')
        .insert(automation)
        .select()
        .single();
      if (error) throw error;
      return data as DbAutomation;
    },

    update: async (id: string, updates: Partial<DbAutomation>) => {
      const { data, error } = await supabase
        .from('automations')
        .update({ ...updates, updated_at: new Date().toISOString() })
        .eq('id', id)
        .select()
        .single();
      if (error) throw error;
      return data as DbAutomation;
    },

    delete: async (id: string) => {
      const { error } = await supabase
        .from('automations')
        .delete()
        .eq('id', id);
      if (error) throw error;
    },

    incrementTrigger: async (id: string) => {
      const { error } = await supabase.rpc('increment_automation_trigger', { automation_id: id });
      if (error) throw error;
    }
  },

  // Contacts
  contacts: {
    getByUser: async (userId: string) => {
      const { data, error } = await supabase
        .from('contacts')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false });
      if (error) throw error;
      return data as DbContact[];
    },

    create: async (contact: Partial<DbContact>) => {
      const { data, error } = await supabase
        .from('contacts')
        .insert(contact)
        .select()
        .single();
      if (error) throw error;
      return data as DbContact;
    },

    update: async (id: string, updates: Partial<DbContact>) => {
      const { data, error } = await supabase
        .from('contacts')
        .update(updates)
        .eq('id', id)
        .select()
        .single();
      if (error) throw error;
      return data as DbContact;
    },

    delete: async (id: string) => {
      const { error } = await supabase
        .from('contacts')
        .delete()
        .eq('id', id);
      if (error) throw error;
    }
  },

  // Flows
  flows: {
    getByUser: async (userId: string) => {
      const { data, error } = await supabase
        .from('flows')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false });
      if (error) throw error;
      return data as DbFlow[];
    },

    create: async (flow: Partial<DbFlow>) => {
      const { data, error } = await supabase
        .from('flows')
        .insert(flow)
        .select()
        .single();
      if (error) throw error;
      return data as DbFlow;
    },

    update: async (id: string, updates: Partial<DbFlow>) => {
      const { data, error } = await supabase
        .from('flows')
        .update({ ...updates, updated_at: new Date().toISOString() })
        .eq('id', id)
        .select()
        .single();
      if (error) throw error;
      return data as DbFlow;
    },

    delete: async (id: string) => {
      const { error } = await supabase
        .from('flows')
        .delete()
        .eq('id', id);
      if (error) throw error;
    }
  },

  // Sequences
  sequences: {
    getByUser: async (userId: string) => {
      const { data, error } = await supabase
        .from('sequences')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false });
      if (error) throw error;
      return data as DbSequence[];
    },

    create: async (sequence: Partial<DbSequence>) => {
      const { data, error } = await supabase
        .from('sequences')
        .insert(sequence)
        .select()
        .single();
      if (error) throw error;
      return data as DbSequence;
    },

    update: async (id: string, updates: Partial<DbSequence>) => {
      const { data, error } = await supabase
        .from('sequences')
        .update({ ...updates, updated_at: new Date().toISOString() })
        .eq('id', id)
        .select()
        .single();
      if (error) throw error;
      return data as DbSequence;
    },

    delete: async (id: string) => {
      const { error } = await supabase
        .from('sequences')
        .delete()
        .eq('id', id);
      if (error) throw error;
    }
  },

  // Broadcasts
  broadcasts: {
    getByUser: async (userId: string) => {
      const { data, error } = await supabase
        .from('broadcasts')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false });
      if (error) throw error;
      return data as DbBroadcast[];
    },

    create: async (broadcast: Partial<DbBroadcast>) => {
      const { data, error } = await supabase
        .from('broadcasts')
        .insert(broadcast)
        .select()
        .single();
      if (error) throw error;
      return data as DbBroadcast;
    },

    update: async (id: string, updates: Partial<DbBroadcast>) => {
      const { data, error } = await supabase
        .from('broadcasts')
        .update(updates)
        .eq('id', id)
        .select()
        .single();
      if (error) throw error;
      return data as DbBroadcast;
    },

    delete: async (id: string) => {
      const { error } = await supabase
        .from('broadcasts')
        .delete()
        .eq('id', id);
      if (error) throw error;
    }
  },

  // Growth Tools
  growthTools: {
    getByUser: async (userId: string) => {
      const { data, error } = await supabase
        .from('growth_tools')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false });
      if (error) throw error;
      return data as DbGrowthTool[];
    },

    create: async (tool: Partial<DbGrowthTool>) => {
      const { data, error } = await supabase
        .from('growth_tools')
        .insert(tool)
        .select()
        .single();
      if (error) throw error;
      return data as DbGrowthTool;
    },

    update: async (id: string, updates: Partial<DbGrowthTool>) => {
      const { data, error } = await supabase
        .from('growth_tools')
        .update(updates)
        .eq('id', id)
        .select()
        .single();
      if (error) throw error;
      return data as DbGrowthTool;
    },

    delete: async (id: string) => {
      const { error } = await supabase
        .from('growth_tools')
        .delete()
        .eq('id', id);
      if (error) throw error;
    }
  },

  // Payments
  payments: {
    getAll: async () => {
      const { data, error } = await supabase
        .from('payments')
        .select('*')
        .order('created_at', { ascending: false });
      if (error) throw error;
      return data as DbPayment[];
    },

    getByUser: async (userId: string) => {
      const { data, error } = await supabase
        .from('payments')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false });
      if (error) throw error;
      return data as DbPayment[];
    },

    create: async (payment: Partial<DbPayment>) => {
      const { data, error } = await supabase
        .from('payments')
        .insert(payment)
        .select()
        .single();
      if (error) throw error;
      return data as DbPayment;
    },

    update: async (id: string, updates: Partial<DbPayment>) => {
      const { data, error } = await supabase
        .from('payments')
        .update({ ...updates, reviewed_at: new Date().toISOString() })
        .eq('id', id)
        .select()
        .single();
      if (error) throw error;
      return data as DbPayment;
    },

    getStats: async () => {
      const { data, error } = await supabase
        .from('payments')
        .select('amount, status');
      if (error) throw error;
      
      const approved = data.filter((p: { status: string }) => p.status === 'approved');
      const pending = data.filter((p: { status: string }) => p.status === 'pending');
      
      return {
        totalRevenue: approved.reduce((sum: number, p: { amount: number }) => sum + p.amount, 0),
        pendingAmount: pending.reduce((sum: number, p: { amount: number }) => sum + p.amount, 0),
        pendingCount: pending.length
      };
    }
  },

  // Coupons
  coupons: {
    getAll: async () => {
      const { data, error } = await supabase
        .from('coupons')
        .select('*')
        .order('created_at', { ascending: false });
      if (error) throw error;
      return data as DbCoupon[];
    },

    getByCode: async (code: string) => {
      const { data, error } = await supabase
        .from('coupons')
        .select('*')
        .eq('code', code.toUpperCase())
        .single();
      if (error && error.code !== 'PGRST116') throw error;
      return data as DbCoupon | null;
    },

    create: async (coupon: Partial<DbCoupon>) => {
      const { data, error } = await supabase
        .from('coupons')
        .insert({ ...coupon, code: coupon.code?.toUpperCase() })
        .select()
        .single();
      if (error) throw error;
      return data as DbCoupon;
    },

    update: async (id: string, updates: Partial<DbCoupon>) => {
      const { data, error } = await supabase
        .from('coupons')
        .update(updates)
        .eq('id', id)
        .select()
        .single();
      if (error) throw error;
      return data as DbCoupon;
    },

    delete: async (id: string) => {
      const { error } = await supabase
        .from('coupons')
        .delete()
        .eq('id', id);
      if (error) throw error;
    },

    use: async (id: string) => {
      const { error } = await supabase.rpc('use_coupon', { coupon_id: id });
      if (error) throw error;
    }
  },

  // Platform Settings
  settings: {
    get: async () => {
      const { data, error } = await supabase
        .from('platform_settings')
        .select('*')
        .single();
      if (error && error.code !== 'PGRST116') throw error;
      return data as DbPlatformSettings | null;
    },

    update: async (updates: Partial<DbPlatformSettings>) => {
      const { data: existing } = await supabase
        .from('platform_settings')
        .select('id')
        .single();

      if (existing) {
        const { data, error } = await supabase
          .from('platform_settings')
          .update({ ...updates, updated_at: new Date().toISOString() })
          .eq('id', existing.id)
          .select()
          .single();
        if (error) throw error;
        return data as DbPlatformSettings;
      } else {
        const { data, error } = await supabase
          .from('platform_settings')
          .insert(updates)
          .select()
          .single();
        if (error) throw error;
        return data as DbPlatformSettings;
      }
    }
  },

  // Activity Log
  activity: {
    getByUser: async (userId: string, limit = 50) => {
      const { data, error } = await supabase
        .from('activity_log')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false })
        .limit(limit);
      if (error) throw error;
      return data as DbActivity[];
    },

    getAll: async (limit = 100) => {
      const { data, error } = await supabase
        .from('activity_log')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(limit);
      if (error) throw error;
      return data as DbActivity[];
    },

    create: async (activity: Partial<DbActivity>) => {
      const { error } = await supabase
        .from('activity_log')
        .insert(activity);
      if (error) throw error;
    }
  },

  // Real-time subscriptions
  subscribe: {
    toUsers: (callback: (payload: any) => void) => {
      return supabase
        .channel('users-changes')
        .on('postgres_changes', { event: '*', schema: 'public', table: 'users' }, callback)
        .subscribe();
    },

    toPayments: (callback: (payload: any) => void) => {
      return supabase
        .channel('payments-changes')
        .on('postgres_changes', { event: '*', schema: 'public', table: 'payments' }, callback)
        .subscribe();
    },

    toCoupons: (callback: (payload: any) => void) => {
      return supabase
        .channel('coupons-changes')
        .on('postgres_changes', { event: '*', schema: 'public', table: 'coupons' }, callback)
        .subscribe();
    },

    toSettings: (callback: (payload: any) => void) => {
      return supabase
        .channel('settings-changes')
        .on('postgres_changes', { event: '*', schema: 'public', table: 'platform_settings' }, callback)
        .subscribe();
    }
  }
};

export default supabase;
