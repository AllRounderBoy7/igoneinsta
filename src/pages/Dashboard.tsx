import React, { useEffect } from 'react';
import { useStore } from '../hooks/useStore'; // Tere folder structure ke hisab se
import { Bot, Users, Send, TrendingUp, Instagram, MessageCircle, ExternalLink, Sparkles } from 'lucide-react';

interface DashboardProps {
  onNavigate: (page: string) => void;
}

export function Dashboard({ onNavigate }: DashboardProps) {
  const { 
    user, 
    automations, 
    contacts, 
    flows, 
    connectInstagram 
  } = useStore();

  // --- Meta se wapas aane par connection check ---
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const authCode = urlParams.get('code');

    // Agar URL mein 'code' hai aur user abhi tak connected nahi dikh raha
    if (authCode && (!user || !user.instagram_connected)) {
      console.log("✅ OAuth Code detected! Syncing with store...");
      
      // Store ka method call kar rahe hain jo tune bheja tha
      // Ye user state ko 'connected: true' kar dega
      if (connectInstagram) {
        connectInstagram("Instagram User", "temp_token_" + authCode);
      }

      // URL se kachra (?code=...) hatane ke liye
      window.history.replaceState({}, document.title, "/");
    }
  }, [user, connectInstagram]);

  const handleConnectMessenger = () => {
    const appId = '2436954916718675';
    const redirectUri = 'https://igone.vercel.app/settings';
    
    const scope = [
      'instagram_basic',
      'instagram_manage_comments',
      'instagram_manage_messages',
      'pages_show_list',
      'pages_read_engagement',
      'public_profile'
    ].join(',');

    const authUrl = `https://www.facebook.com/v18.0/dialog/oauth?client_id=${appId}&redirect_uri=${encodeURIComponent(redirectUri)}&scope=${scope}&response_type=code`;
    
    window.location.href = authUrl;
  };

  // --- UI CONDITIONAL RENDERING ---

  if (!user?.instagram_connected) {
    return (
      <div className="max-w-2xl mx-auto mt-12">
        <div className="bg-white rounded-3xl shadow-2xl p-10 text-center border border-gray-100 relative overflow-hidden">
          <div className="absolute -top-10 -right-10 w-40 h-40 bg-blue-50 rounded-full blur-3xl"></div>
          
          <div className="relative z-10">
            <div className="w-20 h-20 rounded-2xl bg-gradient-to-tr from-blue-600 to-indigo-500 flex items-center justify-center mx-auto mb-6 shadow-lg">
              <MessageCircle size={40} className="text-white" />
            </div>
            <h2 className="text-3xl font-black text-gray-900 mb-4">Connect Instagram</h2>
            <p className="text-gray-500 mb-8 max-w-sm mx-auto">
              Validator green ho gaya hai! Ab bas login karke permissions allow kijiye.
            </p>
            
            <button
              onClick={handleConnectMessenger}
              className="group relative inline-flex items-center gap-3 px-8 py-4 bg-blue-600 text-white rounded-2xl font-bold text-lg transition-all hover:bg-blue-700 hover:-translate-y-1 active:scale-95 shadow-xl shadow-blue-200"
            >
              <Instagram size={24} />
              Login with Messenger
              <ExternalLink size={18} className="opacity-50 group-hover:opacity-100" />
            </button>
          </div>
        </div>
      </div>
    );
  }

  // --- AGAR CONNECTED HAI TOH YE DASHBOARD DIKHEGA ---
  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-black text-gray-900">Dashboard</h1>
          <div className="flex items-center gap-2 mt-1">
            <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
            <p className="text-sm font-bold text-green-600 uppercase tracking-wider">Instagram Connected</p>
          </div>
        </div>
        <button 
          onClick={() => onNavigate('automations')}
          className="bg-gray-900 text-white px-6 py-3 rounded-xl font-bold hover:bg-black transition-all shadow-lg"
        >
          + Create New Automation
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {[
          { label: 'Total DMs', val: user?.message_count || 0, icon: Send, color: 'text-blue-500', bg: 'bg-blue-50' },
          { label: 'Active Bots', val: automations.length, icon: Bot, color: 'text-purple-500', bg: 'bg-purple-50' },
          { label: 'Contacts', val: contacts.length, icon: Users, color: 'text-green-500', bg: 'bg-green-50' },
          { label: 'Flows', val: flows.length, icon: TrendingUp, color: 'text-orange-500', bg: 'bg-orange-50' },
        ].map((item, i) => (
          <div key={i} className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow">
            <div className={`w-12 h-12 ${item.bg} ${item.color} rounded-xl flex items-center justify-center mb-4`}>
              <item.icon size={24} />
            </div>
            <p className="text-3xl font-black text-gray-900">{item.val}</p>
            <p className="text-sm font-bold text-gray-400 uppercase tracking-tighter mt-1">{item.label}</p>
          </div>
        ))}
      </div>

      <div className="bg-gradient-to-r from-blue-600 to-indigo-600 rounded-3xl p-8 text-white relative overflow-hidden shadow-xl">
        <Sparkles className="absolute top-4 right-4 opacity-20" size={100} />
        <div className="relative z-10">
          <h3 className="text-xl font-bold mb-2">Automate your first reply ⚡</h3>
          <p className="opacity-90 mb-6 max-w-md">Comment "DEAL" on my post and I'll DM you the link - setup this in 2 minutes.</p>
          <button 
            onClick={() => onNavigate('automations')}
            className="bg-white text-blue-600 px-6 py-3 rounded-xl font-bold hover:bg-blue-50 transition-colors"
          >
            Get Started
          </button>
        </div>
      </div>
    </div>
  );
}
