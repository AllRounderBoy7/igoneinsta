import React, { useEffect } from 'react';
import { useStore } from '../hooks/useStore';
import { 
  Bot, Users, Send, TrendingUp, Instagram, 
  MessageCircle, ExternalLink, Sparkles 
} from 'lucide-react';

interface DashboardProps {
  onNavigate: (page: string) => void;
}

export function Dashboard({ onNavigate }: DashboardProps) {
  // Store se data nikalte waqt safety check
  const storeData = useStore();
  
  const user = storeData?.user;
  const automations = storeData?.automations || [];
  const contacts = storeData?.contacts || [];
  const flows = storeData?.flows || [];
  const connectInstagram = storeData?.connectInstagram;

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const urlParams = new URLSearchParams(window.location.search);
      const authCode = urlParams.get('code');

      if (authCode && (!user || !user.instagram_connected)) {
        if (connectInstagram) {
          connectInstagram("Instagram User", "temp_token_" + authCode);
          // Clean URL
          window.history.replaceState({}, document.title, "/");
        }
      }
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

  // Build safe conditional rendering
  if (!user?.instagram_connected) {
    return (
      <div className="max-w-2xl mx-auto mt-12 px-4">
        <div className="bg-white rounded-3xl shadow-xl p-8 text-center border border-gray-100">
          <div className="w-20 h-20 rounded-2xl bg-blue-600 flex items-center justify-center mx-auto mb-6 shadow-lg">
            <MessageCircle size={40} className="text-white" />
          </div>
          <h2 className="text-3xl font-black text-gray-900 mb-4">Final Step! 🚀</h2>
          <p className="text-gray-500 mb-8">Green signal mil gaya hai! Bas account link karo.</p>
          <button
            onClick={handleConnectMessenger}
            className="inline-flex items-center gap-3 px-8 py-4 bg-blue-600 text-white rounded-2xl font-bold text-lg hover:bg-blue-700 transition-all shadow-lg"
          >
            <Instagram size={24} />
            Connect with Messenger
            <ExternalLink size={18} />
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8 p-4">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <h1 className="text-3xl font-black text-gray-900">Dashboard Live 🟢</h1>
        <button 
          onClick={() => onNavigate('automations')}
          className="bg-black text-white px-6 py-3 rounded-xl font-bold"
        >
          + New Bot
        </button>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <StatCard label="Messages" val={user?.message_count || 0} Icon={Send} color="text-blue-500" />
        <StatCard label="Bots" val={automations.length} Icon={Bot} color="text-purple-500" />
        <StatCard label="Contacts" val={contacts.length} Icon={Users} color="text-green-500" />
        <StatCard label="Flows" val={flows.length} Icon={TrendingUp} color="text-orange-500" />
      </div>
    </div>
  );
}

// Separate component to keep main code clean and build-safe
function StatCard({ label, val, Icon, color }: { label: string, val: number, Icon: any, color: string }) {
  return (
    <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm">
      <Icon className={`${color} mb-2`} size={20} />
      <p className="text-2xl font-black">{val}</p>
      <p className="text-[10px] text-gray-400 font-bold uppercase">{label}</p>
    </div>
  );
}
