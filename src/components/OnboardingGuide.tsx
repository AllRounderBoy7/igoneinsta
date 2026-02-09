import { useState } from 'react';
import { X, ChevronRight, ChevronLeft, Instagram, Zap, MessageCircle, Send, BarChart3, GitBranch, Users, TrendingUp, Check, Rocket, Star, Sparkles, Eye, Shield, Lightbulb } from 'lucide-react';

interface OnboardingGuideProps {
  onClose: () => void;
}

export function OnboardingGuide({ onClose }: OnboardingGuideProps) {
  const [step, setStep] = useState(0);

  const steps = [
    {
      title: '🎉 Welcome to IGOne!',
      subtitle: 'The #1 Instagram Automation Platform',
      icon: Rocket,
      color: 'from-purple-600 to-pink-500',
      content: (
        <div className="space-y-4">
          <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-2xl p-6 border border-purple-100">
            <h4 className="font-bold text-gray-900 mb-3">What is IGOne?</h4>
            <p className="text-sm text-gray-600 leading-relaxed">
              IGOne is an <strong>Instagram Automation Platform</strong> that keeps your Instagram account on autopilot 24/7. 
              When someone DMs you, comments, or mentions you in stories — IGOne <strong>automatically replies</strong>!
            </p>
            <div className="mt-4 grid grid-cols-3 gap-3">
              <div className="text-center p-3 bg-white rounded-xl">
                <div className="text-2xl mb-1">💬</div>
                <div className="text-[10px] font-bold text-gray-700">Auto DM Reply</div>
              </div>
              <div className="text-center p-3 bg-white rounded-xl">
                <div className="text-2xl mb-1">📝</div>
                <div className="text-[10px] font-bold text-gray-700">Comment Reply</div>
              </div>
              <div className="text-center p-3 bg-white rounded-xl">
                <div className="text-2xl mb-1">📸</div>
                <div className="text-[10px] font-bold text-gray-700">Story Reply</div>
              </div>
            </div>
          </div>
          <div className="bg-blue-50 rounded-xl p-4 border border-blue-100">
            <div className="flex items-start gap-2">
              <Lightbulb size={16} className="text-blue-600 mt-0.5" />
              <p className="text-xs text-blue-800">
                <strong>Example:</strong> If you're a shop owner — when someone comments "PRICE", IGOne automatically sends them a DM with your price list! 🛍️
              </p>
            </div>
          </div>
        </div>
      ),
    },
    {
      title: '📱 Step 1: Connect Instagram',
      subtitle: 'Link your Instagram Business/Creator account',
      icon: Instagram,
      color: 'from-pink-500 to-rose-500',
      content: (
        <div className="space-y-4">
          <div className="bg-pink-50 rounded-2xl p-6 border border-pink-100">
            <h4 className="font-bold text-gray-900 mb-3">How to Connect?</h4>
            <div className="space-y-3">
              {[
                { step: '1', text: 'Go to Settings page (⚙️ in left sidebar)', icon: '⚙️' },
                { step: '2', text: 'Click "Instagram" tab', icon: '📱' },
                { step: '3', text: 'Click "Connect Instagram Account" button', icon: '🔗' },
                { step: '4', text: 'Login to Instagram and allow permissions', icon: '✅' },
                { step: '5', text: 'Done! Account will be connected', icon: '🎉' },
              ].map((s, i) => (
                <div key={i} className="flex items-center gap-3 p-2.5 bg-white rounded-xl">
                  <span className="w-8 h-8 rounded-lg bg-pink-100 flex items-center justify-center text-lg">{s.icon}</span>
                  <div className="flex items-center gap-2">
                    <span className="w-5 h-5 rounded-full bg-pink-500 text-white text-[10px] flex items-center justify-center font-bold">{s.step}</span>
                    <span className="text-sm text-gray-700">{s.text}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
          <div className="bg-orange-50 rounded-xl p-4 border border-orange-200">
            <p className="text-xs text-orange-800 font-medium">
              ⚠️ <strong>Important:</strong> Instagram Business or Creator account is required. Personal accounts will not work. 
              Go to Instagram Settings → Account → Switch to Professional Account to change.
            </p>
          </div>
        </div>
      ),
    },
    {
      title: '🤖 Step 2: Create Automation',
      subtitle: 'Create your first auto-reply automation',
      icon: Zap,
      color: 'from-blue-500 to-cyan-400',
      content: (
        <div className="space-y-4">
          <div className="bg-blue-50 rounded-2xl p-6 border border-blue-100">
            <h4 className="font-bold text-gray-900 mb-3">How to Create Automation?</h4>
            <div className="space-y-3">
              {[
                { text: 'Go to "Automations" page (🤖 in sidebar)', detail: 'Click Automations in left menu' },
                { text: 'Click "New Automation" button', detail: 'Purple button in top-right corner' },
                { text: 'Choose a template or create custom', detail: 'DM Reply, Comment Reply, Story Reply, Welcome Message' },
                { text: 'Set trigger keywords', detail: 'Like: INFO, PRICE, HELP, BUY, LINK' },
                { text: 'Write response message', detail: 'Personalize with {{name}}' },
                { text: 'Activate! Turn toggle ON', detail: 'Green toggle = Active, Yellow = Paused' },
              ].map((s, i) => (
                <div key={i} className="p-3 bg-white rounded-xl">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="w-5 h-5 rounded-full bg-blue-500 text-white text-[10px] flex items-center justify-center font-bold">{i + 1}</span>
                    <span className="text-sm font-semibold text-gray-900">{s.text}</span>
                  </div>
                  <p className="text-[11px] text-gray-500 ml-7">{s.detail}</p>
                </div>
              ))}
            </div>
          </div>
          <div className="bg-green-50 rounded-xl p-4 border border-green-200">
            <p className="text-xs text-green-800">
              💡 <strong>Pro Tip:</strong> Separate multiple keywords with commas: <code className="bg-green-100 px-1 rounded">INFO, PRICE, DETAILS</code>
              <br/>Auto-reply will trigger for any of these keywords!
            </p>
          </div>
        </div>
      ),
    },
    {
      title: '🔀 Step 3: Use Flow Builder',
      subtitle: 'Build complex conversation flows visually',
      icon: GitBranch,
      color: 'from-green-500 to-emerald-400',
      content: (
        <div className="space-y-4">
          <div className="bg-green-50 rounded-2xl p-6 border border-green-100">
            <h4 className="font-bold text-gray-900 mb-3">What is Flow Builder?</h4>
            <p className="text-sm text-gray-600 mb-4">
              With Flow Builder you can create <strong>multi-step conversations</strong>. Like a chatbot — guide users step by step!
            </p>
            <div className="space-y-2">
              <div className="p-3 bg-white rounded-xl border-l-4 border-green-500">
                <p className="text-xs font-bold text-green-700">TRIGGER → </p>
                <p className="text-xs text-gray-600">User ne "SHOP" DM kiya</p>
              </div>
              <div className="text-center text-gray-300">↓</div>
              <div className="p-3 bg-white rounded-xl border-l-4 border-blue-500">
                <p className="text-xs font-bold text-blue-700">MESSAGE →</p>
                <p className="text-xs text-gray-600">"Welcome! Kya dekhna chahoge?"</p>
              </div>
              <div className="text-center text-gray-300">↓</div>
              <div className="p-3 bg-white rounded-xl border-l-4 border-yellow-500">
                <p className="text-xs font-bold text-yellow-700">CONDITION →</p>
                <p className="text-xs text-gray-600">Is user a follower?</p>
              </div>
              <div className="grid grid-cols-2 gap-2">
                <div className="p-2 bg-white rounded-xl border-l-4 border-green-400 text-center">
                  <p className="text-[10px] font-bold text-green-600">YES → 20% OFF!</p>
                </div>
                <div className="p-2 bg-white rounded-xl border-l-4 border-red-400 text-center">
                  <p className="text-[10px] font-bold text-red-600">NO → "Follow us!"</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      ),
    },
    {
      title: '📢 Step 4: Broadcasts & Sequences',
      subtitle: 'Mass messaging and drip campaigns',
      icon: Send,
      color: 'from-orange-500 to-amber-400',
      content: (
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-orange-50 rounded-2xl p-5 border border-orange-100">
              <Send size={24} className="text-orange-500 mb-2" />
              <h4 className="font-bold text-gray-900 mb-2 text-sm">📢 Broadcasts</h4>
              <p className="text-xs text-gray-600 mb-3">Ek baar mein sabko message bhejo!</p>
              <ul className="space-y-1.5">
                {['Sale announcement', 'New product launch', 'Event invitation', 'Special offers'].map((item, i) => (
                  <li key={i} className="text-[11px] text-gray-600 flex items-center gap-1">
                    <Check size={10} className="text-orange-500" /> {item}
                  </li>
                ))}
              </ul>
            </div>
            <div className="bg-purple-50 rounded-2xl p-5 border border-purple-100">
              <Sparkles size={24} className="text-purple-500 mb-2" />
              <h4 className="font-bold text-gray-900 mb-2 text-sm">📋 Sequences</h4>
              <p className="text-xs text-gray-600 mb-3">Time par automatically messages bhejo!</p>
              <ul className="space-y-1.5">
                {['Day 0: Welcome DM', 'Day 1: Product info', 'Day 3: Special offer', 'Day 7: Feedback ask'].map((item, i) => (
                  <li key={i} className="text-[11px] text-gray-600 flex items-center gap-1">
                    <Check size={10} className="text-purple-500" /> {item}
                  </li>
                ))}
              </ul>
            </div>
          </div>
          <div className="bg-blue-50 rounded-xl p-4 border border-blue-100">
            <p className="text-xs text-blue-800">
              💡 <strong>How Sequences work:</strong> When someone subscribes, Day 0 sends welcome message. 
              Day 1 sends product info. Day 3 sends discount. All automatic! You don't have to do anything.
            </p>
          </div>
        </div>
      ),
    },
    {
      title: '📊 Step 5: Analytics & Growth',
      subtitle: 'Track performance and grow your audience',
      icon: BarChart3,
      color: 'from-violet-500 to-purple-500',
      content: (
        <div className="space-y-4">
          <div className="bg-violet-50 rounded-2xl p-6 border border-violet-100">
            <h4 className="font-bold text-gray-900 mb-3">What to Track in Analytics?</h4>
            <div className="grid grid-cols-2 gap-3">
              {[
                { icon: MessageCircle, label: 'Messages Sent', desc: 'Kitne messages bheje', value: '12.4K' },
                { icon: Users, label: 'Contacts', desc: 'Kitne log connected', value: '8.9K' },
                { icon: Eye, label: 'Open Rate', desc: 'Kitne % ne padhe', value: '67.8%' },
                { icon: TrendingUp, label: 'Growth Rate', desc: 'Audience growth', value: '+340%' },
              ].map((m, i) => {
                const Icon = m.icon;
                return (
                  <div key={i} className="bg-white rounded-xl p-3">
                    <Icon size={16} className="text-violet-500 mb-1" />
                    <p className="text-lg font-black text-gray-900">{m.value}</p>
                    <p className="text-[10px] font-bold text-gray-700">{m.label}</p>
                    <p className="text-[9px] text-gray-400">{m.desc}</p>
                  </div>
                );
              })}
            </div>
          </div>
          <div className="bg-emerald-50 rounded-xl p-4 border border-emerald-200">
            <h5 className="font-bold text-emerald-800 text-sm mb-2">🚀 Growth Tools</h5>
            <p className="text-xs text-emerald-700 mb-2">Audience grow karne ke tools:</p>
            <div className="grid grid-cols-3 gap-2">
              {['Comment Triggers', 'Story Mentions', 'Bio Links', 'QR Codes', 'Ref Links', 'Live Comments'].map((tool, i) => (
                <div key={i} className="bg-white rounded-lg p-2 text-center">
                  <p className="text-[10px] font-medium text-gray-700">{tool}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      ),
    },
    {
      title: '🛡️ Admin Features (Owner Only)',
      subtitle: 'Full platform control for administrators',
      icon: Shield,
      color: 'from-red-500 to-orange-500',
      content: (
        <div className="space-y-4">
          <div className="bg-red-50 rounded-2xl p-6 border border-red-100">
            <h4 className="font-bold text-gray-900 mb-3">How to Access Admin?</h4>
            <div className="space-y-2">
              <div className="p-3 bg-white rounded-xl flex items-center gap-3">
                <span className="text-2xl">👆</span>
                <div>
                  <p className="text-sm font-bold text-gray-900">Tap logo 5 times</p>
                  <p className="text-xs text-gray-500">Click the IGOne logo 5 times on landing page</p>
                </div>
              </div>
              <div className="p-3 bg-white rounded-xl flex items-center gap-3">
                <span className="text-2xl">🔐</span>
                <div>
                  <p className="text-sm font-bold text-gray-900">Enter password</p>
                  <p className="text-xs text-gray-500">Enter admin password and get access</p>
                </div>
              </div>
            </div>
          </div>
          <div className="bg-gray-50 rounded-2xl p-5 border border-gray-200">
            <h5 className="font-bold text-gray-900 text-sm mb-3">Admin Controls:</h5>
            <div className="grid grid-cols-2 gap-2">
              {[
                '👥 Manage all users',
                '💳 Edit plan prices',
                '📊 Platform analytics',
                '⚙️ Platform settings',
                '🚫 Suspend/ban users',
                '📢 Announcements',
                '🔧 API configuration',
                '💾 Database management',
                '📧 Email settings',
                '🔒 Security settings',
              ].map((item, i) => (
                <div key={i} className="text-xs text-gray-700 p-2 bg-white rounded-lg">{item}</div>
              ))}
            </div>
          </div>
        </div>
      ),
    },
    {
      title: '🎯 All Set! Get Started!',
      subtitle: 'You\'re ready to automate your Instagram!',
      icon: Star,
      color: 'from-yellow-500 to-orange-500',
      content: (
        <div className="space-y-4">
          <div className="bg-gradient-to-br from-yellow-50 to-orange-50 rounded-2xl p-6 border border-yellow-200 text-center">
            <div className="text-5xl mb-4">🎉</div>
            <h4 className="text-xl font-black text-gray-900 mb-2">Congratulations!</h4>
            <p className="text-sm text-gray-600 mb-4">
              You now understand all IGOne features! Start automating and put your Instagram on autopilot!
            </p>
            <div className="grid grid-cols-3 gap-3">
              <div className="bg-white rounded-xl p-3">
                <div className="text-2xl mb-1">⚡</div>
                <div className="text-[10px] font-bold text-gray-700">2 Min Setup</div>
              </div>
              <div className="bg-white rounded-xl p-3">
                <div className="text-2xl mb-1">🤖</div>
                <div className="text-[10px] font-bold text-gray-700">24/7 Active</div>
              </div>
              <div className="bg-white rounded-xl p-3">
                <div className="text-2xl mb-1">📈</div>
                <div className="text-[10px] font-bold text-gray-700">3x Growth</div>
              </div>
            </div>
          </div>
          <div className="bg-purple-50 rounded-xl p-4 border border-purple-200">
            <h5 className="font-bold text-purple-800 text-sm mb-2">Quick Start Checklist:</h5>
            <div className="space-y-2">
              {[
                '✅ Connect Instagram Account',
                '✅ Create first automation',
                '✅ Set trigger keywords',
                '✅ Write auto-reply message',
                '✅ Activate automation',
                '✅ Watch the magic happen! ✨',
              ].map((item, i) => (
                <p key={i} className="text-xs text-purple-700">{item}</p>
              ))}
            </div>
          </div>
        </div>
      ),
    },
  ];

  const currentStep = steps[step];
  const Icon = currentStep.icon;
  const progress = ((step + 1) / steps.length) * 100;

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-md z-[100] flex items-center justify-center p-4 animate-fade-in">
      <div className="bg-white rounded-3xl w-full max-w-lg shadow-2xl overflow-hidden animate-scale-in max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className={`bg-gradient-to-r ${currentStep.color} p-6 text-white relative overflow-hidden`}>
          <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full blur-2xl"></div>
          <div className="relative z-10">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <Icon size={24} />
                <span className="text-xs font-bold bg-white/20 px-2 py-0.5 rounded-full">
                  {step + 1} / {steps.length}
                </span>
              </div>
              <button onClick={onClose} className="p-1.5 hover:bg-white/20 rounded-lg transition-colors">
                <X size={18} />
              </button>
            </div>
            <h3 className="text-xl font-black">{currentStep.title}</h3>
            <p className="text-sm text-white/80 mt-1">{currentStep.subtitle}</p>
          </div>
          {/* Progress bar */}
          <div className="absolute bottom-0 left-0 right-0 h-1 bg-white/20">
            <div className="h-full bg-white/60 transition-all duration-500" style={{ width: `${progress}%` }}></div>
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-auto p-6">
          {currentStep.content}
        </div>

        {/* Navigation */}
        <div className="p-4 border-t border-gray-100 flex items-center justify-between bg-gray-50">
          <button
            onClick={() => setStep(Math.max(0, step - 1))}
            disabled={step === 0}
            className="flex items-center gap-1 px-4 py-2.5 rounded-xl text-sm font-medium text-gray-600 hover:bg-gray-100 disabled:opacity-30 disabled:cursor-not-allowed transition-all"
          >
            <ChevronLeft size={16} /> Back
          </button>
          <div className="flex gap-1.5">
            {steps.map((_, i) => (
              <button
                key={i}
                onClick={() => setStep(i)}
                className={`w-2 h-2 rounded-full transition-all ${i === step ? 'bg-purple-500 w-6' : i < step ? 'bg-purple-300' : 'bg-gray-300'}`}
              />
            ))}
          </div>
          {step < steps.length - 1 ? (
            <button
              onClick={() => setStep(step + 1)}
              className="flex items-center gap-1 px-5 py-2.5 bg-gradient-to-r from-purple-600 to-pink-500 text-white rounded-xl text-sm font-bold shadow-lg shadow-purple-200 hover:shadow-xl transition-all hover:-translate-y-0.5"
            >
              Next <ChevronRight size={16} />
            </button>
          ) : (
            <button
              onClick={onClose}
              className="flex items-center gap-1 px-5 py-2.5 bg-gradient-to-r from-green-500 to-emerald-400 text-white rounded-xl text-sm font-bold shadow-lg shadow-green-200 hover:shadow-xl transition-all hover:-translate-y-0.5"
            >
              Start Now! <Rocket size={16} />
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
