import React, { useEffect, useState } from 'react';
import * as LucideIcons from 'lucide-react';
// Path ko dhyan se dekho - hum hooks folder se utha rahe hain
import { useStore } from '../hooks/useStore'; 

export function Dashboard({ onNavigate }: { onNavigate: (p: string) => void }) {
  // useStore se store object nikal rahe hain
  const { store } = useStore() as any;
  const [user, setUser] = useState(store?.getUser() || {});

  useEffect(() => {
    // UI update ke liye subscribe
    const unsub = store.subscribe(() => {
      setUser({ ...store.getUser() });
    });

    // Meta Redirect Logic
    const urlParams = new URLSearchParams(window.location.search);
    const authCode = urlParams.get('code');
    
    if (authCode && !user?.instagram_connected) {
      if (store?.connectInstagram) {
        store.connectInstagram("Connected Account", "token_" + authCode);
        window.history.replaceState({}, document.title, "/");
      }
    }

    return () => unsub();
  }, [user, store]);

  // Agar connect nahi hai
  if (!user?.instagram_connected) {
    return (
      <div className="flex items-center justify-center min-h-[60vh] p-4">
        <div className="bg-white p-10 rounded-[2.5rem] shadow-xl border border-gray-100 text-center max-w-sm w-full">
          <LucideIcons.Instagram size={50} className="mx-auto mb-4 text-pink-600" />
          <h2 className="text-2xl font-black mb-6">Connect Instagram</h2>
          <button 
            onClick={() => {
              const appId = '2436954916718675';
              const rUri = encodeURIComponent('https://igone.vercel.app/settings');
              window.location.href = `https://www.facebook.com/v18.0/dialog/oauth?client_id=${appId}&redirect_uri=${rUri}&scope=instagram_basic,instagram_manage_comments,instagram_manage_messages,pages_show_list,pages_read_engagement,public_profile&response_type=code`;
            }}
            className="w-full bg-blue-600 text-white py-4 rounded-2xl font-bold shadow-lg"
          >
            Connect Messenger
          </button>
        </div>
      </div>
    );
  }

  // Connected Dashboard
  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center bg-white p-6 rounded-3xl border border-gray-100 shadow-sm">
        <h1 className="text-xl font-black italic">Account: <span className="text-blue-600">@{user.username || 'Admin'}</span></h1>
        <button onClick={() => onNavigate('automations')} className="bg-black text-white px-5 py-2 rounded-xl font-bold">+ New Bot</button>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-white p-5 rounded-2xl border border-gray-100 text-center">
           <LucideIcons.Send size={20} className="mx-auto text-blue-500 mb-2" />
           <p className="text-2xl font-black">{user.message_count || 0}</p>
           <p className="text-[10px] font-bold text-gray-400 uppercase">DMs</p>
        </div>
        <div className="bg-white p-5 rounded-2xl border border-gray-100 text-center">
           <LucideIcons.Bot size={20} className="mx-auto text-purple-500 mb-2" />
           <p className="text-2xl font-black">{store.getAutomations?.().length || 0}</p>
           <p className="text-[10px] font-bold text-gray-400 uppercase">Bots</p>
        </div>
        <div className="bg-white p-5 rounded-2xl border border-gray-100 text-center">
           <LucideIcons.Users size={20} className="mx-auto text-green-500 mb-2" />
           <p className="text-2xl font-black">{store.getContacts?.().length || 0}</p>
           <p className="text-[10px] font-bold text-gray-400 uppercase">Leads</p>
        </div>
        <div className="bg-white p-5 rounded-2xl border border-gray-100 text-center">
           <LucideIcons.TrendingUp size={20} className="mx-auto text-orange-500 mb-2" />
           <p className="text-2xl font-black">0%</p>
           <p className="text-[10px] font-bold text-gray-400 uppercase">Growth</p>
        </div>
      </div>
    </div>
  );
}
