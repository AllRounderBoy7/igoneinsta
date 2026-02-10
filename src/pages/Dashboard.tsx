import React, { useEffect } from 'react';
import { useStore } from '../hooks/useStore';
import { Bot, Users, Send, TrendingUp, ArrowUpRight, Instagram, Zap, BarChart3, ChevronRight, BookOpen, Sparkles, ExternalLink } from 'lucide-react';

interface DashboardProps {
  onNavigate: (page: string) => void;
}

export function Dashboard({ onNavigate }: DashboardProps) {
  const { user, automations, contacts, flows, activities } = useStore();

  // Facebook SDK ko load aur setup karne ka auto-logic
  useEffect(() => {
    // @ts-ignore
    window.fbAsyncInit = function() {
      // @ts-ignore
      window.FB.init({
        appId      : '2436954916718675', // Maine ID fix kar di hai yahan
        cookie     : true,
        xfbml      : true,
        version    : 'v21.0'
      });
    };

    // Script ko body mein add karna taaki SDK chalu ho jaye
    if (!document.getElementById('facebook-jssdk')) {
      const script = document.createElement('script');
      script.id = 'facebook-jssdk';
      script.src = "https://connect.facebook.net/en_US/sdk.js";
      script.async = true;
      script.defer = true;
      script.crossOrigin = "anonymous";
      document.body.appendChild(script);
    }
  }, []);

  // Instagram Connect karne wala function (Manychat style popup)
  const handleConnectInstagram = () => {
    // @ts-ignore
    if (window.FB) {
      // @ts-ignore
      window.FB.login((response: any) => {
        if (response.authResponse) {
          console.log('✅ Token Mil Gaya:', response.authResponse.accessToken);
          alert("Instagram Connected! Dashboard refresh ho raha hai...");
          window.location.reload(); 
        }
      }, {
        scope: 'instagram_basic,instagram_manage_comments,instagram_manage_messages,pages_show_list,pages_read_engagement'
      });
    } else {
      alert("Facebook System load ho raha hai, please 2 second baad click karein.");
    }
  };

  // AGAR INSTAGRAM CONNECTED NAHI HAI TOH YE DIKHEGA
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

  // AGAR CONNECTED HAI TOH YE DASHBOARD DIKHEGA
  const activeAutomations = automations.filter(a => a.is_active).length;
  const messageCount = user?.message_count || 0;

  return (
    <div className="space-y-6">
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

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { title: 'Messages Sent', value: messageCount, icon: Send, color: 'from-blue-500 to-cyan-400', emoji: '📨' },
          { title: 'Active Automations', value: activeAutomations, icon: Bot, color: 'from-purple-500 to-pink-500', emoji: '🤖' },
          { title: 'Total Contacts', value: contacts.length, icon: Users, color: 'from-green-500 to-emerald-400', emoji: '👥' },
          { title: 'Active Flows', value: flows.length, icon: TrendingUp, color: 'from-orange-500 to-amber-400', emoji: '📈' },
        ].map((stat, i) => (
          <div key={i} className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm transition-all hover:-translate-y-1">
            <div className={`w-12 h-12 rounded-2xl bg-gradient-to-br ${stat.color} flex items-center justify-center mb-4 shadow-lg text-white`}>
              <stat.icon size={22} />
            </div>
            <p className="text-2xl font-black text-gray-900">{stat.value.toLocaleString()}</p>
            <p className="text-sm text-gray-500 mt-0.5 flex items-center gap-1">{stat.emoji} {stat.title}</p>
          </div>
        ))}
      </div>

      <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm">
        <h3 className="font-bold text-gray-900 mb-4 flex items-center gap-2"><Sparkles size={18} className="text-purple-600" /> Quick Actions</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {[
            { label: 'New Automation', icon: Bot, page: 'automations', emoji: '🤖' },
            { label: 'View Contacts', icon: Users, page: 'contacts', emoji: '👥' },
            { label: 'View Analytics', icon: BarChart3, page: 'analytics', emoji: '📊' },
            { label: 'Settings', icon: Instagram, page: 'settings', emoji: '⚙️' },
          ].map((action, i) => (
            <button
              key={i}
              onClick={() => onNavigate(action.page)}
              className="flex flex-col items-center gap-2 p-5 rounded-2xl border border-gray-100 hover:bg-purple-50 transition-all group"
            >
              <div className="text-2xl group-hover:scale-110 transition-transform">{action.emoji}</div>
              <span className="text-xs font-bold text-gray-600">{action.label}</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
