import { useState } from 'react';
import { useStore } from '../useStore';
import { Users, Search, Plus, Tag, Trash2, Edit2, X, UserPlus, Download } from 'lucide-react';

export function ContactsPage() {
  const { store } = useStore();
  const [search, setSearch] = useState('');
  const [filterTag, setFilterTag] = useState('all');
  const [showAdd, setShowAdd] = useState(false);
  const [selectedContact, setSelectedContact] = useState<string | null>(null);
  const [newTag, setNewTag] = useState('');
  const [newContact, setNewContact] = useState({ username: '', name: '', email: '', notes: '' });

  const allTags = Array.from(new Set(store.contacts.flatMap(c => c.tags)));
  const filtered = store.contacts.filter(c => {
    const matchSearch = c.name.toLowerCase().includes(search.toLowerCase()) || c.username.toLowerCase().includes(search.toLowerCase());
    const matchTag = filterTag === 'all' || c.tags.includes(filterTag);
    return matchSearch && matchTag;
  });

  const handleAddContact = () => {
    if (!newContact.username) return;
    store.addContact({
      username: newContact.username,
      name: newContact.name || newContact.username,
      avatar: '',
      isFollower: false,
      tags: [],
      lastInteraction: new Date().toISOString().split('T')[0],
      messageCount: 0,
      source: 'manual',
      email: newContact.email,
      notes: newContact.notes,
    });
    setShowAdd(false);
    setNewContact({ username: '', name: '', email: '', notes: '' });
  };

  const selected = store.contacts.find(c => c.id === selectedContact);

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-gray-900">Contacts</h1>
          <p className="text-gray-500 mt-1">{store.contacts.length} total contacts</p>
        </div>
        <div className="flex gap-2">
          <button onClick={() => setShowAdd(true)} className="inline-flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-purple-600 to-pink-500 text-white rounded-xl font-semibold text-sm shadow-lg shadow-purple-200">
            <UserPlus size={16} /> Add Contact
          </button>
          <button className="inline-flex items-center gap-2 px-4 py-2.5 bg-white border border-gray-200 text-gray-700 rounded-xl font-semibold text-sm">
            <Download size={16} /> Export
          </button>
        </div>
      </div>

      {/* Add Modal */}
      {showAdd && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl w-full max-w-md p-6 shadow-2xl">
            <h3 className="text-lg font-bold mb-4">Add Contact</h3>
            <div className="space-y-3">
              <input value={newContact.username} onChange={e => setNewContact({...newContact, username: e.target.value})} placeholder="Instagram username" className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-purple-500" />
              <input value={newContact.name} onChange={e => setNewContact({...newContact, name: e.target.value})} placeholder="Full name" className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-purple-500" />
              <input value={newContact.email} onChange={e => setNewContact({...newContact, email: e.target.value})} placeholder="Email (optional)" className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-purple-500" />
              <textarea value={newContact.notes} onChange={e => setNewContact({...newContact, notes: e.target.value})} placeholder="Notes" rows={3} className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-purple-500 resize-none" />
              <div className="flex gap-3">
                <button onClick={handleAddContact} className="px-6 py-2.5 bg-gradient-to-r from-purple-600 to-pink-500 text-white rounded-xl font-semibold text-sm">Add</button>
                <button onClick={() => setShowAdd(false)} className="px-6 py-2.5 bg-gray-100 text-gray-700 rounded-xl font-semibold text-sm">Cancel</button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Contact Detail */}
      {selected && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl w-full max-w-lg p-6 shadow-2xl">
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center text-white font-bold">{selected.name[0]}</div>
                <div>
                  <h3 className="font-bold text-gray-900">{selected.name}</h3>
                  <p className="text-sm text-gray-500">@{selected.username}</p>
                </div>
              </div>
              <button onClick={() => setSelectedContact(null)} className="text-gray-400 hover:text-gray-600"><X size={20} /></button>
            </div>
            <div className="grid grid-cols-2 gap-4 mb-4">
              <div className="bg-gray-50 rounded-xl p-3"><p className="text-xs text-gray-500">Messages</p><p className="font-bold">{selected.messageCount}</p></div>
              <div className="bg-gray-50 rounded-xl p-3"><p className="text-xs text-gray-500">Source</p><p className="font-bold capitalize">{selected.source}</p></div>
              <div className="bg-gray-50 rounded-xl p-3"><p className="text-xs text-gray-500">Last Active</p><p className="font-bold text-sm">{selected.lastInteraction}</p></div>
              <div className="bg-gray-50 rounded-xl p-3"><p className="text-xs text-gray-500">Follower</p><p className="font-bold">{selected.isFollower ? 'Yes ✓' : 'No'}</p></div>
            </div>
            {selected.email && <p className="text-sm text-gray-600 mb-2">📧 {selected.email}</p>}
            {selected.phone && <p className="text-sm text-gray-600 mb-2">📱 {selected.phone}</p>}
            {selected.notes && <p className="text-sm text-gray-500 mb-4 bg-yellow-50 p-3 rounded-xl">📝 {selected.notes}</p>}
            <div className="mb-4">
              <p className="text-sm font-medium text-gray-700 mb-2">Tags</p>
              <div className="flex flex-wrap gap-2">
                {selected.tags.map(tag => (
                  <span key={tag} className="flex items-center gap-1 px-3 py-1 bg-purple-50 text-purple-700 rounded-full text-xs font-medium">
                    {tag}
                    <button onClick={() => store.removeTagFromContact(selected.id, tag)} className="hover:text-red-500"><X size={12} /></button>
                  </span>
                ))}
                <div className="flex items-center gap-1">
                  <input value={newTag} onChange={e => setNewTag(e.target.value)} placeholder="Add tag" className="px-2 py-1 border border-gray-200 rounded-lg text-xs w-20 focus:outline-none focus:ring-1 focus:ring-purple-500" />
                  <button onClick={() => { if (newTag) { store.addTagToContact(selected.id, newTag); setNewTag(''); } }} className="p-1 text-purple-600"><Plus size={14} /></button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input type="text" value={search} onChange={e => setSearch(e.target.value)} placeholder="Search contacts..." className="w-full pl-9 pr-4 py-2.5 bg-white border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-purple-500" />
        </div>
        <div className="flex items-center gap-2 flex-wrap">
          <Tag size={14} className="text-gray-400" />
          <button onClick={() => setFilterTag('all')} className={`px-3 py-1.5 rounded-lg text-xs font-medium ${filterTag === 'all' ? 'bg-purple-100 text-purple-700' : 'bg-gray-50 text-gray-500'}`}>All</button>
          {allTags.map(tag => (
            <button key={tag} onClick={() => setFilterTag(tag)} className={`px-3 py-1.5 rounded-lg text-xs font-medium ${filterTag === tag ? 'bg-purple-100 text-purple-700' : 'bg-gray-50 text-gray-500'}`}>{tag}</button>
          ))}
        </div>
      </div>

      {/* Contacts Table */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-gray-50 text-xs text-gray-500">
                <th className="text-left py-3 px-4 font-medium">Contact</th>
                <th className="text-left py-3 px-4 font-medium">Tags</th>
                <th className="text-left py-3 px-4 font-medium hidden md:table-cell">Source</th>
                <th className="text-left py-3 px-4 font-medium hidden md:table-cell">Messages</th>
                <th className="text-left py-3 px-4 font-medium hidden md:table-cell">Last Active</th>
                <th className="text-right py-3 px-4 font-medium">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map(contact => (
                <tr key={contact.id} className="border-t border-gray-50 hover:bg-gray-50 cursor-pointer" onClick={() => setSelectedContact(contact.id)}>
                  <td className="py-3 px-4">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-full bg-gradient-to-br from-purple-400 to-pink-400 flex items-center justify-center text-white text-sm font-bold">{contact.name[0]}</div>
                      <div>
                        <p className="text-sm font-medium text-gray-900">{contact.name}</p>
                        <p className="text-xs text-gray-500">@{contact.username}</p>
                      </div>
                    </div>
                  </td>
                  <td className="py-3 px-4">
                    <div className="flex gap-1 flex-wrap">
                      {contact.tags.slice(0, 2).map(tag => (
                        <span key={tag} className="px-2 py-0.5 bg-purple-50 text-purple-700 rounded-full text-[10px] font-medium">{tag}</span>
                      ))}
                      {contact.tags.length > 2 && <span className="text-xs text-gray-400">+{contact.tags.length - 2}</span>}
                    </div>
                  </td>
                  <td className="py-3 px-4 hidden md:table-cell"><span className="text-xs text-gray-500 capitalize">{contact.source}</span></td>
                  <td className="py-3 px-4 hidden md:table-cell"><span className="text-sm text-gray-600">{contact.messageCount}</span></td>
                  <td className="py-3 px-4 hidden md:table-cell"><span className="text-xs text-gray-500">{contact.lastInteraction}</span></td>
                  <td className="py-3 px-4 text-right" onClick={e => e.stopPropagation()}>
                    <div className="flex items-center justify-end gap-1">
                      <button onClick={() => setSelectedContact(contact.id)} className="p-1.5 hover:bg-gray-100 rounded-lg text-gray-400"><Edit2 size={14} /></button>
                      <button onClick={() => store.deleteContact(contact.id)} className="p-1.5 hover:bg-red-50 rounded-lg text-gray-400 hover:text-red-500"><Trash2 size={14} /></button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {filtered.length === 0 && (
          <div className="p-12 text-center">
            <Users size={48} className="text-gray-300 mx-auto mb-4" />
            <p className="text-gray-500">No contacts found</p>
          </div>
        )}
      </div>
    </div>
  );
}
