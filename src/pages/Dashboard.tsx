import React, { useEffect } from 'react';
import { useStore } from '../hooks/useStore';
import { Bot, Users, Send, TrendingUp, ArrowUpRight, Instagram, Zap, BarChart3, ChevronRight, BookOpen, Sparkles, ExternalLink } from 'lucide-react';

interface DashboardProps {
  onNavigate: (page: string) => void;
}

export function Dashboard({ onNavigate }: DashboardProps) {
  const { user, automations, contacts, flows, activities } = useStore();

  // 1. Facebook SDK Load logic (Add this for Popup support)
  useEffect(() => {
    // @ts-ignore
    window.fbAsyncInit = function() {
      // @ts-ignore
      window.FB.init({
        appId      : '2436954916718675', // Teri Fixed App ID
        cookie     : true,
        xfbml      : true,
        version    : 'v21.0'
      });
    };

    // Load SDK script automatically
    const script = document.createElement('script');
    script.src = "https://connect.facebook.net/en_US/sdk.js";
    script.async = true;
    script.defer = true;
    script.crossOrigin = "anonymous";
    document.body.appendChild(script);
  }, []);

  // 2. Updated Instagram Connect - Opens Professional Popup
  const handleConnectInstagram = () => {
    // @ts-ignore
    if (!window.FB) {
      alert("System loading... please wait 2 seconds and try again.");
      return;
    }

    // @ts-ignore
    window.FB.login((response: any) => {
      if (response.authResponse) {
        console.log('🔗 Connected! Access Token:', response.authResponse.accessToken);
        // Page reload taaki store update ho jaye aur stats dikhne lagein
        alert("Success! Instagram connected successfully.");
        window.location.reload(); 
      } else {
        console.log('❌ User cancelled login or did not fully authorize.');
      }
    }, {
      // Professional Permissions for Automation
      scope: 'instagram_basic,instagram_manage_comments,instagram_manage_messages,pages_show_list,pages_read_engagement'
    });
  };

  // Instagram not connected - show setup guide
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
              Link your Instagram Business or Creator account to start automating your DMs, comments, and stories.
              <span className="block mt-2 text-sm text-purple-600 font-medium">Takes only 30 seconds! 🚀</span>
            </p>
            <button
              onClick={handleConnectInstagram}
              className="inline-flex items-center gap-3 px-8 py-4 bg-gradient-to-r from-purple-600 to-pink-500 text-white rounded-2xl font-bold text-base shadow-xl shadow-purple-200 hover:shadow-2xl transition-all hover:-translate-y-1 active:translate-y-0"
            >
              <Instagram size={22} />
              Connect Instagram Account
              <ExternalLink size={18} />
            </button>
            <div className="mt-10 grid grid-cols-3 gap-4">
              {[
                { icon: '🔒', text: 'Secure OAuth', desc: 'Meta Official API' },
                { icon: '⚡', text: 'Instant Setup', desc: 'Done in 30 seconds' },
                { icon: '🔄', text: 'Auto-Sync', desc: 'Real-time data' },
              ].map((item, i) => (
                <div key={i} className="text-center p-3 bg-gray-50 rounded-xl">
                  <div className="text-2xl mb-1">{item.icon}</div>
                  <div className="text-xs font-bold text-gray-700">{item.text}</div>
                  <div className="text-[10px] text-gray-400">{item.desc}</div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="mt-6 bg-white rounded-2xl p-6 border border-gray-100 shadow-sm">
          <h3 className="font-bold text-gray-900 mb-4 flex items-center gap-2">
            <BookOpen size={18} className="text-purple-600" />
            How to Create Instagram Business Account
          </h3>
          <div className="space-y-3">
            {[
              'Open Instagram app → Go to Profile → Tap ⚙️ Settings',
              'Tap "Account" → "Switch to Professional Account"',
              'Choose "Business" or "Creator" account type',
              'Select a category (any category works)',
              'Done! ✅ Now you can connect to igone',
            ].map((step, i) => (
              <div key={i} className="flex items-start gap-3 p-3 bg-purple-50 rounded-xl">
                <span className="w-6 h-6 rounded-full bg-purple-500 text-white text-xs flex items-center justify-center font-bold flex-shrink-0">{i + 1}</span>
                <p className="text-sm text-gray-700">{step}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  // Real stats from store
  const activeAutomations = automations.filter(a => a.is_active).length;
  const totalContacts = contacts.length;
  const totalFlows = flows.length;
  const messageCount = user?.message_count || 0;

  const statsCards = [
    { title: 'Messages Sent', value: messageCount.toLocaleString(), icon: Send, color: 'from-blue-500 to-cyan-400', emoji: '📨' },
    { title: 'Active Automations', value: activeAutomations.toString(), icon: Bot, color: 'from-purple-500 to-pink-500', emoji: '🤖' },
    { title: 'Total Contacts', value: totalContacts.toString(), icon: Users, color: 'from-green-500 to-emerald-400', emoji: '👥' },
    { title: 'Active Flows', value: totalFlows.toString(), icon: TrendingUp, color: 'from-orange-500 to-amber-400', emoji: '📈' },
  ];

  // Real activity from store
  const recentActivity = activities.length > 0
    ? activities.slice(0, 5).map(a => ({
        message: a.message,
        time: new Date(a.created_at).toLocaleString(),
        color: a.type.includes('automation') ? 'bg-purple-50 text-purple-600' :
               a.type.includes('contact') ? 'bg-blue-50 text-blue-600' :
               a.type.includes('payment') ? 'bg-green-50 text-green-600' :
               'bg-gray-50 text-gray-600',
      }))
    : [];

  return (
    <div className="space-y-6">
      {/* Welcome Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-black text-gray-900 flex items-center gap-2">
            👋 Welcome back, {user?.name || 'User'}!
          </h1>
          <p className="text-gray-500 mt-1">Here's your Instagram automation overview.</p>
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => onNavigate('automations')}
            className="inline-flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-purple-600 to-pink-500 text-white rounded-xl font-bold text-sm shadow-lg shadow-purple-200 hover:shadow-xl hover:-translate-y-0.5 transition-all active:translate-y-0"
          >
            <Zap size={16} />
            New Automation
          </button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {statsCards.map((stat, i) => {
          const Icon = stat.icon;
          return (
            <div key={i} className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm hover:shadow-lg hover:-translate-y-1 transition-all duration-300 group">
              <div className="flex items-start justify-between mb-4">
                <div className={`w-12 h-12 rounded-2xl bg-gradient-to-br ${stat.color} flex items-center justify-center shadow-lg group-hover:scale-110 group-hover:rotate-3 transition-all duration-300`}>
                  <Icon size={22} className="text-white" />
                </div>
                <span className="text-green-600 text-xs font-bold bg-green-50 px-2.5 py-1 rounded-full flex items-center gap-0.5">
                  <ArrowUpRight size={12} />
                  Live
                </span>
              </div>
              <p className="text-2xl font-black text-gray-900">{stat.value}</p>
              <p className="text-sm text-gray-500 mt-0.5 flex items-center gap-1">{stat.emoji} {stat.title}</p>
            </div>
          );
        })}
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Automations Summary */}
        <div className="lg:col-span-2 bg-white rounded-2xl p-6 border border-gray-100 shadow-sm">
          <div className="flex items-center justify-between mb-6">
            <h3 className="font-bold text-gray-900 flex items-center gap-2">🤖 Your Automations</h3>
            <button onClick={() => onNavigate('automations')} className="text-sm text-purple-600 font-bold hover:text-purple-700 flex items-center gap-1">
              View All <ChevronRight size={14} />
            </button>
          </div>
          {automations.length === 0 ? (
            <div className="text-center py-12">
              <div className="text-4xl mb-3">🤖</div>
              <p className="text-gray-500 mb-4">No automations yet. Create your first one!</p>
              <button
                onClick={() => onNavigate('automations')}
                className="px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-500 text-white rounded-xl font-bold text-sm shadow-lg"
              >
                Create Automation
              </button>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="text-xs text-gray-500 border-b border-gray-100">
                    <th className="text-left py-3 font-semibold">Name</th>
                    <th className="text-left py-3 font-semibold">Type</th>
                    <th className="text-left py-3 font-semibold">Keywords</th>
                    <th className="text-left py-3 font-semibold">Triggers</th>
                    <th className="text-left py-3 font-semibold">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {automations.slice(0, 5).map(auto => (
                    <tr key={auto.id} className="border-b border-gray-50 hover:bg-purple-50/30 transition-colors cursor-pointer" onClick={() => onNavigate('automations')}>
                      <td className="py-3.5 text-sm font-semibold text-gray-900">{auto.name}</td>
                      <td className="py-3.5">
                        <span className="text-xs px-2.5 py-1 rounded-full bg-purple-50 text-purple-700 font-semibold">{auto.type.replace(/_/g, ' ')}</span>
                      </td>
                      <td className="py-3.5 text-sm text-gray-600">{auto.keywords?.join(', ') || '-'}</td>
                      <td className="py-3.5 text-sm text-gray-600 font-medium">{auto.trigger_count || 0}</td>
                      <td className="py-3.5">
                        <span className={`text-xs px-2.5 py-1 rounded-full font-bold ${auto.is_active ? 'bg-green-50 text-green-700' : 'bg-yellow-50 text-yellow-700'}`}>
                          {auto.is_active ? '🟢 Active' : '🟡 Paused'}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Recent Activity */}
        <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm">
          <h3 className="font-bold text-gray-900 mb-4 flex items-center gap-2">⚡ Recent Activity</h3>
          {recentActivity.length === 0 ? (
            <div className="text-center py-12">
              <div className="text-4xl mb-3">📭</div>
              <p className="text-sm text-gray-500">No activity yet. Start by creating an automation!</p>
            </div>
          ) : (
            <div className="space-y-3">
              {recentActivity.map((a, i) => (
                <div key={i} className="flex items-start gap-3 p-2.5 rounded-xl hover:bg-gray-50 transition-colors">
                  <div className={`w-9 h-9 rounded-xl ${a.color} flex items-center justify-center flex-shrink-0`}>
                    <Zap size={14} />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="text-sm text-gray-700 font-medium truncate">{a.message}</p>
                    <p className="text-[10px] text-gray-400 mt-0.5">{a.time}</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Quick Actions */}
      <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm">
        <h3 className="font-bold text-gray-900 mb-4 flex items-center gap-2"><Sparkles size={18} className="text-purple-600" /> Quick Actions</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {[
            { label: 'New Automation', icon: Bot, page: 'automations', emoji: '🤖', color: 'hover:border-purple-200 hover:bg-purple-50' },
            { label: 'View Contacts', icon: Users, page: 'contacts', emoji: '👥', color: 'hover:border-blue-200 hover:bg-blue-50' },
            { label: 'View Analytics', icon: BarChart3, page: 'analytics', emoji: '📊', color: 'hover:border-orange-200 hover:bg-orange-50' },
            { label: 'Settings', icon: Instagram, page: 'settings', emoji: '⚙️', color: 'hover:border-green-200 hover:bg-green-50' },
          ].map((action, i) => {
            const Icon = action.icon;
            return (
              <button
                key={i}
                onClick={() => onNavigate(action.page)}
                className={`flex flex-col items-center gap-2 p-5 rounded-2xl border border-gray-100 transition-all group hover:-translate-y-1 hover:shadow-md ${action.color}`}
              >
                <div className="text-2xl group-hover:scale-110 transition-transform">{action.emoji}</div>
                <Icon size={20} className="text-gray-400 group-hover:text-purple-600 transition-colors" />
                <span className="text-xs font-bold text-gray-600 group-hover:text-gray-900">{action.label}</span>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
