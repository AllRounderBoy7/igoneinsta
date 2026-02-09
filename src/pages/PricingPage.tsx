import { useState } from 'react';
import { useStore } from '../hooks/useStore';
import { Check, Zap, Star, ArrowRight, X, CreditCard, Phone, Copy, Gift, Clock, CheckCircle, Sparkles, Crown } from 'lucide-react';

export function PricingPage() {
  const { user, submitPayment, applyCoupon } = useStore();
  const [billingCycle, setBillingCycle] = useState<'monthly' | 'yearly'>('monthly');
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState<string | null>(null);
  const [utrNumber, setUtrNumber] = useState('');
  const [paymentMethod, setPaymentMethod] = useState<'upi' | 'phone'>('upi');
  const [couponCode, setCouponCode] = useState('');
  const [couponMessage, setCouponMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  const [paymentSubmitted, setPaymentSubmitted] = useState(false);
  const [copied, setCopied] = useState(false);

  // Payment details
  const paymentUPI = '7321086174@ibl';
  const paymentPhone = '7321086174';

  // Calculate prices
  const getPlanPrice = (planId: string) => {
    const monthlyPrices: Record<string, number> = { free: 0, pro: 99, master: 199, legend: 299 };
    const yearlyPrices: Record<string, number> = { free: 0, pro: 999, master: 1999, legend: 2999 };
    return billingCycle === 'monthly' ? monthlyPrices[planId] || 0 : yearlyPrices[planId] || 0;
  };

  const planFeatures: Record<string, string[]> = {
    free: ['DM Auto-Reply', 'Comment Reply', '3 Automations', '50 Contacts', 'Basic Analytics'],
    pro: ['Everything in Free', 'Flow Builder', '10 Automations', '500 Contacts', 'Advanced Analytics', 'Priority Support'],
    master: ['Everything in Pro', 'A/B Testing', '50 Automations', '2500 Contacts', 'Custom Integrations', 'Dedicated Support'],
    legend: ['Everything in Master', 'Unlimited Everything', 'White Label', '24/7 VIP Support', 'SLA Guarantee', 'Custom Development'],
  };

  const handleSelectPlan = (planId: string) => {
    if (planId === 'free') return;
    setSelectedPlan(planId);
    setShowPaymentModal(true);
    setPaymentSubmitted(false);
    setUtrNumber('');
  };

  const handleCopyUPI = () => {
    navigator.clipboard.writeText(paymentUPI);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleSubmitPayment = async () => {
    if (!utrNumber.trim() || utrNumber.length < 6 || !selectedPlan) return;
    
    try {
      await submitPayment(selectedPlan, billingCycle, getPlanPrice(selectedPlan), utrNumber);
      setPaymentSubmitted(true);
    } catch (err) {
      console.error('Payment error:', err);
    }
  };

  const handleApplyCoupon = async () => {
    if (!couponCode.trim()) return;
    
    try {
      await applyCoupon(couponCode);
      setCouponMessage({
        type: 'success',
        text: 'Coupon applied successfully! Your plan has been upgraded.',
      });
      setCouponCode('');
      setTimeout(() => setCouponMessage(null), 3000);
    } catch (err: any) {
      setCouponMessage({ 
        type: 'error', 
        text: err.message || 'Failed to apply coupon' 
      });
    }
  };

  const planCards = ['free', 'pro', 'master', 'legend'];

  return (
    <div className="space-y-6 pb-8">
      {/* Header */}
      <div className="text-center">
        <h1 className="text-2xl md:text-3xl font-black text-gray-900">Plans & Pricing</h1>
        <p className="text-gray-500 mt-2">Choose the perfect plan for your Instagram growth</p>
        {user && (
          <div className="mt-3 inline-flex items-center gap-2 px-4 py-2 bg-purple-50 border border-purple-200 rounded-xl">
            <Star size={14} className="text-purple-600" />
            <span className="text-sm font-medium text-purple-700">Current Plan: <strong>{user.plan?.toUpperCase() || 'FREE'}</strong></span>
          </div>
        )}
      </div>

      {/* Coupon Section */}
      <div className="max-w-md mx-auto">
        <div className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-2xl p-4 border border-green-200">
          <div className="flex items-center gap-2 mb-3">
            <Gift size={18} className="text-green-600" />
            <span className="font-bold text-green-800">Have a Coupon Code?</span>
          </div>
          <div className="flex gap-2">
            <input
              type="text"
              value={couponCode}
              onChange={e => setCouponCode(e.target.value.toUpperCase())}
              placeholder="Enter coupon code..."
              className="flex-1 px-4 py-2.5 bg-white border border-green-200 rounded-xl text-sm font-mono uppercase focus:outline-none focus:ring-2 focus:ring-green-500"
            />
            <button
              onClick={handleApplyCoupon}
              className="px-5 py-2.5 bg-green-600 text-white rounded-xl font-bold text-sm hover:bg-green-700 transition-colors"
            >
              Apply
            </button>
          </div>
          {couponMessage && (
            <div className={`mt-2 p-2 rounded-lg text-sm font-medium ${couponMessage.type === 'success' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
              {couponMessage.type === 'success' ? '✅' : '❌'} {couponMessage.text}
            </div>
          )}
        </div>
      </div>

      {/* Billing Toggle */}
      <div className="flex items-center justify-center gap-4">
        <span className={`text-sm font-medium ${billingCycle === 'monthly' ? 'text-gray-900' : 'text-gray-400'}`}>Monthly</span>
        <button
          onClick={() => setBillingCycle(billingCycle === 'monthly' ? 'yearly' : 'monthly')}
          className={`relative w-14 h-7 rounded-full transition-colors ${billingCycle === 'yearly' ? 'bg-green-500' : 'bg-gray-300'}`}
        >
          <div className={`absolute top-1 w-5 h-5 rounded-full bg-white shadow transition-transform ${billingCycle === 'yearly' ? 'translate-x-8' : 'translate-x-1'}`} />
        </button>
        <span className={`text-sm font-medium ${billingCycle === 'yearly' ? 'text-gray-900' : 'text-gray-400'}`}>
          Yearly 
          <span className="ml-1 text-xs bg-green-100 text-green-700 px-1.5 py-0.5 rounded-full font-bold">Save 15%</span>
        </span>
      </div>

      {/* Plans Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 max-w-6xl mx-auto px-2">
        {planCards.map(planId => {
          const price = getPlanPrice(planId);
          const features = planFeatures[planId] || [];
          const isCurrent = user?.plan === planId;
          const isPopular = planId === 'pro';
          
          return (
            <div 
              key={planId} 
              className={`relative rounded-2xl p-4 md:p-6 bg-white border-2 transition-all hover:shadow-xl ${
                isCurrent ? 'border-green-400 shadow-lg' : 
                isPopular ? 'border-purple-300 ring-2 ring-purple-100' :
                planId === 'legend' ? 'border-amber-300 ring-2 ring-amber-100' :
                'border-gray-200'
              }`}
            >
              {/* Badge */}
              {isPopular && !isCurrent && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-1 bg-purple-500 text-white text-[10px] font-bold rounded-full">
                  🔥 POPULAR
                </div>
              )}
              {planId === 'legend' && !isCurrent && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-1 bg-gradient-to-r from-amber-500 to-orange-500 text-white text-[10px] font-bold rounded-full">
                  👑 VIP
                </div>
              )}
              {isCurrent && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-1 bg-green-500 text-white text-[10px] font-bold rounded-full">
                  ✓ CURRENT
                </div>
              )}

              {/* Plan Icon */}
              <div className="mb-3">
                {planId === 'legend' && <Crown size={24} className="text-amber-500" />}
                {planId === 'master' && <Sparkles size={24} className="text-blue-500" />}
                {planId === 'pro' && <Zap size={24} className="text-purple-500" />}
              </div>

              <h3 className="text-lg font-black text-gray-900 capitalize">{planId}</h3>
              
              {/* Price */}
              <div className="mt-2 mb-4">
                <div className="flex items-baseline gap-1">
                  <span className="text-3xl md:text-4xl font-black text-gray-900">₹{price}</span>
                  <span className="text-gray-500 text-sm">/{billingCycle === 'yearly' ? 'year' : 'mo'}</span>
                </div>
              </div>

              {/* Features */}
              <ul className="space-y-2 mb-6">
                {features.map((f, i) => (
                  <li key={i} className="flex items-start gap-2 text-xs text-gray-600">
                    <Check size={14} className="text-green-500 mt-0.5 flex-shrink-0" />
                    <span>{f}</span>
                  </li>
                ))}
              </ul>

              {/* Action Button */}
              <button
                onClick={() => handleSelectPlan(planId)}
                disabled={isCurrent || price === 0}
                className={`w-full py-3 rounded-xl font-bold text-sm transition-all flex items-center justify-center gap-2 ${
                  isCurrent
                    ? 'bg-green-50 text-green-700 border border-green-200 cursor-default'
                    : price === 0
                      ? 'bg-gray-100 text-gray-500 cursor-default'
                      : planId === 'legend'
                        ? 'bg-gradient-to-r from-amber-500 to-orange-500 text-white shadow-lg hover:shadow-xl hover:-translate-y-0.5'
                        : 'bg-gradient-to-r from-purple-600 to-pink-500 text-white shadow-lg hover:shadow-xl hover:-translate-y-0.5'
                }`}
              >
                {isCurrent ? (
                  <>
                    <CheckCircle size={16} /> Current Plan
                  </>
                ) : price === 0 ? (
                  'Free Forever'
                ) : (
                  <>
                    Upgrade Now <ArrowRight size={14} />
                  </>
                )}
              </button>
            </div>
          );
        })}
      </div>

      {/* Payment Modal */}
      {showPaymentModal && selectedPlan && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl w-full max-w-md shadow-2xl overflow-hidden">
            {/* Header */}
            <div className="bg-gradient-to-r from-purple-600 to-pink-500 p-5 text-white relative">
              <button onClick={() => setShowPaymentModal(false)} className="absolute top-4 right-4 p-1 hover:bg-white/20 rounded-lg">
                <X size={18} />
              </button>
              <h3 className="text-lg font-bold">Complete Payment</h3>
              <p className="text-white/80 text-sm mt-1">
                {selectedPlan.charAt(0).toUpperCase() + selectedPlan.slice(1)} Plan - ₹{getPlanPrice(selectedPlan)}
              </p>
            </div>

            {paymentSubmitted ? (
              <div className="p-6 text-center">
                <div className="w-16 h-16 rounded-full bg-green-100 flex items-center justify-center mx-auto mb-4">
                  <CheckCircle size={32} className="text-green-600" />
                </div>
                <h4 className="text-lg font-bold text-gray-900 mb-2">Payment Submitted! 🎉</h4>
                <p className="text-sm text-gray-500 mb-4">
                  Your payment is under verification. Admin will approve it within <strong>1 minute</strong>.
                </p>
                <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-3 mb-4">
                  <div className="flex items-center gap-2 text-yellow-700">
                    <Clock size={16} />
                    <span className="text-sm font-medium">Payment is being verified</span>
                  </div>
                </div>
                <button onClick={() => setShowPaymentModal(false)} className="w-full py-3 bg-gray-100 text-gray-700 rounded-xl font-bold text-sm">
                  Close
                </button>
              </div>
            ) : (
              <div className="p-6 space-y-5">
                {/* Payment Method */}
                <div>
                  <label className="text-sm font-bold text-gray-700 mb-2 block">Payment Method</label>
                  <div className="grid grid-cols-2 gap-3">
                    <button
                      onClick={() => setPaymentMethod('upi')}
                      className={`p-3 rounded-xl border-2 flex items-center gap-2 transition-all ${paymentMethod === 'upi' ? 'border-purple-500 bg-purple-50' : 'border-gray-200'}`}
                    >
                      <CreditCard size={18} className={paymentMethod === 'upi' ? 'text-purple-600' : 'text-gray-400'} />
                      <span className={`text-sm font-medium ${paymentMethod === 'upi' ? 'text-purple-700' : 'text-gray-600'}`}>UPI</span>
                    </button>
                    <button
                      onClick={() => setPaymentMethod('phone')}
                      className={`p-3 rounded-xl border-2 flex items-center gap-2 transition-all ${paymentMethod === 'phone' ? 'border-purple-500 bg-purple-50' : 'border-gray-200'}`}
                    >
                      <Phone size={18} className={paymentMethod === 'phone' ? 'text-purple-600' : 'text-gray-400'} />
                      <span className={`text-sm font-medium ${paymentMethod === 'phone' ? 'text-purple-700' : 'text-gray-600'}`}>Phone Pay</span>
                    </button>
                  </div>
                </div>

                {/* Payment Details */}
                <div className="bg-gray-50 rounded-xl p-4">
                  <p className="text-sm text-gray-600 mb-2">Send payment to:</p>
                  {paymentMethod === 'upi' ? (
                    <div className="flex items-center justify-between bg-white rounded-lg p-3 border border-gray-200">
                      <div>
                        <p className="text-xs text-gray-500">UPI ID</p>
                        <p className="font-mono font-bold text-gray-900">{paymentUPI}</p>
                      </div>
                      <button onClick={handleCopyUPI} className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
                        {copied ? <CheckCircle size={18} className="text-green-500" /> : <Copy size={18} className="text-gray-400" />}
                      </button>
                    </div>
                  ) : (
                    <div className="bg-white rounded-lg p-3 border border-gray-200">
                      <p className="text-xs text-gray-500">Phone Number</p>
                      <p className="font-mono font-bold text-gray-900 text-lg">{paymentPhone}</p>
                    </div>
                  )}
                  <div className="mt-3 flex items-center justify-between">
                    <span className="text-sm text-gray-600">Amount:</span>
                    <span className="text-xl font-black text-gray-900">₹{getPlanPrice(selectedPlan)}</span>
                  </div>
                </div>

                {/* UTR Input */}
                <div>
                  <label className="text-sm font-bold text-gray-700 mb-2 block">Enter UTR / Transaction ID</label>
                  <input
                    type="text"
                    value={utrNumber}
                    onChange={e => setUtrNumber(e.target.value)}
                    placeholder="Enter 12-digit UTR number..."
                    className="w-full px-4 py-3 bg-gray-50 border-2 border-gray-200 rounded-xl text-sm font-mono focus:outline-none focus:border-purple-500"
                  />
                  <p className="text-xs text-gray-400 mt-1">Find UTR in your payment app transaction details</p>
                </div>

                {/* Submit */}
                <button
                  onClick={handleSubmitPayment}
                  disabled={!utrNumber.trim() || utrNumber.length < 6}
                  className="w-full py-3.5 bg-gradient-to-r from-purple-600 to-pink-500 text-white rounded-xl font-bold text-sm disabled:opacity-50"
                >
                  Submit Payment
                </button>

                <p className="text-[10px] text-center text-gray-400">
                  Payment verified within 1 minute. Fake UTR = Account banned.
                </p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* FAQ */}
      <div className="max-w-3xl mx-auto px-4">
        <h3 className="text-xl font-bold text-gray-900 text-center mb-6">Frequently Asked Questions</h3>
        <div className="space-y-3">
          {[
            { q: 'How do I pay?', a: 'Send payment to the UPI ID or Phone number shown, enter the UTR number, and your plan will be upgraded within 1 minute.' },
            { q: 'How to use coupon?', a: 'Enter the coupon code in the box above and click Apply. If valid, your plan will be upgraded instantly.' },
            { q: 'Is there a refund policy?', a: 'Yes! We offer a 7-day money-back guarantee on all paid plans.' },
            { q: 'Can I change my plan?', a: 'Yes! You can upgrade or downgrade your plan anytime.' },
          ].map((faq, i) => (
            <div key={i} className="bg-white rounded-xl p-4 border border-gray-100">
              <h4 className="font-bold text-gray-900 text-sm">{faq.q}</h4>
              <p className="text-sm text-gray-500 mt-1">{faq.a}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
