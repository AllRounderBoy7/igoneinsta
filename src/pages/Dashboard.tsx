import React from 'react';
import { useStore } from '../hooks/useStore';
import { Bot, Users, Send, TrendingUp, ArrowUpRight, Instagram, Zap, BarChart3, ChevronRight, BookOpen, Sparkles, ExternalLink } from 'lucide-react';

interface DashboardProps {
  onNavigate: (page: string) => void;
}

export function Dashboard({ onNavigate }: DashboardProps) {
  const { user, automations, contacts, flows, activities } = useStore();

  // Sabse Fast Connect Method - Direct Redirect
  const handleConnectInstagram = () => {
    const appId = '2436954916718675'; // Teri Sahi ID
    const redirectUri = encodeURIComponent('https://igone.vercel.app/settings');
    const scope = 'instagram_basic,instagram_manage_comments,instagram_manage_messages,pages_show_list,pages_read_engagement';
    
    // Direct URL jo turant khulega
    const authUrl = `https://www.facebook.com/v18.0/dialog/oauth?client_id=${appId}&redirect_uri=${redirectUri}&scope=${scope}&response_type=code`;
    
    console.log('🚀 Connecting to Instagram...');
    window.location.href = authUrl;
  };

  // 1. Agar connect nahi hai toh ye dikhao
  if (!user?.instagram_connected) {
    return (
      <div className="max-w-2xl mx-auto mt-8">
        <div className="bg-white rounded-3xl shadow-xl p-8 md:p-12 text-center border border-gray-100 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-40 h-40 bg-purple-50 rounded-full blur-3xl"></div>
          <div className="absolute bottom-0 left-0 w-40 h-40 bg-pink-50 rounded-full blur-3xl"></div>
          <div className="relative z-10">
            <div className="w-24 h-24 rounded-3xl bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center mx-auto mb-6 shadow-2xl shadow-purple-200">
              <Instagram size={42} className="text-white" />
            </div>
            <h2 className="text-2xl md:text-3xl font-black text-gray-900 mb-3">Connect Your Instagram 📱</h2>
            <p className="text-gray-500 mb-8 max-w-md mx-auto leading-relaxed">
              Link your Instagram Business account to start automating.
              <span className="block mt-2 text-sm text-purple-600 font-medium">Fast Connect Mode Active! 🚀</span>
            </p>
            <button
              onClick={handleConnectInstagram}
              className="inline-flex items-center gap-3 px-8 py-4 bg-gradient-to-r from-purple-600 to-pink-500 text-white rounded-2xl font-bold text-base shadow-xl shadow-purple-200 hover:shadow-2xl transition-all hover:-translate-y-1 active:translate-y-0"
            >
              <Instagram size={22} />
              Connect Instagram Now
              <ExternalLink size={18} />
            </button>
          </div>
        </div>
      </div>
    );
  }

  // 2. Agar connect hai toh asli Dashboard
  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-black text-gray-900 flex items-center gap-2">
            👋 Welcome, {user?.name || 'User'}!
          </h1>
          <p className="text-gray-500 mt-1 text-sm">Your automation is running smoothly.</p>
        </div>
        <button onClick={() => onNavigate('automations')} className="bg-gradient-to-r from-purple-600 to-pink-500 text-white px-5 py-2.5 rounded-xl font-bold text-sm shadow-lg hover:-translate-y-1 transition-all">
          + New Automation
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { title: 'Messages', value: user?.message_count || 0, icon: Send, color: 'from-blue-500 to-cyan-400' },
          { title: 'Bots', value: automations.length, icon: Bot, color: 'from-purple-500 to-pink-500' },
          { title: 'Contacts', value: contacts.length, icon: Users, color: 'from-green-500 to-emerald-400' },
          { title: 'Flows', value: flows.length, icon: TrendingUp, color: 'from-orange-500 to-amber-400' },
        ].map((stat, i) => (
          <div key={i} className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm transition-all hover:shadow-md">
            <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${stat.color} flex items-center justify-center mb-4 text-white`}>
              <stat.icon size={20} />
            </div>
            <p className="text-2xl font-black text-gray-900">{stat.value}</p>
            <p className="text-xs text-gray-400 font-bold uppercase">{stat.title}</p>
          </div>
        ))}
      </div>

      <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm">
        <h3 className="font-bold text-gray-900 mb-4">⚡ Quick Actions</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {['automations', 'contacts', 'analytics', 'settings'].map((page) => (
            <button key={page} onClick={() => onNavigate(page)} className="p-4 rounded-xl border border-gray-100 hover:bg-purple-50 hover:border-purple-200 transition-all text-xs font-bold text-gray-600 uppercase">
              {page}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
