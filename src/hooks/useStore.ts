import React, { useEffect } from 'react';
import { useStore } from '../hooks/useStore';
import { Bot, Users, Send, TrendingUp, Instagram, MessageCircle, ExternalLink, Zap, Sparkles } from 'lucide-react';

interface DashboardProps {
  onNavigate: (page: string) => void;
}

export function Dashboard({ onNavigate }: DashboardProps) {
  // useStore se zaroori cheezein nikaali
  const { 
    user, 
    automations, 
    contacts, 
    flows, 
    connectInstagram, // Tera existing method
    updateUser 
  } = useStore();

  useEffect(() => {
    // 1. URL se code pakadne ka logic
    const urlParams = new URLSearchParams(window.location.search);
    const authCode = urlParams.get('code');

    if (authCode && !user?.instagram_connected) {
      console.log("✅ Meta Auth Code Mil Gaya!");
      
      // 2. Store ko update karna (Fake data ke saath connection simulate kar rahe hain)
      // Asliyat mein yahan backend call honi chahiye, par kaam chalane ke liye:
      connectInstagram("Insta_User", "mock_token_" + authCode);
      
      // Dashboard ko fresh dikhane ke liye URL saaf kar do
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

  // --- UI START ---

  // Agar connect nahi hai
  if (!user?.instagram_connected) {
    return (
      <div className="max-w-2xl mx-auto mt-8">
        <div className="bg-white rounded-3xl shadow-xl p-8 md:p-12 text-center border border-gray-100 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-40 h-40 bg-blue-50 rounded-full blur-3xl"></div>
          <div className="relative z-10">
            <div className="w-24 h-24 rounded-3xl bg-gradient-to-br from-blue-600 to-purple-600 flex items-center justify-center mx-auto mb-6 shadow-2xl">
              <MessageCircle size={42} className="text-white" />
            </div>
            <h2 className="text-2xl md:text-3xl font-black text-gray-900 mb-3">Almost There! 🚀</h2>
            <p className="text-gray-500 mb-8">Click below to finalize your Instagram connection.</p>
            <button
              onClick={handleConnectMessenger}
              className="inline-flex items-center gap-3 px-10 py-4 bg-blue-600 text-white rounded-2xl font-bold text-lg shadow-xl hover:bg-blue-700 transition-all"
            >
              <Instagram size={24} />
              Connect with Messenger
              <ExternalLink size={18} />
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Agar connect ho gaya (Real Dashboard)
  return (
    <div className="space-y-6 p-4">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-black text-gray-900">🚀 Dashboard Live</h1>
          <p className="text-sm text-green-600 font-bold">● Connected to Instagram</p>
        </div>
        <button 
          onClick={() => onNavigate('automations')}
          className="bg-blue-600 text-white px-4 py-2 rounded-xl text-sm font-bold shadow-lg"
        >
          + New Bot
        </button>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm">
          <Send className="text-blue-500 mb-2" size={20} />
          <p className="text-2xl font-black">{user?.message_count || 0}</p>
          <p className="text-[10px] text-gray-400 font-bold uppercase">Messages</p>
        </div>
        <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm">
          <Bot className="text-purple-500 mb-2" size={20} />
          <p className="text-2xl font-black">{automations.length}</p>
          <p className="text-[10px] text-gray-400 font-bold uppercase">Bots</p>
        </div>
        <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm">
          <Users className="text-green-500 mb-2" size={20} />
          <p className="text-2xl font-black">{contacts.length}</p>
          <p className="text-[10px] text-gray-400 font-bold uppercase">Contacts</p>
        </div>
        <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm">
          <TrendingUp className="text-orange-500 mb-2" size={20} />
          <p className="text-2xl font-black">{flows.length}</p>
          <p className="text-[10px] text-gray-400 font-bold uppercase">Flows</p>
        </div>
      </div>

      <div className="bg-white rounded-2xl p-6 border border-gray-100 text-center">
        <h3 className="font-bold text-gray-800 mb-2">Ready to grow?</h3>
        <p className="text-sm text-gray-500 mb-4">Create your first automated reply for Instagram.</p>
        <button 
          onClick={() => onNavigate('automations')}
          className="px-6 py-2 bg-gray-900 text-white rounded-lg text-sm font-bold"
        >
          Setup Auto-Reply
        </button>
      </div>
    </div>
  );
}
