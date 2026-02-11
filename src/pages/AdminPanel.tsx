import { useState, useEffect } from 'react';
import { useStore } from '../hooks/useStore';
import { 
  Users, CreditCard, Tag, Settings, BarChart3, Shield,
  CheckCircle, XCircle, Trash2, Search, RefreshCw,
  TrendingUp, DollarSign, UserCheck, AlertTriangle
} from 'lucide-react';

type AdminTab = 'dashboard' | 'users' | 'payments' | 'coupons' | 'analytics' | 'settings';

export default function AdminPanel() {
  const [activeTab, setActiveTab] = useState<AdminTab>('dashboard');
  const { 
    allUsers, payments, coupons, 
    loadAdminData, updateUserPlan, suspendUser, deleteUser,
    approvePayment, rejectPayment, createCoupon, deleteCoupon
  } = useStore();
  
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(false);
  const [maintenanceMode, setMaintenanceMode] = useState(false);
  const [paymentUPI, setPaymentUPI] = useState('7321086174@ibl');
  const [paymentPhone, setPaymentPhone] = useState('7321086174');
  
  // Coupon form
  const [newCoupon, setNewCoupon] = useState({
    code: '',
    discount: 100,
    maxUses: 50,
    plan: 'master' as string
  });

  useEffect(() => {
    loadAdminData();
    // Load settings from localStorage
    setMaintenanceMode(localStorage.getItem('igone_maintenance') === 'true');
    setPaymentUPI(localStorage.getItem('igone_payment_upi') || '7321086174@ibl');
    setPaymentPhone(localStorage.getItem('igone_payment_phone') || '7321086174');
  }, []);

  const handleRefresh = async () => {
    setLoading(true);
    await loadAdminData();
    setLoading(false);
  };

  const saveSettings = () => {
    localStorage.setItem('igone_maintenance', maintenanceMode.toString());
    localStorage.setItem('igone_payment_upi', paymentUPI);
    localStorage.setItem('igone_payment_phone', paymentPhone);
    alert('Settings saved!');
  };

  const handleCreateCoupon = () => {
    if (!newCoupon.code) {
      alert('Enter coupon code');
      return;
    }
    createCoupon({
      code: newCoupon.code.toUpperCase(),
      discount_percent: newCoupon.discount,
      max_uses: newCoupon.maxUses,
      current_uses: 0,
      target_plan: newCoupon.plan,
      is_active: true,
      expires_at: null
    });
    setNewCoupon({ code: '', discount: 100, maxUses: 50, plan: 'master' });
  };

  // Stats calculations
  const totalUsers = allUsers.length;
  const activeUsers = allUsers.filter(u => u.status !== 'suspended').length;
  const pendingPayments = payments.filter(p => p.status === 'pending').length;
  const totalRevenue = payments
    .filter(p => p.status === 'approved')
    .reduce((sum, p) => sum + (p.amount || 0), 0);

  const filteredUsers = allUsers.filter(u => 
    u.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    u.name?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const tabs = [
    { id: 'dashboard', label: 'Dashboard', icon: BarChart3 },
    { id: 'users', label: 'Users', icon: Users },
    { id: 'payments', label: 'Payments', icon: CreditCard },
    { id: 'coupons', label: 'Coupons', icon: Tag },
    { id: 'analytics', label: 'Analytics', icon: TrendingUp },
    { id: 'settings', label: 'Settings', icon: Settings },
  ];

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Shield className="w-8 h-8 text-purple-600" />
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Admin Panel</h1>
            <p className="text-gray-500">Manage your platform</p>
          </div>
        </div>
        <button
          onClick={handleRefresh}
          disabled={loading}
          className="flex items-center gap-2 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 disabled:opacity-50"
        >
          <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
          Refresh
        </button>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 overflow-x-auto pb-2">
        {tabs.map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as AdminTab)}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium whitespace-nowrap transition-colors ${
              activeTab === tab.id
                ? 'bg-purple-600 text-white'
                : 'bg-white text-gray-600 hover:bg-gray-100'
            }`}
          >
            <tab.icon className="w-4 h-4" />
            {tab.label}
            {tab.id === 'payments' && pendingPayments > 0 && (
              <span className="bg-red-500 text-white text-xs px-2 py-0.5 rounded-full">
                {pendingPayments}
              </span>
            )}
          </button>
        ))}
      </div>

      {/* Dashboard Tab */}
      {activeTab === 'dashboard' && (
        <div className="space-y-6">
          {/* Stats Grid */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="bg-white p-6 rounded-xl shadow-sm">
              <div className="flex items-center gap-3">
                <div className="p-3 bg-blue-100 rounded-lg">
                  <Users className="w-6 h-6 text-blue-600" />
                </div>
                <div>
                  <p className="text-2xl font-bold">{totalUsers}</p>
                  <p className="text-gray-500 text-sm">Total Users</p>
                </div>
              </div>
            </div>
            <div className="bg-white p-6 rounded-xl shadow-sm">
              <div className="flex items-center gap-3">
                <div className="p-3 bg-green-100 rounded-lg">
                  <UserCheck className="w-6 h-6 text-green-600" />
                </div>
                <div>
                  <p className="text-2xl font-bold">{activeUsers}</p>
                  <p className="text-gray-500 text-sm">Active Users</p>
                </div>
              </div>
            </div>
            <div className="bg-white p-6 rounded-xl shadow-sm">
              <div className="flex items-center gap-3">
                <div className="p-3 bg-yellow-100 rounded-lg">
                  <CreditCard className="w-6 h-6 text-yellow-600" />
                </div>
                <div>
                  <p className="text-2xl font-bold">{pendingPayments}</p>
                  <p className="text-gray-500 text-sm">Pending Payments</p>
                </div>
              </div>
            </div>
            <div className="bg-white p-6 rounded-xl shadow-sm">
              <div className="flex items-center gap-3">
                <div className="p-3 bg-purple-100 rounded-lg">
                  <DollarSign className="w-6 h-6 text-purple-600" />
                </div>
                <div>
                  <p className="text-2xl font-bold">₹{totalRevenue}</p>
                  <p className="text-gray-500 text-sm">Total Revenue</p>
                </div>
              </div>
            </div>
          </div>

          {/* Recent Users */}
          <div className="bg-white rounded-xl shadow-sm p-6">
            <h3 className="text-lg font-semibold mb-4">Recent Users</h3>
            {allUsers.length === 0 ? (
              <p className="text-gray-500 text-center py-8">No users yet</p>
            ) : (
              <div className="space-y-3">
                {allUsers.slice(0, 5).map(user => (
                  <div key={user.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center">
                        {user.name?.charAt(0) || 'U'}
                      </div>
                      <div>
                        <p className="font-medium">{user.name || 'Unknown'}</p>
                        <p className="text-sm text-gray-500">{user.email}</p>
                      </div>
                    </div>
                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                      user.plan === 'legend' ? 'bg-purple-100 text-purple-700' :
                      user.plan === 'master' ? 'bg-blue-100 text-blue-700' :
                      user.plan === 'pro' ? 'bg-green-100 text-green-700' :
                      'bg-gray-100 text-gray-700'
                    }`}>
                      {user.plan || 'free'}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {/* Users Tab */}
      {activeTab === 'users' && (
        <div className="bg-white rounded-xl shadow-sm p-6">
          <div className="flex items-center gap-4 mb-6">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Search users..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border rounded-lg"
              />
            </div>
          </div>

          {filteredUsers.length === 0 ? (
            <p className="text-gray-500 text-center py-8">No users found</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="text-left p-3 font-medium">User</th>
                    <th className="text-left p-3 font-medium">Plan</th>
                    <th className="text-left p-3 font-medium">Status</th>
                    <th className="text-left p-3 font-medium">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredUsers.map(user => (
                    <tr key={user.id} className="border-t">
                      <td className="p-3">
                        <div>
                          <p className="font-medium">{user.name || 'Unknown'}</p>
                          <p className="text-sm text-gray-500">{user.email}</p>
                        </div>
                      </td>
                      <td className="p-3">
                        <select
                          value={user.plan || 'free'}
                          onChange={(e) => updateUserPlan(user.id, e.target.value)}
                          className="border rounded px-2 py-1"
                        >
                          <option value="free">Free</option>
                          <option value="pro">Pro</option>
                          <option value="master">Master</option>
                          <option value="legend">Legend</option>
                        </select>
                      </td>
                      <td className="p-3">
                        <span className={`px-2 py-1 rounded text-xs ${
                          user.status === 'suspended' ? 'bg-red-100 text-red-700' : 'bg-green-100 text-green-700'
                        }`}>
                          {user.status || 'active'}
                        </span>
                      </td>
                      <td className="p-3">
                        <div className="flex gap-2">
                          <button
                            onClick={() => suspendUser(user.id)}
                            className="p-1 text-yellow-600 hover:bg-yellow-50 rounded"
                            title={user.status === 'suspended' ? 'Activate' : 'Suspend'}
                          >
                            <AlertTriangle className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => {
                              if (confirm('Delete this user?')) deleteUser(user.id);
                            }}
                            className="p-1 text-red-600 hover:bg-red-50 rounded"
                            title="Delete"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}

      {/* Payments Tab */}
      {activeTab === 'payments' && (
        <div className="bg-white rounded-xl shadow-sm p-6">
          <h3 className="text-lg font-semibold mb-4">Payment Requests</h3>
          
          {payments.length === 0 ? (
            <p className="text-gray-500 text-center py-8">No payment requests yet</p>
          ) : (
            <div className="space-y-4">
              {payments.map(payment => (
                <div key={payment.id} className="flex items-center justify-between p-4 border rounded-lg">
                  <div>
                    <p className="font-medium">{payment.user_email || 'Unknown User'}</p>
                    <p className="text-sm text-gray-500">
                      Plan: {payment.plan} | Amount: ₹{payment.amount} | UTR: {payment.utr}
                    </p>
                    <p className="text-xs text-gray-400">
                      {new Date(payment.created_at).toLocaleString()}
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    {payment.status === 'pending' ? (
                      <>
                        <button
                          onClick={() => approvePayment(payment.id)}
                          className="flex items-center gap-1 px-3 py-1 bg-green-600 text-white rounded-lg hover:bg-green-700"
                        >
                          <CheckCircle className="w-4 h-4" />
                          Approve
                        </button>
                        <button
                          onClick={() => rejectPayment(payment.id)}
                          className="flex items-center gap-1 px-3 py-1 bg-red-600 text-white rounded-lg hover:bg-red-700"
                        >
                          <XCircle className="w-4 h-4" />
                          Reject
                        </button>
                      </>
                    ) : (
                      <span className={`px-3 py-1 rounded-full text-sm ${
                        payment.status === 'approved' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                      }`}>
                        {payment.status}
                      </span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Coupons Tab */}
      {activeTab === 'coupons' && (
        <div className="space-y-6">
          {/* Create Coupon */}
          <div className="bg-white rounded-xl shadow-sm p-6">
            <h3 className="text-lg font-semibold mb-4">Create Coupon</h3>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <input
                type="text"
                placeholder="COUPON CODE"
                value={newCoupon.code}
                onChange={(e) => setNewCoupon({ ...newCoupon, code: e.target.value.toUpperCase() })}
                className="border rounded-lg px-3 py-2"
              />
              <select
                value={newCoupon.plan}
                onChange={(e) => setNewCoupon({ ...newCoupon, plan: e.target.value })}
                className="border rounded-lg px-3 py-2"
              >
                <option value="pro">Pro Plan</option>
                <option value="master">Master Plan</option>
                <option value="legend">Legend Plan</option>
              </select>
              <input
                type="number"
                placeholder="Max Uses"
                value={newCoupon.maxUses}
                onChange={(e) => setNewCoupon({ ...newCoupon, maxUses: parseInt(e.target.value) })}
                className="border rounded-lg px-3 py-2"
              />
              <button
                onClick={handleCreateCoupon}
                className="bg-purple-600 text-white rounded-lg px-4 py-2 hover:bg-purple-700"
              >
                Create Coupon
              </button>
            </div>
          </div>

          {/* Coupons List */}
          <div className="bg-white rounded-xl shadow-sm p-6">
            <h3 className="text-lg font-semibold mb-4">Active Coupons</h3>
            {coupons.length === 0 ? (
              <p className="text-gray-500 text-center py-8">No coupons yet</p>
            ) : (
              <div className="space-y-3">
                {coupons.map(coupon => (
                  <div key={coupon.id} className="flex items-center justify-between p-4 border rounded-lg">
                    <div>
                      <p className="font-mono font-bold text-lg">{coupon.code}</p>
                      <p className="text-sm text-gray-500">
                        Plan: {coupon.target_plan} | Used: {coupon.current_uses}/{coupon.max_uses}
                      </p>
                    </div>
                    <button
                      onClick={() => deleteCoupon(coupon.id)}
                      className="p-2 text-red-600 hover:bg-red-50 rounded-lg"
                    >
                      <Trash2 className="w-5 h-5" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {/* Analytics Tab */}
      {activeTab === 'analytics' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Plan Distribution */}
            <div className="bg-white rounded-xl shadow-sm p-6">
              <h3 className="text-lg font-semibold mb-4">Plan Distribution</h3>
              {allUsers.length === 0 ? (
                <p className="text-gray-500 text-center py-8">No data yet</p>
              ) : (
                <div className="space-y-3">
                  {['free', 'pro', 'master', 'legend'].map(plan => {
                    const count = allUsers.filter(u => (u.plan || 'free') === plan).length;
                    const percent = totalUsers > 0 ? (count / totalUsers) * 100 : 0;
                    return (
                      <div key={plan}>
                        <div className="flex justify-between text-sm mb-1">
                          <span className="capitalize">{plan}</span>
                          <span>{count} users ({percent.toFixed(1)}%)</span>
                        </div>
                        <div className="h-2 bg-gray-100 rounded-full">
                          <div 
                            className={`h-full rounded-full ${
                              plan === 'legend' ? 'bg-purple-500' :
                              plan === 'master' ? 'bg-blue-500' :
                              plan === 'pro' ? 'bg-green-500' :
                              'bg-gray-400'
                            }`}
                            style={{ width: `${percent}%` }}
                          />
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>

            {/* Revenue Stats */}
            <div className="bg-white rounded-xl shadow-sm p-6">
              <h3 className="text-lg font-semibold mb-4">Revenue</h3>
              <div className="space-y-4">
                <div className="p-4 bg-green-50 rounded-lg">
                  <p className="text-green-600 text-sm">Total Revenue</p>
                  <p className="text-3xl font-bold text-green-700">₹{totalRevenue}</p>
                </div>
                <div className="p-4 bg-yellow-50 rounded-lg">
                  <p className="text-yellow-600 text-sm">Pending Payments</p>
                  <p className="text-3xl font-bold text-yellow-700">{pendingPayments}</p>
                </div>
                <div className="p-4 bg-blue-50 rounded-lg">
                  <p className="text-blue-600 text-sm">Approved Payments</p>
                  <p className="text-3xl font-bold text-blue-700">
                    {payments.filter(p => p.status === 'approved').length}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Settings Tab */}
      {activeTab === 'settings' && (
        <div className="bg-white rounded-xl shadow-sm p-6">
          <h3 className="text-lg font-semibold mb-6">Platform Settings</h3>
          
          <div className="space-y-6">
            {/* Maintenance Mode */}
            <div className="flex items-center justify-between p-4 border rounded-lg">
              <div>
                <p className="font-medium">Maintenance Mode</p>
                <p className="text-sm text-gray-500">Disable access for all users</p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={maintenanceMode}
                  onChange={(e) => setMaintenanceMode(e.target.checked)}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:bg-purple-600 after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all"></div>
              </label>
            </div>

            {/* Payment Settings */}
            <div className="p-4 border rounded-lg space-y-4">
              <p className="font-medium">Payment Settings</p>
              <div>
                <label className="block text-sm text-gray-600 mb-1">UPI ID</label>
                <input
                  type="text"
                  value={paymentUPI}
                  onChange={(e) => setPaymentUPI(e.target.value)}
                  className="w-full border rounded-lg px-3 py-2"
                />
              </div>
              <div>
                <label className="block text-sm text-gray-600 mb-1">Phone Number</label>
                <input
                  type="text"
                  value={paymentPhone}
                  onChange={(e) => setPaymentPhone(e.target.value)}
                  className="w-full border rounded-lg px-3 py-2"
                />
              </div>
            </div>

            <button
              onClick={saveSettings}
              className="w-full bg-purple-600 text-white rounded-lg px-4 py-3 hover:bg-purple-700 font-medium"
            >
              Save Settings
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
