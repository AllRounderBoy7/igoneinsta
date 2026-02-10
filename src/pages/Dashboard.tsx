"use client";

import React, { useState, useEffect } from 'react';
import { CheckCircle, Instagram, Settings, AlertCircle, Loader2 } from 'lucide-react';

const Dashboard = () => {
  const [isConnected, setIsConnected] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [userAccount, setUserAccount] = useState({ name: "", handle: "" });

  // 1. Facebook SDK Initialize (Bug Fix: Pehle SDK load hona zaroori hai)
  useEffect(() => {
    // @ts-ignore
    window.fbAsyncInit = function() {
      // @ts-ignore
      window.FB.init({
        appId      : '2436954916718675', // Teri Asli Business App ID
        cookie     : true,
        xfbml      : true,
        version    : 'v21.0'
      });
    };
  }, []);

  const handleConnect = () => {
    setIsLoading(true);
    // @ts-ignore
    window.FB.login((response) => {
      if (response.authResponse) {
        // Success: Yahan hum status change kar denge
        setIsConnected(true);
        setUserAccount({ name: "Instagram Business", handle: "@connected" });
        console.log("Connected Successfully!");
      } else {
        alert("Connection Cancelled!");
      }
      setIsLoading(false);
    }, { scope: 'instagram_business_manage_messages,pages_show_list' });
  };

  return (
    <div className="min-h-screen bg-slate-50 p-6 font-sans">
      <div className="max-w-4xl mx-auto">
        
        {/* Header Section */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-2xl font-bold text-slate-900">IG-One Dashboard</h1>
            <p className="text-slate-500 text-sm">Manage your Instagram Automations</p>
          </div>
          <div className={`px-4 py-1 rounded-full text-xs font-bold flex items-center gap-2 ${isConnected ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
            <span className={`w-2 h-2 rounded-full ${isConnected ? 'bg-green-500 animate-pulse' : 'bg-red-500'}`}></span>
            {isConnected ? 'SYSTEM ACTIVE' : 'SYSTEM OFFLINE'}
          </div>
        </div>

        {/* Main Card */}
        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
          <div className="p-8">
            <div className="flex items-start justify-between">
              <div className="flex gap-4">
                <div className="w-14 h-14 bg-gradient-to-tr from-purple-500 to-pink-500 rounded-2xl flex items-center justify-center text-white shadow-lg">
                  <Instagram size={32} />
                </div>
                <div>
                  <h2 className="text-xl font-semibold text-slate-800">Instagram Connection</h2>
                  <p className="text-slate-500 text-sm mt-1">Connect your business account to start auto-replies.</p>
                </div>
              </div>
            </div>

            <div className="mt-8 p-6 bg-slate-50 rounded-xl border border-dashed border-slate-300">
              {isConnected ? (
                /* CONNECTED VIEW */
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="bg-green-500 p-2 rounded-full text-white">
                      <CheckCircle size={20} />
                    </div>
                    <div>
                      <p className="font-bold text-slate-800">Account Linked Successfully</p>
                      <p className="text-xs text-slate-500">Your bot is now listening to messages.</p>
                    </div>
                  </div>
                  <button className="text-slate-400 hover:text-red-500 transition-colors">
                    <Settings size={20} />
                  </button>
                </div>
              ) : (
                /* DISCONNECTED VIEW */
                <div className="text-center">
                  <p className="text-slate-600 mb-4 text-sm font-medium">No Instagram account linked to this dashboard.</p>
                  <button 
                    onClick={handleConnect}
                    disabled={isLoading}
                    className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-xl font-bold transition-all shadow-md active:scale-95 flex items-center gap-2 mx-auto disabled:opacity-50"
                  >
                    {isLoading ? <Loader2 className="animate-spin" /> : <Instagram size={18} />}
                    {isLoading ? 'Connecting...' : 'Connect Instagram'}
                  </button>
                </div>
              )}
            </div>
          </div>
          
          {/* Footer Info */}
          <div className="bg-slate-50 border-t border-slate-200 px-8 py-4 flex items-center gap-2">
            <AlertCircle size={14} className="text-slate-400" />
            <p className="text-[11px] text-slate-400 uppercase tracking-widest font-bold">
              Secure Meta API Connection • V21.0 Enabled
            </p>
          </div>
        </div>

      </div>
    </div>
  );
};

export default Dashboard;
