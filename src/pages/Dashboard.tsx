import React from 'react';
import { useStore } from '../hooks/useStore';
import { Bot, Users, Send, TrendingUp, Instagram, MessageCircle, ExternalLink, Zap, Sparkles } from 'lucide-react';

interface DashboardProps {
  onNavigate: (page: string) => void;
}

export function Dashboard({ onNavigate }: DashboardProps) {
  const { user, automations, contacts, flows } = useStore();

  // Yahi function hai jo ab Green Link ke saath connect karega
  const handleConnectMessenger = () => {
    const appId = '2436954916718675';
    const redirectUri = 'https://igone.vercel.app/settings'; // EXACT MATCH (GREEN WALA)
    
    const scope = [
      'instagram_basic',
      'instagram_manage_comments',
      'instagram_manage_messages',
      'pages_show_list',
      'pages_read_engagement',
      'public_profile'
    ].join(',');

    const authUrl = `https://www.facebook.com/v18.0/dialog/oauth?client_id=${appId}&redirect_uri=${encodeURIComponent(redirectUri)}&scope=${scope}&response_type=code`;
    
    console.log('🚀 Redirecting to Meta Auth...');
    window.location.href = authUrl;
  };

  // 1. AGAR CONNECT NAHI HAI TOH YE DIKHEGA
  if (!user?.instagram_connected) {
    return (
      <div className="max-w-2xl mx-auto mt-8">
        <div className="bg-white rounded-3xl shadow-xl p-8 md:p-12 text-center border border-gray-100 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-40 h-40 bg-blue-50 rounded-full blur-3xl"></div>
          <div className="absolute bottom-0 left-0 w-40 h-40 bg-purple-50 rounded-full blur-3xl"></div>
          
          <div className="relative z-10">
            <div className="w-24 h-24 rounded-3xl bg-gradient-to-br from-blue-600 to-purple-600 flex items-center justify-center mx-auto mb-6 shadow-2xl">
              <MessageCircle size={42} className="text-white" />
            </div>
            <h2 className="text-2xl md:text-3xl font-black text-gray-900 mb-3">Connect Messenger API 💬</h2>
            <p className="text-gray-500 mb-8 max-w-md mx-auto leading-relaxed">
              Validator Green ho gaya hai! Ab bas ek click mein apna Instagram Business account connect karein.
              <span className="block mt-2 text-sm text-blue-600 font-bold">Meta Approved Redirect Active ✅</span>
            </p>
            <button
              onClick={handleConnectMessenger}
              className="inline-flex items-center gap-3 px-10 py-4 bg-blue-600 text-white rounded-2xl font-bold text-lg shadow-xl shadow-blue-200 hover:bg-blue-700 hover:-translate-y-1 transition-all"
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

  // 2. AGAR CONNECT HAI TOH YE DASHBOARD DIKHEGA
  const activeAutomations = automations.filter(a => a.is_active).length;

  return (
    <div className="space-y-6 p-4">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-black text-gray-900 flex items-center gap-2">
            👋 Welcome, {user?.name || 'User'}!
          </h1>
          <p className="text-gray-500 mt-1">Your Instagram automation is active and running.</p>
        </div>
        <button 
          onClick={() => onNavigate('automations')} 
          className="bg-gradient-to-r from-purple-600 to-blue-600 text-white px-6 py-3 rounded-xl font-bold text-sm shadow-lg hover:shadow-xl transition-all"
        >
          + Create New Bot
        </button>
      </div>

      {/* Stats Section */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { title: 'Messages', value: user?.message_count || 0, icon: Send, color: 'bg-blue-500' },
          { title: 'Active Bots', value: activeAutomations, icon: Bot, color: 'bg-purple-500' },
          { title: 'Contacts', value: contacts.length, icon: Users, color: 'bg-green-500' },
          { title: 'Flows', value: flows.length, icon: TrendingUp, color: 'bg-orange-500' },
        ].map((stat, i) => (
          <div key={i} className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm">
            <div className={`w-10 h-10 rounded-xl ${stat.color} flex items-center justify-center mb-4 text-white shadow-md`}>
              <stat.icon size={20} />
            </div>
            <p className="text-2xl font-black text-gray-900">{stat.value}</p>
            <p className="text-xs text-gray-400 font-bold uppercase tracking-widest">{stat.title}</p>
          </div>
        ))}
      </div>

      {/* Quick Actions */}
      <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm">
        <h3 className="font-bold text-gray-900 mb-4 flex items-center gap-2">
          <Sparkles size={18} className="text-blue-600" /> Quick Management
        </h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {['automations', 'contacts', 'analytics', 'settings'].map((page) => (
            <button 
              key={page} 
              onClick={() => onNavigate(page)} 
              className="p-4 rounded-xl border border-gray-100 hover:bg-blue-50 hover:border-blue-200 transition-all text-xs font-bold text-gray-600 uppercase"
            >
              Go to {page}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
