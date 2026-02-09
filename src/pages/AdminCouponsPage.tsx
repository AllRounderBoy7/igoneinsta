import { useState } from 'react';
import { useStore } from '../useStore';
import { Ticket, Plus, Trash2, X, ToggleLeft, ToggleRight, Clock, Users, Gift, Copy, Check } from 'lucide-react';

export function AdminCouponsPage() {
  const { store } = useStore();
  const [showCreate, setShowCreate] = useState(false);
  const [newCoupon, setNewCoupon] = useState({
    code: '',
    planId: 'master',
    usageLimit: 50,
    expiresAt: '',
  });
  const [copiedCode, setCopiedCode] = useState<string | null>(null);

  const handleCreate = () => {
    if (!newCoupon.code || !newCoupon.expiresAt) return;
    store.createCoupon(
      newCoupon.code,
      newCoupon.planId,
      newCoupon.usageLimit,
      newCoupon.expiresAt
    );
    setShowCreate(false);
    setNewCoupon({ code: '', planId: 'master', usageLimit: 50, expiresAt: '' });
  };

  const copyCode = (code: string) => {
    navigator.clipboard.writeText(code);
    setCopiedCode(code);
    setTimeout(() => setCopiedCode(null), 2000);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-green-500 to-emerald-400 flex items-center justify-center shadow-lg">
            <Ticket size={20} className="text-white" />
          </div>
          <div>
            <h1 className="text-2xl md:text-3xl font-bold text-gray-900">Coupon Management</h1>
            <p className="text-gray-500 mt-0.5">{store.adminSettings.coupons.length} total coupons</p>
          </div>
        </div>
        <button onClick={() => setShowCreate(true)} className="inline-flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-green-500 to-emerald-400 text-white rounded-xl font-semibold text-sm shadow-lg">
          <Plus size={16} /> Create Coupon
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-green-100 flex items-center justify-center">
              <Gift size={18} className="text-green-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900">{store.adminSettings.coupons.filter(c => c.isActive).length}</p>
              <p className="text-xs text-gray-500">Active Coupons</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-blue-100 flex items-center justify-center">
              <Users size={18} className="text-blue-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900">{store.adminSettings.coupons.reduce((acc, c) => acc + c.usedCount, 0)}</p>
              <p className="text-xs text-gray-500">Total Uses</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-purple-100 flex items-center justify-center">
              <Ticket size={18} className="text-purple-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900">{store.adminSettings.coupons.reduce((acc, c) => acc + (c.usageLimit - c.usedCount), 0)}</p>
              <p className="text-xs text-gray-500">Remaining Uses</p>
            </div>
          </div>
        </div>
      </div>

      {/* Create Modal */}
      {showCreate && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl w-full max-w-md p-6 shadow-2xl">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-bold">Create New Coupon</h3>
              <button onClick={() => setShowCreate(false)} className="text-gray-400 hover:text-gray-600"><X size={20} /></button>
            </div>
            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium text-gray-700 mb-1 block">Coupon Code</label>
                <input
                  value={newCoupon.code}
                  onChange={e => setNewCoupon({...newCoupon, code: e.target.value.toUpperCase()})}
                  placeholder="e.g. FREEMASTER"
                  className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm font-mono uppercase focus:outline-none focus:ring-2 focus:ring-green-500"
                />
              </div>
              <div>
                <label className="text-sm font-medium text-gray-700 mb-1 block">Plan to Unlock</label>
                <select
                  value={newCoupon.planId}
                  onChange={e => setNewCoupon({...newCoupon, planId: e.target.value})}
                  className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm"
                >
                  {store.plans.filter(p => p.price > 0).map(p => (
                    <option key={p.id} value={p.id}>{p.name} (₹{p.price}/mo)</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-700 mb-1 block">Usage Limit</label>
                <input
                  type="number"
                  value={newCoupon.usageLimit}
                  onChange={e => setNewCoupon({...newCoupon, usageLimit: Number(e.target.value)})}
                  className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm"
                />
                <p className="text-xs text-gray-400 mt-1">Max number of users who can use this coupon</p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-700 mb-1 block">Expires On</label>
                <input
                  type="date"
                  value={newCoupon.expiresAt}
                  onChange={e => setNewCoupon({...newCoupon, expiresAt: e.target.value})}
                  className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm"
                />
              </div>
              <div className="flex gap-3">
                <button onClick={handleCreate} className="flex-1 py-2.5 bg-gradient-to-r from-green-500 to-emerald-400 text-white rounded-xl font-semibold text-sm">
                  Create Coupon
                </button>
                <button onClick={() => setShowCreate(false)} className="px-6 py-2.5 bg-gray-100 text-gray-700 rounded-xl font-semibold text-sm">
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Coupons List */}
      <div className="space-y-3">
        {store.adminSettings.coupons.length === 0 ? (
          <div className="bg-white rounded-2xl p-12 text-center border border-gray-100">
            <Ticket size={48} className="text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-700 mb-2">No coupons yet</h3>
            <p className="text-gray-500 text-sm">Create your first coupon to offer discounts</p>
          </div>
        ) : (
          store.adminSettings.coupons.map(coupon => {
            const plan = store.plans.find(p => p.id === coupon.planId);
            const isExpired = new Date(coupon.expiresAt) < new Date();
            const usagePct = (coupon.usedCount / coupon.usageLimit) * 100;

            return (
              <div key={coupon.id} className={`bg-white rounded-2xl p-5 border shadow-sm ${isExpired || !coupon.isActive ? 'border-gray-200 opacity-60' : 'border-green-200'}`}>
                <div className="flex items-start justify-between">
                  <div className="flex items-start gap-4">
                    <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${coupon.isActive && !isExpired ? 'bg-green-100' : 'bg-gray-100'}`}>
                      <Ticket size={22} className={coupon.isActive && !isExpired ? 'text-green-600' : 'text-gray-400'} />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <h3 className="font-mono font-bold text-lg text-gray-900">{coupon.code}</h3>
                        <button onClick={() => copyCode(coupon.code)} className="p-1 hover:bg-gray-100 rounded">
                          {copiedCode === coupon.code ? <Check size={14} className="text-green-500" /> : <Copy size={14} className="text-gray-400" />}
                        </button>
                      </div>
                      <div className="flex flex-wrap items-center gap-3 mt-1">
                        <span className="text-xs px-2 py-0.5 rounded-full bg-purple-50 text-purple-700 font-medium">
                          Unlocks: {plan?.name || coupon.planId}
                        </span>
                        <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${coupon.isActive && !isExpired ? 'bg-green-50 text-green-700' : 'bg-gray-100 text-gray-500'}`}>
                          {isExpired ? '❌ Expired' : coupon.isActive ? '✅ Active' : '⏸️ Paused'}
                        </span>
                      </div>
                      <div className="flex items-center gap-4 mt-2 text-xs text-gray-500">
                        <span className="flex items-center gap-1"><Users size={12} /> {coupon.usedCount}/{coupon.usageLimit} used</span>
                        <span className="flex items-center gap-1"><Clock size={12} /> Expires: {coupon.expiresAt}</span>
                      </div>
                      {/* Usage bar */}
                      <div className="mt-2 w-48 h-1.5 bg-gray-200 rounded-full overflow-hidden">
                        <div className={`h-full rounded-full ${usagePct >= 100 ? 'bg-red-500' : usagePct >= 80 ? 'bg-yellow-500' : 'bg-green-500'}`} style={{ width: `${Math.min(100, usagePct)}%` }} />
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => store.toggleCoupon(coupon.id)}
                      className={`p-2 rounded-lg transition-colors ${coupon.isActive ? 'text-green-600 hover:bg-green-50' : 'text-gray-400 hover:bg-gray-50'}`}
                      title={coupon.isActive ? 'Deactivate' : 'Activate'}
                    >
                      {coupon.isActive ? <ToggleRight size={20} /> : <ToggleLeft size={20} />}
                    </button>
                    <button
                      onClick={() => store.deleteCoupon(coupon.id)}
                      className="p-2 rounded-lg text-gray-400 hover:text-red-500 hover:bg-red-50"
                      title="Delete"
                    >
                      <Trash2 size={18} />
                    </button>
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* FREEMASTER Info */}
      <div className="bg-gradient-to-r from-purple-50 to-pink-50 rounded-2xl p-5 border border-purple-200">
        <h4 className="font-bold text-purple-800 mb-2">💡 Default Coupon: FREEMASTER</h4>
        <p className="text-sm text-purple-700">
          This coupon gives <strong>Master plan FREE</strong> to the first 50 users who use it.
          Users enter this code in the Pricing page to instantly upgrade without payment.
        </p>
      </div>
    </div>
  );
}
