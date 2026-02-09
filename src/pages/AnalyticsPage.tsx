import { useStore } from '../hooks/useStore';
import { BarChart3, TrendingUp, Users, Send, MessageCircle, Bot, ArrowUpRight } from 'lucide-react';

export function AnalyticsPage() {
  const { automations, contacts, user } = useStore();

  const activeAutomations = automations.filter(a => a.is_active).length;
  const totalTriggers = automations.reduce((sum, a) => sum + (a.trigger_count || 0), 0);
  const messageCount = user?.message_count || 0;

  const metrics = [
    { label: 'Messages Sent', value: messageCount.toLocaleString(), icon: Send, color: 'from-blue-500 to-cyan-400' },
    { label: 'Total Contacts', value: contacts.length.toString(), icon: Users, color: 'from-purple-500 to-pink-500' },
    { label: 'Active Automations', value: activeAutomations.toString(), icon: Bot, color: 'from-green-500 to-emerald-400' },
    { label: 'Total Triggers', value: totalTriggers.toLocaleString(), icon: MessageCircle, color: 'from-orange-500 to-amber-400' },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl md:text-3xl font-bold text-gray-900">Analytics</h1>
        <p className="text-gray-500 mt-1">Track your Instagram automation performance</p>
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
                <span className="text-xs font-semibold px-2 py-1 rounded-full flex items-center gap-0.5 bg-green-50 text-green-600">
                  <ArrowUpRight size={12} /> Live
                </span>
              </div>
              <p className="text-2xl font-bold text-gray-900">{m.value}</p>
              <p className="text-sm text-gray-500 mt-0.5">{m.label}</p>
            </div>
          );
        })}
      </div>

      {/* Automation Performance */}
      <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-bold text-gray-900 flex items-center gap-2"><BarChart3 size={18} /> Automation Performance</h3>
        </div>
        {automations.length === 0 ? (
          <div className="text-center py-12">
            <div className="text-4xl mb-3">📊</div>
            <p className="text-gray-500">No automations yet. Create one to see analytics!</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="text-xs text-gray-500 border-b border-gray-100">
                  <th className="text-left py-3 font-medium">Automation</th>
                  <th className="text-left py-3 font-medium">Type</th>
                  <th className="text-right py-3 font-medium">Triggers</th>
                  <th className="text-right py-3 font-medium">Status</th>
                  <th className="text-right py-3 font-medium">Created</th>
                </tr>
              </thead>
              <tbody>
                {automations.map((a) => (
                  <tr key={a.id} className="border-b border-gray-50 hover:bg-gray-50">
                    <td className="py-3 text-sm font-medium text-gray-900">{a.name}</td>
                    <td className="py-3">
                      <span className="text-xs px-2 py-1 rounded-full bg-purple-50 text-purple-700 font-medium">
                        {a.type === 'dm_reply' ? '💬 DM' : a.type === 'comment_reply' ? '💭 Comment' : a.type === 'story_mention' ? '📸 Story' : '👋 Welcome'}
                      </span>
                    </td>
                    <td className="py-3 text-sm text-gray-600 text-right font-bold">{(a.trigger_count || 0).toLocaleString()}</td>
                    <td className="py-3 text-right">
                      <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${a.is_active ? 'bg-green-50 text-green-700' : 'bg-yellow-50 text-yellow-700'}`}>
                        {a.is_active ? '🟢 Active' : '🟡 Paused'}
                      </span>
                    </td>
                    <td className="py-3 text-sm text-gray-500 text-right">{new Date(a.created_at).toLocaleDateString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Best Engagement Times */}
      <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm">
        <h3 className="font-bold text-gray-900 mb-4 flex items-center gap-2"><TrendingUp size={18} /> Automation Summary</h3>
        {automations.length === 0 ? (
          <p className="text-gray-500 text-center py-8">No data yet</p>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="bg-purple-50 rounded-xl p-4 text-center">
              <p className="text-3xl font-black text-purple-600">{automations.length}</p>
              <p className="text-xs text-purple-500 mt-1">Total Automations</p>
            </div>
            <div className="bg-green-50 rounded-xl p-4 text-center">
              <p className="text-3xl font-black text-green-600">{activeAutomations}</p>
              <p className="text-xs text-green-500 mt-1">Active</p>
            </div>
            <div className="bg-blue-50 rounded-xl p-4 text-center">
              <p className="text-3xl font-black text-blue-600">{totalTriggers.toLocaleString()}</p>
              <p className="text-xs text-blue-500 mt-1">Total Triggers</p>
            </div>
            <div className="bg-orange-50 rounded-xl p-4 text-center">
              <p className="text-3xl font-black text-orange-600">{contacts.length}</p>
              <p className="text-xs text-orange-500 mt-1">Contacts</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
