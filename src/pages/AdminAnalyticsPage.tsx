import { useStore } from '../useStore';
import { BarChart3, TrendingUp, Users, DollarSign, Activity, Globe, ArrowUpRight, Server, Zap } from 'lucide-react';

export function AdminAnalyticsPage() {
  const { store } = useStore();
  const { adminSettings } = store;

  const metrics = [
    { label: 'Total Users', value: adminSettings.totalUsers.toLocaleString(), change: '+8.4%', icon: Users, color: 'from-blue-500 to-cyan-400' },
    { label: 'Active Users', value: adminSettings.activeUsers.toLocaleString(), change: '+12.1%', icon: Activity, color: 'from-green-500 to-emerald-400' },
    { label: 'Monthly Revenue', value: `$${adminSettings.monthlyRevenue.toLocaleString()}`, change: '+15.3%', icon: DollarSign, color: 'from-purple-500 to-pink-500' },
    { label: 'Churn Rate', value: '2.3%', change: '-0.5%', icon: TrendingUp, color: 'from-orange-500 to-amber-400' },
  ];

  const geoData = [
    { country: '🇺🇸 United States', users: 4200, pct: 27 },
    { country: '🇮🇳 India', users: 3100, pct: 20 },
    { country: '🇬🇧 United Kingdom', users: 1800, pct: 12 },
    { country: '🇧🇷 Brazil', users: 1400, pct: 9 },
    { country: '🇩🇪 Germany', users: 1100, pct: 7 },
    { country: '🇫🇷 France', users: 890, pct: 6 },
    { country: '🇦🇺 Australia', users: 750, pct: 5 },
    { country: '🇨🇦 Canada', users: 680, pct: 4 },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-green-500 to-emerald-400 flex items-center justify-center shadow-lg">
          <BarChart3 size={20} className="text-white" />
        </div>
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-gray-900">Platform Analytics</h1>
          <p className="text-gray-500 mt-0.5">Detailed platform performance metrics</p>
        </div>
      </div>

      {/* Metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {metrics.map((m, i) => {
          const Icon = m.icon;
          return (
            <div key={i} className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm">
              <div className="flex items-start justify-between mb-3">
                <div className={`w-11 h-11 rounded-xl bg-gradient-to-br ${m.color} flex items-center justify-center shadow-lg`}>
                  <Icon size={20} className="text-white" />
                </div>
                <span className="text-green-600 text-xs font-semibold bg-green-50 px-2 py-1 rounded-full flex items-center gap-0.5">
                  <ArrowUpRight size={12} /> {m.change}
                </span>
              </div>
              <p className="text-2xl font-bold text-gray-900">{m.value}</p>
              <p className="text-sm text-gray-500 mt-0.5">{m.label}</p>
            </div>
          );
        })}
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        {/* User Growth Chart */}
        <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm">
          <div className="flex items-center justify-between mb-6">
            <h3 className="font-bold text-gray-900">User Growth</h3>
            <div className="flex gap-2">
              {['6M', '1Y', 'All'].map(p => (
                <button key={p} className={`px-3 py-1 rounded-lg text-xs font-medium ${p === '1Y' ? 'bg-green-100 text-green-700' : 'text-gray-500 hover:bg-gray-50'}`}>{p}</button>
              ))}
            </div>
          </div>
          <div className="flex items-end gap-1.5 h-48">
            {[15, 22, 28, 35, 38, 42, 48, 55, 60, 65, 72, 80].map((h, i) => (
              <div key={i} className="flex-1 group relative">
                <div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-gray-900 text-white text-[10px] px-2 py-1 rounded opacity-0 group-hover:opacity-100 whitespace-nowrap z-10">
                  {Math.floor(h * 193)} users
                </div>
                <div className="w-full bg-gradient-to-t from-blue-500 to-cyan-400 rounded-t-lg opacity-80 hover:opacity-100 transition-opacity cursor-pointer" style={{ height: `${h}%` }}></div>
              </div>
            ))}
          </div>
          <div className="flex justify-between mt-2 text-[10px] text-gray-400">
            {['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'].map(m => (
              <span key={m}>{m}</span>
            ))}
          </div>
        </div>

        {/* Revenue Chart */}
        <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm">
          <div className="flex items-center justify-between mb-6">
            <h3 className="font-bold text-gray-900">Revenue Trend</h3>
            <div className="flex gap-2">
              {['6M', '1Y', 'All'].map(p => (
                <button key={p} className={`px-3 py-1 rounded-lg text-xs font-medium ${p === '1Y' ? 'bg-purple-100 text-purple-700' : 'text-gray-500 hover:bg-gray-50'}`}>{p}</button>
              ))}
            </div>
          </div>
          <div className="flex items-end gap-1.5 h-48">
            {[20, 28, 32, 38, 42, 50, 55, 62, 68, 74, 82, 95].map((h, i) => (
              <div key={i} className="flex-1 group relative">
                <div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-gray-900 text-white text-[10px] px-2 py-1 rounded opacity-0 group-hover:opacity-100 whitespace-nowrap z-10">
                  ${(h * 442).toLocaleString()}
                </div>
                <div className="w-full bg-gradient-to-t from-purple-500 to-pink-400 rounded-t-lg opacity-80 hover:opacity-100 transition-opacity cursor-pointer" style={{ height: `${h}%` }}></div>
              </div>
            ))}
          </div>
          <div className="flex justify-between mt-2 text-[10px] text-gray-400">
            {['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'].map(m => (
              <span key={m}>{m}</span>
            ))}
          </div>
        </div>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Geographic Distribution */}
        <div className="lg:col-span-2 bg-white rounded-2xl p-6 border border-gray-100 shadow-sm">
          <h3 className="font-bold text-gray-900 mb-4 flex items-center gap-2"><Globe size={18} /> Geographic Distribution</h3>
          <div className="space-y-3">
            {geoData.map((g, i) => (
              <div key={i} className="flex items-center gap-4">
                <span className="text-sm font-medium text-gray-700 w-40">{g.country}</span>
                <div className="flex-1 h-3 bg-gray-100 rounded-full overflow-hidden">
                  <div className="h-full bg-gradient-to-r from-blue-500 to-cyan-400 rounded-full" style={{ width: `${g.pct}%` }}></div>
                </div>
                <span className="text-xs text-gray-500 w-24 text-right">{g.users.toLocaleString()} ({g.pct}%)</span>
              </div>
            ))}
          </div>
        </div>

        {/* Key Metrics */}
        <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm">
          <h3 className="font-bold text-gray-900 mb-4">Key Metrics</h3>
          <div className="space-y-4">
            {[
              { label: 'Avg. Session Duration', value: '14m 32s', icon: '⏱️' },
              { label: 'Messages per User', value: '842', icon: '💬' },
              { label: 'Automation Success', value: '94.2%', icon: '🤖' },
              { label: 'User Satisfaction', value: '4.8/5', icon: '⭐' },
              { label: 'API Uptime', value: '99.97%', icon: '🟢' },
              { label: 'Avg. Response Time', value: '45ms', icon: '⚡' },
            ].map((m, i) => (
              <div key={i} className="flex items-center justify-between p-3 bg-gray-50 rounded-xl">
                <div className="flex items-center gap-2">
                  <span>{m.icon}</span>
                  <span className="text-sm text-gray-700">{m.label}</span>
                </div>
                <span className="font-bold text-gray-900 text-sm">{m.value}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Platform Activity */}
      <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm">
        <h3 className="font-bold text-gray-900 mb-4 flex items-center gap-2"><Zap size={18} /> Real-Time Activity</h3>
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
          {[
            { label: 'Active Sessions', value: '2,341', color: 'bg-green-500', pulse: true },
            { label: 'Messages/min', value: '456', color: 'bg-blue-500', pulse: true },
            { label: 'API Calls/min', value: '12,890', color: 'bg-purple-500', pulse: false },
            { label: 'Automations Running', value: '8,234', color: 'bg-orange-500', pulse: false },
          ].map((item, i) => (
            <div key={i} className="bg-gray-50 rounded-xl p-4">
              <div className="flex items-center gap-2 mb-2">
                <div className={`w-2 h-2 rounded-full ${item.color} ${item.pulse ? 'animate-pulse' : ''}`}></div>
                <span className="text-xs text-gray-500">{item.label}</span>
              </div>
              <p className="text-2xl font-bold text-gray-900">{item.value}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Server Health */}
      <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm">
        <h3 className="font-bold text-gray-900 mb-4 flex items-center gap-2"><Server size={18} /> Server Health</h3>
        <div className="grid md:grid-cols-3 gap-4">
          {[
            { label: 'CPU Usage', value: 34, color: 'bg-green-500' },
            { label: 'Memory Usage', value: 58, color: 'bg-blue-500' },
            { label: 'Disk Usage', value: 24, color: 'bg-purple-500' },
          ].map((s, i) => (
            <div key={i} className="bg-gray-50 rounded-xl p-4">
              <div className="flex justify-between mb-2">
                <span className="text-sm font-medium text-gray-700">{s.label}</span>
                <span className="text-sm font-bold text-gray-900">{s.value}%</span>
              </div>
              <div className="h-3 bg-gray-200 rounded-full overflow-hidden">
                <div className={`h-full ${s.color} rounded-full transition-all duration-1000`} style={{ width: `${s.value}%` }}></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
