import { Trash2, CheckCircle, ArrowLeft, Mail, Clock, Shield } from 'lucide-react';

interface DataDeletionPageProps {
  onNavigate: (page: string) => void;
}

export default function DataDeletionPage({ onNavigate }: DataDeletionPageProps) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-gray-900">
      {/* Header */}
      <header className="bg-black/30 backdrop-blur-xl border-b border-white/10">
        <div className="max-w-4xl mx-auto px-4 py-4 flex items-center gap-4">
          <button
            onClick={() => onNavigate('landing')}
            className="p-2 hover:bg-white/10 rounded-lg transition-colors"
          >
            <ArrowLeft className="w-5 h-5 text-white" />
          </button>
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-sm">ig</span>
            </div>
            <span className="text-white font-bold text-xl">igone</span>
          </div>
        </div>
      </header>

      {/* Content */}
      <main className="max-w-4xl mx-auto px-4 py-12">
        <div className="bg-white/10 backdrop-blur-xl rounded-2xl border border-white/20 p-8 md:p-12">
          {/* Title */}
          <div className="flex items-center gap-4 mb-8">
            <div className="w-16 h-16 bg-gradient-to-r from-red-500 to-orange-500 rounded-2xl flex items-center justify-center">
              <Trash2 className="w-8 h-8 text-white" />
            </div>
            <div>
              <h1 className="text-3xl md:text-4xl font-bold text-white">Data Deletion Instructions</h1>
              <p className="text-gray-400">How to delete your data from igone</p>
            </div>
          </div>

          <div className="space-y-8 text-gray-300">
            {/* Overview */}
            <section>
              <p className="text-lg leading-relaxed">
                At igone, we respect your right to control your personal data. This page explains how you can request deletion of your data from our systems. We comply with Meta's data deletion requirements and GDPR regulations.
              </p>
            </section>

            {/* What Data We Store */}
            <section>
              <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                <Shield className="w-6 h-6 text-purple-400" />
                What Data We Store
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-white/5 rounded-xl p-4 border border-white/10">
                  <h3 className="font-semibold text-white mb-2">Account Data</h3>
                  <ul className="text-sm space-y-1">
                    <li>• Name and email address</li>
                    <li>• Profile picture</li>
                    <li>• Account settings</li>
                  </ul>
                </div>
                <div className="bg-white/5 rounded-xl p-4 border border-white/10">
                  <h3 className="font-semibold text-white mb-2">Instagram Data</h3>
                  <ul className="text-sm space-y-1">
                    <li>• Instagram Business Account ID</li>
                    <li>• Access Token (encrypted)</li>
                    <li>• Instagram username</li>
                  </ul>
                </div>
                <div className="bg-white/5 rounded-xl p-4 border border-white/10">
                  <h3 className="font-semibold text-white mb-2">Automation Data</h3>
                  <ul className="text-sm space-y-1">
                    <li>• Your automation rules</li>
                    <li>• Keywords and responses</li>
                    <li>• Flow configurations</li>
                  </ul>
                </div>
                <div className="bg-white/5 rounded-xl p-4 border border-white/10">
                  <h3 className="font-semibold text-white mb-2">Activity Data</h3>
                  <ul className="text-sm space-y-1">
                    <li>• Message statistics</li>
                    <li>• Automation logs</li>
                    <li>• Payment history</li>
                  </ul>
                </div>
              </div>
            </section>

            {/* Deletion Methods */}
            <section>
              <h2 className="text-xl font-bold text-white mb-6">How to Delete Your Data</h2>
              
              {/* Method 1: In-App */}
              <div className="bg-gradient-to-r from-purple-500/10 to-pink-500/10 rounded-xl p-6 border border-purple-500/20 mb-6">
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 bg-purple-500 rounded-full flex items-center justify-center text-white font-bold flex-shrink-0">
                    1
                  </div>
                  <div className="flex-1">
                    <h3 className="font-bold text-white text-lg mb-2">Delete via Dashboard (Recommended)</h3>
                    <p className="text-sm mb-4">The fastest way to delete your data:</p>
                    <ol className="space-y-3 text-sm">
                      <li className="flex items-start gap-3">
                        <span className="w-6 h-6 bg-white/10 rounded-full flex items-center justify-center text-xs flex-shrink-0">1</span>
                        <span>Log in to your igone dashboard</span>
                      </li>
                      <li className="flex items-start gap-3">
                        <span className="w-6 h-6 bg-white/10 rounded-full flex items-center justify-center text-xs flex-shrink-0">2</span>
                        <span>Go to <strong>Settings</strong> → <strong>Account</strong> tab</span>
                      </li>
                      <li className="flex items-start gap-3">
                        <span className="w-6 h-6 bg-white/10 rounded-full flex items-center justify-center text-xs flex-shrink-0">3</span>
                        <span>Scroll down to <strong>Danger Zone</strong></span>
                      </li>
                      <li className="flex items-start gap-3">
                        <span className="w-6 h-6 bg-white/10 rounded-full flex items-center justify-center text-xs flex-shrink-0">4</span>
                        <span>Click <strong>"Delete Account"</strong></span>
                      </li>
                      <li className="flex items-start gap-3">
                        <span className="w-6 h-6 bg-white/10 rounded-full flex items-center justify-center text-xs flex-shrink-0">5</span>
                        <span>Confirm deletion by typing "DELETE"</span>
                      </li>
                    </ol>
                    <div className="mt-4 flex items-center gap-2 text-green-400 text-sm">
                      <CheckCircle className="w-4 h-4" />
                      <span>Data will be permanently deleted within 24 hours</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Method 2: Email */}
              <div className="bg-gradient-to-r from-blue-500/10 to-cyan-500/10 rounded-xl p-6 border border-blue-500/20 mb-6">
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center text-white font-bold flex-shrink-0">
                    2
                  </div>
                  <div className="flex-1">
                    <h3 className="font-bold text-white text-lg mb-2">Delete via Email Request</h3>
                    <p className="text-sm mb-4">If you can't access your account, email us:</p>
                    <div className="bg-black/20 rounded-lg p-4">
                      <div className="flex items-center gap-3 mb-3">
                        <Mail className="w-5 h-5 text-blue-400" />
                        <a href="mailto:delete@igone.app" className="text-blue-400 hover:text-blue-300 font-semibold">
                          delete@igone.app
                        </a>
                      </div>
                      <p className="text-sm text-gray-400">Include in your email:</p>
                      <ul className="text-sm mt-2 space-y-1">
                        <li>• Your registered email address</li>
                        <li>• Your Instagram username (if connected)</li>
                        <li>• Subject: "Data Deletion Request"</li>
                      </ul>
                    </div>
                    <div className="mt-4 flex items-center gap-2 text-blue-400 text-sm">
                      <Clock className="w-4 h-4" />
                      <span>We will process your request within 30 days</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Method 3: Instagram Removal */}
              <div className="bg-gradient-to-r from-pink-500/10 to-rose-500/10 rounded-xl p-6 border border-pink-500/20">
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 bg-pink-500 rounded-full flex items-center justify-center text-white font-bold flex-shrink-0">
                    3
                  </div>
                  <div className="flex-1">
                    <h3 className="font-bold text-white text-lg mb-2">Revoke Access via Instagram</h3>
                    <p className="text-sm mb-4">Remove igone's access from your Instagram settings:</p>
                    <ol className="space-y-3 text-sm">
                      <li className="flex items-start gap-3">
                        <span className="w-6 h-6 bg-white/10 rounded-full flex items-center justify-center text-xs flex-shrink-0">1</span>
                        <span>Open Instagram app → Settings</span>
                      </li>
                      <li className="flex items-start gap-3">
                        <span className="w-6 h-6 bg-white/10 rounded-full flex items-center justify-center text-xs flex-shrink-0">2</span>
                        <span>Go to <strong>Security</strong> → <strong>Apps and Websites</strong></span>
                      </li>
                      <li className="flex items-start gap-3">
                        <span className="w-6 h-6 bg-white/10 rounded-full flex items-center justify-center text-xs flex-shrink-0">3</span>
                        <span>Find <strong>"igone"</strong> in the list</span>
                      </li>
                      <li className="flex items-start gap-3">
                        <span className="w-6 h-6 bg-white/10 rounded-full flex items-center justify-center text-xs flex-shrink-0">4</span>
                        <span>Tap <strong>"Remove"</strong></span>
                      </li>
                    </ol>
                    <div className="mt-4 p-3 bg-yellow-500/10 rounded-lg border border-yellow-500/20">
                      <p className="text-yellow-300 text-sm">
                        ⚠️ This only revokes API access. To delete stored data, please also use Method 1 or 2.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </section>

            {/* What Happens After Deletion */}
            <section>
              <h2 className="text-xl font-bold text-white mb-4">What Happens After Deletion</h2>
              <div className="space-y-3">
                <div className="flex items-start gap-3">
                  <CheckCircle className="w-5 h-5 text-green-400 flex-shrink-0 mt-0.5" />
                  <span>All your personal data is permanently deleted from our database</span>
                </div>
                <div className="flex items-start gap-3">
                  <CheckCircle className="w-5 h-5 text-green-400 flex-shrink-0 mt-0.5" />
                  <span>Your Instagram Access Token is revoked and removed</span>
                </div>
                <div className="flex items-start gap-3">
                  <CheckCircle className="w-5 h-5 text-green-400 flex-shrink-0 mt-0.5" />
                  <span>All automations, flows, and sequences are deleted</span>
                </div>
                <div className="flex items-start gap-3">
                  <CheckCircle className="w-5 h-5 text-green-400 flex-shrink-0 mt-0.5" />
                  <span>Activity logs and statistics are purged</span>
                </div>
                <div className="flex items-start gap-3">
                  <CheckCircle className="w-5 h-5 text-green-400 flex-shrink-0 mt-0.5" />
                  <span>Payment records are anonymized (retained for legal compliance)</span>
                </div>
              </div>
            </section>

            {/* Confirmation */}
            <section>
              <h2 className="text-xl font-bold text-white mb-4">Deletion Confirmation</h2>
              <p className="text-sm leading-relaxed">
                Once your data deletion request is processed, you will receive a confirmation email at your registered email address. If you do not receive confirmation within the stated timeframe, please contact us at{' '}
                <a href="mailto:support@igone.app" className="text-purple-400 hover:text-purple-300">support@igone.app</a>.
              </p>
            </section>

            {/* Meta Callback URL Notice */}
            <section className="bg-white/5 rounded-xl p-6 border border-white/10">
              <h2 className="text-lg font-bold text-white mb-3">For Meta App Review</h2>
              <p className="text-sm text-gray-400 mb-3">
                This page serves as igone's Data Deletion Callback URL as required by Meta Platform Terms.
              </p>
              <div className="bg-black/30 rounded-lg p-3 font-mono text-sm text-purple-400">
                https://igone.app/data-deletion
              </div>
            </section>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-black/30 border-t border-white/10 py-8 mt-12">
        <div className="max-w-4xl mx-auto px-4 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-gray-400 text-sm">© 2024 igone. All rights reserved.</p>
          <div className="flex items-center gap-6">
            <button onClick={() => onNavigate('privacy')} className="text-gray-400 hover:text-white text-sm">
              Privacy Policy
            </button>
            <button onClick={() => onNavigate('terms')} className="text-gray-400 hover:text-white text-sm">
              Terms of Service
            </button>
          </div>
        </div>
      </footer>
    </div>
  );
}
