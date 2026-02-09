import { FileText, AlertTriangle, CheckCircle, XCircle, ArrowLeft } from 'lucide-react';

interface TermsPageProps {
  onNavigate: (page: string) => void;
}

export default function TermsPage({ onNavigate }: TermsPageProps) {
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
              <FileText className="w-8 h-8 text-white" />
            </div>
            <div>
              <h1 className="text-3xl md:text-4xl font-bold text-white">Terms of Service</h1>
              <p className="text-gray-400">Last updated: {new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}</p>
            </div>
          </div>

          <div className="space-y-8 text-gray-300">
            {/* Agreement */}
            <section>
              <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                <span className="w-8 h-8 bg-purple-500/20 rounded-lg flex items-center justify-center text-purple-400">1</span>
                Agreement to Terms
              </h2>
              <p className="leading-relaxed">
                By accessing or using igone ("Service"), you agree to be bound by these Terms of Service. If you do not agree to these terms, please do not use our Service. These terms apply to all visitors, users, and others who access or use the Service.
              </p>
            </section>

            {/* Service Description */}
            <section>
              <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                <span className="w-8 h-8 bg-purple-500/20 rounded-lg flex items-center justify-center text-purple-400">2</span>
                Service Description
              </h2>
              <p className="leading-relaxed mb-4">
                igone is an Instagram automation platform that helps businesses and creators automate their Instagram interactions, including:
              </p>
              <ul className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <li className="flex items-center gap-2 bg-white/5 rounded-lg p-3">
                  <CheckCircle className="w-5 h-5 text-green-400 flex-shrink-0" />
                  <span className="text-sm">Automated DM responses</span>
                </li>
                <li className="flex items-center gap-2 bg-white/5 rounded-lg p-3">
                  <CheckCircle className="w-5 h-5 text-green-400 flex-shrink-0" />
                  <span className="text-sm">Comment auto-replies</span>
                </li>
                <li className="flex items-center gap-2 bg-white/5 rounded-lg p-3">
                  <CheckCircle className="w-5 h-5 text-green-400 flex-shrink-0" />
                  <span className="text-sm">Story mention responses</span>
                </li>
                <li className="flex items-center gap-2 bg-white/5 rounded-lg p-3">
                  <CheckCircle className="w-5 h-5 text-green-400 flex-shrink-0" />
                  <span className="text-sm">Keyword-based triggers</span>
                </li>
              </ul>
            </section>

            {/* Instagram Guidelines - IMPORTANT */}
            <section>
              <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                <span className="w-8 h-8 bg-purple-500/20 rounded-lg flex items-center justify-center text-purple-400">3</span>
                Instagram Community Guidelines
              </h2>
              <div className="bg-gradient-to-r from-yellow-500/10 to-orange-500/10 rounded-xl p-6 border border-yellow-500/20">
                <div className="flex items-start gap-4">
                  <AlertTriangle className="w-8 h-8 text-yellow-400 flex-shrink-0 mt-1" />
                  <div>
                    <h3 className="font-bold text-white mb-2">Important Disclaimer</h3>
                    <p className="text-sm leading-relaxed mb-4">
                      igone is designed to comply with Instagram's Community Guidelines and Meta's Platform Terms. Our service:
                    </p>
                    <ul className="space-y-2 text-sm">
                      <li className="flex items-start gap-2">
                        <CheckCircle className="w-4 h-4 text-green-400 flex-shrink-0 mt-0.5" />
                        <span>Uses only official Meta/Instagram Graph API</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <CheckCircle className="w-4 h-4 text-green-400 flex-shrink-0 mt-0.5" />
                        <span>Requires proper user authorization and permissions</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <CheckCircle className="w-4 h-4 text-green-400 flex-shrink-0 mt-0.5" />
                        <span>Does not engage in any unauthorized data scraping</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <CheckCircle className="w-4 h-4 text-green-400 flex-shrink-0 mt-0.5" />
                        <span>Respects rate limits and API usage policies</span>
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
            </section>

            {/* Prohibited Uses */}
            <section>
              <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                <span className="w-8 h-8 bg-purple-500/20 rounded-lg flex items-center justify-center text-purple-400">4</span>
                Prohibited Uses
              </h2>
              <div className="bg-red-500/10 rounded-xl p-6 border border-red-500/20">
                <p className="text-sm mb-4 text-red-300">You agree NOT to use igone for:</p>
                <ul className="space-y-2 text-sm">
                  <li className="flex items-start gap-2">
                    <XCircle className="w-4 h-4 text-red-400 flex-shrink-0 mt-0.5" />
                    <span><strong>Spamming:</strong> Sending unsolicited bulk messages or repetitive content</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <XCircle className="w-4 h-4 text-red-400 flex-shrink-0 mt-0.5" />
                    <span><strong>Harassment:</strong> Targeting individuals with unwanted or abusive messages</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <XCircle className="w-4 h-4 text-red-400 flex-shrink-0 mt-0.5" />
                    <span><strong>Misinformation:</strong> Spreading false or misleading information</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <XCircle className="w-4 h-4 text-red-400 flex-shrink-0 mt-0.5" />
                    <span><strong>Illegal Activities:</strong> Any activities that violate local or international laws</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <XCircle className="w-4 h-4 text-red-400 flex-shrink-0 mt-0.5" />
                    <span><strong>TOS Violations:</strong> Any activity that violates Instagram's Terms of Service</span>
                  </li>
                </ul>
              </div>
              <p className="mt-4 text-sm text-yellow-300">
                ⚠️ <strong>igone is not responsible for account suspensions or bans resulting from user misuse of our platform.</strong> Users are solely responsible for ensuring their automations comply with Instagram's guidelines.
              </p>
            </section>

            {/* Account Responsibility */}
            <section>
              <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                <span className="w-8 h-8 bg-purple-500/20 rounded-lg flex items-center justify-center text-purple-400">5</span>
                Account Responsibility
              </h2>
              <div className="space-y-3 text-sm">
                <p>You are responsible for:</p>
                <ul className="list-disc list-inside space-y-2 pl-4">
                  <li>Maintaining the confidentiality of your account credentials</li>
                  <li>All activities that occur under your account</li>
                  <li>Ensuring your automations comply with applicable laws and Instagram's guidelines</li>
                  <li>Promptly notifying us of any unauthorized use of your account</li>
                </ul>
              </div>
            </section>

            {/* Subscription & Payments */}
            <section>
              <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                <span className="w-8 h-8 bg-purple-500/20 rounded-lg flex items-center justify-center text-purple-400">6</span>
                Subscription & Payments
              </h2>
              <div className="space-y-4">
                <div className="bg-white/5 rounded-xl p-4 border border-white/10">
                  <h3 className="font-semibold text-white mb-2">Billing</h3>
                  <p className="text-sm">Subscriptions are billed in advance on a monthly or yearly basis. Payment is processed via UPI and is non-refundable except as required by law.</p>
                </div>
                <div className="bg-white/5 rounded-xl p-4 border border-white/10">
                  <h3 className="font-semibold text-white mb-2">Plan Changes</h3>
                  <p className="text-sm">You may upgrade or downgrade your plan at any time. Changes take effect immediately upon payment verification.</p>
                </div>
                <div className="bg-white/5 rounded-xl p-4 border border-white/10">
                  <h3 className="font-semibold text-white mb-2">Cancellation</h3>
                  <p className="text-sm">You may cancel your subscription at any time. Your account will remain active until the end of your current billing period.</p>
                </div>
              </div>
            </section>

            {/* Limitation of Liability */}
            <section>
              <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                <span className="w-8 h-8 bg-purple-500/20 rounded-lg flex items-center justify-center text-purple-400">7</span>
                Limitation of Liability
              </h2>
              <div className="bg-white/5 rounded-xl p-6 border border-white/10 text-sm leading-relaxed">
                <p className="mb-4">
                  TO THE MAXIMUM EXTENT PERMITTED BY LAW, IGONE SHALL NOT BE LIABLE FOR ANY INDIRECT, INCIDENTAL, SPECIAL, CONSEQUENTIAL, OR PUNITIVE DAMAGES, INCLUDING BUT NOT LIMITED TO:
                </p>
                <ul className="list-disc list-inside space-y-1 pl-4">
                  <li>Loss of profits, revenue, or data</li>
                  <li>Instagram account suspensions or bans</li>
                  <li>Interruption of business</li>
                  <li>Any damages resulting from unauthorized access to your account</li>
                </ul>
              </div>
            </section>

            {/* Termination */}
            <section>
              <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                <span className="w-8 h-8 bg-purple-500/20 rounded-lg flex items-center justify-center text-purple-400">8</span>
                Termination
              </h2>
              <p className="leading-relaxed">
                We reserve the right to suspend or terminate your account immediately, without prior notice, if we believe you have violated these Terms of Service, engaged in prohibited activities, or misused our platform in any way.
              </p>
            </section>

            {/* Changes to Terms */}
            <section>
              <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                <span className="w-8 h-8 bg-purple-500/20 rounded-lg flex items-center justify-center text-purple-400">9</span>
                Changes to Terms
              </h2>
              <p className="leading-relaxed">
                We may update these Terms of Service from time to time. We will notify you of any material changes by posting the new terms on this page and updating the "Last updated" date. Your continued use of the Service after any changes constitutes acceptance of the new terms.
              </p>
            </section>

            {/* Contact */}
            <section>
              <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                <span className="w-8 h-8 bg-purple-500/20 rounded-lg flex items-center justify-center text-purple-400">10</span>
                Contact Us
              </h2>
              <div className="bg-gradient-to-r from-purple-500/10 to-pink-500/10 rounded-xl p-6 border border-purple-500/20">
                <p className="text-sm">
                  If you have any questions about these Terms of Service, please contact us at:
                </p>
                <a href="mailto:legal@igone.app" className="text-purple-400 hover:text-purple-300 font-semibold">
                  legal@igone.app
                </a>
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
            <button onClick={() => onNavigate('data-deletion')} className="text-gray-400 hover:text-white text-sm">
              Data Deletion
            </button>
          </div>
        </div>
      </footer>
    </div>
  );
}
