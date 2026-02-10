import React, { useEffect } from 'react';
import { useStore } from '../hooks/useStore';
import { 
  Bot, Users, Send, TrendingUp, Instagram, 
  MessageCircle, ExternalLink 
} from 'lucide-react';

interface DashboardProps {
  onNavigate: (page: string) => void;
}

export function Dashboard({ onNavigate }: DashboardProps) {
  // Store se data safely nikal rahe hain
  const store: any = useStore();
  
  const user = store?.user;
  const automations = store?.automations || [];
  const contacts = store?.contacts || [];
  const flows = store?.flows || [];

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const urlParams = new URLSearchParams(window.location.search);
      const authCode = urlParams.get('code');

      if (authCode && (!user || !user.instagram_connected)) {
        // connectInstagram ko safely call kar rahe hain
        if (store?.connectInstagram) {
          store.connectInstagram("Instagram User", "temp_token_" + authCode);
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

    const authUrl = `https://www.facebook.com/v18.0/dialog/oauth?client_id=${appId}&redirect_uri=${encodeURIComponent(redirectUri)}&scope=${scope}&response_type=code`;
    window.location.href = authUrl;
  };

  // Agar user connected nahi hai
  if (!user?.instagram_connected) {
    return (
      <div className="max-w-2xl mx-auto mt-12 px-4">
        <div className="bg-white rounded-3xl shadow-xl p-8 text-center border border-gray-100">
          <div className="w-20 h-20 rounded-2xl bg-blue-600 flex items-center justify-center mx-auto mb-6">
            <MessageCircle size={40} className="text-white" />
          </div>
          <h2 className="text-3xl font-black text-gray-900 mb-4">Connect Account 🚀</h2>
          <button
            onClick={handleConnectMessenger}
            className="inline-flex items-center gap-3 px-8 py-4 bg-blue-600 text-white rounded-2xl font-bold shadow-lg"
          >
            <Instagram size={24} />
            Login with Messenger
            <ExternalLink size={18} />
          </button>
        </div>
      </div>
    );
  }

  // Connected Dashboard
  return (
    <div className="space-y-8 p-4">
      <h1 className="text-3xl font-black text-gray-900">Dashboard Live 🟢</h1>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-white p-5 rounded-2xl border border-gray-100">
          <Send className="text-blue-500 mb-2" size={20} />
          <p className="text-2xl font-black">{user?.message_count || 0}</p>
          <p className="text-xs text-gray-400 font-bold uppercase">Messages</p>
        </div>
        <div className="bg-white p-5 rounded-2xl border border-gray-100">
          <Bot className="text-purple-500 mb-2" size={20} />
          <p className="text-2xl font-black">{automations.length}</p>
          <p className="text-xs text-gray-400 font-bold uppercase">Bots</p>
        </div>
        <div className="bg-white p-5 rounded-2xl border border-gray-100">
          <Users className="text-green-500 mb-2" size={20} />
          <p className="text-2xl font-black">{contacts.length}</p>
          <p className="text-xs text-gray-400 font-bold uppercase">Contacts</p>
        </div>
        <div className="bg-white p-5 rounded-2xl border border-gray-100">
          <TrendingUp className="text-orange-500 mb-2" size={20} />
          <p className="text-2xl font-black">{flows.length}</p>
          <p className="text-xs text-gray-400 font-bold uppercase">Flows</p>
        </div>
      </div>
    </div>
  );
}
