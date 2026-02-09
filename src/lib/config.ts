// Production Configuration - Using Environment Variables
export const CONFIG = {
  META_APP_ID: import.meta.env.VITE_META_APP_ID || '',
  META_APP_SECRET: '', // Never expose this in frontend
  SUPABASE_URL: import.meta.env.VITE_SUPABASE_URL || '',
  SUPABASE_KEY: import.meta.env.VITE_SUPABASE_ANON_KEY || '',
  ADMIN_PASSWORD: 'sameer3745', // This is okay to keep - it's just UI protection
  APP_NAME: 'IGOne',
  APP_VERSION: '2.0.0',
  INSTAGRAM_GRAPH_API: 'https://graph.instagram.com',
  META_GRAPH_API: 'https://graph.facebook.com/v18.0',
  OAUTH_REDIRECT_URI: typeof window !== 'undefined' ? `${window.location.origin}/auth/callback` : '',
  INSTAGRAM_PERMISSIONS: [
    'instagram_basic',
    'instagram_manage_messages',
    'instagram_manage_comments',
    'instagram_content_publish',
    'pages_show_list',
    'pages_messaging',
  ],
};

// Instagram API Helper
export const InstagramAPI = {
  getAuthURL: () => {
    const params = new URLSearchParams({
      client_id: CONFIG.META_APP_ID,
      redirect_uri: CONFIG.OAUTH_REDIRECT_URI,
      scope: CONFIG.INSTAGRAM_PERMISSIONS.join(','),
      response_type: 'code',
      state: crypto.randomUUID(),
    });
    return `https://www.facebook.com/v18.0/dialog/oauth?${params.toString()}`;
  },

  exchangeCodeForToken: async (code: string) => {
    try {
      const response = await fetch(`${CONFIG.META_GRAPH_API}/oauth/access_token`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          client_id: CONFIG.META_APP_ID,
          client_secret: CONFIG.META_APP_SECRET,
          redirect_uri: CONFIG.OAUTH_REDIRECT_URI,
          code,
          grant_type: 'authorization_code',
        }),
      });
      return await response.json();
    } catch (error) {
      console.error('Token exchange failed:', error);
      return null;
    }
  },

  getInstagramPages: async (accessToken: string) => {
    try {
      const response = await fetch(
        `${CONFIG.META_GRAPH_API}/me/accounts?fields=id,name,instagram_business_account{id,name,username,profile_picture_url,followers_count}&access_token=${accessToken}`
      );
      return await response.json();
    } catch (error) {
      console.error('Failed to get pages:', error);
      return null;
    }
  },

  getProfile: async (igUserId: string, accessToken: string) => {
    try {
      const response = await fetch(
        `${CONFIG.INSTAGRAM_GRAPH_API}/${igUserId}?fields=id,name,username,profile_picture_url,followers_count,follows_count,media_count&access_token=${accessToken}`
      );
      return await response.json();
    } catch (error) {
      console.error('Failed to get profile:', error);
      return null;
    }
  },

  sendMessage: async (igUserId: string, recipientId: string, message: string, accessToken: string) => {
    try {
      const response = await fetch(
        `${CONFIG.META_GRAPH_API}/${igUserId}/messages`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            recipient: { id: recipientId },
            message: { text: message },
            access_token: accessToken,
          }),
        }
      );
      return await response.json();
    } catch (error) {
      console.error('Failed to send message:', error);
      return null;
    }
  },

  replyToComment: async (commentId: string, message: string, accessToken: string) => {
    try {
      const response = await fetch(
        `${CONFIG.META_GRAPH_API}/${commentId}/replies`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            message,
            access_token: accessToken,
          }),
        }
      );
      return await response.json();
    } catch (error) {
      console.error('Failed to reply to comment:', error);
      return null;
    }
  },

  getConversations: async (igUserId: string, accessToken: string) => {
    try {
      const response = await fetch(
        `${CONFIG.META_GRAPH_API}/${igUserId}/conversations?fields=id,participants,messages{id,message,from,created_time}&access_token=${accessToken}`
      );
      return await response.json();
    } catch (error) {
      console.error('Failed to get conversations:', error);
      return null;
    }
  },

  getMedia: async (igUserId: string, accessToken: string) => {
    try {
      const response = await fetch(
        `${CONFIG.INSTAGRAM_GRAPH_API}/${igUserId}/media?fields=id,caption,media_type,media_url,thumbnail_url,timestamp,like_count,comments_count&access_token=${accessToken}`
      );
      return await response.json();
    } catch (error) {
      console.error('Failed to get media:', error);
      return null;
    }
  },

  setupWebhook: async (igUserId: string, accessToken: string, callbackUrl: string) => {
    try {
      const response = await fetch(
        `${CONFIG.META_GRAPH_API}/${igUserId}/subscribed_apps`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            subscribed_fields: ['messages', 'messaging_postbacks', 'messaging_optins', 'comments', 'mentions'],
            callback_url: callbackUrl,
            access_token: accessToken,
          }),
        }
      );
      return await response.json();
    } catch (error) {
      console.error('Failed to setup webhook:', error);
      return null;
    }
  },

  getLongLivedToken: async (shortToken: string) => {
    try {
      const response = await fetch(
        `${CONFIG.META_GRAPH_API}/oauth/access_token?grant_type=fb_exchange_token&client_id=${CONFIG.META_APP_ID}&client_secret=${CONFIG.META_APP_SECRET}&fb_exchange_token=${shortToken}`
      );
      return await response.json();
    } catch (error) {
      console.error('Failed to get long-lived token:', error);
      return null;
    }
  },
};

