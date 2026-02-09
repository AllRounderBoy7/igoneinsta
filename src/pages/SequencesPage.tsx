import { useState } from 'react';
import { ListOrdered, Plus, Clock, MessageCircle, Play, Pause, Trash2, Edit2 } from 'lucide-react';

interface Sequence {
  id: string;
  name: string;
  status: 'active' | 'paused' | 'draft';
  steps: { day: number; message: string; sent: number; opened: number }[];
  subscribers: number;
  completed: number;
}

const demoSequences: Sequence[] = [
  {
    id: '1', name: 'New Subscriber Welcome', status: 'active', subscribers: 340, completed: 120,
    steps: [
      { day: 0, message: 'Welcome! 🎉 So glad you\'re here. Here\'s what we\'re all about...', sent: 340, opened: 290 },
      { day: 1, message: 'Day 2: Here\'s our top content you don\'t want to miss! 📱', sent: 310, opened: 245 },
      { day: 3, message: 'Day 4: Ready for a special offer? Use code WELCOME20 for 20% off! 🛍️', sent: 280, opened: 220 },
      { day: 7, message: 'Week 1 check-in: How are you enjoying our content? Reply to let us know!', sent: 240, opened: 180 },
    ],
  },
  {
    id: '2', name: 'Abandoned Cart Recovery', status: 'active', subscribers: 156, completed: 45,
    steps: [
      { day: 0, message: 'Hey! Looks like you left something in your cart 🛒', sent: 156, opened: 130 },
      { day: 1, message: 'Still thinking about it? Here\'s 10% off to help you decide! 💰', sent: 140, opened: 110 },
      { day: 3, message: 'Last chance! Your cart items are selling fast ⚡', sent: 120, opened: 85 },
    ],
  },
];

