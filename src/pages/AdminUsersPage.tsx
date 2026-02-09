import { useState, useEffect } from 'react';
import { useStore } from '../hooks/useStore';
import { UserCog, Search, Shield, Ban, Trash2, Mail, Instagram, Eye, ChevronDown, X, Download, RefreshCw } from 'lucide-react';

export function AdminUsersPage({ onNavigate: _onNavigate }: { onNavigate: (page: string) => void }) {
  // _onNavigate is available for future use (e.g., navigating to user detail page)
  void _onNavigate;
  const { allUsers, plans, loadAdminData, adminUpdateUser, adminDeleteUser } = useStore();
  const [search, setSearch] = useState('');
  const [filterPlan, setFilterPlan] = useState('all');
  const [filterStatus, setFilterStatus] = useState('all');
  const [selectedUser, setSelectedUser] = useState<string | null>(null);
  const [editingPlan, setEditingPlan] = useState<string | null>(null);
  const [selectedUsers, setSelectedUsers] = useState<Set<string>>(new Set());
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      await loadAdminData();
      setLoading(false);
    };
    load();
  }, []);

  const handleRefresh = async () => {
    setLoading(true);
    await loadAdminData();
    setLoading(false);
  };

  const filtered = allUsers.filter(u => {
    const matchSearch = u.name.toLowerCase().includes(search.toLowerCase()) || u.email.toLowerCase().includes(search.toLowerCase());
    const matchPlan = filterPlan === 'all' || u.plan === filterPlan;
    const matchStatus = filterStatus === 'all' || (filterStatus === 'active' ? !u.is_suspended : u.is_suspended);
    return matchSearch && matchPlan && matchStatus;
  });

  const selected = allUsers.find(u => u.id === selectedUser);

  const toggleSelectUser = (id: string) => {
    const next = new Set(selectedUsers);
    if (next.has(id)) next.delete(id); else next.add(id);
    setSelectedUsers(next);
  };

  const selectAll = () => {
    if (selectedUsers.size === filtered.length) {
      setSelectedUsers(new Set());
    } else {
      setSelectedUsers(new Set(filtered.map(u => u.id)));
    }
  };

  const handleChangePlan = async (userId: string, newPlan: string) => {
    try {
      await adminUpdateUser(userId, { plan: newPlan as 'free' | 'pro' | 'master' | 'legend' });
      setEditingPlan(null);
    } catch (error) {
      console.error('Failed to update plan:', error);
    }
  };

  const handleToggleSuspend = async (userId: string, currentlySuspended: boolean) => {
    try {
      await adminUpdateUser(userId, { is_suspended: !currentlySuspended });
    } catch (error) {
      console.error('Failed to toggle suspend:', error);
    }
  };

  const handleDeleteUser = async (userId: string) => {
    if (!confirm('Are you sure you want to delete this user? This action cannot be undone.')) return;
    try {
      await adminDeleteUser(userId);
      setSelectedUser(null);
    } catch (error) {
      console.error('Failed to delete user:', error);
    }
  };

  const planList = [
    { id: 'free', name: 'Free', price: plans.free.price },
    { id: 'pro', name: 'Pro', price: plans.pro.price },
    { id: 'master', name: 'Master', price: plans.master.price },
    { id: 'legend', name: 'Legend', price: plans.legend.price }
  ];

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <RefreshCw size={32} className="animate-spin text-purple-500 mx-auto mb-4" />
          <p className="text-gray-500">Loading users...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 to-cyan-400 flex items-center justify-center shadow-lg">
            <UserCog size={20} className="text-white" />
          </div>
          <div>
            <h1 className="text-2xl md:text-3xl font-bold text-gray-900">Manage Users</h1>
            <p className="text-gray-500 mt-0.5">{allUsers.length} total users</p>
          </div>
        </div>
        <div className="flex gap-2">
          <button className="inline-flex items-center gap-2 px-4 py-2.5 bg-white border border-gray-200 text-gray-700 rounded-xl font-semibold text-sm hover:bg-gray-50">
            <Download size={16} /> Export
          </button>
          <button 
            onClick={handleRefresh}
            className="inline-flex items-center gap-2 px-4 py-2.5 bg-white border border-gray-200 text-gray-700 rounded-xl font-semibold text-sm hover:bg-gray-50"
          >
            <RefreshCw size={16} className={loading ? 'animate-spin' : ''} /> Refresh
          </button>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input 
            type="text" 
            value={search} 
            onChange={e => setSearch(e.target.value)} 
            placeholder="Search users by name or email..." 
            className="w-full pl-9 pr-4 py-2.5 bg-white border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-purple-500" 
          />
        </div>
        <div className="flex gap-2 flex-wrap">
          {['all', 'free', 'pro', 'master', 'legend'].map(p => (
            <button 
              key={p} 
              onClick={() => setFilterPlan(p)} 
              className={`px-3 py-1.5 rounded-lg text-xs font-medium ${filterPlan === p ? 'bg-purple-100 text-purple-700' : 'bg-gray-50 text-gray-500 hover:bg-gray-100'}`}
            >
              {p === 'all' ? 'All Plans' : p.charAt(0).toUpperCase() + p.slice(1)}
            </button>
          ))}
          <span className="text-gray-200">|</span>
          {['all', 'active', 'suspended'].map(s => (
            <button 
              key={s} 
              onClick={() => setFilterStatus(s)} 
              className={`px-3 py-1.5 rounded-lg text-xs font-medium ${filterStatus === s ? 'bg-green-100 text-green-700' : 'bg-gray-50 text-gray-500 hover:bg-gray-100'}`}
            >
              {s.charAt(0).toUpperCase() + s.slice(1)}
            </button>
          ))}
        </div>
      </div>

      {/* Bulk Actions */}
      {selectedUsers.size > 0 && (
        <div className="bg-purple-50 border border-purple-200 rounded-xl p-3 flex items-center justify-between">
          <span className="text-sm font-medium text-purple-700">{selectedUsers.size} user(s) selected</span>
          <div className="flex gap-2">
            <button className="px-3 py-1.5 bg-white border border-gray-200 rounded-lg text-xs font-medium text-gray-700">Change Plan</button>
            <button className="px-3 py-1.5 bg-white border border-gray-200 rounded-lg text-xs font-medium text-gray-700">Send Email</button>
            <button className="px-3 py-1.5 bg-red-100 border border-red-200 rounded-lg text-xs font-medium text-red-700">Suspend</button>
          </div>
        </div>
      )}

      {/* No Users Message */}
      {allUsers.length === 0 && (
        <div className="bg-yellow-50 border border-yellow-200 rounded-2xl p-8 text-center">
          <UserCog size={48} className="text-yellow-500 mx-auto mb-4" />
          <h3 className="font-bold text-yellow-800 mb-2">No Users Yet</h3>
          <p className="text-yellow-700">
            No users have registered on the platform yet. Once users sign up using Google OAuth, they will appear here.
          </p>
        </div>
      )}

      {/* User Detail Modal */}
      {selected && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl w-full max-w-2xl p-6 shadow-2xl max-h-[90vh] overflow-auto">
            <div className="flex items-start justify-between mb-6">
              <div className="flex items-center gap-4">
                {selected.avatar ? (
                  <img src={selected.avatar} alt={selected.name} className="w-14 h-14 rounded-full" />
                ) : (
                  <div className="w-14 h-14 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center text-white text-xl font-bold">
                    {selected.name[0]?.toUpperCase() || '?'}
                  </div>
                )}
                <div>
                  <h3 className="text-xl font-bold text-gray-900">{selected.name}</h3>
                  <p className="text-sm text-gray-500">{selected.email}</p>
                  <div className="flex gap-2 mt-1">
                    <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${
                      selected.plan === 'free' ? 'bg-gray-100 text-gray-600' : 
                      selected.plan === 'pro' ? 'bg-purple-50 text-purple-700' : 
                      selected.plan === 'master' ? 'bg-blue-50 text-blue-700' : 
                      'bg-amber-50 text-amber-700'
                    }`}>{selected.plan}</span>
                    <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${
                      selected.is_suspended ? 'bg-red-50 text-red-700' : 'bg-green-50 text-green-700'
                    }`}>{selected.is_suspended ? 'Suspended' : 'Active'}</span>
                  </div>
                </div>
              </div>
              <button onClick={() => setSelectedUser(null)} className="text-gray-400 hover:text-gray-600">
                <X size={20} />
              </button>
            </div>
            
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
              <div className="bg-gray-50 rounded-xl p-3">
                <p className="text-xs text-gray-500">Messages</p>
                <p className="font-bold">{selected.message_count?.toLocaleString() || 0}</p>
              </div>
              <div className="bg-gray-50 rounded-xl p-3">
                <p className="text-xs text-gray-500">Automations</p>
                <p className="font-bold">{selected.automation_count || 0}</p>
              </div>
              <div className="bg-gray-50 rounded-xl p-3">
                <p className="text-xs text-gray-500">Contacts</p>
                <p className="font-bold">{selected.contact_count?.toLocaleString() || 0}</p>
              </div>
              <div className="bg-gray-50 rounded-xl p-3">
                <p className="text-xs text-gray-500">Plan Expires</p>
                <p className="font-bold text-sm">
                  {selected.plan_expires_at 
                    ? new Date(selected.plan_expires_at).toLocaleDateString() 
                    : 'Never'}
                </p>
              </div>
            </div>

            <div className="mb-6">
              <p className="text-sm font-medium text-gray-700 mb-2">Instagram</p>
              {selected.instagram_connected ? (
                <div className="flex items-center gap-3 p-3 bg-green-50 rounded-xl border border-green-200">
                  <Instagram size={18} className="text-green-600" />
                  <span className="text-sm font-medium text-green-700">@{selected.instagram_username} · Connected</span>
                </div>
              ) : (
                <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl border border-gray-200">
                  <Instagram size={18} className="text-gray-400" />
                  <span className="text-sm text-gray-500">Not connected</span>
                </div>
              )}
            </div>

            <div className="mb-6">
              <p className="text-sm font-medium text-gray-700 mb-2">Change Plan</p>
              <div className="grid grid-cols-4 gap-2">
                {planList.map(plan => (
                  <button 
                    key={plan.id} 
                    onClick={() => handleChangePlan(selected.id, plan.id)}
                    className={`p-3 rounded-xl border text-center text-sm font-medium transition-all ${
                      selected.plan === plan.id 
                        ? 'border-purple-300 bg-purple-50 text-purple-700' 
                        : 'border-gray-200 hover:border-purple-200 text-gray-700'
                    }`}
                  >
                    {plan.name}
                    <p className="text-xs text-gray-500 mt-0.5">₹{plan.price}/mo</p>
                  </button>
                ))}
              </div>
            </div>

            <div className="flex gap-3 flex-wrap">
              <button 
                onClick={() => handleToggleSuspend(selected.id, selected.is_suspended)} 
                className={`px-4 py-2.5 rounded-xl font-semibold text-sm ${
                  selected.is_suspended 
                    ? 'bg-green-100 text-green-700 hover:bg-green-200' 
                    : 'bg-red-100 text-red-700 hover:bg-red-200'
                }`}
              >
                {selected.is_suspended ? '✅ Activate User' : '⛔ Suspend User'}
              </button>
              <button className="px-4 py-2.5 bg-blue-100 text-blue-700 rounded-xl font-semibold text-sm hover:bg-blue-200 flex items-center gap-1">
                <Mail size={14} /> Send Email
              </button>
              <button 
                onClick={() => handleDeleteUser(selected.id)} 
                className="px-4 py-2.5 bg-red-100 text-red-700 rounded-xl font-semibold text-sm hover:bg-red-200 flex items-center gap-1"
              >
                <Trash2 size={14} /> Delete User
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Users Table */}
      {allUsers.length > 0 && (
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-gray-50 text-xs text-gray-500">
                  <th className="text-left py-3 px-4 font-medium">
                    <input 
                      type="checkbox" 
                      checked={selectedUsers.size === filtered.length && filtered.length > 0} 
                      onChange={selectAll} 
                      className="rounded" 
                    />
                  </th>
                  <th className="text-left py-3 px-4 font-medium">User</th>
                  <th className="text-left py-3 px-4 font-medium">Plan</th>
                  <th className="text-left py-3 px-4 font-medium hidden md:table-cell">Instagram</th>
                  <th className="text-left py-3 px-4 font-medium hidden md:table-cell">Messages</th>
                  <th className="text-left py-3 px-4 font-medium hidden lg:table-cell">Joined</th>
                  <th className="text-left py-3 px-4 font-medium">Status</th>
                  <th className="text-right py-3 px-4 font-medium">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map(user => (
                  <tr key={user.id} className="border-t border-gray-50 hover:bg-gray-50">
                    <td className="py-3 px-4">
                      <input 
                        type="checkbox" 
                        checked={selectedUsers.has(user.id)} 
                        onChange={() => toggleSelectUser(user.id)} 
                        className="rounded" 
                      />
                    </td>
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-3">
                        {user.avatar ? (
                          <img src={user.avatar} alt={user.name} className="w-9 h-9 rounded-full" />
                        ) : (
                          <div className="w-9 h-9 rounded-full bg-gradient-to-br from-purple-400 to-pink-400 flex items-center justify-center text-white text-sm font-bold">
                            {user.name[0]?.toUpperCase() || '?'}
                          </div>
                        )}
                        <div>
                          <p className="text-sm font-medium text-gray-900">{user.name}</p>
                          <p className="text-xs text-gray-500">{user.email}</p>
                        </div>
                      </div>
                    </td>
                    <td className="py-3 px-4">
                      <div className="relative">
                        <button
                          onClick={() => setEditingPlan(editingPlan === user.id ? null : user.id)}
                          className={`text-xs px-2.5 py-1 rounded-full font-medium flex items-center gap-1 ${
                            user.plan === 'free' ? 'bg-gray-100 text-gray-600' :
                            user.plan === 'pro' ? 'bg-purple-50 text-purple-700' :
                            user.plan === 'master' ? 'bg-blue-50 text-blue-700' :
                            'bg-amber-50 text-amber-700'
                          }`}
                        >
                          {user.plan} <ChevronDown size={10} />
                        </button>
                        {editingPlan === user.id && (
                          <div className="absolute left-0 top-8 w-36 bg-white rounded-xl shadow-xl border border-gray-100 z-20 overflow-hidden">
                            {planList.map(p => (
                              <button 
                                key={p.id} 
                                onClick={() => handleChangePlan(user.id, p.id)}
                                className="w-full text-left px-3 py-2 text-xs hover:bg-gray-50 font-medium"
                              >
                                {p.name} - ₹{p.price}/mo
                              </button>
                            ))}
                          </div>
                        )}
                      </div>
                    </td>
                    <td className="py-3 px-4 hidden md:table-cell">
                      {user.instagram_connected ? (
                        <span className="text-sm text-gray-600 flex items-center gap-1">
                          <Instagram size={12} className="text-pink-500" /> @{user.instagram_username}
                        </span>
                      ) : (
                        <span className="text-xs text-gray-400">Not connected</span>
                      )}
                    </td>
                    <td className="py-3 px-4 hidden md:table-cell">
                      <span className="text-sm text-gray-600">{user.message_count?.toLocaleString() || 0}</span>
                    </td>
                    <td className="py-3 px-4 hidden lg:table-cell">
                      <span className="text-xs text-gray-500">
                        {new Date(user.created_at).toLocaleDateString()}
                      </span>
                    </td>
                    <td className="py-3 px-4">
                      <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${
                        user.is_suspended ? 'bg-red-50 text-red-700' : 'bg-green-50 text-green-700'
                      }`}>
                        {user.is_suspended ? 'Suspended' : 'Active'}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-right">
                      <div className="flex items-center justify-end gap-1">
                        <button 
                          onClick={() => setSelectedUser(user.id)} 
                          className="p-1.5 hover:bg-gray-100 rounded-lg text-gray-400 hover:text-purple-600" 
                          title="View"
                        >
                          <Eye size={14} />
                        </button>
                        <button 
                          onClick={() => handleToggleSuspend(user.id, user.is_suspended)}
                          className={`p-1.5 rounded-lg ${
                            user.is_suspended 
                              ? 'hover:bg-green-50 text-gray-400 hover:text-green-500' 
                              : 'hover:bg-red-50 text-gray-400 hover:text-red-500'
                          }`} 
                          title={user.is_suspended ? 'Activate' : 'Suspend'}
                        >
                          {user.is_suspended ? <Shield size={14} /> : <Ban size={14} />}
                        </button>
                        <button 
                          onClick={() => handleDeleteUser(user.id)} 
                          className="p-1.5 hover:bg-red-50 rounded-lg text-gray-400 hover:text-red-500" 
                          title="Delete"
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          {filtered.length === 0 && allUsers.length > 0 && (
            <div className="p-12 text-center">
              <UserCog size={48} className="text-gray-300 mx-auto mb-4" />
              <p className="text-gray-500">No users match your filters</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
