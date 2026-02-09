import { useStore } from '../hooks/useStore';
import { Menu, Bell, Search } from 'lucide-react';

interface TopBarProps {
  currentPage: string;
  onMenuClick: () => void;
  isAdmin: boolean;
}

const pageInfo: Record<string, { title: string; emoji: string }> = {
  'dashboard': { title: 'Dashboard', emoji: '📊' },
  'automations': { title: 'Automations', emoji: '🤖' },
  'flow-builder': { title: 'Flow Builder', emoji: '🔀' },
  'contacts': { title: 'Contacts', emoji: '👥' },
  'sequences': { title: 'Sequences', emoji: '📋' },
  'growth-tools': { title: 'Growth Tools', emoji: '🚀' },
  'analytics': { title: 'Analytics', emoji: '📈' },
  'settings': { title: 'Settings', emoji: '⚙️' },
  'pricing': { title: 'Upgrade Plan', emoji: '💎' },
  'admin-dashboard': { title: 'Admin Dashboard', emoji: '🛡️' },
  'admin-users': { title: 'Manage Users', emoji: '👤' },
  'admin-plans': { title: 'Plans & Payments', emoji: '💳' },
  'admin-coupons': { title: 'Coupons', emoji: '🎟️' },
  'admin-webhooks': { title: 'Webhook Logs', emoji: '⚡' },
  'admin-analytics': { title: 'Platform Analytics', emoji: '📊' },
  'admin-settings': { title: 'Platform Settings', emoji: '🔧' },
};

export function TopBar({ currentPage, onMenuClick, isAdmin }: TopBarProps) {
  const { user } = useStore();
  const info = pageInfo[currentPage] || { title: 'Dashboard', emoji: '📊' };

  return (
    <header className="sticky top-0 z-30 bg-white/80 backdrop-blur-lg border-b border-gray-100">
      <div className="flex items-center justify-between px-4 py-3">
        {/* Left - Menu + Title */}
        <div className="flex items-center gap-3">
          <button
            onClick={onMenuClick}
            className="lg:hidden p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <Menu size={20} className="text-gray-600" />
          </button>
          <div>
            <h1 className="text-lg font-bold text-gray-900 flex items-center gap-2">
              <span>{info.emoji}</span>
              <span>{info.title}</span>
              {isAdmin && (
                <span className="text-[10px] bg-red-500 text-white px-2 py-0.5 rounded-full font-bold">ADMIN MODE</span>
              )}
            </h1>
          </div>
        </div>

        {/* Right - Search, Notifications, Profile */}
        <div className="flex items-center gap-2">
          {/* Search - Hidden on mobile */}
          <div className="hidden md:flex items-center gap-2 px-3 py-2 bg-gray-100 rounded-lg">
            <Search size={16} className="text-gray-400" />
            <input
              type="text"
              placeholder="Search..."
              className="bg-transparent text-sm w-40 focus:outline-none"
            />
          </div>

          {/* Notifications */}
          <button className="relative p-2 hover:bg-gray-100 rounded-lg transition-colors">
            <Bell size={20} className="text-gray-600" />
            <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
          </button>

          {/* Profile */}
          <div className="flex items-center gap-2 pl-2">
            {user?.avatar ? (
              <img src={user.avatar} alt={user.name} className="w-8 h-8 rounded-full" />
            ) : (
              <div className="w-8 h-8 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center text-white text-sm font-bold">
                {user?.name?.[0]?.toUpperCase() || 'U'}
              </div>
            )}
            <div className="hidden sm:block">
              <p className="text-sm font-medium text-gray-900">{user?.name || 'User'}</p>
              <p className="text-xs text-gray-500 capitalize">{user?.plan || 'Free'} Plan</p>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}

export default TopBar;
