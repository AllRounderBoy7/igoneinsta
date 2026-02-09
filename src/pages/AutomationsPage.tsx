import { useState } from 'react';
import { useStore } from '../hooks/useStore';
import { Bot, Plus, Search, Play, Pause, Trash2, Edit2, Zap, MessageCircle, AtSign, Heart, MoreVertical, Copy, X, Check, ChevronDown, Sparkles, ArrowRight, HelpCircle, Settings, Send } from 'lucide-react';

const automationTemplates = [
  { name: 'DM Auto-Reply', type: 'dm_reply' as const, icon: MessageCircle, desc: 'Auto-reply to direct messages', color: 'from-blue-500 to-cyan-400', emoji: '💬' },
  { name: 'Comment Reply', type: 'comment_reply' as const, icon: AtSign, desc: 'Reply to post comments + send DM', color: 'from-purple-500 to-pink-500', emoji: '💭' },
  { name: 'Story Mention', type: 'story_mention' as const, icon: Zap, desc: 'Thank users who mention you in stories', color: 'from-orange-500 to-amber-400', emoji: '📸' },
  { name: 'Welcome Message', type: 'welcome' as const, icon: Heart, desc: 'Greet new followers automatically', color: 'from-pink-500 to-rose-400', emoji: '👋' },
];

