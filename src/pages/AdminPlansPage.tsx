import { useState } from 'react';
import { useStore } from '../useStore';
import { CreditCard, Edit2, Save, X, Plus, Trash2, DollarSign, Check, Clock, CheckCircle, XCircle, AlertTriangle, RefreshCw, Settings } from 'lucide-react';
import type { Plan } from '../store';

export function AdminPlansPage() {
  const { store } = useStore();
  const [editingPlan, setEditingPlan] = useState<string | null>(null);
  const [editData, setEditData] = useState<Partial<Plan>>({});
  const [showCreate, setShowCreate] = useState(false);
  const [activeTab, setActiveTab] = useState<'plans' | 'payments' | 'settings'>('payments');
  const [newPlan, setNewPlan] = useState<{name: string; price: number; interval: 'month' | 'year'; messagesLimit: number; automationsLimit: number; contactsLimit: number; features: string[]}>({
    name: '', price: 0, interval: 'month', messagesLimit: 1000,
    automationsLimit: 10, contactsLimit: 500, features: [''],
  });
  const [paymentUPI, setPaymentUPI] = useState(store.adminSettings.paymentUPI);
  const [paymentPhone, setPaymentPhone] = useState(store.adminSettings.paymentPhone);

  const pendingPayments = store.adminSettings.paymentRequests.filter(p => p.status === 'pending');
  const allPayments = store.adminSettings.paymentRequests;

  const startEdit = (plan: Plan) => {
    setEditingPlan(plan.id);
    setEditData({ ...plan });
  };

  const saveEdit = () => {
    if (editingPlan && editData) {
      store.updatePlan(editingPlan, editData);
      setEditingPlan(null);
      setEditData({});
    }
  };

  const handleCreatePlan = () => {
    if (!newPlan.name) return;
    const id = newPlan.name.toLowerCase().replace(/\\s+/g, '_');
    store.plans.push({
      id,
      name: newPlan.name,
      price: newPlan.price,
      interval: newPlan.interval,
      messagesLimit: newPlan.messagesLimit,
      automationsLimit: newPlan.automationsLimit,
      contactsLimit: newPlan.contactsLimit,
      features: newPlan.features.filter(f => f.trim() !== ''),
    });
    store.adminSettings.plans = [...store.plans];
    setShowCreate(false);
    setNewPlan({ name: '', price: 0, interval: 'month', messagesLimit: 1000, automationsLimit: 10, contactsLimit: 500, features: [''] });
  };

  const savePaymentSettings = () => {
    store.updatePaymentSettings(paymentUPI, paymentPhone);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center shadow-lg">
            <CreditCard size={20} className="text-white" />
          </div>
          <div>
            <h1 className="text-2xl md:text-3xl font-bold text-gray-900">Plans & Payments</h1>
            <p className="text-gray-500 mt-0.5">Manage pricing, payments, and subscriptions</p>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 border-b border-gray-200 pb-1">
        <button
          onClick={() => setActiveTab('payments')}
          className={`px-4 py-2 rounded-t-lg font-medium text-sm transition-colors ${activeTab === 'payments' ? 'bg-white border border-b-white border-gray-200 -mb-px text-purple-700' : 'text-gray-500 hover:text-gray-700'}`}
        >
          💳 Payments {pendingPayments.length > 0 && <span className="ml-1 bg-red-500 text-white text-xs px-1.5 py-0.5 rounded-full">{pendingPayments.length}</span>}
        </button>
        <button
          onClick={() => setActiveTab('plans')}
          className={`px-4 py-2 rounded-t-lg font-medium text-sm transition-colors ${activeTab === 'plans' ? 'bg-white border border-b-white border-gray-200 -mb-px text-purple-700' : 'text-gray-500 hover:text-gray-700'}`}
        >
          📦 Plans
        </button>
        <button
          onClick={() => setActiveTab('settings')}
          className={`px-4 py-2 rounded-t-lg font-medium text-sm transition-colors ${activeTab === 'settings' ? 'bg-white border border-b-white border-gray-200 -mb-px text-purple-700' : 'text-gray-500 hover:text-gray-700'}`}
        >
          ⚙️ Settings
        </button>
      </div>

      {/* Payments Tab */}
      {activeTab === 'payments' && (
        <div className="space-y-6">
          {/* Stats */}
          <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
            <div className="bg-yellow-50 rounded-2xl p-5 border border-yellow-200">
              <div className="flex items-center gap-3">
                <Clock size={24} className="text-yellow-600" />
                <div>
                  <p className="text-2xl font-bold text-yellow-700">{pendingPayments.length}</p>
                  <p className="text-xs text-yellow-600">Pending</p>
                </div>
              </div>
            </div>
            <div className="bg-green-50 rounded-2xl p-5 border border-green-200">
              <div className="flex items-center gap-3">
                <CheckCircle size={24} className="text-green-600" />
                <div>
                  <p className="text-2xl font-bold text-green-700">{allPayments.filter(p => p.status === 'approved').length}</p>
                  <p className="text-xs text-green-600">Approved</p>
                </div>
              </div>
            </div>
            <div className="bg-red-50 rounded-2xl p-5 border border-red-200">
              <div className="flex items-center gap-3">
                <XCircle size={24} className="text-red-600" />
                <div>
                  <p className="text-2xl font-bold text-red-700">{allPayments.filter(p => p.status === 'rejected').length}</p>
                  <p className="text-xs text-red-600">Rejected</p>
                </div>
              </div>
            </div>
            <div className="bg-purple-50 rounded-2xl p-5 border border-purple-200">
              <div className="flex items-center gap-3">
                <DollarSign size={24} className="text-purple-600" />
                <div>
                  <p className="text-2xl font-bold text-purple-700">₹{allPayments.filter(p => p.status === 'approved').reduce((acc, p) => acc + p.amount, 0).toLocaleString()}</p>
                  <p className="text-xs text-purple-600">Total Revenue</p>
                </div>
              </div>
            </div>
          </div>

          {/* Pending Payments */}
          {pendingPayments.length > 0 && (
            <div className="bg-yellow-50 rounded-2xl p-5 border-2 border-yellow-300">
              <h3 className="font-bold text-yellow-800 mb-4 flex items-center gap-2">
                <AlertTriangle size={18} />
                Pending Payments ({pendingPayments.length})
              </h3>
              <div className="space-y-3">
                {pendingPayments.map(payment => (
                  <div key={payment.id} className="bg-white rounded-xl p-4 border border-yellow-200">
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="font-bold text-gray-900">{payment.userName}</span>
                          <span className="text-xs text-gray-500">{payment.userEmail}</span>
                        </div>
                        <div className="flex flex-wrap gap-2 text-xs">
                          <span className="bg-purple-100 text-purple-700 px-2 py-0.5 rounded-full font-medium">
                            {payment.planName} Plan
                          </span>
                          <span className="bg-green-100 text-green-700 px-2 py-0.5 rounded-full font-bold">
                            ₹{payment.amount}
                          </span>
                          <span className="bg-gray-100 text-gray-600 px-2 py-0.5 rounded-full font-mono">
                            UTR: {payment.utrNumber}
                          </span>
                          <span className="bg-blue-100 text-blue-700 px-2 py-0.5 rounded-full">
                            {payment.paymentMethod.toUpperCase()}
                          </span>
                        </div>
                        <p className="text-[10px] text-gray-400 mt-1">
                          Submitted: {new Date(payment.createdAt).toLocaleString()}
                        </p>
                      </div>
                      <div className="flex gap-2">
                        <button
                          onClick={() => store.approvePayment(payment.id)}
                          className="px-4 py-2 bg-green-500 text-white rounded-lg text-sm font-bold hover:bg-green-600 flex items-center gap-1"
                        >
                          <CheckCircle size={14} /> Approve
                        </button>
                        <button
                          onClick={() => store.rejectPayment(payment.id, 'Invalid UTR')}
                          className="px-4 py-2 bg-red-500 text-white rounded-lg text-sm font-bold hover:bg-red-600 flex items-center gap-1"
                        >
                          <XCircle size={14} /> Reject
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* All Payments History */}
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
            <div className="p-4 border-b border-gray-100 flex items-center justify-between">
              <h3 className="font-bold text-gray-900">Payment History</h3>
              <button className="text-sm text-purple-600 font-medium flex items-center gap-1">
                <RefreshCw size={14} /> Refresh
              </button>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="bg-gray-50 text-xs text-gray-500">
                    <th className="text-left py-3 px-4 font-medium">User</th>
                    <th className="text-left py-3 px-4 font-medium">Plan</th>
                    <th className="text-left py-3 px-4 font-medium">Amount</th>
                    <th className="text-left py-3 px-4 font-medium">UTR</th>
                    <th className="text-left py-3 px-4 font-medium">Status</th>
                    <th className="text-left py-3 px-4 font-medium">Date</th>
                  </tr>
                </thead>
                <tbody>
                  {allPayments.length === 0 ? (
                    <tr>
                      <td colSpan={6} className="py-12 text-center text-gray-400">
                        No payments yet
                      </td>
                    </tr>
                  ) : (
                    allPayments.slice().reverse().map(payment => (
                      <tr key={payment.id} className="border-t border-gray-50 hover:bg-gray-50">
                        <td className="py-3 px-4">
                          <p className="text-sm font-medium text-gray-900">{payment.userName}</p>
                          <p className="text-xs text-gray-500">{payment.userEmail}</p>
                        </td>
                        <td className="py-3 px-4">
                          <span className="text-xs bg-purple-50 text-purple-700 px-2 py-0.5 rounded-full font-medium">
                            {payment.planName}
                          </span>
                        </td>
                        <td className="py-3 px-4">
                          <span className="font-bold text-gray-900">₹{payment.amount}</span>
                        </td>
                        <td className="py-3 px-4">
                          <code className="text-xs bg-gray-100 px-2 py-0.5 rounded">{payment.utrNumber}</code>
                        </td>
                        <td className="py-3 px-4">
                          <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${
                            payment.status === 'approved' ? 'bg-green-50 text-green-700' :
                            payment.status === 'rejected' ? 'bg-red-50 text-red-700' :
                            'bg-yellow-50 text-yellow-700'
                          }`}>
                            {payment.status === 'approved' ? '✅' : payment.status === 'rejected' ? '❌' : '⏳'} {payment.status}
                          </span>
                        </td>
                        <td className="py-3 px-4 text-xs text-gray-500">
                          {new Date(payment.createdAt).toLocaleDateString()}
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* Plans Tab */}
      {activeTab === 'plans' && (
        <div className="space-y-6">
          <div className="flex justify-end">
            <button onClick={() => setShowCreate(true)} className="inline-flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-purple-600 to-pink-500 text-white rounded-xl font-semibold text-sm shadow-lg">
              <Plus size={16} /> Create Plan
            </button>
          </div>

          {/* Create Plan Modal */}
          {showCreate && (
            <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
              <div className="bg-white rounded-2xl w-full max-w-lg p-6 shadow-2xl max-h-[90vh] overflow-auto">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-bold">Create New Plan</h3>
                  <button onClick={() => setShowCreate(false)} className="text-gray-400 hover:text-gray-600"><X size={20} /></button>
                </div>
                <div className="space-y-4">
                  <div>
                    <label className="text-sm font-medium text-gray-700 mb-1 block">Plan Name</label>
                    <input value={newPlan.name} onChange={e => setNewPlan({...newPlan, name: e.target.value})} placeholder="e.g. Starter" className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm" />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="text-sm font-medium text-gray-700 mb-1 block">Price (₹)</label>
                      <input type="number" value={newPlan.price} onChange={e => setNewPlan({...newPlan, price: Number(e.target.value)})} className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm" />
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-700 mb-1 block">Interval</label>
                      <select value={newPlan.interval} onChange={e => setNewPlan({...newPlan, interval: e.target.value as Plan['interval']})} className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm">
                        <option value="month">Monthly</option>
                        <option value="year">Yearly</option>
                      </select>
                    </div>
                  </div>
                  <div className="grid grid-cols-3 gap-4">
                    <div>
                      <label className="text-sm font-medium text-gray-700 mb-1 block">Messages</label>
                      <input type="number" value={newPlan.messagesLimit} onChange={e => setNewPlan({...newPlan, messagesLimit: Number(e.target.value)})} className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm" />
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-700 mb-1 block">Automations</label>
                      <input type="number" value={newPlan.automationsLimit} onChange={e => setNewPlan({...newPlan, automationsLimit: Number(e.target.value)})} className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm" />
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-700 mb-1 block">Contacts</label>
                      <input type="number" value={newPlan.contactsLimit} onChange={e => setNewPlan({...newPlan, contactsLimit: Number(e.target.value)})} className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm" />
                    </div>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-700 mb-1 block">Features</label>
                    {newPlan.features.map((f, i) => (
                      <div key={i} className="flex gap-2 mb-2">
                        <input value={f} onChange={e => { const updated = [...newPlan.features]; updated[i] = e.target.value; setNewPlan({...newPlan, features: updated}); }} placeholder="Feature description" className="flex-1 px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm" />
                        <button onClick={() => setNewPlan({...newPlan, features: newPlan.features.filter((_, j) => j !== i)})} className="text-red-400 hover:text-red-600"><Trash2 size={14} /></button>
                      </div>
                    ))}
                    <button onClick={() => setNewPlan({...newPlan, features: [...newPlan.features, '']})} className="text-sm text-purple-600 font-medium">+ Add Feature</button>
                  </div>
                  <div className="flex gap-3">
                    <button onClick={handleCreatePlan} className="px-6 py-2.5 bg-gradient-to-r from-purple-600 to-pink-500 text-white rounded-xl font-semibold text-sm">Create Plan</button>
                    <button onClick={() => setShowCreate(false)} className="px-6 py-2.5 bg-gray-100 text-gray-700 rounded-xl font-semibold text-sm">Cancel</button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Plans Grid */}
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
            {store.plans.map(plan => (
              <div key={plan.id} className={`bg-white rounded-2xl p-6 border shadow-sm ${plan.isPopular ? 'border-purple-300 ring-2 ring-purple-100' : 'border-gray-100'}`}>
                {editingPlan === plan.id ? (
                  <div className="space-y-3">
                    <input value={editData.name || ''} onChange={e => setEditData({...editData, name: e.target.value})} className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm font-bold" />
                    <div>
                      <label className="text-[10px] text-gray-500">Price (₹)</label>
                      <input type="number" value={editData.price || 0} onChange={e => setEditData({...editData, price: Number(e.target.value)})} className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm" />
                    </div>
                    <div>
                      <label className="text-[10px] text-gray-500">Messages Limit</label>
                      <input type="number" value={editData.messagesLimit || 0} onChange={e => setEditData({...editData, messagesLimit: Number(e.target.value)})} className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm" />
                    </div>
                    <div>
                      <label className="text-[10px] text-gray-500">Automations Limit</label>
                      <input type="number" value={editData.automationsLimit || 0} onChange={e => setEditData({...editData, automationsLimit: Number(e.target.value)})} className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm" />
                    </div>
                    <div>
                      <label className="text-[10px] text-gray-500">Contacts Limit</label>
                      <input type="number" value={editData.contactsLimit || 0} onChange={e => setEditData({...editData, contactsLimit: Number(e.target.value)})} className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm" />
                    </div>
                    <div className="flex gap-2">
                      <button onClick={saveEdit} className="flex-1 py-2 bg-green-500 text-white rounded-lg text-xs font-semibold flex items-center justify-center gap-1"><Save size={12} /> Save</button>
                      <button onClick={() => setEditingPlan(null)} className="flex-1 py-2 bg-gray-100 text-gray-700 rounded-lg text-xs font-semibold">Cancel</button>
                    </div>
                  </div>
                ) : (
                  <>
                    {plan.isPopular && (
                      <div className="text-[10px] font-bold text-purple-600 bg-purple-50 px-2 py-0.5 rounded-full inline-block mb-2">POPULAR</div>
                    )}
                    <div className="flex items-start justify-between mb-2">
                      <h3 className="text-lg font-bold text-gray-900">{plan.name}</h3>
                      <button onClick={() => startEdit(plan)} className="p-1.5 hover:bg-gray-100 rounded-lg text-gray-400 hover:text-purple-600"><Edit2 size={14} /></button>
                    </div>
                    <div className="mb-4">
                      <span className="text-3xl font-black text-gray-900">₹{plan.price}</span>
                      <span className="text-gray-500 text-sm">/{plan.interval}</span>
                    </div>
                    <div className="space-y-2 mb-4 text-xs text-gray-600">
                      <div className="flex justify-between p-2 bg-gray-50 rounded-lg">
                        <span>Messages</span>
                        <span className="font-semibold">{plan.messagesLimit === 999999 ? 'Unlimited' : plan.messagesLimit.toLocaleString()}</span>
                      </div>
                      <div className="flex justify-between p-2 bg-gray-50 rounded-lg">
                        <span>Automations</span>
                        <span className="font-semibold">{plan.automationsLimit === 999999 ? 'Unlimited' : plan.automationsLimit}</span>
                      </div>
                      <div className="flex justify-between p-2 bg-gray-50 rounded-lg">
                        <span>Contacts</span>
                        <span className="font-semibold">{plan.contactsLimit === 999999 ? 'Unlimited' : plan.contactsLimit.toLocaleString()}</span>
                      </div>
                    </div>
                    <div className="space-y-1.5">
                      {plan.features.slice(0, 4).map((f, i) => (
                        <div key={i} className="flex items-start gap-1.5 text-xs text-gray-600">
                          <Check size={12} className="text-green-500 mt-0.5 flex-shrink-0" />
                          <span>{f}</span>
                        </div>
                      ))}
                    </div>
                  </>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Settings Tab */}
      {activeTab === 'settings' && (
        <div className="max-w-xl">
          <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm space-y-6">
            <div className="flex items-center gap-3 mb-4">
              <Settings size={20} className="text-purple-600" />
              <h3 className="text-lg font-bold text-gray-900">Payment Settings</h3>
            </div>

            <div>
              <label className="text-sm font-medium text-gray-700 mb-1 block">UPI ID</label>
              <input
                value={paymentUPI}
                onChange={e => setPaymentUPI(e.target.value)}
                placeholder="yourname@upi"
                className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm font-mono focus:outline-none focus:ring-2 focus:ring-purple-500"
              />
              <p className="text-xs text-gray-400 mt-1">Users will send payment to this UPI ID</p>
            </div>

            <div>
              <label className="text-sm font-medium text-gray-700 mb-1 block">Phone Number</label>
              <input
                value={paymentPhone}
                onChange={e => setPaymentPhone(e.target.value)}
                placeholder="9876543210"
                className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm font-mono focus:outline-none focus:ring-2 focus:ring-purple-500"
              />
              <p className="text-xs text-gray-400 mt-1">Alternative payment number for PhonePe/Paytm</p>
            </div>

            <button
              onClick={savePaymentSettings}
              className="w-full py-3 bg-gradient-to-r from-purple-600 to-pink-500 text-white rounded-xl font-bold text-sm flex items-center justify-center gap-2"
            >
              <Save size={16} /> Save Payment Settings
            </button>

            <div className="p-4 bg-blue-50 rounded-xl border border-blue-200">
              <h4 className="font-bold text-blue-800 text-sm mb-1">💡 How it works:</h4>
              <p className="text-xs text-blue-700">
                1. User selects plan and sends payment to your UPI/Phone<br/>
                2. User enters UTR number in the upgrade form<br/>
                3. You receive notification in Payments tab<br/>
                4. Verify UTR and click Approve/Reject<br/>
                5. User plan is updated instantly
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
