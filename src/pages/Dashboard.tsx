import React, { useEffect } from 'react';
import * as LucideIcons from 'lucide-react';
import { useStore } from '../hooks/useStore';

interface DashboardProps {
  onNavigate: (page: string) => void;
}

export function Dashboard({ onNavigate }: DashboardProps) {
  // TypeScript ko bypass karne ke liye 'any' ka sahara
  const store = useStore() as any;
  
  const user = store?.user;
  const automations = store?.automations || [];
  const contacts = store?.contacts || [];
  const flows = store?.flows || [];

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const urlParams = new URLSearchParams(window.location.search);
      const authCode = urlParams.get('code');

      if (authCode && (!user || !user.instagram_connected)) {
        if (store?.connectInstagram) {
          store.connectInstagram("IG User", "token_" + authCode);
          window.history.replaceState({}, document.title, "/");
        }
      }
    }
  }, [user, store]);

  const handleConnectMessenger = () => {
    const appId = '2436954916718675';
    const redirectUri = 'https://igone.vercel.app/settings';
    const scope = ['instagram_basic', 'instagram_manage_comments', 'instagram_manage_messages', 'pages_show_list', 'pages_read_engagement', 'public_profile'].join(',');
    window.location.href = `https://www.facebook.com/v18.0/dialog/oauth?client_id=${appId}&redirect_uri=${encodeURIComponent(redirectUri)}&scope=${scope}&response_type=code`;
  };

  if (!user?.instagram_connected) {
    return (
      <div className="max-w-2xl mx-auto mt-12 px-4 text-center">
        <div className="bg-white rounded-3xl shadow-xl p-10 border border-gray-100">
          <div className="w-20 h-20 bg-blue-600 rounded-2xl flex items-center justify-center mx-auto mb-6">
            <LucideIcons.MessageCircle size={40} className="text-white" />
          </div>
          <h2 className="text-3xl font-black text-gray-900 mb-4">Connect Your Instagram 🚀</h2>
          <button
            onClick={handleConnectMessenger}
            className="inline-flex items-center gap-3 px-8 py-4 bg-blue-600 text-white rounded-2xl font-bold"
          >
            <LucideIcons.Instagram size={24} />
            Connect with Messenger
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8 p-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-black text-gray-900">Dashboard Live 🟢</h1>
        <button onClick={() => onNavigate('automations')} className="bg-black text-white px-6 py-2 rounded-xl font-bold">
          + New Bot
        </button>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
          <LucideIcons.Send className="text-blue-500 mb-2" size={24} />
          <p className="text-3xl font-black">{user?.message_count || 0}</p>
          <p className="text-xs text-gray-400 font-bold uppercase">Messages</p>
        </div>
        <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
          <LucideIcons.Bot className="text-purple-500 mb-2" size={24} />
          <p className="text-3xl font-black">{automations.length}</p>
          <p className="text-xs text-gray-400 font-bold uppercase">Bots</p>
        </div>
        <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
          <LucideIcons.Users className="text-green-500 mb-2" size={24} />
          <p className="text-3xl font-black">{contacts.length}</p>
          <p className="text-xs text-gray-400 font-bold uppercase">Contacts</p>
        </div>
        <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
          <LucideIcons.TrendingUp className="text-orange-500 mb-2" size={24} />
          <p className="text-3xl font-black">{flows.length}</p>
          <p className="text-xs text-gray-400 font-bold uppercase">Flows</p>
        </div>
      </div>
    </div>
  );
}
