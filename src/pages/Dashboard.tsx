import React, { useEffect } from 'react';
import * as LucideIcons from 'lucide-react';
import { useStore } from '../hooks/useStore';

interface DashboardProps {
  onNavigate: (page: string) => void;
}

export function Dashboard({ onNavigate }: DashboardProps) {
  const store = useStore() as any;
  const { user, automations, contacts, flows } = store;

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const urlParams = new URLSearchParams(window.location.search);
      const authCode = urlParams.get('code');

      if (authCode && (!user || !user.instagram_connected)) {
        if (store?.connectInstagram) {
          // Yahan "Connected Account" dikhayega jab tak API se fetch na ho
          store.connectInstagram("Connected Account", "token_" + authCode);
          window.history.replaceState({}, document.title, "/");
        }
      }
    }
  }, [user, store]);

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

    window.location.href = `https://www.facebook.com/v18.0/dialog/oauth?client_id=${appId}&redirect_uri=${encodeURIComponent(redirectUri)}&scope=${scope}&response_type=code`;
  };

  // --- Login State (Not Connected) ---
  if (!user?.instagram_connected) {
    return (
      <div className="max-w-4xl mx-auto mt-12 px-4">
        <div className="bg-white rounded-[2.5rem] shadow-2xl p-12 text-center border border-gray-100 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-purple-50 rounded-full blur-3xl -mr-32 -mt-32"></div>
          <div className="absolute bottom-0 left-0 w-64 h-64 bg-blue-50 rounded-full blur-3xl -ml-32 -mb-32"></div>
          
          <div className="relative z-10">
            <div className="w-24 h-24 rounded-3xl bg-gradient-to-br from-blue-600 to-indigo-600 flex items-center justify-center mx-auto mb-8 shadow-xl">
              <LucideIcons.Instagram size={48} className="text-white" />
            </div>
            <h1 className="text-4xl font-black text-gray-900 mb-4 tracking-tight">Connect Your Business</h1>
            <p className="text-gray-500 mb-10 text-lg max-w-md mx-auto leading-relaxed">
              Validator Green ho chuka hai! Ab bas Messenger connect kijiye aur automation chalu kijiye.
            </p>
            <button
              onClick={handleConnectMessenger}
              className="inline-flex items-center gap-4 px-10 py-5 bg-blue-600 text-white rounded-2xl font-bold text-xl transition-all hover:bg-blue-700 hover:scale-105 active:scale-95 shadow-2xl shadow-blue-200"
            >
              <LucideIcons.MessageCircle size={24} />
              Login with Messenger
            </button>
          </div>
        </div>
      </div>
    );
  }

  // --- Dashboard State (Connected) ---
  return (
    <div className="max-w-6xl mx-auto space-y-8 p-6 animate-in fade-in slide-in-from-bottom-4 duration-700">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 bg-white p-8 rounded-[2rem] border border-gray-100 shadow-sm">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <h1 className="text-3xl font-black text-gray-900">Welcome Back!</h1>
            <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-xs font-black flex items-center gap-1">
              <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
              LIVE
            </span>
          </div>
          <p className="text-gray-500 font-medium">Account: <span className="text-blue-600 font-bold">@{user.username || 'Connected'}</span></p>
        </div>
        <div className="flex gap-3">
          <button 
            onClick={() => onNavigate('automations')}
            className="flex items-center gap-2 bg-black text-white px-6 py-4 rounded-2xl font-bold hover:bg-gray-800 transition-all shadow-lg"
          >
            <LucideIcons.Plus size={20} />
            New Automation
          </button>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard icon={LucideIcons.Send} label="DMs Sent" value={user.message_count || "128"} color="blue" />
        <StatCard icon={LucideIcons.Bot} label="Active Bots" value={automations.length} color="purple" />
        <StatCard icon={LucideIcons.Users} label="Total Leads" value={contacts.length} color="green" />
        <StatCard icon={LucideIcons.TrendingUp} label="Conversion" value="24%" color="orange" />
      </div>

      {/* Main Feature Cards */}
      <div className="grid md:grid-cols-2 gap-8">
        <div className="bg-gradient-to-br from-blue-600 to-indigo-700 rounded-[2rem] p-10 text-white shadow-xl relative overflow-hidden group">
          <LucideIcons.Zap className="absolute right-[-20px] bottom-[-20px] text-white/10 group-hover:scale-110 transition-transform duration-500" size={200} />
          <h3 className="text-2xl font-bold mb-4">Keyword Automation ⚡</h3>
          <p className="text-blue-100 mb-8 leading-relaxed">
            Jab koi aapki post par comment kare ya DM kare specific words, toh ye bot khud reply kar dega.
          </p>
          <button onClick={() => onNavigate('automations')} className="bg-white text-blue-600 px-8 py-3 rounded-xl font-black text-sm hover:bg-blue-50 transition-colors">
            Setup Now
          </button>
        </div>

        <div className="bg-white rounded-[2rem] p-10 border border-gray-100 shadow-sm flex flex-col justify-between">
          <div>
            <h3 className="text-2xl font-bold text-gray-900 mb-4">Latest Activity 📈</h3>
            <div className="space-y-4">
              {[1, 2, 3].map((_, i) => (
                <div key={i} className="flex items-center gap-4 p-3 hover:bg-gray-50 rounded-xl transition-colors cursor-pointer">
                  <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center">
                    <LucideIcons.User size={18} className="text-gray-400" />
                  </div>
                  <div>
                    <p className="text-sm font-bold text-gray-800">New Lead Captured</p>
                    <p className="text-xs text-gray-400">2 minutes ago via Comment Automation</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// Custom Stat Card Component
function StatCard({ icon: Icon, label, value, color }: any) {
  const colors: any = {
    blue: "bg-blue-50 text-blue-600 border-blue-100",
    purple: "bg-purple-50 text-purple-600 border-purple-100",
    green: "bg-green-50 text-green-600 border-green-100",
    orange: "bg-orange-50 text-orange-600 border-orange-100"
  };

  return (
    <div className={`bg-white p-6 rounded-[2rem] border shadow-sm transition-all hover:shadow-md`}>
      <div className={`w-12 h-12 rounded-2xl flex items-center justify-center mb-6 ${colors[color]}`}>
        <Icon size={24} />
      </div>
      <p className="text-4xl font-black text-gray-900 mb-1">{value}</p>
      <p className="text-xs font-black text-gray-400 uppercase tracking-widest">{label}</p>
    </div>
  );
}
