import { useState } from 'react';
import { useStore } from '../useStore';
import { Send, Plus, Clock, CheckCircle, Users, Eye, MousePointer2 } from 'lucide-react';

export function BroadcastsPage() {
  const { store } = useStore();
  const [showCreate, setShowCreate] = useState(false);
  const [name, setName] = useState('');
  const [content, setContent] = useState('');
  const [targetTags, setTargetTags] = useState('');

  const handleCreate = () => {
    if (!name || !content) return;
    store.addBroadcast({
      name,
      content,
      status: 'draft',
      recipients: store.contacts.length,
      delivered: 0,
      opened: 0,
      clicked: 0,
      targetTags: targetTags ? targetTags.split(',').map(t => t.trim()) : [],
    });
    setShowCreate(false);
    setName('');
    setContent('');
    setTargetTags('');
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-gray-900">Broadcasts</h1>
          <p className="text-gray-500 mt-1">Send targeted mass messages to your contacts</p>
        </div>
        <button onClick={() => setShowCreate(true)} className="inline-flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-purple-600 to-pink-500 text-white rounded-xl font-semibold text-sm shadow-lg shadow-purple-200">
          <Plus size={16} /> New Broadcast
        </button>
      </div>

      {showCreate && (
        <div className="bg-white rounded-2xl p-6 border border-gray-200 shadow-lg">
          <h3 className="text-lg font-bold mb-4">Create Broadcast</h3>
          <div className="space-y-4">
            <div>
              <label className="text-sm font-medium text-gray-700 mb-1 block">Broadcast Name</label>
              <input value={name} onChange={e => setName(e.target.value)} placeholder="e.g. Weekend Sale Announcement" className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-purple-500" />
            </div>
            <div>
              <label className="text-sm font-medium text-gray-700 mb-1 block">Message Content</label>
              <textarea value={content} onChange={e => setContent(e.target.value)} placeholder="Type your broadcast message... Use {{name}} for personalization" rows={5} className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-purple-500 resize-none" />
            </div>
            <div>
              <label className="text-sm font-medium text-gray-700 mb-1 block">Target Tags (comma separated, leave empty for all)</label>
              <input value={targetTags} onChange={e => setTargetTags(e.target.value)} placeholder="e.g. customer, vip, lead" className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-purple-500" />
            </div>
            <div className="bg-blue-50 rounded-xl p-4">
              <p className="text-sm text-blue-700">📣 This will be sent to <strong>{store.contacts.length}</strong> contacts{targetTags ? ` with tags: ${targetTags}` : ''}</p>
            </div>
            <div className="flex gap-3">
              <button onClick={handleCreate} className="px-6 py-2.5 bg-gradient-to-r from-purple-600 to-pink-500 text-white rounded-xl font-semibold text-sm">Create Draft</button>
              <button onClick={() => setShowCreate(false)} className="px-6 py-2.5 bg-gray-100 text-gray-700 rounded-xl font-semibold text-sm">Cancel</button>
            </div>
          </div>
        </div>
      )}

      {/* Broadcasts List */}
      {store.broadcasts.length === 0 && !showCreate ? (
        <div className="bg-white rounded-2xl p-12 text-center border border-gray-100">
          <Send size={48} className="text-gray-300 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-gray-700 mb-2">No broadcasts yet</h3>
          <p className="text-gray-500 text-sm mb-4">Create your first broadcast to reach your audience</p>
          <button onClick={() => setShowCreate(true)} className="px-6 py-2.5 bg-gradient-to-r from-purple-600 to-pink-500 text-white rounded-xl font-semibold text-sm">Create Broadcast</button>
        </div>
      ) : (
        <div className="space-y-3">
          {store.broadcasts.map(bc => (
            <div key={bc.id} className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm">
              <div className="flex items-start justify-between">
                <div>
                  <h3 className="font-semibold text-gray-900">{bc.name}</h3>
                  <p className="text-sm text-gray-500 mt-1 line-clamp-2">{bc.content}</p>
                  <div className="flex items-center gap-4 mt-3">
                    <span className={`text-xs px-2 py-1 rounded-full font-medium ${
                      bc.status === 'sent' ? 'bg-green-50 text-green-700' :
                      bc.status === 'draft' ? 'bg-gray-50 text-gray-600' :
                      bc.status === 'scheduled' ? 'bg-blue-50 text-blue-700' :
                      'bg-yellow-50 text-yellow-700'
                    }`}>
                      {bc.status === 'sent' && <CheckCircle size={12} className="inline mr-1" />}
                      {bc.status === 'draft' && <Clock size={12} className="inline mr-1" />}
                      {bc.status}
                    </span>
                    <span className="text-xs text-gray-400 flex items-center gap-1"><Users size={12} /> {bc.recipients} recipients</span>
                    {bc.status === 'sent' && (
                      <>
                        <span className="text-xs text-gray-400 flex items-center gap-1"><Eye size={12} /> {bc.opened} opened</span>
                        <span className="text-xs text-gray-400 flex items-center gap-1"><MousePointer2 size={12} /> {bc.clicked} clicked</span>
                      </>
                    )}
                  </div>
                </div>
                {bc.status === 'draft' && (
                  <button onClick={() => store.sendBroadcast(bc.id)} className="px-4 py-2 bg-gradient-to-r from-purple-600 to-pink-500 text-white rounded-lg text-sm font-semibold flex items-center gap-2">
                    <Send size={14} /> Send Now
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