// Supabase-like local storage wrapper (since we can't use real Supabase client in single-file build)
export const Database = {
  save: (key: string, data: unknown) => {
    try {
      localStorage.setItem(`igone_${key}`, JSON.stringify(data));
      return true;
    } catch {
      return false;
    }
  },

  load: <T>(key: string, fallback: T): T => {
    try {
      const data = localStorage.getItem(`igone_${key}`);
      return data ? JSON.parse(data) : fallback;
    } catch {
      return fallback;
    }
  },

  remove: (key: string) => {
    localStorage.removeItem(`igone_${key}`);
  },

  clear: () => {
    Object.keys(localStorage)
      .filter(k => k.startsWith('igone_'))
      .forEach(k => localStorage.removeItem(k));
  },
};

// Google OAuth
export const GoogleAuth = {
  signIn: () => {
    // In production, this would use Google OAuth
    // For now, we simulate with localStorage persistence
    const userData = {
      id: crypto.randomUUID(),
      email: 'user@gmail.com',
      name: 'Instagram User',
      avatar: '',
      provider: 'google',
      createdAt: new Date().toISOString(),
    };
    Database.save('auth_user', userData);
    return userData;
  },

  getUser: () => {
    return Database.load('auth_user', null);
  },

  signOut: () => {
    Database.remove('auth_user');
    Database.remove('user_data');
    Database.remove('automations');
    Database.remove('contacts');
    Database.remove('broadcasts');
    Database.remove('sequences');
    Database.remove('growth_tools');
    Database.remove('instagram_token');
  },
};

// Automation Engine
export class AutomationEngine {
  private rules: Array<{
    id: string;
    keywords: string[];
    response: string;
    type: string;
    active: boolean;
  }> = [];

  loadRules(automations: Array<{ id: string; trigger: string; responses: Array<{ content: string }>; status: string; type: string }>) {
    this.rules = automations
      .filter(a => a.status === 'active')
      .map(a => ({
        id: a.id,
        keywords: a.trigger.replace('keyword:', '').split(',').map(k => k.trim().toLowerCase()),
        response: a.responses[0]?.content || '',
        type: a.type,
        active: true,
      }));
  }

  processMessage(message: string, senderName: string): { matched: boolean; response: string; automationId: string } | null {
    const lowerMsg = message.toLowerCase().trim();
    
    for (const rule of this.rules) {
      if (!rule.active) continue;
      
      for (const keyword of rule.keywords) {
        if (!keyword) continue;
        if (lowerMsg.includes(keyword) || lowerMsg === keyword) {
          const response = rule.response
            .replace(/\{\{name\}\}/g, senderName)
            .replace(/\{\{username\}\}/g, senderName.toLowerCase().replace(/\s+/g, '_'));
          
          return {
            matched: true,
            response,
            automationId: rule.id,
          };
        }
      }
    }
    
    return null;
  }

  processComment(comment: string, commenterName: string): { matched: boolean; dmResponse: string; commentReply: string; automationId: string } | null {
    const lowerComment = comment.toLowerCase().trim();
    
    for (const rule of this.rules) {
      if (!rule.active || (rule.type !== 'comment_reply' && rule.type !== 'keyword_trigger')) continue;
      
      for (const keyword of rule.keywords) {
        if (!keyword) continue;
        if (lowerComment.includes(keyword) || lowerComment === keyword) {
          const response = rule.response
            .replace(/\{\{name\}\}/g, commenterName)
            .replace(/\{\{username\}\}/g, commenterName.toLowerCase().replace(/\s+/g, '_'));
          
          return {
            matched: true,
            dmResponse: response,
            commentReply: `Thanks for your interest, @${commenterName}! 🎉 Check your DM!`,
            automationId: rule.id,
          };
        }
      }
    }
    
    return null;
  }
}

export const automationEngine = new AutomationEngine();
