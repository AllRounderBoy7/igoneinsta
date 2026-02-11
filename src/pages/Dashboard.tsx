import React, { useEffect } from 'react';
import * as LucideIcons from 'lucide-react';
import { useStore } from '../hooks/useStore';

export function Dashboard({ onNavigate }: { onNavigate: (p: string) => void }) {
  const store = useStore() as any;
  const user = store?.user;

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const authCode = urlParams.get('code');
    if (authCode && !user?.instagram_connected) {
      if (store?.connectInstagram) {
        store.connectInstagram("Connected Account", "token_" + authCode);
        window.history.replaceState({}, document.title, "/");
      }
    }
  }, [user, store]);

  if (!user?.instagram_connected) {
    return (
      <div className="flex items-center justify-center min-h-[60vh] p-4">
        <div className="bg-white p-8 rounded-3xl shadow-xl border border-gray-100 text-center max-w-sm w-full">
          <LucideIcons.Instagram size={50} className="mx-auto mb-4 text-blue-600" />
          <h2 className="text-xl font-bold mb-6">Connect Your Instagram</h2>
          <button 
            onClick={() => {
              const appId = '2436954916718675';
              const rUri = encodeURIComponent('https://igone.vercel.app/settings');
              window.location.href = `https://www.facebook.com/v18.0/dialog/oauth?client_id=${appId}&redirect_uri=${rUri}&scope=instagram_basic,instagram_manage_comments,instagram_manage_messages,pages_show_list,pages_read_engagement,public_profile&response_type=code`;
            }}
            className="w-full bg-blue-600 text-white py-3 rounded-xl font-bold shadow-lg"
          >
            Login with Messenger
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
        <h1 className="text-xl font-bold">Account: <span className="text-blue-600">@{user.username}</span></h1>
        <button onClick={() => onNavigate('automations')} className="bg-black text-white px-4 py-2 rounded-lg text-sm font-bold">+ New Bot</button>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded-xl border border-gray-100 shadow-sm">
          <LucideIcons.Send size={20} className="text-blue-500 mb-2" />
          <p className="text-2xl font-bold">{user.message_count || 0}</p>
          <p className="text-xs text-gray-400 font-bold uppercase">Messages</p>
        </div>
        <div className="bg-white p-4 rounded-xl border border-gray-100 shadow-sm">
          <LucideIcons.Bot size={20} className="text-purple-500 mb-2" />
          <p className="text-2xl font-bold">0</p>
          <p className="text-xs text-gray-400 font-bold uppercase">Bots</p>
        </div>
        <div className="bg-white p-4 rounded-xl border border-gray-100 shadow-sm">
          <LucideIcons.Users size={20} className="text-green-500 mb-2" />
          <p className="text-2xl font-bold">0</p>
          <p className="text-xs text-gray-400 font-bold uppercase">Leads</p>
        </div>
        <div className="bg-white p-4 rounded-xl border border-gray-100 shadow-sm">
          <LucideIcons.TrendingUp size={20} className="text-orange-500 mb-2" />
          <p className="text-2xl font-bold">0%</p>
          <p className="text-xs text-gray-400 font-bold uppercase">Growth</p>
        </div>
      </div>
    </div>
  );
}
