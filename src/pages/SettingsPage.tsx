import { useState, useEffect } from 'react';
import { useStore } from '../hooks/useStore';
import { Instagram, LogOut, ExternalLink, CheckCircle, AlertCircle, Loader2 } from 'lucide-react';

export function SettingsPage() {
  const { user, logout, connectInstagram, disconnectInstagram } = useStore();
  const [isConnecting, setIsConnecting] = useState(false);
  const [connectionStatus, setConnectionStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [statusMessage, setStatusMessage] = useState('');

  // Handle OAuth callback - check if we have a code in URL
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const code = urlParams.get('code');
    const error = urlParams.get('error');

    if (code) {
      setIsConnecting(true);
      setStatusMessage('Connecting your Instagram account...');
      
      // In production, this code would be sent to your webhook server
      // to exchange for an access token
      // For now, we'll simulate the connection
      setTimeout(() => {
        connectInstagram('instagram_user', 'connected_token');
        setConnectionStatus('success');
        setStatusMessage('Instagram connected successfully!');
        setIsConnecting(false);
        // Clean URL
        window.history.replaceState({}, '', window.location.pathname);
      }, 2000);
    }

    if (error) {
      setConnectionStatus('error');
      setStatusMessage('Connection failed: ' + (urlParams.get('error_description') || error));
      window.history.replaceState({}, '', window.location.pathname);
    }
  }, [connectInstagram]);

  const handleConnectInstagram = () => {
    console.log('🔗 Connect Instagram button clicked!');
    
    // Real Facebook OAuth URL with proper scopes
    const appId = import.meta.env.VITE_META_APP_ID || '1512686570574863';
    const redirectUri = encodeURIComponent(window.location.origin + '/settings');
    const scope = encodeURIComponent('instagram_basic,instagram_manage_comments,instagram_manage_messages,pages_show_list,pages_read_engagement');
    
    const authUrl = `https://www.facebook.com/v18.0/dialog/oauth?client_id=${appId}&redirect_uri=${redirectUri}&scope=${scope}&response_type=code`;
    
    console.log('📍 Redirect URL:', authUrl);
    console.log('🚀 Redirecting to Facebook OAuth...');
    
    // Redirect to Facebook OAuth
    window.location.href = authUrl;
  };

  const handleDisconnect = () => {
    if (confirm('Are you sure you want to disconnect your Instagram account?')) {
      disconnectInstagram();
      setConnectionStatus('idle');
      setStatusMessage('');
    }
  };

  const handleLogout = () => {
    if (confirm('Are you sure you want to logout?')) {
      logout();
    }
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl md:text-3xl font-bold text-gray-900">Settings</h1>
        <p className="text-gray-500 mt-1">Manage your Instagram connection</p>
      </div>

      {/* Status Messages */}
      {connectionStatus === 'success' && (
        <div className="bg-green-50 border border-green-200 rounded-xl p-4 flex items-center gap-3">
          <CheckCircle className="text-green-600" size={20} />
          <p className="text-green-700 text-sm font-medium">{statusMessage}</p>
        </div>
      )}

      {connectionStatus === 'error' && (
        <div className="bg-red-50 border border-red-200 rounded-xl p-4 flex items-center gap-3">
          <AlertCircle className="text-red-600" size={20} />
          <p className="text-red-700 text-sm font-medium">{statusMessage}</p>
        </div>
      )}

      {/* Account Info */}
      <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm">
        <h3 className="text-lg font-bold text-gray-900 mb-4">Your Account</h3>
        <div className="flex items-center gap-4 p-4 bg-gray-50 rounded-xl">
          <div className="w-14 h-14 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center text-white text-xl font-bold">
            {user?.name?.[0]?.toUpperCase() || 'U'}
          </div>
          <div>
            <p className="font-semibold text-gray-900">{user?.name || 'User'}</p>
            <p className="text-sm text-gray-500">{user?.email || 'user@example.com'}</p>
            <p className="text-xs text-purple-600 font-semibold mt-1">
              {user?.plan?.toUpperCase() || 'FREE'} Plan
            </p>
          </div>
        </div>
      </div>

      {/* Instagram Connection */}
      <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm">
        <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
          <Instagram className="text-pink-500" size={20} />
          Instagram Connection
        </h3>

        {isConnecting ? (
          <div className="text-center py-8">
            <Loader2 size={40} className="animate-spin text-purple-600 mx-auto mb-4" />
            <p className="text-gray-600">{statusMessage}</p>
          </div>
        ) : user?.instagram_connected ? (
          <div className="space-y-4">
            <div className="flex items-center gap-4 p-4 bg-green-50 rounded-xl border border-green-200">
              <div className="w-12 h-12 rounded-full bg-gradient-to-br from-purple-500 via-pink-500 to-orange-400 flex items-center justify-center">
                <Instagram size={24} className="text-white" />
              </div>
              <div className="flex-1">
                <p className="font-semibold text-gray-900">@{user.instagram_username || 'connected'}</p>
                <p className="text-sm text-green-600 flex items-center gap-1">
                  <CheckCircle size={14} /> Connected & Active
                </p>
              </div>
            </div>
            
            <button
              onClick={handleDisconnect}
              className="w-full py-3 border border-red-200 text-red-600 rounded-xl font-semibold text-sm hover:bg-red-50 transition-colors"
            >
              Disconnect Instagram
            </button>
          </div>
        ) : (
          <div className="space-y-6">
            <div className="text-center py-6">
              <div className="w-20 h-20 rounded-full bg-gradient-to-br from-purple-500 via-pink-500 to-orange-400 flex items-center justify-center mx-auto mb-4">
                <Instagram size={36} className="text-white" />
              </div>
              <p className="text-gray-600 mb-6">Connect your Instagram Business account to start automating</p>
              <button
                onClick={handleConnectInstagram}
                className="inline-flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-purple-600 to-pink-500 text-white rounded-xl font-bold shadow-lg shadow-purple-200 hover:shadow-xl transition-all"
              >
                <Instagram size={20} />
                Connect Instagram Account
                <ExternalLink size={16} />
              </button>
            </div>

            {/* Setup Guide */}
            <div className="bg-gradient-to-r from-purple-50 to-pink-50 rounded-2xl p-5 border border-purple-100">
              <h4 className="font-bold text-purple-800 mb-4">📱 How to Create Instagram Business Account</h4>
              <div className="space-y-3">
                {[
                  'Open Instagram app → Go to Profile → Tap ⚙️ Settings',
                  'Tap "Account" → "Switch to Professional Account"',
                  'Choose "Business" or "Creator" account type',
                  'Select a category (any category works)',
                  'Done! ✅ Now you can connect to igone',
                ].map((text, i) => (
                  <div key={i} className="flex items-start gap-3 bg-white rounded-xl p-3 border border-purple-100">
                    <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center text-white font-bold text-sm flex-shrink-0">
                      {i + 1}
                    </div>
                    <p className="text-sm text-gray-700 pt-0.5">{text}</p>
                  </div>
                ))}
              </div>
              <p className="text-xs text-purple-600 mt-4 text-center">
                ⚠️ Note: Personal accounts cannot use automation. Business/Creator account is required.
              </p>
            </div>
          </div>
        )}
      </div>

      {/* Logout */}
      <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm">
        <h3 className="text-lg font-bold text-gray-900 mb-4">Account Actions</h3>
        <button
          onClick={handleLogout}
          className="w-full flex items-center justify-center gap-2 py-3 border border-gray-200 text-gray-700 rounded-xl font-semibold text-sm hover:bg-gray-50 transition-colors"
        >
          <LogOut size={18} />
          Logout
        </button>
      </div>
    </div>
  );
}