export function SequencesPage() {
  const [sequences, setSequences] = useState(demoSequences);
  const [showCreate, setShowCreate] = useState(false);
  const [newName, setNewName] = useState('');
  const [newSteps, setNewSteps] = useState([{ day: 0, message: '' }]);
  const [editId, setEditId] = useState<string | null>(null);

  const handleCreate = () => {
    if (!newName || newSteps[0].message === '') return;
    setSequences([...sequences, {
      id: Date.now().toString(),
      name: newName,
      status: 'draft',
      subscribers: 0,
      completed: 0,
      steps: newSteps.map(s => ({ ...s, sent: 0, opened: 0 })),
    }]);
    setShowCreate(false);
    setNewName('');
    setNewSteps([{ day: 0, message: '' }]);
  };

  const toggleSequence = (id: string) => {
    setSequences(sequences.map(s => s.id === id ? { ...s, status: s.status === 'active' ? 'paused' : 'active' } : s));
  };

  const deleteSequence = (id: string) => {
    setSequences(sequences.filter(s => s.id !== id));
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-gray-900">Sequences</h1>
          <p className="text-gray-500 mt-1">Automated drip campaigns over time</p>
        </div>
        <button onClick={() => setShowCreate(true)} className="inline-flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-purple-600 to-pink-500 text-white rounded-xl font-semibold text-sm shadow-lg shadow-purple-200">
          <Plus size={16} /> New Sequence
        </button>
      </div>

      {showCreate && (
        <div className="bg-white rounded-2xl p-6 border border-gray-200 shadow-lg">
          <h3 className="text-lg font-bold mb-4">Create Sequence</h3>
          <div className="space-y-4">
            <div>
              <label className="text-sm font-medium text-gray-700 mb-1 block">Sequence Name</label>
              <input value={newName} onChange={e => setNewName(e.target.value)} placeholder="e.g. Welcome Series" className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-purple-500" />
            </div>
            <div>
              <label className="text-sm font-medium text-gray-700 mb-2 block">Steps</label>
              {newSteps.map((step, i) => (
                <div key={i} className="flex gap-3 mb-3">
                  <div className="w-20">
                    <label className="text-xs text-gray-500">Day</label>
                    <input type="number" value={step.day} onChange={e => {
                      const updated = [...newSteps];
                      updated[i].day = Number(e.target.value);
                      setNewSteps(updated);
                    }} className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm" />
                  </div>
                  <div className="flex-1">
                    <label className="text-xs text-gray-500">Message</label>
                    <input value={step.message} onChange={e => {
                      const updated = [...newSteps];
                      updated[i].message = e.target.value;
                      setNewSteps(updated);
                    }} placeholder="Message content..." className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm" />
                  </div>
                </div>
              ))}
              <button onClick={() => setNewSteps([...newSteps, { day: newSteps[newSteps.length - 1].day + 1, message: '' }])} className="text-sm text-purple-600 font-medium">+ Add Step</button>
            </div>
            <div className="flex gap-3">
              <button onClick={handleCreate} className="px-6 py-2.5 bg-gradient-to-r from-purple-600 to-pink-500 text-white rounded-xl font-semibold text-sm">Create Sequence</button>
              <button onClick={() => setShowCreate(false)} className="px-6 py-2.5 bg-gray-100 text-gray-700 rounded-xl font-semibold text-sm">Cancel</button>
            </div>
          </div>
        </div>
      )}

      {/* Sequences List */}
      <div className="space-y-4">
        {sequences.length === 0 ? (
          <div className="bg-white rounded-2xl p-12 text-center border border-gray-100">
            <ListOrdered size={48} className="text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-700 mb-2">No sequences yet</h3>
            <p className="text-gray-500 text-sm">Create drip campaigns to nurture leads</p>
          </div>
        ) : (
          sequences.map(seq => (
            <div key={seq.id} className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <div className="flex items-center gap-3">
                    <h3 className="font-bold text-gray-900">{seq.name}</h3>
                    <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${seq.status === 'active' ? 'bg-green-50 text-green-700' : seq.status === 'paused' ? 'bg-yellow-50 text-yellow-700' : 'bg-gray-50 text-gray-500'}`}>{seq.status}</span>
                  </div>
                  <div className="flex gap-4 mt-1 text-xs text-gray-500">
                    <span>{seq.subscribers} subscribers</span>
                    <span>{seq.completed} completed</span>
                    <span>{seq.steps.length} steps</span>
                  </div>
                </div>
                <div className="flex gap-1">
                  <button onClick={() => toggleSequence(seq.id)} className={`p-2 rounded-lg ${seq.status === 'active' ? 'text-green-600 bg-green-50' : 'text-gray-400 bg-gray-50'}`}>
                    {seq.status === 'active' ? <Pause size={16} /> : <Play size={16} />}
                  </button>
                  <button onClick={() => setEditId(editId === seq.id ? null : seq.id)} className="p-2 rounded-lg text-gray-400 bg-gray-50"><Edit2 size={16} /></button>
                  <button onClick={() => deleteSequence(seq.id)} className="p-2 rounded-lg text-red-400 bg-red-50"><Trash2 size={16} /></button>
                </div>
              </div>

              {/* Steps timeline */}
              <div className="space-y-3">
                {seq.steps.map((step, i) => (
                  <div key={i} className="flex gap-4">
                    <div className="flex flex-col items-center">
                      <div className="w-8 h-8 rounded-full bg-purple-100 flex items-center justify-center">
                        {step.day === 0 ? <MessageCircle size={14} className="text-purple-600" /> : <Clock size={14} className="text-purple-600" />}
                      </div>
                      {i < seq.steps.length - 1 && <div className="w-0.5 h-full bg-purple-100 mt-1"></div>}
                    </div>
                    <div className="flex-1 pb-3">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-xs font-semibold text-purple-700 bg-purple-50 px-2 py-0.5 rounded-full">Day {step.day}</span>
                        <span className="text-xs text-gray-400">{step.sent} sent · {step.opened} opened</span>
                      </div>
                      <p className="text-sm text-gray-700 bg-gray-50 p-3 rounded-xl">{step.message}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
