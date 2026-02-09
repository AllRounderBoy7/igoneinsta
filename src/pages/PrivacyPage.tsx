import { Shield, Database, Lock, Mail, ArrowLeft } from 'lucide-react';

interface PrivacyPageProps {
  onNavigate: (page: string) => void;
}

export default function PrivacyPage({ onNavigate }: PrivacyPageProps) {
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
            <div className="w-16 h-16 bg-gradient-to-r from-purple-500 to-pink-500 rounded-2xl flex items-center justify-center">
              <Shield className="w-8 h-8 text-white" />
            </div>
            <div>
              <h1 className="text-3xl md:text-4xl font-bold text-white">Privacy Policy</h1>
              <p className="text-gray-400">Last updated: {new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}</p>
            </div>
          </div>

          <div className="space-y-8 text-gray-300">
            {/* Introduction */}
            <section>
              <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                <span className="w-8 h-8 bg-purple-500/20 rounded-lg flex items-center justify-center text-purple-400">1</span>
                Introduction
              </h2>
              <p className="leading-relaxed">
                Welcome to igone ("we," "our," or "us"). We are committed to protecting your privacy and ensuring the security of your personal information. This Privacy Policy explains how we collect, use, store, and protect your data when you use our Instagram automation platform.
              </p>
            </section>

            {/* Data We Collect */}
            <section>
              <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                <span className="w-8 h-8 bg-purple-500/20 rounded-lg flex items-center justify-center text-purple-400">2</span>
                Data We Collect
              </h2>
              <div className="space-y-4">
                <div className="bg-white/5 rounded-xl p-4 border border-white/10">
                  <h3 className="font-semibold text-white mb-2">Account Information</h3>
                  <ul className="list-disc list-inside space-y-1 text-sm">
                    <li>Name and email address (via Google OAuth)</li>
                    <li>Profile picture</li>
                    <li>Account preferences and settings</li>
                  </ul>
                </div>
                <div className="bg-white/5 rounded-xl p-4 border border-white/10">
                  <h3 className="font-semibold text-white mb-2">Instagram Integration Data</h3>
                  <ul className="list-disc list-inside space-y-1 text-sm">
                    <li>Instagram Business/Creator Account ID</li>
                    <li>Instagram Access Token (for API operations)</li>
                    <li>Instagram username and profile information</li>
                  </ul>
                </div>
                <div className="bg-white/5 rounded-xl p-4 border border-white/10">
                  <h3 className="font-semibold text-white mb-2">Automation Data</h3>
                  <ul className="list-disc list-inside space-y-1 text-sm">
                    <li>Keywords and trigger phrases you configure</li>
                    <li>Auto-reply messages you create</li>
                    <li>Automation performance statistics</li>
                  </ul>
                </div>
              </div>
            </section>

            {/* How We Use Your Data */}
            <section>
              <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                <span className="w-8 h-8 bg-purple-500/20 rounded-lg flex items-center justify-center text-purple-400">3</span>
                How We Use Your Data
              </h2>
              <div className="bg-gradient-to-r from-purple-500/10 to-pink-500/10 rounded-xl p-6 border border-purple-500/20">
                <div className="flex items-start gap-4">
                  <Lock className="w-8 h-8 text-purple-400 flex-shrink-0 mt-1" />
                  <div>
                    <h3 className="font-bold text-white mb-2">Your Instagram Access Token</h3>
                    <p className="text-sm leading-relaxed">
                      We use your Instagram Access Token <strong>solely</strong> for the purpose of executing automations on your behalf, such as:
                    </p>
                    <ul className="list-disc list-inside mt-2 space-y-1 text-sm">
                      <li>Sending automated DM replies when keywords are detected</li>
                      <li>Replying to comments on your posts</li>
                      <li>Responding to story mentions</li>
                    </ul>
                    <p className="mt-4 text-purple-300 font-semibold">
                      ⚠️ We NEVER sell, share, or transfer your Access Token to any third party.
                    </p>
                  </div>
                </div>
              </div>
            </section>

            {/* Data Storage */}
            <section>
              <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                <span className="w-8 h-8 bg-purple-500/20 rounded-lg flex items-center justify-center text-purple-400">4</span>
                Data Storage & Security
              </h2>
              <div className="bg-white/5 rounded-xl p-6 border border-white/10">
                <div className="flex items-start gap-4">
                  <Database className="w-8 h-8 text-green-400 flex-shrink-0 mt-1" />
                  <div>
                    <h3 className="font-bold text-white mb-2">Supabase (PostgreSQL)</h3>
                    <p className="text-sm leading-relaxed mb-4">
                      All your data is securely stored in Supabase, a trusted cloud database platform powered by PostgreSQL. Supabase provides:
                    </p>
                    <ul className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm">
                      <li className="flex items-center gap-2">
                        <span className="w-2 h-2 bg-green-400 rounded-full"></span>
                        End-to-end encryption
                      </li>
                      <li className="flex items-center gap-2">
                        <span className="w-2 h-2 bg-green-400 rounded-full"></span>
                        SOC 2 Type II compliance
                      </li>
                      <li className="flex items-center gap-2">
                        <span className="w-2 h-2 bg-green-400 rounded-full"></span>
                        Row-level security (RLS)
                      </li>
                      <li className="flex items-center gap-2">
                        <span className="w-2 h-2 bg-green-400 rounded-full"></span>
                        Regular automated backups
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
            </section>

            {/* Data Retention */}
            <section>
              <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                <span className="w-8 h-8 bg-purple-500/20 rounded-lg flex items-center justify-center text-purple-400">5</span>
                Data Retention
              </h2>
              <p className="leading-relaxed">
                We retain your data for as long as your account is active. If you delete your account or request data deletion, we will permanently remove all your data from our systems within 30 days, except where retention is required by law.
              </p>
            </section>

            {/* Your Rights */}
            <section>
              <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                <span className="w-8 h-8 bg-purple-500/20 rounded-lg flex items-center justify-center text-purple-400">6</span>
                Your Rights
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-white/5 rounded-xl p-4 border border-white/10">
                  <h3 className="font-semibold text-white mb-2">Access & Export</h3>
                  <p className="text-sm">Request a copy of all your stored data</p>
                </div>
                <div className="bg-white/5 rounded-xl p-4 border border-white/10">
                  <h3 className="font-semibold text-white mb-2">Deletion</h3>
                  <p className="text-sm">Request complete deletion of your data</p>
                </div>
                <div className="bg-white/5 rounded-xl p-4 border border-white/10">
                  <h3 className="font-semibold text-white mb-2">Correction</h3>
                  <p className="text-sm">Update or correct inaccurate information</p>
                </div>
                <div className="bg-white/5 rounded-xl p-4 border border-white/10">
                  <h3 className="font-semibold text-white mb-2">Revoke Access</h3>
                  <p className="text-sm">Disconnect Instagram and revoke access anytime</p>
                </div>
              </div>
            </section>

            {/* Third-Party Services */}
            <section>
              <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                <span className="w-8 h-8 bg-purple-500/20 rounded-lg flex items-center justify-center text-purple-400">7</span>
                Third-Party Services
              </h2>
              <p className="leading-relaxed mb-4">We integrate with the following trusted services:</p>
              <ul className="space-y-2 text-sm">
                <li className="flex items-center gap-2">
                  <span className="w-2 h-2 bg-blue-400 rounded-full"></span>
                  <strong>Meta/Instagram API</strong> - For Instagram automation features
                </li>
                <li className="flex items-center gap-2">
                  <span className="w-2 h-2 bg-green-400 rounded-full"></span>
                  <strong>Supabase</strong> - For secure data storage
                </li>
                <li className="flex items-center gap-2">
                  <span className="w-2 h-2 bg-red-400 rounded-full"></span>
                  <strong>Google OAuth</strong> - For authentication
                </li>
              </ul>
            </section>

            {/* Contact */}
            <section>
              <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                <span className="w-8 h-8 bg-purple-500/20 rounded-lg flex items-center justify-center text-purple-400">8</span>
                Contact Us
              </h2>
              <div className="bg-gradient-to-r from-purple-500/10 to-pink-500/10 rounded-xl p-6 border border-purple-500/20">
                <div className="flex items-center gap-4">
                  <Mail className="w-8 h-8 text-purple-400" />
                  <div>
                    <p className="text-white font-semibold">For privacy-related inquiries:</p>
                    <a href="mailto:privacy@igone.app" className="text-purple-400 hover:text-purple-300">
                      privacy@igone.app
                    </a>
                  </div>
                </div>
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
            <button onClick={() => onNavigate('terms')} className="text-gray-400 hover:text-white text-sm">
              Terms of Service
            </button>
            <button onClick={() => onNavigate('data-deletion')} className="text-gray-400 hover:text-white text-sm">
              Data Deletion
            </button>
          </div>
        </div>
      </footer>
    </div>
  );
}
