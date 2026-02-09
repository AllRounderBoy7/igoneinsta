import { useState } from 'react';
import { useStore } from '../useStore';
import { Sliders, Shield, Bell, Globe, Server, AlertTriangle, Plus, Trash2, Save, Key, Database, Mail } from 'lucide-react';

export function AdminSettingsPage() {
  const { store } = useStore();
  const { adminSettings } = store;
  const [platformName, setPlatformName] = useState(adminSettings.platformName);
  const [maintenance, setMaintenance] = useState(adminSettings.maintenanceMode);
  const [registration, setRegistration] = useState(adminSettings.registrationEnabled);
  const [newAnnouncement, setNewAnnouncement] = useState('');
  const [annType, setAnnType] = useState<'info' | 'warning' | 'success'>('info');
  const [activeTab, setActiveTab] = useState('general');

  const handleSave = () => {
    store.updateAdminSettings({
      platformName,
      maintenanceMode: maintenance,
      registrationEnabled: registration,
    });
  };

  const addAnnouncement = () => {
    if (!newAnnouncement) return;
    const anns = [...adminSettings.announcements, {
      id: Date.now().toString(),
      message: newAnnouncement,
      type: annType,
      active: true,
    }];
    store.updateAdminSettings({ announcements: anns });
    setNewAnnouncement('');
  };

  const removeAnnouncement = (id: string) => {
    store.updateAdminSettings({
      announcements: adminSettings.announcements.filter(a => a.id !== id),
    });
  };

  const tabs = [
    { id: 'general', label: 'General', icon: Sliders },
    { id: 'security', label: 'Security', icon: Shield },
    { id: 'announcements', label: 'Announcements', icon: Bell },
    { id: 'api', label: 'API & Integrations', icon: Key },
    { id: 'email', label: 'Email Settings', icon: Mail },
    { id: 'database', label: 'Database', icon: Database },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-orange-500 to-amber-500 flex items-center justify-center shadow-lg">
          <Sliders size={20} className="text-white" />
        </div>
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-gray-900">Platform Settings</h1>
          <p className="text-gray-500 mt-0.5">Configure global platform settings</p>
        </div>
      </div>

      <div className="flex flex-col md:flex-row gap-6">
        {/* Tabs */}
        <div className="w-full md:w-56 flex-shrink-0">
          <div className="bg-white rounded-2xl p-2 border border-gray-100 shadow-sm">
            {tabs.map(tab => {
              const Icon = tab.icon;
              return (
                <button key={tab.id} onClick={() => setActiveTab(tab.id)} className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all ${activeTab === tab.id ? 'bg-orange-50 text-orange-700' : 'text-gray-600 hover:bg-gray-50'}`}>
                  <Icon size={16} /> {tab.label}
                </button>
              );
            })}
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 space-y-6">
          {activeTab === 'general' && (
            <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm space-y-6">
              <h3 className="text-lg font-bold">General Settings</h3>
              
              <div>
                <label className="text-sm font-medium text-gray-700 mb-1 block">Platform Name</label>
                <input value={platformName} onChange={e => setPlatformName(e.target.value)} className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-orange-500" />
              </div>

              <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
                <div>
                  <p className="font-medium text-gray-900 text-sm">Maintenance Mode</p>
                  <p className="text-xs text-gray-500">When enabled, users will see a maintenance page</p>
                </div>
                <button onClick={() => setMaintenance(!maintenance)} className={`w-12 h-6 rounded-full transition-colors ${maintenance ? 'bg-orange-500' : 'bg-gray-300'}`}>
                  <div className={`w-5 h-5 rounded-full bg-white shadow transition-transform ${maintenance ? 'translate-x-6' : 'translate-x-0.5'}`} />
                </button>
              </div>

              <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
                <div>
                  <p className="font-medium text-gray-900 text-sm">User Registration</p>
                  <p className="text-xs text-gray-500">Allow new users to sign up</p>
                </div>
                <button onClick={() => setRegistration(!registration)} className={`w-12 h-6 rounded-full transition-colors ${registration ? 'bg-green-500' : 'bg-gray-300'}`}>
                  <div className={`w-5 h-5 rounded-full bg-white shadow transition-transform ${registration ? 'translate-x-6' : 'translate-x-0.5'}`} />
                </button>
              </div>

              <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
                <div>
                  <p className="font-medium text-gray-900 text-sm">Default User Plan</p>
                  <p className="text-xs text-gray-500">Plan assigned to new users</p>
                </div>
                <select className="px-3 py-1.5 bg-white border border-gray-200 rounded-lg text-sm">
                  <option>Free</option>
                  <option>Pro</option>
                  <option>Business</option>
                </select>
              </div>

              <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
                <div>
                  <p className="font-medium text-gray-900 text-sm">Rate Limiting</p>
                  <p className="text-xs text-gray-500">Max API requests per minute</p>
                </div>
                <input type="number" defaultValue={100} className="w-20 px-3 py-1.5 bg-white border border-gray-200 rounded-lg text-sm text-center" />
              </div>

              <button onClick={handleSave} className="px-6 py-2.5 bg-gradient-to-r from-orange-500 to-amber-500 text-white rounded-xl font-semibold text-sm flex items-center gap-2">
                <Save size={16} /> Save Settings
              </button>
            </div>
          )}

          {activeTab === 'security' && (
            <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm space-y-6">
              <h3 className="text-lg font-bold">Security Settings</h3>
              
              <div className="p-4 bg-gray-50 rounded-xl">
                <p className="font-medium text-gray-900 text-sm mb-2">Meta App Credentials</p>
                <div className="space-y-3">
                  <div>
                    <label className="text-xs text-gray-500">App ID</label>
                    <input defaultValue="1512686570574863" className="w-full px-3 py-2 bg-white border border-gray-200 rounded-lg text-sm font-mono" />
                  </div>
                  <div>
                    <label className="text-xs text-gray-500">App Secret</label>
                    <input type="password" defaultValue="1eb4121b8a7648909dd9939f681ca7c7" className="w-full px-3 py-2 bg-white border border-gray-200 rounded-lg text-sm font-mono" />
                  </div>
                </div>
              </div>

              <div className="p-4 bg-gray-50 rounded-xl">
                <p className="font-medium text-gray-900 text-sm mb-2">Supabase Credentials</p>
                <div className="space-y-3">
                  <div>
                    <label className="text-xs text-gray-500">URL</label>
                    <input defaultValue="https://fsvjzuqyijnesegkadtc.supabase.co" className="w-full px-3 py-2 bg-white border border-gray-200 rounded-lg text-sm font-mono" />
                  </div>
                  <div>
                    <label className="text-xs text-gray-500">Anon Key</label>
                    <input type="password" defaultValue="sb_publishable_yMlM7_1vEnbbcQxqyGH5pQ_uSX96yM0" className="w-full px-3 py-2 bg-white border border-gray-200 rounded-lg text-sm font-mono" />
                  </div>
                </div>
              </div>

              <div className="p-4 bg-gray-50 rounded-xl">
                <p className="font-medium text-gray-900 text-sm">Admin Password</p>
                <p className="text-xs text-gray-500 mt-1">Change the admin access password</p>
                <div className="flex gap-2 mt-2">
                  <input type="password" placeholder="New password" className="flex-1 px-3 py-2 bg-white border border-gray-200 rounded-lg text-sm" />
                  <button className="px-4 py-2 bg-orange-500 text-white rounded-lg text-sm font-semibold">Update</button>
                </div>
              </div>

              <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
                <div>
                  <p className="font-medium text-gray-900 text-sm">Force 2FA for All Users</p>
                  <p className="text-xs text-gray-500">Require two-factor authentication</p>
                </div>
                <button className="w-12 h-6 rounded-full bg-gray-300 transition-colors">
                  <div className="w-5 h-5 rounded-full bg-white shadow translate-x-0.5" />
                </button>
              </div>

              <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
                <div>
                  <p className="font-medium text-gray-900 text-sm">IP Whitelisting</p>
                  <p className="text-xs text-gray-500">Restrict admin access to specific IPs</p>
                </div>
                <button className="px-3 py-1.5 bg-white border border-gray-200 rounded-lg text-xs font-medium text-gray-700">Configure</button>
              </div>
            </div>
          )}

          {activeTab === 'announcements' && (
            <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm space-y-6">
              <h3 className="text-lg font-bold">Platform Announcements</h3>
              
              <div className="space-y-3">
                <div className="flex gap-2">
                  <input value={newAnnouncement} onChange={e => setNewAnnouncement(e.target.value)} placeholder="Type announcement message..." className="flex-1 px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-orange-500" />
                  <select value={annType} onChange={e => setAnnType(e.target.value as 'info' | 'warning' | 'success')} className="px-3 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm">
                    <option value="info">Info</option>
                    <option value="warning">Warning</option>
                    <option value="success">Success</option>
                  </select>
                  <button onClick={addAnnouncement} className="px-4 py-2.5 bg-orange-500 text-white rounded-xl font-semibold text-sm flex items-center gap-1"><Plus size={14} /> Add</button>
                </div>
              </div>

              <div className="space-y-2">
                {adminSettings.announcements.length === 0 ? (
                  <div className="text-center py-8 text-gray-400">
                    <Bell size={32} className="mx-auto mb-2" />
                    <p className="text-sm">No active announcements</p>
                  </div>
                ) : (
                  adminSettings.announcements.map(ann => (
                    <div key={ann.id} className={`flex items-center justify-between p-4 rounded-xl border ${
                      ann.type === 'info' ? 'bg-blue-50 border-blue-200' :
                      ann.type === 'warning' ? 'bg-yellow-50 border-yellow-200' :
                      'bg-green-50 border-green-200'
                    }`}>
                      <div className="flex items-center gap-2">
                        <AlertTriangle size={14} className={ann.type === 'info' ? 'text-blue-600' : ann.type === 'warning' ? 'text-yellow-600' : 'text-green-600'} />
                        <span className="text-sm font-medium">{ann.message}</span>
                        <span className={`text-[10px] px-1.5 py-0.5 rounded-full font-semibold ${
                          ann.type === 'info' ? 'bg-blue-200 text-blue-700' :
                          ann.type === 'warning' ? 'bg-yellow-200 text-yellow-700' :
                          'bg-green-200 text-green-700'
                        }`}>{ann.type}</span>
                      </div>
                      <button onClick={() => removeAnnouncement(ann.id)} className="text-gray-400 hover:text-red-500"><Trash2 size={14} /></button>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}

          {activeTab === 'api' && (
            <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm space-y-6">
              <h3 className="text-lg font-bold">API & Integrations</h3>
              <div className="p-4 bg-gray-50 rounded-xl">
                <p className="font-medium text-gray-900 text-sm mb-2">Webhook Configuration</p>
                <input defaultValue="https://api.igone.com/webhooks/instagram" className="w-full px-3 py-2 bg-white border border-gray-200 rounded-lg text-sm font-mono mb-2" />
                <div className="flex gap-2">
                  <button className="px-3 py-1.5 bg-green-500 text-white rounded-lg text-xs font-semibold">Test Webhook</button>
                  <button className="px-3 py-1.5 bg-gray-200 text-gray-700 rounded-lg text-xs font-semibold">View Logs</button>
                </div>
              </div>
              <div className="p-4 bg-gray-50 rounded-xl">
                <p className="font-medium text-gray-900 text-sm mb-2 flex items-center gap-2"><Globe size={14} /> API Rate Limits</p>
                <div className="grid grid-cols-2 gap-3">
                  <div><label className="text-xs text-gray-500">Free Plan (req/min)</label><input type="number" defaultValue={10} className="w-full px-3 py-2 bg-white border border-gray-200 rounded-lg text-sm" /></div>
                  <div><label className="text-xs text-gray-500">Pro Plan (req/min)</label><input type="number" defaultValue={60} className="w-full px-3 py-2 bg-white border border-gray-200 rounded-lg text-sm" /></div>
                  <div><label className="text-xs text-gray-500">Business (req/min)</label><input type="number" defaultValue={120} className="w-full px-3 py-2 bg-white border border-gray-200 rounded-lg text-sm" /></div>
                  <div><label className="text-xs text-gray-500">Enterprise (req/min)</label><input type="number" defaultValue={500} className="w-full px-3 py-2 bg-white border border-gray-200 rounded-lg text-sm" /></div>
                </div>
              </div>
              <div className="p-4 bg-gray-50 rounded-xl">
                <p className="font-medium text-gray-900 text-sm mb-2 flex items-center gap-2"><Server size={14} /> Third-Party Integrations</p>
                <div className="space-y-2">
                  {['Stripe Payments', 'SendGrid Email', 'Twilio SMS', 'Google Analytics', 'Zapier'].map(int => (
                    <div key={int} className="flex items-center justify-between p-2 bg-white rounded-lg border border-gray-200">
                      <span className="text-sm text-gray-700">{int}</span>
                      <button className="px-3 py-1 bg-gray-100 rounded-lg text-xs font-medium text-gray-600 hover:bg-purple-100 hover:text-purple-700">Configure</button>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {activeTab === 'email' && (
            <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm space-y-6">
              <h3 className="text-lg font-bold">Email Settings</h3>
              <div className="space-y-4">
                <div><label className="text-sm font-medium text-gray-700 mb-1 block">SMTP Host</label><input defaultValue="smtp.gmail.com" className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm" /></div>
                <div className="grid grid-cols-2 gap-4">
                  <div><label className="text-sm font-medium text-gray-700 mb-1 block">SMTP Port</label><input defaultValue="587" className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm" /></div>
                  <div><label className="text-sm font-medium text-gray-700 mb-1 block">Encryption</label><select className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm"><option>TLS</option><option>SSL</option></select></div>
                </div>
                <div><label className="text-sm font-medium text-gray-700 mb-1 block">From Email</label><input defaultValue="noreply@igone.com" className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm" /></div>
                <div><label className="text-sm font-medium text-gray-700 mb-1 block">From Name</label><input defaultValue="IGOne" className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm" /></div>
                <button className="px-4 py-2 bg-blue-500 text-white rounded-lg text-sm font-semibold">Send Test Email</button>
              </div>
            </div>
          )}

          {activeTab === 'database' && (
            <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm space-y-6">
              <h3 className="text-lg font-bold">Database Management</h3>
              <div className="grid grid-cols-2 gap-4">
                <div className="p-4 bg-green-50 rounded-xl border border-green-200">
                  <p className="text-sm font-medium text-green-700">Database Status</p>
                  <p className="text-2xl font-bold text-green-600 mt-1">Healthy</p>
                  <p className="text-xs text-green-600 mt-0.5">Latency: 12ms</p>
                </div>
                <div className="p-4 bg-blue-50 rounded-xl border border-blue-200">
                  <p className="text-sm font-medium text-blue-700">Storage Used</p>
                  <p className="text-2xl font-bold text-blue-600 mt-1">2.4 GB</p>
                  <p className="text-xs text-blue-600 mt-0.5">of 10 GB available</p>
                </div>
              </div>
              <div className="space-y-3">
                <button className="w-full p-4 bg-gray-50 rounded-xl border border-gray-200 text-left hover:bg-gray-100 transition-colors">
                  <p className="text-sm font-medium text-gray-900">🗄️ Backup Database</p>
                  <p className="text-xs text-gray-500">Last backup: 6 hours ago</p>
                </button>
                <button className="w-full p-4 bg-gray-50 rounded-xl border border-gray-200 text-left hover:bg-gray-100 transition-colors">
                  <p className="text-sm font-medium text-gray-900">🔄 Reset Cache</p>
                  <p className="text-xs text-gray-500">Clear all cached data</p>
                </button>
                <button className="w-full p-4 bg-red-50 rounded-xl border border-red-200 text-left hover:bg-red-100 transition-colors">
                  <p className="text-sm font-medium text-red-700">⚠️ Purge Old Data</p>
                  <p className="text-xs text-red-500">Delete data older than 90 days</p>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
