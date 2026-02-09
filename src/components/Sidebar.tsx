import { useStore } from '../hooks/useStore';
import {
  LayoutDashboard, Bot, Users, TrendingUp,
  Settings, BarChart3, GitBranch, ListOrdered,
  Shield, UserCog, CreditCard, Sliders, ChartBar,
  LogOut, Instagram, X, Zap, HelpCircle, Ticket
} from 'lucide-react';
import { useState } from 'react';

interface SidebarProps {
  currentPage: string;
  onNavigate: (page: string) => void;
  isOpen: boolean;
  onClose: () => void;
  isAdmin: boolean;
}

const userMenuItems = [
  { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard, emoji: '📊' },
  { id: 'automations', label: 'Automations', icon: Bot, emoji: '🤖' },
  { id: 'flow-builder', label: 'Flow Builder', icon: GitBranch, emoji: '🔀' },
  { id: 'contacts', label: 'Contacts', icon: Users, emoji: '👥' },
  { id: 'sequences', label: 'Sequences', icon: ListOrdered, emoji: '📋' },
  { id: 'growth-tools', label: 'Growth Tools', icon: TrendingUp, emoji: '🚀' },
  { id: 'analytics', label: 'Analytics', icon: BarChart3, emoji: '📈' },
  { id: 'pricing', label: 'Upgrade Plan', icon: CreditCard, emoji: '💎' },
  { id: 'settings', label: 'Settings', icon: Settings, emoji: '⚙️' },
];

const adminMenuItems = [
  { id: 'admin-dashboard', label: 'Admin Dashboard', icon: Shield, emoji: '🛡️' },
  { id: 'admin-users', label: 'Manage Users', icon: UserCog, emoji: '👤' },
  { id: 'admin-plans', label: 'Plans & Payments', icon: CreditCard, emoji: '💳' },
  { id: 'admin-coupons', label: 'Coupons', icon: Ticket, emoji: '🎟️' },
  { id: 'admin-webhooks', label: 'Webhook Logs', icon: Zap, emoji: '⚡' },
  { id: 'admin-analytics', label: 'Platform Analytics', icon: ChartBar, emoji: '📊' },
  { id: 'admin-settings', label: 'Platform Settings', icon: Sliders, emoji: '🔧' },
];

