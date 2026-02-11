import React, { useState, useEffect } from 'react';
import * as LucideIcons from 'lucide-react';
import { store } from '../lib/store'; // Make sure this path to store.ts is correct

export function Dashboard({ onNavigate }: { onNavigate: (p: string) => void }) {
  // Hook ke bina direct store se state manage kar rahe hain build bachane ke liye
  const [user, setUser] = useState<any>(store.getUser());
  const [automations] = useState<any[]>(store.getAutomations() || []);
  const [contacts] = useState<any[]>(store.getContacts() || []);

  useEffect(() => {
    // Store updates ko sunne ke liye
    const unsub = store.subscribe(() => {
      setUser({ ...store.getUser() });
    });

    // Meta se wapas aane wala logic
    const urlParams = new URLSearchParams(window.location.search);
    const authCode = urlParams.get('code');
    
    if (authCode && !user?.instagram_connected) {
      if (store?.connectInstagram) {
        store.connectInstagram("Connected Account", "token_" + authCode);
        window.history.replaceState({}, document.title, "/");
      }
    }

    return () => unsub();
  }, [user]);

  const handleLogin = () => {
    const appId = '2436954916718675';
    const rUri = encodeURIComponent('https://igone.vercel.app/settings');
    window.location.href = `https://www.facebook.com/v18.0/dialog/oauth?client_id=${appId}&redirect_uri=${rUri}&scope=instagram_basic,instagram_manage_comments,instagram_manage_messages,pages_show_list,pages_read_engagement,public_profile&response_type=code`;
  };

  if (!user?.instagram_connected) {
    return (
      <div className="flex items-center justify-center min-h-[60vh] p-4">
        <div className="bg-white p-8 rounded-3xl shadow-xl border border-gray-100 text-center max-w-sm w-full">
          <LucideIcons.Instagram size={50} className="mx-auto mb-4 text-pink-600" />
          <h2 className="text-xl font-bold mb-6">Connect Your Instagram</h2>
          <button 
            onClick={handleLogin}
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
        <h1 className="text-xl font-bold tracking-tight">
          Account: <span className="text-blue-600">@{user.username || 'Connected'}</span>
        </h1>
        <button 
          onClick={() => onNavigate('automations')} 
          className="bg-black text-white px-4 py-2 rounded-lg text-sm font-bold"
        >
          + New Bot
        </button>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm">
          <LucideIcons.Send size={20} className="text-blue-500 mb-3" />
          <p className="text-3xl font-black">{user.message_count || 0}</p>
          <p className="text-[10px] font-bold text-gray-400 uppercase">Messages</p>
        </div>
        <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm">
          <LucideIcons.Bot size={20} className="text-purple-500 mb-3" />
          <p className="text-3xl font-black">{automations.length}</p>
          <p className="text-[10px] font-bold text-gray-400 uppercase">Active Bots</p>
        </div>
        <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm">
          <LucideIcons.Users size={20} className="text-green-500 mb-3" />
          <p className="text-3xl font-black">{contacts.length}</p>
          <p className="text-[10px] font-bold text-gray-400 uppercase">Total Leads</p>
        </div>
        <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm">
          <LucideIcons.TrendingUp size={20} className="text-orange-500 mb-3" />
          <p className="text-3xl font-black">0%</p>
          <p className="text-[10px] font-bold text-gray-400 uppercase">Growth</p>
        </div>
      </div>
    </div>
  );
}
