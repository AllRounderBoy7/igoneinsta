import { useState } from 'react';
import { useStore } from '../useStore';
import { TrendingUp, MessageSquare, Link, QrCode, Share2, Radio, Plus, Play, Pause } from 'lucide-react';

const tools = [
  { type: 'comment_trigger', name: 'Comment Trigger', desc: 'Users comment a keyword, get auto-DM', icon: MessageSquare, color: 'from-blue-500 to-cyan-400' },
  { type: 'story_mention', name: 'Story Mention', desc: 'Auto-reply when mentioned in stories', icon: Share2, color: 'from-purple-500 to-pink-500' },
  { type: 'bio_link', name: 'Bio Link', desc: 'Smart link that triggers DM automation', icon: Link, color: 'from-green-500 to-emerald-400' },
  { type: 'qr_code', name: 'QR Code', desc: 'Generate QR codes for DM opt-in', icon: QrCode, color: 'from-orange-500 to-amber-400' },
  { type: 'ref_link', name: 'Ref Link', desc: 'Trackable referral links', icon: TrendingUp, color: 'from-red-500 to-pink-500' },
  { type: 'live_comment', name: 'Live Comment', desc: 'Engage during Instagram Lives', icon: Radio, color: 'from-violet-500 to-purple-500' },
];

export function GrowthToolsPage() {
  const { store } = useStore();
  const [activeTool, setActiveTool] = useState<string | null>(null);
  const [keyword, setKeyword] = useState('');
  const [response, setResponse] = useState('');

  const handleCreate = (type: string) => {
    if (!keyword || !response) return;
    store.growthTools.push({
      id: Date.now().toString(),
      name: `${type} - ${keyword}`,
      type: type as 'comment_trigger',
      status: 'active',
      settings: { keyword, response },
      stats: { impressions: 0, clicks: 0, conversions: 0 },
    });
    setActiveTool(null);
    setKeyword('');
    setResponse('');
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl md:text-3xl font-bold text-gray-900">Growth Tools</h1>
        <p className="text-gray-500 mt-1">Tools to grow your Instagram audience and engagement</p>
      </div>

      <div className="grid md:grid-cols-3 gap-4">
        {tools.map(tool => {
          const Icon = tool.icon;
          return (
            <div key={tool.type} className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm hover:shadow-md transition-shadow">
              <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${tool.color} flex items-center justify-center mb-4 shadow-lg`}>
                <Icon size={22} className="text-white" />
              </div>
              <h3 className="font-bold text-gray-900 mb-1">{tool.name}</h3>
              <p className="text-sm text-gray-500 mb-4">{tool.desc}</p>
              <button
                onClick={() => setActiveTool(tool.type)}
                className="w-full py-2.5 bg-gray-50 hover:bg-purple-50 text-gray-700 hover:text-purple-700 rounded-xl text-sm font-semibold transition-colors flex items-center justify-center gap-2"
              >
                <Plus size={14} /> Set Up
              </button>
            </div>
          );
        })}
      </div>

      {activeTool && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl w-full max-w-md p-6 shadow-2xl">
            <h3 className="text-lg font-bold mb-4">Set Up {tools.find(t => t.type === activeTool)?.name}</h3>
            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium text-gray-700 mb-1 block">Trigger Keyword</label>
                <input value={keyword} onChange={e => setKeyword(e.target.value)} placeholder="e.g. INFO, LINK, GET" className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-purple-500" />
              </div>
              <div>
                <label className="text-sm font-medium text-gray-700 mb-1 block">Auto-Response Message</label>
                <textarea value={response} onChange={e => setResponse(e.target.value)} placeholder="Message to send when triggered..." rows={4} className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-purple-500 resize-none" />
              </div>
              <div className="flex gap-3">
                <button onClick={() => handleCreate(activeTool)} className="px-6 py-2.5 bg-gradient-to-r from-purple-600 to-pink-500 text-white rounded-xl font-semibold text-sm">Create</button>
                <button onClick={() => setActiveTool(null)} className="px-6 py-2.5 bg-gray-100 text-gray-700 rounded-xl font-semibold text-sm">Cancel</button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Active Growth Tools */}
      {store.growthTools.length > 0 && (
        <div>
          <h2 className="text-lg font-bold text-gray-900 mb-3">Active Growth Tools</h2>
          <div className="space-y-3">
            {store.growthTools.map(gt => (
              <div key={gt.id} className="bg-white rounded-2xl p-4 border border-gray-100 shadow-sm flex items-center justify-between">
                <div>
                  <h4 className="font-semibold text-gray-900">{gt.name}</h4>
                  <div className="flex gap-4 mt-1 text-xs text-gray-500">
                    <span>{gt.stats.impressions} impressions</span>
                    <span>{gt.stats.clicks} clicks</span>
                    <span>{gt.stats.conversions} conversions</span>
                  </div>
                </div>
                <button className={`p-2 rounded-lg ${gt.status === 'active' ? 'text-green-600 bg-green-50' : 'text-gray-400 bg-gray-50'}`}>
                  {gt.status === 'active' ? <Play size={16} /> : <Pause size={16} />}
                </button>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