export function Sidebar({ currentPage, onNavigate, isOpen, onClose, isAdmin }: SidebarProps) {
  const { user, logout } = useStore();
  const [showQuickGuide, setShowQuickGuide] = useState(false);
  
  const menuItems = isAdmin 
    ? [...adminMenuItems, { id: 'divider', label: '', icon: Zap, emoji: '' }, ...userMenuItems] 
    : userMenuItems;

  return (
    <>
      {/* Mobile overlay */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={onClose}
        />
      )}
      
      {/* Sidebar */}
      <div className={`fixed inset-y-0 left-0 z-50 w-64 bg-white border-r border-gray-100 flex flex-col shadow-xl transform transition-transform duration-300 lg:transform-none ${isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}`}>
        {/* Logo */}
        <div className="p-4 flex items-center justify-between border-b border-gray-50">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-purple-600 to-pink-500 flex items-center justify-center shadow-lg shadow-purple-200 hover:scale-105 transition-transform">
              <Instagram size={20} className="text-white" />
            </div>
            <div>
              <span className="font-black text-lg bg-gradient-to-r from-purple-600 to-pink-500 bg-clip-text text-transparent">igone</span>
              {isAdmin && (
                <span className="ml-1.5 text-[10px] bg-red-500 text-white px-1.5 py-0.5 rounded-full font-bold animate-pulse">ADMIN</span>
              )}
            </div>
          </div>
          <button onClick={onClose} className="lg:hidden text-gray-400 hover:text-gray-600 p-1.5 hover:bg-gray-100 rounded-lg transition-colors">
            <X size={18} />
          </button>
        </div>

        {/* Instagram connection status */}
        {user?.instagram_connected ? (
          <div className="mx-3 mt-3 p-3 bg-gradient-to-r from-purple-50 to-pink-50 rounded-xl border border-purple-100">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center text-white text-xs font-bold shadow-md">
                {user.instagram_username?.[0]?.toUpperCase() || 'U'}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-xs font-bold text-gray-900 truncate">@{user.instagram_username}</p>
                <p className="text-[10px] text-gray-500 flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-green-500 inline-block"></span>
                  Connected
                </p>
              </div>
            </div>
          </div>
        ) : !isAdmin && (
          <div className="mx-3 mt-3 p-3 bg-gradient-to-r from-orange-50 to-amber-50 rounded-xl border border-orange-200">
            <div className="flex items-center gap-2">
              <span className="text-lg">⚠️</span>
              <div>
                <p className="text-xs font-bold text-orange-800">Instagram Not Connected</p>
                <button onClick={() => onNavigate('settings')} className="text-[10px] text-orange-600 font-medium hover:underline">Connect now →</button>
              </div>
            </div>
          </div>
        )}

        {/* Menu */}
        <nav className="flex-1 overflow-auto py-3 px-2 space-y-0.5">
          {menuItems.map((item) => {
            if (item.id === 'divider') {
              return (
                <div key="div" className="my-3 mx-2 flex items-center gap-2">
                  <hr className="flex-1 border-gray-100" />
                  <span className="text-[10px] text-gray-400 font-bold">USER TOOLS</span>
                  <hr className="flex-1 border-gray-100" />
                </div>
              );
            }
            const Icon = item.icon;
            const isActive = currentPage === item.id;
            const isPricing = item.id === 'pricing';
            return (
              <button
                key={item.id}
                onClick={() => { onNavigate(item.id); onClose(); }}
                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 group ${
                  isActive
                    ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white shadow-lg shadow-purple-200'
                    : isPricing && user?.plan === 'free'
                      ? 'bg-gradient-to-r from-amber-50 to-orange-50 text-amber-700 border border-amber-200'
                      : 'text-gray-600 hover:bg-purple-50 hover:text-purple-700'
                }`}
              >
                <Icon size={18} className={`${isActive ? '' : 'group-hover:scale-110'} transition-transform`} />
                <span className="flex-1 text-left">{item.label}</span>
                {isPricing && user?.plan === 'free' && (
                  <span className="text-[10px] bg-amber-500 text-white px-1.5 py-0.5 rounded font-bold">PRO</span>
                )}
              </button>
            );
          })}
        </nav>

        {/* Quick Help - Minimal */}
        {!isAdmin && (
          <div className="mx-3 mb-2">
            <button 
              onClick={() => setShowQuickGuide(!showQuickGuide)} 
              className="w-full flex items-center justify-center gap-2 px-3 py-2 rounded-xl text-xs font-medium text-gray-500 hover:text-purple-600 hover:bg-purple-50 transition-colors"
            >
              <HelpCircle size={14} />
              <span>Help Guide</span>
            </button>
            {showQuickGuide && (
              <div className="mt-2 p-3 bg-purple-50 rounded-xl border border-purple-100 text-xs text-purple-800 space-y-1.5">
                <p className="font-bold">🚀 Quick Setup:</p>
                <p>1️⃣ Connect Instagram (Settings)</p>
                <p>2️⃣ Create Automation</p>
                <p>3️⃣ Set Keywords & Response</p>
                <p>4️⃣ Activate - Done! ✅</p>
              </div>
            )}
          </div>
        )}

        {/* Logout */}
        <div className="p-3 border-t border-gray-50">
          <button
            onClick={logout}
            className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-gray-500 hover:bg-red-50 hover:text-red-600 transition-all"
          >
            <LogOut size={18} />
            <span>Logout</span>
          </button>
        </div>
      </div>
    </>
  );
}

export default Sidebar;
