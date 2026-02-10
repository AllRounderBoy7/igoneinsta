import React, { useEffect } from 'react';
import { useStore } from '../hooks/useStore';
import { Bot, Users, Send, TrendingUp, Instagram, MessageCircle, ExternalLink, Zap, Sparkles } from 'lucide-react';

interface DashboardProps {
  onNavigate: (page: string) => void;
}

export function Dashboard({ onNavigate }: DashboardProps) {
  const { user, automations, contacts, flows, setUser } = useStore(); // setUser ko store se nikalo

  // --- YE NAYA LOGIC HAI ---
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const authCode = urlParams.get('code');

    if (authCode) {
      console.log("✅ Code mil gaya, connecting...");
      // Temporary connection simulate kar rahe hain taaki dashboard dikhe
      // Asli setup mein yahan backend call hoti hai
      if (setUser) {
        setUser({
          ...user,
          instagram_connected: true,
          name: "IG User", // Yahan user ka naam set ho jayega
          message_count: 0
        });
        // URL se kachra saaf karne ke liye
        window.history.replaceState({}, document.title, "/");
      }
    }
  }, []);
  // -------------------------

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

  // 1. Connection check logic
  if (!user?.instagram_connected) {
    return (
      <div className="max-w-2xl mx-auto mt-8">
        <div className="bg-white rounded-3xl shadow-xl p-8 md:p-12 text-center border border-gray-100 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-40 h-40 bg-blue-50 rounded-full blur-3xl"></div>
          <div className="relative z-10">
            <div className="w-24 h-24 rounded-3xl bg-gradient-to-br from-blue-600 to-purple-600 flex items-center justify-center mx-auto mb-6 shadow-2xl">
              <MessageCircle size={42} className="text-white" />
            </div>
            <h2 className="text-2xl md:text-3xl font-black text-gray-900 mb-3">Connect Messenger API 💬</h2>
            <p className="text-gray-500 mb-8">Click connect to authorize your account.</p>
            <button
              onClick={handleConnectMessenger}
              className="inline-flex items-center gap-3 px-10 py-4 bg-blue-600 text-white rounded-2xl font-bold text-lg shadow-xl hover:bg-blue-700 hover:-translate-y-1 transition-all"
            >
              <Instagram size={24} />
              Login with Messenger
              <ExternalLink size={18} />
            </button>
          </div>
        </div>
      </div>
    );
  }

  // 2. Connected Dashboard (Jo tum dekhna chahte ho)
  return (
    <div className="space-y-6 p-4">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-black text-gray-900">🚀 Dashboard Live</h1>
        <div className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-xs font-bold">● CONNECTED</div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm">
          <Send className="text-blue-500 mb-2" />
          <p className="text-2xl font-black">0</p>
          <p className="text-xs text-gray-400 font-bold">MESSAGES</p>
        </div>
        <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm">
          <Bot className="text-purple-500 mb-2" />
          <p className="text-2xl font-black">{automations.length}</p>
          <p className="text-xs text-gray-400 font-bold">ACTIVE BOTS</p>
        </div>
        <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm">
          <Users className="text-green-500 mb-2" />
          <p className="text-2xl font-black">{contacts.length}</p>
          <p className="text-xs text-gray-400 font-bold">CONTACTS</p>
        </div>
        <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm">
          <TrendingUp className="text-orange-500 mb-2" />
          <p className="text-2xl font-black">{flows.length}</p>
          <p className="text-xs text-gray-400 font-bold">FLOWS</p>
        </div>
      </div>

      <div className="bg-white rounded-2xl p-6 border border-gray-100">
        <h3 className="font-bold text-gray-900 mb-4 flex items-center gap-2">
          <Sparkles size={18} className="text-blue-600" /> Start Automating
        </h3>
        <button 
          onClick={() => onNavigate('automations')}
          className="w-full py-4 bg-gray-50 border-2 border-dashed border-gray-200 rounded-xl text-gray-500 font-bold hover:bg-blue-50 hover:border-blue-200 transition-all"
        >
          + Create your first DM Auto-Reply
        </button>
      </div>
    </div>
  );
}