export function AutomationsPage() {
  const { automations, createAutomation, updateAutomation, deleteAutomation, toggleAutomation } = useStore();
  const [showCreate, setShowCreate] = useState(false);
  const [search, setSearch] = useState('');
  const [editId, setEditId] = useState<string | null>(null);
  const [editData, setEditData] = useState({ name: '', keywords: '', response: '' });
  const [filterType, setFilterType] = useState('all');
  const [filterStatus, setFilterStatus] = useState('all');
  const [newData, setNewData] = useState({
    name: '',
    type: 'dm_reply' as 'dm_reply' | 'comment_reply' | 'story_mention' | 'welcome',
    keywords: '',
    response: '',
    post_url: '',
    send_dm: true,
    reply_to_comment: true
  });
  const [activeMenu, setActiveMenu] = useState<string | null>(null);
  const [showFilters, setShowFilters] = useState(false);
  const [step, setStep] = useState(1);
  const [showGuide, setShowGuide] = useState(false);
  const [mode, setMode] = useState<'simple' | 'advanced'>('simple');

  const filtered = automations.filter(a => {
    const matchSearch = a.name.toLowerCase().includes(search.toLowerCase());
    const matchType = filterType === 'all' || a.type === filterType;
    const matchStatus = filterStatus === 'all' || (filterStatus === 'active' ? a.is_active : !a.is_active);
    return matchSearch && matchType && matchStatus;
  });

  const handleCreate = async () => {
    if (!newData.name || !newData.response) return;
    try {
      await createAutomation({
        name: newData.name,
        type: newData.type,
        keywords: newData.keywords.split(',').map(k => k.trim()).filter(Boolean),
        response: newData.response,
        post_url: newData.post_url || null,
        send_dm: newData.send_dm,
        reply_to_comment: newData.reply_to_comment,
        is_active: true,
        trigger_count: 0
      });
      setShowCreate(false);
      resetNewData();
    } catch (err) {
      console.error('Create automation error:', err);
    }
  };

  const resetNewData = () => {
    setNewData({ name: '', type: 'dm_reply', keywords: '', response: '', post_url: '', send_dm: true, reply_to_comment: true });
    setStep(1);
    setMode('simple');
  };

  const handleEdit = (auto: typeof automations[0]) => {
    setEditId(auto.id);
    setEditData({
      name: auto.name,
      keywords: (auto.keywords || []).join(', '),
      response: auto.response || '',
    });
  };

  const handleSaveEdit = async () => {
    if (editId) {
      try {
        await updateAutomation(editId, {
          name: editData.name,
          keywords: editData.keywords.split(',').map(k => k.trim()).filter(Boolean),
          response: editData.response,
        });
        setEditId(null);
      } catch (err) {
        console.error('Update error:', err);
      }
    }
  };

  const handleDuplicate = async (auto: typeof automations[0]) => {
    try {
      await createAutomation({
        name: auto.name + ' (Copy)',
        type: auto.type,
        keywords: auto.keywords,
        response: auto.response,
        post_url: auto.post_url,
        send_dm: auto.send_dm,
        reply_to_comment: auto.reply_to_comment,
        is_active: false,
        trigger_count: 0
      });
      setActiveMenu(null);
    } catch (err) {
      console.error('Duplicate error:', err);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await deleteAutomation(id);
      setActiveMenu(null);
    } catch (err) {
      console.error('Delete error:', err);
    }
  };

  const handleToggle = async (id: string) => {
    try {
      await toggleAutomation(id);
    } catch (err) {
      console.error('Toggle error:', err);
    }
  };

  const selectTemplate = (template: typeof automationTemplates[0]) => {
    setNewData({ ...newData, name: template.name, type: template.type });
    setStep(2);
  };

  const needsKeywords = newData.type === 'dm_reply' || newData.type === 'comment_reply';

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-xl md:text-2xl font-bold text-gray-900">Automations</h1>
          <p className="text-gray-500 text-sm mt-1">Create and manage your auto-replies</p>
        </div>
        <div className="flex gap-2">
          <button onClick={() => setShowGuide(!showGuide)} className={`inline-flex items-center gap-2 px-3 py-2 rounded-xl font-medium text-sm border ${showGuide ? 'bg-blue-50 text-blue-700 border-blue-200' : 'bg-white text-gray-600 border-gray-200'}`}>
            <HelpCircle size={16} /> Guide
          </button>
          <button onClick={() => { setShowCreate(true); setStep(1); }} className="inline-flex items-center justify-center gap-2 px-4 py-2.5 bg-gradient-to-r from-purple-600 to-pink-500 text-white rounded-xl font-semibold text-sm shadow-lg shadow-purple-200">
            <Plus size={16} /> New Automation
          </button>
        </div>
      </div>

      {/* Guide */}
      {showGuide && (
        <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-2xl p-4 border border-blue-200">
          <h3 className="font-bold text-blue-800 mb-3 flex items-center gap-2">📖 How Automations Work</h3>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 text-sm">
            {[
              { n: '1️⃣', t: 'Choose Type', d: 'DM Reply, Comment Reply, Story Mention, or Welcome' },
              { n: '2️⃣', t: 'Set Keywords', d: 'Enter trigger words like PRICE, INFO' },
              { n: '3️⃣', t: 'Write Response', d: 'Create your auto-reply message' },
              { n: '4️⃣', t: 'Activate', d: 'Turn it ON and it works 24/7!' },
            ].map((s, i) => (
              <div key={i} className="bg-white rounded-xl p-3 border border-blue-100">
                <div className="text-2xl mb-2">{s.n}</div>
                <strong className="text-gray-800">{s.t}</strong>
                <p className="text-xs text-gray-500 mt-1">{s.d}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Search & Filters */}
      <div className="space-y-3">
        <div className="flex gap-2">
          <div className="relative flex-1">
            <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input type="text" value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search automations..." className="w-full pl-9 pr-4 py-2.5 bg-white border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-purple-500" />
          </div>
          <button onClick={() => setShowFilters(!showFilters)} className={`px-3 py-2.5 rounded-xl border text-sm font-medium flex items-center gap-1 ${showFilters ? 'bg-purple-50 border-purple-200 text-purple-700' : 'bg-white border-gray-200 text-gray-600'}`}>
            <ChevronDown size={14} className={`transition-transform ${showFilters ? 'rotate-180' : ''}`} />
            <span className="hidden sm:inline">Filters</span>
          </button>
        </div>
        {showFilters && (
          <div className="p-3 bg-gray-50 rounded-xl space-y-3">
            <div>
              <span className="text-xs text-gray-500 font-medium block mb-2">Type:</span>
              <div className="flex flex-wrap gap-2">
                {[{v:'all',l:'🔮 All'},{v:'dm_reply',l:'💬 DM'},{v:'comment_reply',l:'💭 Comment'},{v:'story_mention',l:'📸 Story'},{v:'welcome',l:'👋 Welcome'}].map(t => (
                  <button key={t.v} onClick={() => setFilterType(t.v)} className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${filterType === t.v ? 'bg-purple-500 text-white' : 'bg-white text-gray-600 border border-gray-200'}`}>{t.l}</button>
                ))}
              </div>
            </div>
            <div>
              <span className="text-xs text-gray-500 font-medium block mb-2">Status:</span>
              <div className="flex flex-wrap gap-2">
                {[{v:'all',l:'📊 All'},{v:'active',l:'🟢 Active'},{v:'paused',l:'🟡 Paused'}].map(s => (
                  <button key={s.v} onClick={() => setFilterStatus(s.v)} className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${filterStatus === s.v ? 'bg-purple-500 text-white' : 'bg-white text-gray-600 border border-gray-200'}`}>{s.l}</button>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Create Modal */}
      {showCreate && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4">
          <div className="bg-white rounded-t-3xl sm:rounded-2xl w-full sm:max-w-lg max-h-[90vh] overflow-auto shadow-2xl">
            <div className="sticky top-0 bg-white p-4 border-b border-gray-100 z-10">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-lg font-bold text-gray-900">Create Automation</h3>
                  <p className="text-xs text-gray-500">Step {step} of 3</p>
                </div>
                <button onClick={() => { setShowCreate(false); resetNewData(); }} className="p-2 hover:bg-gray-100 rounded-xl text-gray-400"><X size={18} /></button>
              </div>
              <div className="flex gap-1 mt-3">
                {[1, 2, 3].map(s => (<div key={s} className={`flex-1 h-1.5 rounded-full ${s <= step ? 'bg-purple-500' : 'bg-gray-200'}`} />))}
              </div>
              {step === 2 && (
                <div className="flex gap-2 mt-3 p-1 bg-gray-100 rounded-xl">
                  <button onClick={() => setMode('simple')} className={`flex-1 py-2 px-3 rounded-lg text-sm font-medium transition-colors ${mode === 'simple' ? 'bg-white text-purple-700 shadow-sm' : 'text-gray-600'}`}>🎯 Simple</button>
                  <button onClick={() => setMode('advanced')} className={`flex-1 py-2 px-3 rounded-lg text-sm font-medium transition-colors ${mode === 'advanced' ? 'bg-white text-purple-700 shadow-sm' : 'text-gray-600'}`}><Settings size={14} className="inline mr-1" /> Advanced</button>
                </div>
              )}
            </div>
            <div className="p-4">
              {step === 1 && (
                <div className="space-y-4">
                  <div className="text-center mb-4">
                    <div className="text-4xl mb-2">🎯</div>
                    <h4 className="font-bold text-gray-900">What do you want to automate?</h4>
                  </div>
                  <div className="space-y-3">
                    {automationTemplates.map((t, i) => {
                      const Icon = t.icon;
                      return (
                        <button key={i} onClick={() => selectTemplate(t)} className="flex items-center gap-4 p-4 rounded-2xl border-2 border-gray-100 hover:border-purple-300 hover:bg-purple-50/50 transition-all text-left group w-full">
                          <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${t.color} flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform`}>
                            <Icon size={24} className="text-white" />
                          </div>
                          <div className="flex-1">
                            <p className="font-bold text-gray-900 flex items-center gap-2">{t.name} <span className="text-lg">{t.emoji}</span></p>
                            <p className="text-sm text-gray-500">{t.desc}</p>
                          </div>
                          <ArrowRight size={20} className="text-gray-300 group-hover:text-purple-500 transition-all" />
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}
              {step === 2 && (
                <div className="space-y-4">
                  <div>
                    <label className="text-sm font-medium text-gray-700 mb-1 block">Automation Name</label>
                    <input value={newData.name} onChange={e => setNewData({...newData, name: e.target.value})} placeholder="e.g. Price Inquiry Reply" className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-purple-500" />
                  </div>
                  {needsKeywords && (
                    <div>
                      <label className="text-sm font-medium text-gray-700 mb-1 block">Trigger Keywords</label>
                      <input value={newData.keywords} onChange={e => setNewData({...newData, keywords: e.target.value})} placeholder="e.g. INFO, PRICE, HELP" className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-purple-500" />
                      <p className="text-xs text-gray-400 mt-1.5">💡 Separate multiple keywords with commas</p>
                    </div>
                  )}
                  {mode === 'advanced' && newData.type === 'comment_reply' && (
                    <div className="bg-purple-50 rounded-xl p-4 border border-purple-100">
                      <p className="text-sm font-medium text-purple-800 mb-3">When someone comments the keyword:</p>
                      <div className="space-y-2">
                        <label className="flex items-center gap-3 cursor-pointer">
                          <input type="checkbox" checked={newData.reply_to_comment} onChange={e => setNewData({...newData, reply_to_comment: e.target.checked})} className="w-5 h-5 rounded-lg border-gray-300 text-purple-600" />
                          <span className="text-sm text-gray-700 flex items-center gap-2"><AtSign size={16} className="text-purple-500" /> Reply to their comment</span>
                        </label>
                        <label className="flex items-center gap-3 cursor-pointer">
                          <input type="checkbox" checked={newData.send_dm} onChange={e => setNewData({...newData, send_dm: e.target.checked})} className="w-5 h-5 rounded-lg border-gray-300 text-purple-600" />
                          <span className="text-sm text-gray-700 flex items-center gap-2"><Send size={16} className="text-purple-500" /> Send them a DM</span>
                        </label>
                      </div>
                    </div>
                  )}
                  <div className="flex gap-3 pt-2">
                    <button onClick={() => setStep(1)} className="px-6 py-3 bg-gray-100 text-gray-700 rounded-xl font-semibold text-sm">Back</button>
                    <button onClick={() => setStep(3)} disabled={!newData.name || (needsKeywords && !newData.keywords)} className="flex-1 py-3 bg-gradient-to-r from-purple-600 to-pink-500 text-white rounded-xl font-bold text-sm disabled:opacity-50 flex items-center justify-center gap-2">Continue <ArrowRight size={16} /></button>
                  </div>
                </div>
              )}
              {step === 3 && (
                <div className="space-y-4">
                  <div>
                    <label className="text-sm font-medium text-gray-700 mb-1 flex items-center gap-2"><Send size={14} className="text-purple-500" /> Auto-Reply Message</label>
                    <textarea value={newData.response} onChange={e => setNewData({...newData, response: e.target.value})} placeholder="Type your message..." rows={4} className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-purple-500 resize-none" />
                  </div>
                  <div>
                    <p className="text-xs text-gray-500 mb-2">Click to add:</p>
                    <div className="flex flex-wrap gap-2">
                      {['{{name}}', '{{username}}', '👋', '🎉', '💰', '📩', '✅'].map(v => (
                        <button key={v} onClick={() => setNewData({...newData, response: newData.response + ' ' + v})} className="text-sm bg-purple-50 text-purple-600 px-3 py-1.5 rounded-lg hover:bg-purple-100 font-medium">{v}</button>
                      ))}
                    </div>
                  </div>
                  <div className="bg-gray-50 rounded-xl p-4 border border-gray-200">
                    <p className="text-xs text-gray-500 mb-2 font-medium">Preview:</p>
                    <div className="bg-white rounded-lg p-3 border border-gray-100 text-sm text-gray-700">{newData.response || 'Your message will appear here...'}</div>
                  </div>
                  <div className="flex gap-3 pt-2">
                    <button onClick={() => setStep(2)} className="px-6 py-3 bg-gray-100 text-gray-700 rounded-xl font-semibold text-sm">Back</button>
                    <button onClick={handleCreate} disabled={!newData.response} className="flex-1 py-3 bg-gradient-to-r from-purple-600 to-pink-500 text-white rounded-xl font-bold text-sm disabled:opacity-50 flex items-center justify-center gap-2"><Sparkles size={16} /> Create & Activate</button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Edit Modal */}
      {editId && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4">
          <div className="bg-white rounded-t-3xl sm:rounded-2xl w-full sm:max-w-lg p-5 shadow-2xl max-h-[85vh] overflow-auto">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-bold text-gray-900 flex items-center gap-2"><Edit2 size={18} className="text-purple-600" /> Edit Automation</h3>
              <button onClick={() => setEditId(null)} className="p-2 hover:bg-gray-100 rounded-xl text-gray-400"><X size={18} /></button>
            </div>
            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium text-gray-700 mb-1 block">Automation Name</label>
                <input value={editData.name} onChange={e => setEditData({...editData, name: e.target.value})} className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-purple-500" />
              </div>
              <div>
                <label className="text-sm font-medium text-gray-700 mb-1 block">Trigger Keywords</label>
                <input value={editData.keywords} onChange={e => setEditData({...editData, keywords: e.target.value})} placeholder="e.g. INFO, PRICE, HELP" className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-purple-500" />
                <p className="text-xs text-gray-400 mt-1">Separate multiple keywords with commas</p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-700 mb-1 block">Response Message</label>
                <textarea value={editData.response} onChange={e => setEditData({...editData, response: e.target.value})} rows={4} className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-purple-500 resize-none" />
              </div>
              <div className="flex gap-3">
                <button onClick={handleSaveEdit} className="flex-1 py-3 bg-gradient-to-r from-purple-600 to-pink-500 text-white rounded-xl font-bold text-sm flex items-center justify-center gap-2"><Check size={16} /> Save Changes</button>
                <button onClick={() => setEditId(null)} className="px-6 py-3 bg-gray-100 text-gray-700 rounded-xl font-semibold text-sm">Cancel</button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Automations List */}
      <div className="space-y-3">
        {filtered.length === 0 ? (
          <div className="bg-white rounded-2xl p-8 text-center border border-gray-100">
            <Bot size={48} className="text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-700 mb-2">{search || filterType !== 'all' ? 'No matching automations' : 'No automations yet'}</h3>
            <p className="text-gray-500 text-sm mb-4">Create your first automation to start auto-replying!</p>
            <button onClick={() => { setShowCreate(true); setStep(1); }} className="px-6 py-2.5 bg-gradient-to-r from-purple-600 to-pink-500 text-white rounded-xl font-semibold text-sm">Create Automation</button>
          </div>
        ) : (
          filtered.map(auto => (
            <div key={auto.id} className="bg-white rounded-2xl p-4 border border-gray-100 shadow-sm hover:shadow-md transition-shadow">
              <div className="flex items-start gap-3">
                <div className={`w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0 ${auto.is_active ? 'bg-gradient-to-br from-green-400 to-emerald-500' : 'bg-gray-100'}`}>
                  <Bot size={20} className={auto.is_active ? 'text-white' : 'text-gray-400'} />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-2">
                    <div className="min-w-0">
                      <h3 className="font-bold text-gray-900 text-sm truncate">{auto.name}</h3>
                      <div className="flex flex-wrap items-center gap-2 mt-1.5">
                        <span className="text-[10px] px-2 py-0.5 rounded-full bg-purple-50 text-purple-700 font-medium">
                          {auto.type === 'dm_reply' ? '💬 DM' : auto.type === 'comment_reply' ? '💭 Comment' : auto.type === 'story_mention' ? '📸 Story' : '👋 Welcome'}
                        </span>
                        <span className={`text-[10px] px-2 py-0.5 rounded-full font-medium ${auto.is_active ? 'bg-green-50 text-green-700' : 'bg-yellow-50 text-yellow-700'}`}>
                          {auto.is_active ? '🟢 Active' : '🟡 Paused'}
                        </span>
                      </div>
                    </div>
                    <div className="flex items-center gap-1 flex-shrink-0">
                      <button onClick={() => handleToggle(auto.id)} className={`p-2 rounded-xl transition-colors ${auto.is_active ? 'bg-green-50 text-green-600 hover:bg-green-100' : 'bg-gray-50 text-gray-400 hover:bg-gray-100'}`}>
                        {auto.is_active ? <Pause size={16} /> : <Play size={16} />}
                      </button>
                      <button onClick={() => handleEdit(auto)} className="p-2 rounded-xl hover:bg-gray-50 text-gray-400"><Edit2 size={16} /></button>
                      <div className="relative">
                        <button onClick={() => setActiveMenu(activeMenu === auto.id ? null : auto.id)} className="p-2 rounded-xl hover:bg-gray-50 text-gray-400"><MoreVertical size={16} /></button>
                        {activeMenu === auto.id && (
                          <>
                            <div className="fixed inset-0 z-10" onClick={() => setActiveMenu(null)} />
                            <div className="absolute right-0 top-10 w-40 bg-white rounded-xl shadow-xl border border-gray-100 z-20 overflow-hidden">
                              <button onClick={() => handleDuplicate(auto)} className="w-full text-left px-4 py-3 text-sm hover:bg-gray-50 flex items-center gap-2"><Copy size={14} /> Duplicate</button>
                              <button onClick={() => handleDelete(auto.id)} className="w-full text-left px-4 py-3 text-sm text-red-600 hover:bg-red-50 flex items-center gap-2"><Trash2 size={14} /> Delete</button>
                            </div>
                          </>
                        )}
                      </div>
                    </div>
                  </div>
                  {auto.keywords && auto.keywords.length > 0 && (
                    <div className="mt-2 flex items-center gap-1.5 flex-wrap">
                      <span className="text-[10px] text-gray-500 font-medium">Keywords:</span>
                      {auto.keywords.slice(0, 5).map((k, i) => (
                        <span key={i} className="text-[10px] bg-purple-100 text-purple-700 px-2 py-0.5 rounded-full font-medium">{k}</span>
                      ))}
                    </div>
                  )}
                  <div className="flex items-center gap-3 mt-3 pt-3 border-t border-gray-100 text-[10px] text-gray-500">
                    <span>🎯 <strong className="text-gray-700">{(auto.trigger_count || 0).toLocaleString()}</strong> triggered</span>
                    <span>📅 Created {new Date(auto.created_at).toLocaleDateString()}</span>
                  </div>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Quick Stats */}
      {automations.length > 0 && (
        <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
          <div className="bg-white rounded-xl p-4 border border-gray-100">
            <p className="text-2xl font-bold text-gray-900">{automations.length}</p>
            <p className="text-xs text-gray-500">Total Automations</p>
          </div>
          <div className="bg-white rounded-xl p-4 border border-gray-100">
            <p className="text-2xl font-bold text-green-600">{automations.filter(a => a.is_active).length}</p>
            <p className="text-xs text-gray-500">Active</p>
          </div>
          <div className="bg-white rounded-xl p-4 border border-gray-100">
            <p className="text-2xl font-bold text-purple-600">{automations.reduce((sum, a) => sum + (a.trigger_count || 0), 0).toLocaleString()}</p>
            <p className="text-xs text-gray-500">Total Triggered</p>
          </div>
        </div>
      )}
    </div>
  );
}
