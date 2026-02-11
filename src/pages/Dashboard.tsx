import React, { useEffect } from 'react';
import * as LucideIcons from 'lucide-react';
import { useStore } from '../hooks/useStore';

export function Dashboard({ onNavigate }: { onNavigate: (p: string) => void }) {
  const { store, user, automations, contacts } = useStore() as any;

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const authCode = urlParams.get('code');
    if (authCode && !user?.instagram_connected) {
      store.connectInstagram("Connected Account", "token_" + authCode);
      window.history.replaceState({}, document.title, "/");
    }
  }, [user, store]);

  // Login Screen (Agar connect nahi hai)
  if (!user?.instagram_connected) {
    return (
      <div className="flex items-center justify-center min-h-[70vh] px-4">
        <div className="bg-white p-10 rounded-[2.5rem] shadow-2xl border border-gray-100 text-center max-w-sm w-full">
          <div className="w-20 h-20 bg-gradient-to-tr from-pink-500 to-yellow-500 rounded-3xl flex items-center justify-center mx-auto mb-6 shadow-lg">
            <LucideIcons.Instagram size={40} className="text-white" />
          </div>
          <h2 className="text-2xl font-black text-gray-900 mb-2">Connect Instagram</h2>
          <p className="text-gray-500 mb-8 text-sm">Apne account ko link karein aur automation chalu karein.</p>
          <button 
            onClick={() => {
              const appId = '2436954916718675';
              const rUri = encodeURIComponent('https://igone.vercel.app/settings');
              window.location.href = `https://www.facebook.com/v18.0/dialog/oauth?client_id=${appId}&redirect_uri=${rUri}&scope=instagram_basic,instagram_manage_comments,instagram_manage_messages,pages_show_list,pages_read_engagement,public_profile&response_type=code`;
            }}
            className="w-full bg-blue-600 text-white py-4 rounded-2xl font-black shadow-xl hover:bg-blue-700 transition-all"
          >
            Login with Messenger
          </button>
        </div>
      </div>
    );
  }

  // Real Dashboard (Connected State)
  return (
    <div className="max-w-6xl mx-auto p-6 space-y-8">
      <div className="flex justify-between items-center bg-white p-6 rounded-[2rem] shadow-sm border border-gray-100">
        <div>
          <h1 className="text-xl font-black uppercase tracking-tight">Account: <span className="text-blue-600">@{user.username || 'Connected'}</span></h1>
          <p className="text-xs font-bold text-green-500 flex items-center gap-1">
            <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span> System Live
          </p>
        </div>
        <button onClick={() => onNavigate('automations')} className="bg-black text-white px-6 py-3 rounded-2xl font-bold text-sm hover:scale-105 transition-transform">
          + New Bot
        </button>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
        <StatCard Icon={LucideIcons.Send} label="DMs Sent" value={user.message_count || 0} color="text-blue-500" />
        <StatCard Icon={LucideIcons.Bot} label="Active Bots" value={automations.length} color="text-purple-500" />
        <StatCard Icon={LucideIcons.Users} label="Total Leads" value={contacts.length} color="text-green-500" />
        <StatCard Icon={LucideIcons.TrendingUp} label="Growth" value="0%" color="text-orange-500" />
      </div>
    </div>
  );
}

function StatCard({ Icon, label, value, color }: any) {
  return (
    <div className="bg-white p-6 rounded-[2rem] border border-gray-100 shadow-sm hover:shadow-md transition-shadow">
      <Icon size={24} className={`${color} mb-4`} />
      <p className="text-3xl font-black text-gray-900">{value}</p>
      <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">{label}</p>
    </div>
  );
}
