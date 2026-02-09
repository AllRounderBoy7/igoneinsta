import { useState, useEffect } from 'react';
import { useStore } from '../hooks/useStore';
import { Shield, Users, DollarSign, TrendingUp, Activity, Server, UserPlus, CreditCard, BarChart3, AlertTriangle, CheckCircle, Globe, Ticket, RefreshCw } from 'lucide-react';

export function AdminDashboard({ onNavigate }: { onNavigate: (page: string) => void }) {
  const { allUsers, allPayments, coupons, platformSettings, loadAdminData } = useStore();
  const [loading, setLoading] = useState(true);
  const [lastRefresh, setLastRefresh] = useState(new Date());

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
    setLastRefresh(new Date());
    setLoading(false);
  };

  // Calculate REAL stats from database
  const totalUsers = allUsers.length;
  const activeUsers = allUsers.filter(u => !u.is_suspended).length;
  const suspendedUsers = allUsers.filter(u => u.is_suspended).length;
  
  // Calculate real revenue from approved payments
  const approvedPayments = allPayments.filter(p => p.status === 'approved');
  const totalRevenue = approvedPayments.reduce((sum, p) => sum + p.amount, 0);
  
  // Monthly revenue (current month)
  const currentMonth = new Date().getMonth();
  const currentYear = new Date().getFullYear();
  const monthlyRevenue = approvedPayments
    .filter(p => {
      const date = new Date(p.created_at);
      return date.getMonth() === currentMonth && date.getFullYear() === currentYear;
    })
    .reduce((sum, p) => sum + p.amount, 0);

  // Pending payments count
  const pendingPayments = allPayments.filter(p => p.status === 'pending').length;

  // Plan distribution from real users
  const planCounts = {
    free: allUsers.filter(u => u.plan === 'free').length,
    pro: allUsers.filter(u => u.plan === 'pro').length,
    master: allUsers.filter(u => u.plan === 'master').length,
    legend: allUsers.filter(u => u.plan === 'legend').length
  };

  const planDistribution = [
    { name: 'Free', count: planCounts.free, pct: totalUsers > 0 ? Math.round((planCounts.free / totalUsers) * 100) : 0, color: 'bg-gray-400' },
    { name: 'Pro', count: planCounts.pro, pct: totalUsers > 0 ? Math.round((planCounts.pro / totalUsers) * 100) : 0, color: 'bg-purple-500' },
    { name: 'Master', count: planCounts.master, pct: totalUsers > 0 ? Math.round((planCounts.master / totalUsers) * 100) : 0, color: 'bg-blue-500' },
    { name: 'Legend', count: planCounts.legend, pct: totalUsers > 0 ? Math.round((planCounts.legend / totalUsers) * 100) : 0, color: 'bg-amber-500' },
  ];

  // Recent users (last 5)
  const recentUsers = [...allUsers]
    .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
    .slice(0, 5);

  // Monthly revenue data (last 6 months)
  const monthlyData = [];
  for (let i = 5; i >= 0; i--) {
    const date = new Date();
    date.setMonth(date.getMonth() - i);
    const month = date.getMonth();
    const year = date.getFullYear();
    
    const monthRevenue = approvedPayments
      .filter(p => {
        const pDate = new Date(p.created_at);
        return pDate.getMonth() === month && pDate.getFullYear() === year;
      })
      .reduce((sum, p) => sum + p.amount, 0);
    
    monthlyData.push({
      month: date.toLocaleString('default', { month: 'short' }),
      revenue: monthRevenue
    });
  }
  const maxRevenue = Math.max(...monthlyData.map(m => m.revenue), 1);

  const stats = [
    { label: 'Total Users', value: totalUsers, change: `${activeUsers} active`, icon: Users, color: 'from-blue-500 to-cyan-400' },
    { label: 'Active Users', value: activeUsers, change: `${suspendedUsers} suspended`, icon: Activity, color: 'from-green-500 to-emerald-400' },
    { label: 'Monthly Revenue', value: `₹${monthlyRevenue.toLocaleString()}`, change: `${pendingPayments} pending`, icon: DollarSign, color: 'from-purple-500 to-pink-500' },
    { label: 'Total Revenue', value: `₹${totalRevenue.toLocaleString()}`, change: `${approvedPayments.length} payments`, icon: TrendingUp, color: 'from-orange-500 to-amber-400' },
  ];

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <RefreshCw size={32} className="animate-spin text-purple-500 mx-auto mb-4" />
          <p className="text-gray-500">Loading admin data...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-red-500 to-orange-500 flex items-center justify-center shadow-lg">
            <Shield size={20} className="text-white" />
          </div>
          <div>
            <h1 className="text-2xl md:text-3xl font-bold text-gray-900">Admin Dashboard</h1>
            <p className="text-gray-500 mt-0.5">Real-time platform overview</p>
          </div>
        </div>
        <button
          onClick={handleRefresh}
          className="inline-flex items-center gap-2 px-4 py-2.5 bg-white border border-gray-200 text-gray-700 rounded-xl font-semibold text-sm hover:bg-gray-50"
        >
          <RefreshCw size={16} className={loading ? 'animate-spin' : ''} />
          Refresh Data
        </button>
      </div>

      {/* System Status */}
      <div className="flex flex-wrap gap-3">
        <div className="flex items-center gap-2 px-4 py-2 bg-green-50 border border-green-200 rounded-xl">
          <CheckCircle size={14} className="text-green-600" />
          <span className="text-sm font-medium text-green-700">Systems Online</span>
        </div>
        <div className="flex items-center gap-2 px-4 py-2 bg-blue-50 border border-blue-200 rounded-xl">
          <Server size={14} className="text-blue-600" />
          <span className="text-sm font-medium text-blue-700">Supabase Connected</span>
        </div>
        <div className="flex items-center gap-2 px-4 py-2 bg-purple-50 border border-purple-200 rounded-xl">
          <Globe size={14} className="text-purple-600" />
          <span className="text-sm font-medium text-purple-700">Last updated: {lastRefresh.toLocaleTimeString()}</span>
        </div>
        {platformSettings?.maintenance_mode && (
          <div className="flex items-center gap-2 px-4 py-2 bg-yellow-50 border border-yellow-200 rounded-xl">
            <AlertTriangle size={14} className="text-yellow-600" />
            <span className="text-sm font-medium text-yellow-700">Maintenance Mode ON</span>
          </div>
        )}
        {pendingPayments > 0 && (
          <div className="flex items-center gap-2 px-4 py-2 bg-orange-50 border border-orange-200 rounded-xl">
            <CreditCard size={14} className="text-orange-600" />
            <span className="text-sm font-medium text-orange-700">{pendingPayments} Pending Payments</span>
          </div>
        )}
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((s, i) => {
          const Icon = s.icon;
          return (
            <div key={i} className="bg-white rounded-2xl p-4 md:p-5 border border-gray-100 shadow-sm hover:shadow-md transition-shadow">
              <div className="flex items-start justify-between mb-3 md:mb-4">
                <div className={`w-10 h-10 md:w-11 md:h-11 rounded-xl bg-gradient-to-br ${s.color} flex items-center justify-center shadow-lg`}>
                  <Icon size={18} className="text-white" />
                </div>
                <span className="text-gray-500 text-[10px] md:text-xs bg-gray-50 px-2 py-1 rounded-full">{s.change}</span>
              </div>
              <p className="text-xl md:text-2xl font-bold text-gray-900">{s.value}</p>
              <p className="text-xs md:text-sm text-gray-500 mt-0.5">{s.label}</p>
            </div>
          );
        })}
      </div>

      {/* No Data Message */}
      {totalUsers === 0 && (
        <div className="bg-yellow-50 border border-yellow-200 rounded-2xl p-6 text-center">
          <AlertTriangle size={32} className="text-yellow-500 mx-auto mb-3" />
          <h3 className="font-bold text-yellow-800 mb-2">No Users Yet</h3>
          <p className="text-yellow-700 text-sm">
            No users have registered yet. Once users sign up with Google OAuth, they will appear here in real-time.
          </p>
        </div>
      )}

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Revenue Chart */}
        <div className="lg:col-span-2 bg-white rounded-2xl p-4 md:p-6 border border-gray-100 shadow-sm">
          <h3 className="font-bold text-gray-900 mb-4 md:mb-6">Revenue (Last 6 Months)</h3>
          {totalRevenue === 0 ? (
            <div className="flex items-center justify-center h-48 text-gray-400">
              <div className="text-center">
                <DollarSign size={32} className="mx-auto mb-2 opacity-50" />
                <p className="text-sm">No revenue data yet</p>
              </div>
            </div>
          ) : (
            <>
              <div className="flex items-end gap-2 h-48">
                {monthlyData.map((m, i) => (
                  <div key={i} className="flex-1 flex flex-col items-center gap-1 group relative">
                    <div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-gray-900 text-white text-[10px] px-2 py-1 rounded opacity-0 group-hover:opacity-100 whitespace-nowrap z-10">
                      ₹{m.revenue.toLocaleString()}
                    </div>
                    <div 
                      className="w-full bg-gradient-to-t from-green-500 to-emerald-400 rounded-t-lg opacity-80 hover:opacity-100 transition-opacity cursor-pointer min-h-[4px]" 
                      style={{ height: `${Math.max((m.revenue / maxRevenue) * 100, 2)}%` }}
                    ></div>
                  </div>
                ))}
              </div>
              <div className="flex justify-between mt-2 text-[10px] text-gray-400">
                {monthlyData.map(m => (
                  <span key={m.month}>{m.month}</span>
                ))}
              </div>
            </>
          )}
        </div>

        {/* Plan Distribution */}
        <div className="bg-white rounded-2xl p-4 md:p-6 border border-gray-100 shadow-sm">
          <h3 className="font-bold text-gray-900 mb-4">Plan Distribution</h3>
          {totalUsers === 0 ? (
            <div className="flex items-center justify-center h-48 text-gray-400">
              <div className="text-center">
                <Users size={32} className="mx-auto mb-2 opacity-50" />
                <p className="text-sm">No users yet</p>
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              {planDistribution.map((p, i) => (
                <div key={i}>
                  <div className="flex justify-between text-sm mb-1">
                    <span className="font-medium text-gray-700">{p.name}</span>
                    <span className="text-gray-500">{p.count} ({p.pct}%)</span>
                  </div>
                  <div className="h-2.5 bg-gray-100 rounded-full overflow-hidden">
                    <div className={`h-full ${p.color} rounded-full transition-all`} style={{ width: `${p.pct}%` }}></div>
                  </div>
                </div>
              ))}
            </div>
          )}
          <div className="mt-4 p-3 bg-gray-50 rounded-xl">
            <p className="text-xs text-gray-500">Monthly Revenue</p>
            <p className="text-2xl font-bold text-gray-900">₹{monthlyRevenue.toLocaleString()}</p>
          </div>
        </div>
      </div>

      {/* Recent Users */}
      <div className="bg-white rounded-2xl p-4 md:p-6 border border-gray-100 shadow-sm">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-bold text-gray-900 flex items-center gap-2"><UserPlus size={18} /> Recent Users</h3>
          <button onClick={() => onNavigate('admin-users')} className="text-sm text-purple-600 font-medium hover:text-purple-700">View All →</button>
        </div>
        {recentUsers.length === 0 ? (
          <div className="text-center py-8 text-gray-400">
            <Users size={32} className="mx-auto mb-2 opacity-50" />
            <p className="text-sm">No users registered yet</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="text-xs text-gray-500 border-b border-gray-100">
                  <th className="text-left py-3 font-medium">User</th>
                  <th className="text-left py-3 font-medium">Plan</th>
                  <th className="text-left py-3 font-medium hidden md:table-cell">Instagram</th>
                  <th className="text-left py-3 font-medium hidden md:table-cell">Joined</th>
                  <th className="text-left py-3 font-medium">Status</th>
                </tr>
              </thead>
              <tbody>
                {recentUsers.map(user => (
                  <tr key={user.id} className="border-b border-gray-50 hover:bg-gray-50">
                    <td className="py-3">
                      <div className="flex items-center gap-2">
                        {user.avatar ? (
                          <img src={user.avatar} alt={user.name} className="w-8 h-8 rounded-full" />
                        ) : (
                          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-purple-400 to-pink-400 flex items-center justify-center text-white text-xs font-bold">
                            {user.name[0]?.toUpperCase() || '?'}
                          </div>
                        )}
                        <div>
                          <p className="text-sm font-medium text-gray-900">{user.name}</p>
                          <p className="text-xs text-gray-500">{user.email}</p>
                        </div>
                      </div>
                    </td>
                    <td className="py-3">
                      <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${
                        user.plan === 'free' ? 'bg-gray-100 text-gray-600' :
                        user.plan === 'pro' ? 'bg-purple-50 text-purple-700' :
                        user.plan === 'master' ? 'bg-blue-50 text-blue-700' :
                        'bg-amber-50 text-amber-700'
                      }`}>{user.plan}</span>
                    </td>
                    <td className="py-3 hidden md:table-cell">
                      <span className="text-sm text-gray-600">
                        {user.instagram_connected ? `@${user.instagram_username}` : 'Not connected'}
                      </span>
                    </td>
                    <td className="py-3 hidden md:table-cell">
                      <span className="text-xs text-gray-500">
                        {new Date(user.created_at).toLocaleDateString()}
                      </span>
                    </td>
                    <td className="py-3">
                      <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${
                        user.is_suspended ? 'bg-red-50 text-red-700' : 'bg-green-50 text-green-700'
                      }`}>
                        {user.is_suspended ? 'Suspended' : 'Active'}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Quick Admin Actions */}
      <div className="bg-white rounded-2xl p-4 md:p-6 border border-gray-100 shadow-sm">
        <h3 className="font-bold text-gray-900 mb-4">Quick Actions</h3>
        <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
          {[
            { label: 'Manage Users', icon: Users, page: 'admin-users', color: 'text-blue-600 bg-blue-50', count: totalUsers },
            { label: 'Payments', icon: CreditCard, page: 'admin-plans', color: 'text-purple-600 bg-purple-50', count: pendingPayments > 0 ? `${pendingPayments} pending` : '' },
            { label: 'Coupons', icon: Ticket, page: 'admin-coupons', color: 'text-pink-600 bg-pink-50', count: coupons.length },
            { label: 'Analytics', icon: BarChart3, page: 'admin-analytics', color: 'text-green-600 bg-green-50', count: '' },
            { label: 'Settings', icon: Shield, page: 'admin-settings', color: 'text-orange-600 bg-orange-50', count: '' },
          ].map((action, i) => {
            const Icon = action.icon;
            return (
              <button 
                key={i} 
                onClick={() => onNavigate(action.page)} 
                className={`flex flex-col items-center gap-2 p-4 rounded-xl border border-gray-100 hover:shadow-md transition-all ${action.color} relative`}
              >
                <Icon size={22} />
                <span className="text-xs font-semibold">{action.label}</span>
                {action.count && (
                  <span className="absolute -top-1 -right-1 bg-red-500 text-white text-[10px] px-1.5 py-0.5 rounded-full">
                    {action.count}
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
