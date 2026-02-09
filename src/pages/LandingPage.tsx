import { useState, useRef } from 'react';
import { useStore } from '../hooks/useStore';
import { Instagram, Zap, Bot, Users, BarChart3, Send, MessageCircle, Shield, Star, ArrowRight, Check, TrendingUp, GitBranch, Sparkles, Heart, Clock, ChevronDown, Globe, Lock, Layers, Rocket, Target } from 'lucide-react';

interface LandingPageProps {
  onNavigate: (page: string) => void;
}

export function LandingPage({ onNavigate }: LandingPageProps) {
  const { demoLogin, loginWithGoogle, setAdmin, plans } = useStore();
  const [logoClicks, setLogoClicks] = useState(0);
  const [showAdminModal, setShowAdminModal] = useState(false);
  const [adminPass, setAdminPass] = useState('');
  const [adminError, setAdminError] = useState('');
  const [activeFaq, setActiveFaq] = useState<number | null>(null);
  const clickTimeout = useRef<ReturnType<typeof setTimeout>>(undefined);

  const handleLogoClick = () => {
    const newClicks = logoClicks + 1;
    setLogoClicks(newClicks);
    if (clickTimeout.current) clearTimeout(clickTimeout.current);
    clickTimeout.current = setTimeout(() => setLogoClicks(0), 3000);
    if (newClicks >= 5) {
      setShowAdminModal(true);
      setLogoClicks(0);
    }
  };

  const handleAdminLogin = () => {
    if (adminPass === 'sameer3745') {
      setAdmin(true);
      demoLogin('admin@igone.com', 'Admin');
      setShowAdminModal(false);
      setAdminPass('');
      setAdminError('');
      onNavigate('admin-dashboard');
    } else {
      setAdminError('Invalid password');
    }
  };

  const [loginLoading, setLoginLoading] = useState(false);
  const [loginError, setLoginError] = useState('');

  const handleGoogleLogin = async () => {
    setLoginLoading(true);
    setLoginError('');
    
    try {
      // Try real Google OAuth via Supabase
      await loginWithGoogle();
      // If successful, Supabase will redirect to Google OAuth
      // After user logs in, they'll be redirected back and the session will be set
    } catch (error: any) {
      console.error('Google login error:', error);
      
      // If Supabase is not configured properly, show helpful message
      if (error?.message?.includes('fetch') || error?.message?.includes('network') || error?.code === 'PGRST') {
        setLoginError('Supabase not configured. Please set up your Supabase project first.');
        // For demo/development, allow demo login
        setTimeout(() => {
          const confirm = window.confirm('Supabase is not configured. Would you like to use demo mode instead?');
          if (confirm) {
            const randomId = Math.random().toString(36).substring(7);
            demoLogin(`user_${randomId}@gmail.com`, `User ${randomId}`);
            onNavigate('dashboard');
          }
        }, 500);
      } else {
        setLoginError(error?.message || 'Login failed. Please try again.');
      }
    } finally {
      setLoginLoading(false);
    }
  };

  const features = [
    { icon: Bot, title: 'DM Auto-Reply', desc: 'Instantly reply to every DM with smart, keyword-triggered responses that feel personal and human.', color: 'from-blue-500 to-cyan-400' },
    { icon: MessageCircle, title: 'Comment Auto-Reply', desc: 'Auto-respond to comments and send DMs when users type trigger keywords on any post.', color: 'from-purple-500 to-pink-500' },
    { icon: GitBranch, title: 'Visual Flow Builder', desc: 'Build complex conversation flows with our easy drag-and-drop visual editor. No coding needed.', color: 'from-green-500 to-emerald-400' },
    { icon: Send, title: 'Broadcast Messages', desc: 'Send targeted mass messages to segmented audience groups with one click.', color: 'from-orange-500 to-amber-400' },
    { icon: Users, title: 'Smart CRM', desc: 'Complete contact management with tags, custom fields, and interaction history.', color: 'from-red-500 to-pink-500' },
    { icon: TrendingUp, title: 'Growth Tools', desc: 'QR codes, bio links, comment triggers, and more to grow your audience automatically.', color: 'from-violet-500 to-purple-500' },
    { icon: BarChart3, title: 'Deep Analytics', desc: 'Track opens, clicks, conversions, and revenue from every automation in real-time.', color: 'from-teal-500 to-cyan-400' },
    { icon: Sparkles, title: 'Smart Sequences', desc: 'Drip campaigns that nurture leads over days or weeks completely on autopilot.', color: 'from-yellow-500 to-orange-400' },
    { icon: Heart, title: 'Story Mentions', desc: 'Auto-thank users who mention you in stories with personalized custom DMs.', color: 'from-pink-500 to-rose-400' },
  ];

  const testimonials = [
    { name: 'Sarah K.', role: 'E-commerce Owner', text: 'IGOne tripled my Instagram sales in just 2 weeks! The auto-reply feature is absolutely a game changer for my business!', stars: 5, avatar: '👩‍💼' },
    { name: 'Mike R.', role: 'Digital Marketer', text: 'Best automation tool I\'ve used. Super intuitive and very affordable. My clients love the results!', stars: 5, avatar: '👨‍💻' },
    { name: 'Priya M.', role: 'Influencer · 500K+', text: 'My engagement went up 400%. The comment trigger to DM feature is incredible. I can\'t imagine going back!', stars: 5, avatar: '👩‍🎤' },
    { name: 'Alex R.', role: 'Fitness Coach', text: 'I automated my entire lead generation. From 10 leads/day to 100+. IGOne paid for itself in the first week.', stars: 5, avatar: '💪' },
    { name: 'Neha P.', role: 'Brand Owner', text: 'The flow builder is so easy that I set up my entire sales funnel in 30 minutes. No tech skills needed at all!', stars: 5, avatar: '👩‍🔧' },
    { name: 'David L.', role: 'Agency Owner', text: 'Managing 20+ client accounts is a breeze with IGOne. The admin panel gives me complete control.', stars: 5, avatar: '🧑‍💼' },
  ];

  const stats = [
    { value: '15K+', label: 'Active Users', icon: Users },
    { value: '50M+', label: 'Messages Sent', icon: Send },
    { value: '340%', label: 'Avg. Growth', icon: TrendingUp },
    { value: '99.9%', label: 'Uptime', icon: Globe },
  ];

  const howItWorks = [
    { step: '1', title: 'Connect Your Instagram', desc: 'Link your Instagram Business or Creator account in just one click. Secure OAuth — we never see your password.', icon: Instagram, color: 'from-purple-500 to-pink-500', detail: 'Just click "Connect Instagram" and authorize. Takes 10 seconds!' },
    { step: '2', title: 'Set Up Automations', desc: 'Pick a template or create custom flows. Set keyword triggers, auto-replies, and conversation sequences.', icon: Zap, color: 'from-blue-500 to-cyan-400', detail: 'We have 20+ pre-built templates. Or build your own in minutes!' },
    { step: '3', title: 'Watch It Grow', desc: 'Your automations work 24/7 while you sleep. Track every message, click, and conversion in real-time.', icon: Rocket, color: 'from-green-500 to-emerald-400', detail: 'Average users see 3x engagement growth in the first month!' },
  ];

  const faqs = [
    { q: 'Is IGOne safe to use?', a: '100% safe! We use Instagram\'s official Meta Graph API. Your account will never be banned. Fully compliant and secure.' },
    { q: 'What features are included in the free plan?', a: 'Free plan includes basic features — DM Auto-Reply, Comment Reply, 3 Automations, 50 Contacts. Advanced features like Flow Builder, Broadcasts, Sequences are available in Pro plan.' },
    { q: 'Is Instagram Business account required?', a: 'Yes, automation requires Instagram Business or Creator account. Converting a personal account to Business is easy — Instagram Settings > Account > Switch to Professional.' },
    { q: 'How long does setup take?', a: 'Just 2 minutes! Connect Instagram, choose template, set keywords — done! Your automation will be live. No coding or technical knowledge needed.' },
    { q: 'Why choose IGOne?', a: 'IGOne offers complete Instagram automation with: Better UI, lower pricing (starting ₹99/mo), faster setup, more templates, better analytics, and dedicated support.' },
    { q: 'Can I cancel anytime?', a: 'Yes! No lock-in period. Cancel anytime. 30-day money-back guarantee on all paid plans.' },
  ];

  // Benefits data moved inline

  return (
    <div className="min-h-screen bg-white font-['Inter',sans-serif] overflow-x-hidden">
      {/* Admin Modal */}
      {showAdminModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-md z-[100] flex items-center justify-center p-4 animate-fade-in">
          <div className="bg-white rounded-3xl p-8 w-full max-w-sm shadow-2xl animate-scale-in">
            <div className="text-center mb-6">
              <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-red-500 to-orange-500 flex items-center justify-center mx-auto mb-4 shadow-xl animate-bounce-soft">
                <Shield size={32} className="text-white" />
              </div>
              <h3 className="text-xl font-bold text-gray-900">🔐 Admin Access</h3>
              <p className="text-sm text-gray-500 mt-1">Enter admin password to continue</p>
            </div>
            <input
              type="password"
              value={adminPass}
              onChange={(e) => { setAdminPass(e.target.value); setAdminError(''); }}
              onKeyDown={(e) => e.key === 'Enter' && handleAdminLogin()}
              placeholder="Enter password..."
              className="w-full px-4 py-3.5 bg-gray-50 border-2 border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent mb-3 transition-all"
              autoFocus
            />
            {adminError && <p className="text-red-500 text-xs mb-3 flex items-center gap-1">⚠️ {adminError}</p>}
            <button onClick={handleAdminLogin} className="w-full py-3.5 bg-gradient-to-r from-red-500 to-orange-500 text-white rounded-xl font-bold text-sm hover:opacity-90 transition-all shadow-lg shadow-red-200 hover:shadow-xl hover:-translate-y-0.5 active:translate-y-0">
              Access Admin Panel
            </button>
            <button onClick={() => { setShowAdminModal(false); setAdminPass(''); setAdminError(''); }} className="w-full mt-2 py-2.5 text-gray-500 text-sm hover:text-gray-700 transition-colors">
              Cancel
            </button>
          </div>
        </div>
      )}

      {/* Navigation */}
      <nav className="fixed top-0 w-full glass border-b border-white/20 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16 md:h-18">
            <button onClick={handleLogoClick} className="flex items-center gap-2.5 select-none group">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-purple-600 to-pink-500 flex items-center justify-center shadow-lg shadow-purple-200 group-hover:shadow-xl group-hover:shadow-purple-300 transition-all group-hover:-translate-y-0.5 group-hover:scale-105">
                <Instagram size={20} className="text-white" />
              </div>
              <span className="font-black text-xl gradient-text">IGOne</span>
              {logoClicks > 0 && (
                <span className="text-[10px] bg-gray-100 text-gray-400 px-1.5 py-0.5 rounded-full">{logoClicks}/5</span>
              )}
            </button>
            <div className="hidden md:flex items-center gap-8">
              <a href="#features" className="text-sm text-gray-600 hover:text-purple-600 font-medium transition-colors">Features</a>
              <a href="#how-it-works" className="text-sm text-gray-600 hover:text-purple-600 font-medium transition-colors">How It Works</a>
              <a href="#pricing" className="text-sm text-gray-600 hover:text-purple-600 font-medium transition-colors">Pricing</a>
              <a href="#testimonials" className="text-sm text-gray-600 hover:text-purple-600 font-medium transition-colors">Reviews</a>
            </div>
            <button
              onClick={handleGoogleLogin}
              disabled={loginLoading}
              className="flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-purple-600 to-pink-500 text-white rounded-xl font-bold text-sm shadow-lg shadow-purple-200 hover:shadow-xl hover:shadow-purple-300 transition-all hover:-translate-y-0.5 active:translate-y-0 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loginLoading ? (
                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
              ) : (
                <svg className="w-4 h-4" viewBox="0 0 24 24"><path fill="currentColor" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z"/><path fill="currentColor" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/><path fill="currentColor" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/><path fill="currentColor" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/></svg>
              )}
              <span className="hidden sm:inline">{loginLoading ? 'Signing in...' : 'Sign in with Google'}</span>
              <span className="sm:hidden">{loginLoading ? '...' : 'Sign in'}</span>
            </button>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section className="pt-28 md:pt-36 pb-20 px-4 relative overflow-hidden">
        {/* Background decorations */}
        <div className="absolute inset-0 bg-gradient-to-br from-purple-50 via-white to-pink-50"></div>
        <div className="absolute top-20 -left-20 w-96 h-96 bg-purple-200 rounded-full blur-3xl opacity-20 animate-float"></div>
        <div className="absolute bottom-20 -right-20 w-[500px] h-[500px] bg-pink-200 rounded-full blur-3xl opacity-20 animate-float-slow"></div>
        <div className="absolute top-40 right-20 w-32 h-32 bg-blue-200 rounded-full blur-2xl opacity-30 animate-float"></div>
        <div className="absolute bottom-40 left-20 w-24 h-24 bg-yellow-200 rounded-full blur-2xl opacity-30 animate-float-slow"></div>
        
        {/* Floating elements */}
        <div className="absolute top-32 left-[15%] hidden lg:block animate-float">
          <div className="bg-white rounded-2xl p-3 shadow-xl border border-gray-100">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-green-100 flex items-center justify-center"><MessageCircle size={14} className="text-green-600" /></div>
              <div><p className="text-[10px] font-bold text-gray-700">Auto-Reply Sent!</p><p className="text-[9px] text-gray-400">2 seconds ago</p></div>
            </div>
          </div>
        </div>
        <div className="absolute top-52 right-[12%] hidden lg:block animate-float-slow">
          <div className="bg-white rounded-2xl p-3 shadow-xl border border-gray-100">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-purple-100 flex items-center justify-center"><Heart size={14} className="text-purple-600" /></div>
              <div><p className="text-[10px] font-bold text-gray-700">+23 New Followers</p><p className="text-[9px] text-gray-400">Welcome DM sent ✓</p></div>
            </div>
          </div>
        </div>
        <div className="absolute bottom-32 left-[10%] hidden lg:block animate-float">
          <div className="bg-white rounded-2xl p-3 shadow-xl border border-gray-100">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-blue-100 flex items-center justify-center"><TrendingUp size={14} className="text-blue-600" /></div>
              <div><p className="text-[10px] font-bold text-gray-700">Engagement +340%</p><p className="text-[9px] text-gray-400">This month</p></div>
            </div>
          </div>
        </div>
        
        <div className="max-w-5xl mx-auto text-center relative z-10">
          <div className="animate-slide-up">
            <div className="inline-flex items-center gap-2 px-5 py-2.5 bg-white/80 backdrop-blur border border-purple-200 rounded-full mb-8 shadow-sm">
              <span className="animate-wave inline-block">👋</span>
              <span className="text-sm font-semibold text-purple-700">#1 Instagram Automation Platform</span>
              <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span>
            </div>
          </div>
          
          <h1 className="text-4xl sm:text-5xl md:text-7xl font-black text-gray-900 leading-tight mb-6 animate-slide-up">
            Automate Your
            <span className="block md:inline"> <span className="gradient-text animate-gradient-x">Instagram</span></span>
            <span className="block">Growth 🚀</span>
          </h1>
          
          <p className="text-lg md:text-xl text-gray-600 max-w-2xl mx-auto mb-10 leading-relaxed animate-slide-up delay-200" style={{animationDelay: '200ms'}}>
            Auto-reply to DMs, comments & stories. Build flows, broadcast messages, and grow your audience on <strong>complete autopilot</strong>. The most powerful Instagram automation platform.
          </p>
          
          {loginError && (
            <div className="mb-4 px-4 py-3 bg-red-50 border border-red-200 rounded-xl text-red-700 text-sm animate-slide-up">
              ⚠️ {loginError}
            </div>
          )}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-16 animate-slide-up delay-300" style={{animationDelay: '300ms'}}>
            <button
              onClick={handleGoogleLogin}
              className="group flex items-center gap-3 px-8 py-4 bg-gradient-to-r from-purple-600 to-pink-500 text-white rounded-2xl font-bold text-lg shadow-2xl shadow-purple-300 hover:shadow-xl hover:shadow-purple-400 transition-all hover:-translate-y-1 active:translate-y-0 animate-pulse-glow"
            >
              <svg className="w-5 h-5" viewBox="0 0 24 24"><path fill="currentColor" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z"/><path fill="currentColor" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/><path fill="currentColor" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/><path fill="currentColor" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/></svg>
              Start Free with Google
              <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
            </button>
{/* Watch Demo removed */}
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6 max-w-3xl mx-auto animate-slide-up delay-400" style={{animationDelay: '400ms'}}>
            {stats.map((s, i) => {
              const Icon = s.icon;
              return (
                <div key={i} className="bg-white/80 backdrop-blur rounded-2xl p-4 border border-gray-100 shadow-sm hover:shadow-md hover:-translate-y-1 transition-all group">
                  <Icon size={18} className="text-purple-500 mx-auto mb-2 group-hover:scale-110 transition-transform" />
                  <div className="text-2xl md:text-3xl font-black gradient-text">{s.value}</div>
                  <div className="text-xs text-gray-500 font-medium mt-1">{s.label}</div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Phone mockup */}
        <div className="max-w-5xl mx-auto mt-16 relative">
          <div className="mx-auto max-w-4xl rounded-2xl overflow-hidden shadow-2xl border border-gray-200 bg-gradient-to-br from-gray-50 to-white">
            <div className="bg-gradient-to-r from-purple-600 to-pink-500 px-4 py-2 flex items-center gap-2">
              <div className="flex gap-1.5"><div className="w-3 h-3 rounded-full bg-red-400"></div><div className="w-3 h-3 rounded-full bg-yellow-400"></div><div className="w-3 h-3 rounded-full bg-green-400"></div></div>
              <div className="flex-1 text-center"><span className="text-white/80 text-xs font-medium">app.igone.com</span></div>
            </div>
            <div className="p-4 md:p-8 bg-gradient-to-br from-gray-50 to-gray-100">
              <div className="grid grid-cols-4 gap-3 md:gap-4">
                {[
                  { label: 'Messages Sent', value: '12,450', icon: '📨', color: 'from-blue-500 to-cyan-400' },
                  { label: 'Active Automations', value: '24', icon: '🤖', color: 'from-purple-500 to-pink-500' },
                  { label: 'Total Contacts', value: '8,920', icon: '👥', color: 'from-green-500 to-emerald-400' },
                  { label: 'Conversion Rate', value: '23.5%', icon: '📈', color: 'from-orange-500 to-amber-400' },
                ].map((card, i) => (
                  <div key={i} className="bg-white rounded-xl p-3 md:p-4 shadow-sm border border-gray-100">
                    <div className="text-lg md:text-2xl mb-1">{card.icon}</div>
                    <div className="text-sm md:text-lg font-bold text-gray-900">{card.value}</div>
                    <div className="text-[10px] md:text-xs text-gray-500">{card.label}</div>
                  </div>
                ))}
              </div>
              <div className="mt-4 bg-white rounded-xl p-4 shadow-sm border border-gray-100">
                <div className="flex items-end gap-1.5 h-20 md:h-32">
                  {[40, 65, 45, 80, 55, 70, 90, 60, 75, 85, 50, 95, 70, 88, 62, 78, 92, 68, 84, 96].map((h, i) => (
                    <div key={i} className="flex-1 bg-gradient-to-t from-purple-500 to-pink-400 rounded-t opacity-70" style={{ height: `${h}%` }}></div>
                  ))}
                </div>
              </div>
            </div>
          </div>
          <div className="absolute -bottom-4 left-1/2 -translate-x-1/2 w-3/4 h-8 bg-purple-600/10 blur-2xl rounded-full"></div>
        </div>
      </section>

      {/* Trusted by */}
      <section className="py-12 px-4 bg-gray-50 border-y border-gray-100">
        <div className="max-w-5xl mx-auto text-center">
          <p className="text-sm text-gray-400 font-medium mb-6">TRUSTED BY 15,000+ BUSINESSES WORLDWIDE</p>
          <div className="flex flex-wrap items-center justify-center gap-8 md:gap-12 opacity-40">
            {['🏪 ShopEasy', '📱 AppVenture', '🎨 DesignCo', '🏋️ FitnessPro', '📸 PhotoStudio', '🍕 FoodChain', '👗 FashionHub'].map((brand, i) => (
              <span key={i} className="text-base md:text-lg font-bold text-gray-600">{brand}</span>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works - DETAILED GUIDE */}
      <section id="how-it-works" className="py-24 px-4 bg-white relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-purple-50 rounded-full blur-3xl opacity-50"></div>
        <div className="max-w-6xl mx-auto relative z-10">
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-blue-50 border border-blue-200 rounded-full mb-4">
              <Target size={14} className="text-blue-600" />
              <span className="text-sm font-semibold text-blue-700">Super Easy Setup</span>
            </div>
            <h2 className="text-3xl md:text-5xl font-black text-gray-900 mt-3">How Does It Work? 🤔</h2>
            <p className="text-lg text-gray-500 max-w-2xl mx-auto mt-4">Your Instagram automation ready in just 3 simple steps! No coding, no technical knowledge needed.</p>
          </div>
          
          <div className="space-y-12 md:space-y-0 md:grid md:grid-cols-3 md:gap-8">
            {howItWorks.map((step, i) => {
              const Icon = step.icon;
              return (
                <div key={i} className="relative group">
                  {/* Connection line */}
                  {i < 2 && <div className="hidden md:block absolute top-12 left-[calc(50%+40px)] w-[calc(100%-80px)] h-0.5 bg-gradient-to-r from-purple-200 to-pink-200"></div>}
                  
                  <div className="text-center">
                    <div className={`w-24 h-24 rounded-3xl bg-gradient-to-br ${step.color} flex items-center justify-center mx-auto mb-6 shadow-2xl group-hover:scale-110 group-hover:-translate-y-2 transition-all duration-300`}>
                      <Icon size={36} className="text-white" />
                    </div>
                    <div className="inline-flex items-center gap-2 px-3 py-1 bg-purple-50 rounded-full mb-3">
                      <span className="text-xs font-black text-purple-700">STEP {step.step}</span>
                    </div>
                    <h3 className="text-xl font-bold text-gray-900 mb-3">{step.title}</h3>
                    <p className="text-gray-500 mb-4 leading-relaxed">{step.desc}</p>
                    <div className="inline-flex items-center gap-2 px-4 py-2 bg-green-50 border border-green-200 rounded-xl">
                      <Check size={14} className="text-green-600" />
                      <span className="text-xs font-medium text-green-700">{step.detail}</span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Detailed setup guide */}
          <div className="mt-16 bg-gradient-to-br from-purple-50 via-white to-pink-50 rounded-3xl p-8 md:p-12 border border-purple-100">
            <h3 className="text-2xl font-bold text-gray-900 mb-6 text-center">📋 Complete Setup Guide</h3>
            <div className="grid md:grid-cols-2 gap-6">
              {[
                { num: '1', title: 'Sign In with Google', desc: 'Click "Sign in with Google" on homepage. Select your Gmail account. Done!', icon: '🔐', time: '10 sec' },
                { num: '2', title: 'Connect Instagram', desc: 'Click "Connect Instagram" button on Dashboard. Authorize your Instagram Business/Creator account.', icon: '📱', time: '30 sec' },
                { num: '3', title: 'Create Automation', desc: 'Go to "Automations" page. Click "New Automation". Choose a template or build custom.', icon: '⚡', time: '2 min' },
                { num: '4', title: 'Set Keywords', desc: 'Type trigger keywords (like INFO, PRICE, HELP). When someone types these words, auto-reply triggers.', icon: '🎯', time: '1 min' },
                { num: '5', title: 'Write Response', desc: 'Write your auto-reply message. Use {{name}} for personalization. Add emojis! 🎉', icon: '✍️', time: '1 min' },
                { num: '6', title: 'Activate!', desc: 'Toggle ON. That\'s it! Your automation works 24/7 now. Check results in Analytics.', icon: '🚀', time: 'Done!' },
              ].map((step, i) => (
                <div key={i} className="flex gap-4 bg-white rounded-2xl p-5 border border-gray-100 shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all">
                  <div className="flex-shrink-0">
                    <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center text-2xl shadow-lg">
                      {step.icon}
                    </div>
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-xs font-black text-purple-600 bg-purple-50 px-2 py-0.5 rounded-full">#{step.num}</span>
                      <span className="text-[10px] text-gray-400 flex items-center gap-1"><Clock size={10} /> {step.time}</span>
                    </div>
                    <h4 className="font-bold text-gray-900 text-sm">{step.title}</h4>
                    <p className="text-xs text-gray-500 mt-1 leading-relaxed">{step.desc}</p>
                  </div>
                </div>
              ))}
            </div>
            <div className="text-center mt-8">
              <button onClick={handleGoogleLogin} className="inline-flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-purple-600 to-pink-500 text-white rounded-2xl font-bold shadow-xl shadow-purple-200 hover:shadow-2xl hover:-translate-y-1 transition-all">
                <Rocket size={20} /> Get Started Now — It's Free!
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section id="features" className="py-24 px-4 bg-gradient-to-br from-gray-50 to-white relative overflow-hidden">
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-pink-50 rounded-full blur-3xl opacity-50"></div>
        <div className="max-w-6xl mx-auto relative z-10">
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-purple-50 border border-purple-200 rounded-full mb-4">
              <Layers size={14} className="text-purple-600" />
              <span className="text-sm font-semibold text-purple-700">All Features</span>
            </div>
            <h2 className="text-3xl md:text-5xl font-black text-gray-900 mt-3 mb-4">All Features In One Place 💪</h2>
            <p className="text-lg text-gray-500 max-w-2xl mx-auto">Powerful automation platform with an easier setup. Complete Instagram automation solution.</p>
          </div>
          <div className="grid md:grid-cols-3 gap-5">
            {features.map((f, i) => {
              const Icon = f.icon;
              return (
                <div key={i} className="group bg-white p-6 rounded-2xl border border-gray-100 hover:border-purple-200 shadow-sm hover:shadow-xl hover:shadow-purple-50 transition-all duration-300 hover:-translate-y-2">
                  <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${f.color} flex items-center justify-center mb-4 shadow-lg group-hover:scale-110 group-hover:rotate-3 transition-all duration-300`}>
                    <Icon size={24} className="text-white" />
                  </div>
                  <h3 className="text-lg font-bold text-gray-900 mb-2">{f.title}</h3>
                  <p className="text-sm text-gray-500 leading-relaxed">{f.desc}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-20 px-4 bg-white">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-5xl font-black text-gray-900">Why 50,000+ Creators Choose IGOne 🏆</h2>
            <p className="text-lg text-gray-500 mt-4">The #1 Instagram Automation Platform</p>
          </div>
          <div className="grid md:grid-cols-3 gap-6">
            {[
              { icon: '⚡', title: 'Setup in 2 Minutes', desc: 'No coding, no complexity. Just click and automate.' },
              { icon: '🎯', title: '10x More Engagement', desc: 'Auto-reply to comments & DMs within seconds.' },
              { icon: '💰', title: 'Save ₹50,000/month', desc: 'Replace your social media manager with AI.' },
              { icon: '📈', title: '300% Growth', desc: 'Our users see 3x follower growth in 30 days.' },
              { icon: '🛡️', title: '100% Safe', desc: 'Official Instagram API. No risk of account ban.' },
              { icon: '🌟', title: '4.9★ Rating', desc: 'Loved by creators, influencers & businesses.' },
            ].map((item, i) => (
              <div key={i} className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-2xl p-6 border border-purple-100 hover:shadow-lg transition-all hover:-translate-y-1">
                <div className="text-4xl mb-4">{item.icon}</div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">{item.title}</h3>
                <p className="text-gray-600">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section id="pricing" className="py-24 px-4 bg-gradient-to-br from-purple-50 via-white to-pink-50 relative overflow-hidden">
        <div className="absolute top-20 right-0 w-96 h-96 bg-purple-100 rounded-full blur-3xl opacity-30"></div>
        <div className="max-w-6xl mx-auto relative z-10">
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-orange-50 border border-orange-200 rounded-full mb-4">
              <Sparkles size={14} className="text-orange-600" />
              <span className="text-sm font-semibold text-orange-700">Affordable Pricing</span>
            </div>
            <h2 className="text-3xl md:text-5xl font-black text-gray-900 mt-3 mb-4">Simple, Transparent Pricing 💰</h2>
            <p className="text-lg text-gray-500">Start free. Upgrade when you need more power. No hidden fees.</p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {(Object.entries(plans).map(([planId, planData]) => ({ id: planId, ...planData as { price: number }, name: planId.charAt(0).toUpperCase() + planId.slice(1), isPopular: planId === 'pro', features: planId === 'free' ? ['DM Auto-Reply', 'Comment Reply', '3 Automations', '50 Contacts'] : planId === 'pro' ? ['Everything in Free', 'Advanced Flows', '10 Automations', '500 Contacts'] : planId === 'master' ? ['Everything in Pro', 'A/B Testing', '50 Automations', '2500 Contacts'] : ['Everything in Master', 'Unlimited All', '24/7 VIP Support'] }))).map((plan) => (
              <div key={plan.id} className={`relative rounded-3xl p-6 transition-all duration-300 hover:-translate-y-2 ${plan.isPopular ? 'border-2 border-purple-500 shadow-2xl shadow-purple-100 scale-[1.02] bg-white' : 'border border-gray-200 bg-white shadow-sm hover:shadow-xl'}`}>
                {plan.isPopular && (
                  <div className="absolute -top-4 left-1/2 -translate-x-1/2 px-5 py-1.5 bg-gradient-to-r from-purple-600 to-pink-500 text-white text-xs font-black rounded-full shadow-lg">
                    🔥 MOST POPULAR
                  </div>
                )}
                <h3 className="text-lg font-bold text-gray-900">{plan.name}</h3>
                <div className="mt-4 mb-6">
                  <span className="text-4xl font-black text-gray-900">₹{plan.price}</span>
                  <span className="text-gray-500 text-sm">/mo</span>
                </div>
                <ul className="space-y-3 mb-8">
                  {plan.features.map((f, i) => (
                    <li key={i} className="flex items-start gap-2 text-sm text-gray-600">
                      <Check size={16} className="text-green-500 mt-0.5 flex-shrink-0" />
                      <span>{f}</span>
                    </li>
                  ))}
                </ul>
                <button
                  onClick={handleGoogleLogin}
                  className={`w-full py-3.5 rounded-xl font-bold text-sm transition-all ${
                    plan.isPopular
                      ? 'bg-gradient-to-r from-purple-600 to-pink-500 text-white shadow-lg shadow-purple-200 hover:shadow-xl hover:-translate-y-0.5'
                      : 'bg-gray-100 text-gray-700 hover:bg-purple-50 hover:text-purple-700'
                  }`}
                >
                  Get Started {plan.price === 0 ? 'Free' : '→'}
                </button>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section id="testimonials" className="py-24 px-4 bg-gradient-to-br from-gray-900 via-purple-900 to-gray-900 relative overflow-hidden">
        <div className="absolute top-20 left-20 w-72 h-72 bg-purple-500 rounded-full blur-3xl opacity-10"></div>
        <div className="absolute bottom-20 right-20 w-96 h-96 bg-pink-500 rounded-full blur-3xl opacity-10"></div>
        <div className="max-w-6xl mx-auto relative z-10">
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/10 border border-white/20 rounded-full mb-4">
              <Star size={14} className="text-yellow-400" />
              <span className="text-sm font-semibold text-purple-300">Real Reviews</span>
            </div>
            <h2 className="text-3xl md:text-5xl font-black text-white mt-3">What Our Users Say 💜</h2>
            <p className="text-lg text-gray-400 mt-4">Trusted by 15,000+ businesses worldwide</p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {testimonials.map((t, i) => (
              <div key={i} className="bg-white/5 backdrop-blur-xl rounded-2xl p-6 border border-white/10 hover:border-purple-400/30 hover:bg-white/10 transition-all duration-300 hover:-translate-y-1">
                <div className="flex gap-1 mb-4">
                  {Array.from({ length: t.stars }).map((_, j) => (
                    <Star key={j} size={14} className="text-yellow-400 fill-yellow-400" />
                  ))}
                </div>
                <p className="text-gray-300 text-sm leading-relaxed mb-5">"{t.text}"</p>
                <div className="flex items-center gap-3 pt-4 border-t border-white/10">
                  <div className="text-2xl">{t.avatar}</div>
                  <div>
                    <p className="text-white font-bold text-sm">{t.name}</p>
                    <p className="text-gray-400 text-xs">{t.role}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-24 px-4 bg-white">
        <div className="max-w-3xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-5xl font-black text-gray-900">Frequently Asked Questions 🙋</h2>
            <p className="text-lg text-gray-500 mt-4">Answers to common questions</p>
          </div>
          <div className="space-y-3">
            {faqs.map((faq, i) => (
              <div key={i} className="bg-white rounded-2xl border border-gray-200 overflow-hidden hover:border-purple-200 transition-colors">
                <button onClick={() => setActiveFaq(activeFaq === i ? null : i)} className="w-full text-left p-5 flex items-center justify-between gap-4">
                  <h4 className="font-bold text-gray-900 text-sm flex-1">{faq.q}</h4>
                  <ChevronDown size={18} className={`text-gray-400 transition-transform flex-shrink-0 ${activeFaq === i ? 'rotate-180' : ''}`} />
                </button>
                {activeFaq === i && (
                  <div className="px-5 pb-5 animate-slide-up">
                    <p className="text-sm text-gray-600 leading-relaxed bg-purple-50 p-4 rounded-xl">{faq.a}</p>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-24 px-4 bg-gradient-to-br from-purple-600 via-pink-500 to-orange-400 relative overflow-hidden">
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGNpcmNsZSBjeD0iMzAiIGN5PSIzMCIgcj0iMS41IiBmaWxsPSJyZ2JhKDI1NSwyNTUsMjU1LDAuMSkiLz48L3N2Zz4=')] opacity-50"></div>
        <div className="max-w-3xl mx-auto text-center relative z-10">
          <div className="text-5xl mb-6 animate-bounce-soft">🚀</div>
          <h2 className="text-3xl md:text-5xl font-black text-white mb-6">Ready to Automate?</h2>
          <p className="text-xl text-white/80 mb-10">Join 15,000+ businesses growing with IGOne. Start for free — today!</p>
          <button
            onClick={handleGoogleLogin}
            className="inline-flex items-center gap-3 px-10 py-5 bg-white text-purple-700 rounded-2xl font-black text-lg shadow-2xl hover:shadow-xl transition-all hover:-translate-y-1 active:translate-y-0 group"
          >
            <svg className="w-5 h-5" viewBox="0 0 24 24"><path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z"/><path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/><path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/><path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/></svg>
            Start Free with Google
            <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
          </button>
          <p className="text-white/60 text-sm mt-4 flex items-center justify-center gap-2">
            <Lock size={12} /> No credit card required · Free forever plan · Cancel anytime
          </p>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 px-4 bg-gray-900 border-t border-gray-800">
        <div className="max-w-6xl mx-auto">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="flex items-center gap-2">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-purple-600 to-pink-500 flex items-center justify-center shadow-lg">
                <Instagram size={16} className="text-white" />
              </div>
              <span className="font-black text-lg text-white">IGOne</span>
            </div>
            <div className="flex flex-wrap items-center justify-center gap-6 text-sm text-gray-400">
              <a href="#features" className="hover:text-white transition-colors">Features</a>
              <a href="#pricing" className="hover:text-white transition-colors">Pricing</a>
              <a href="#testimonials" className="hover:text-white transition-colors">Reviews</a>
              <button onClick={() => onNavigate('privacy')} className="hover:text-white transition-colors">Privacy</button>
              <button onClick={() => onNavigate('terms')} className="hover:text-white transition-colors">Terms</button>
              <button onClick={() => onNavigate('data-deletion')} className="hover:text-white transition-colors">Data Deletion</button>
            </div>
            <p className="text-gray-500 text-xs">© 2024 IGOne. Not affiliated with Instagram or Meta.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
