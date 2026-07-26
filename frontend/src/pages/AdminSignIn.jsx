// frontend/src/pages/AdminSignIn.jsx
import React, { useState, useEffect } from 'react';
import { Mail, Lock } from 'lucide-react';
import { Logo } from '../components/Logo';
import { api } from '../services/api';

// ============================================================================
// DEDICATED ADMIN SIGN-IN PORTAL
// ============================================================================
export function AdminSignIn({ setIsAdminLoggedIn, navigateTo }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);
  const [backendStatus, setBackendStatus] = useState('checking');

  useEffect(() => {
    // Check backend connection status
    api.getNgos()
      .then(res => {
        if (res.ok) setBackendStatus('online');
        else setBackendStatus('error');
      })
      .catch(() => setBackendStatus('offline'));
  }, []);

  const handleSubmit = async (e) => {
    if (e) e.preventDefault();
    setError('');
    setSuccess(false);
    setLoading(true);

    try {
      const res = await api.login(email, password);

      if (res.ok) {
        const user = await res.json();
        if (user.role === 'Admin') {
          setSuccess(true);
          setTimeout(() => {
            setIsAdminLoggedIn(true);
          }, 1000);
        } else {
          setError('Access denied. This portal is restricted to system administrators.');
        }
      } else {
        const data = await res.json();
        setError(data.error || 'Authentication failed. Please verify your credentials.');
      }
    } catch (err) {
      console.error('Admin Sign In Error:', err);
      setError('Server connection error. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  const handleDemoSignIn = async () => {
    setEmail('admin@gmail.com');
    setPassword('admin123');
    setError('');
    setSuccess(false);
    setLoading(true);

    try {
      const res = await api.login('admin@gmail.com', 'admin123');

      if (res.ok) {
        const user = await res.json();
        if (user.role === 'Admin') {
          setSuccess(true);
          setTimeout(() => {
            setIsAdminLoggedIn(true);
          }, 1000);
        } else {
          setError('Access denied. Admin role not found.');
        }
      } else {
        const data = await res.json();
        setError(data.error || 'Authentication failed.');
      }
    } catch (err) {
      console.error('Demo Sign In Error:', err);
      setError('Server connection error.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center relative bg-gradient-to-br from-[#0F340F] via-[#1A3828] to-[#081F08] p-4 font-sans text-[#0F340F] overflow-hidden">
      
      {/* Decorative leaf backgrounds */}
      <div className="absolute top-0 left-0 w-96 h-96 bg-[#7EB138]/10 rounded-full filter blur-3xl pointer-events-none z-0" />
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-[#7EB138]/15 rounded-full filter blur-3xl pointer-events-none z-0" />
      
      {/* Back to Home Button */}
      <button 
        onClick={() => navigateTo('/')}
        className="absolute top-6 left-6 text-white/80 hover:text-white bg-white/10 hover:bg-white/20 px-4 py-2 rounded-full transition-all flex items-center gap-2 cursor-pointer shadow-sm text-xs font-bold border border-white/10"
      >
        <span className="text-sm">←</span> Back to Home
      </button>

      <div className="w-full max-w-md bg-white/95 backdrop-blur-md rounded-3xl shadow-[0_24px_50px_rgba(0,0,0,0.4)] border border-[#0F340F]/10 p-8 md:p-10 relative overflow-hidden z-10 animate-fade-in">
        
        {/* Subtle decorative leaf vectors inside card */}
        <div className="absolute -top-12 -right-12 text-[#7EB138]/10 pointer-events-none select-none">
          <svg width="120" height="120" fill="currentColor" viewBox="0 0 100 100">
            <path d="M10,90 C30,70 60,60 90,10 C80,40 70,70 10,90 Z" />
          </svg>
        </div>

        {/* Central Logo */}
        <div className="flex flex-col items-center justify-center mb-6">
          <div className="w-16 h-16 bg-[#0F340F]/5 rounded-2xl flex items-center justify-center text-[#7EB138] mb-3">
            <Logo showText={false} />
          </div>
          <h2 className="text-2xl md:text-3xl font-extrabold text-[#0F340F] text-center font-serif tracking-tight">
            Admin Portal
          </h2>
          <p className="text-xs text-[#556B5D] font-bold text-center mt-1 uppercase tracking-widest">
            Pick&Give System Console
          </p>
          
          {/* Connection Status Pill */}
          <div className="mt-3.5 flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#0F340F]/5 border border-[#0F340F]/10">
            <span className={`w-2 h-2 rounded-full ${
              backendStatus === 'online' ? 'bg-emerald-500 animate-pulse' :
              backendStatus === 'offline' ? 'bg-rose-500' : 'bg-amber-500 animate-ping'
            }`} />
            <span className="text-[10px] font-bold uppercase tracking-wider text-[#556B5D]">
              API Connection: {backendStatus === 'online' ? 'Online' : backendStatus === 'offline' ? 'Offline' : 'Checking...'}
            </span>
          </div>
        </div>

        {success ? (
          <div className="text-center py-10 flex flex-col items-center gap-4 animate-pulse">
            <div className="w-16 h-16 rounded-full bg-emerald-50 text-emerald-600 border border-emerald-200 flex items-center justify-center text-2xl">
              ✓
            </div>
            <h3 className="text-xl font-bold font-serif text-[#0F340F]">Access Granted</h3>
            <p className="text-xs text-[#556B5D] font-semibold">Authorizing administrator session...</p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-5 text-left relative z-10">
            {error && (
              <div className="bg-rose-50 border border-rose-200 text-rose-700 p-3.5 rounded-2xl text-xs font-semibold leading-relaxed animate-fade-in">
                ⚠️ {error}
              </div>
            )}

            <div className="space-y-4">
              <div>
                <label className="text-xs font-bold text-[#0F340F] mb-1.5 block uppercase tracking-wider">
                  Admin Email Address
                </label>
                <div className="relative flex items-center">
                  <span className="absolute left-3.5 text-[#556B5D]">
                    <Mail className="w-4 h-4" />
                  </span>
                  <input 
                    type="email" 
                    required 
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full pl-10 pr-4 py-3 border border-[#0F340F]/10 rounded-2xl bg-[#F8FAF5] font-sans text-sm text-[#0F340F] transition-all focus:outline-none focus:border-[#0F340F] focus:bg-white focus:ring-4 focus:ring-[#7EB138]/10"
                    placeholder="name@pickandgive.org"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-bold text-[#0F340F] mb-1.5 block uppercase tracking-wider">
                  Security Password
                </label>
                <div className="relative flex items-center">
                  <span className="absolute left-3.5 text-[#556B5D]">
                    <Lock className="w-4 h-4" />
                  </span>
                  <input 
                    type="password" 
                    required 
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full pl-10 pr-4 py-3 border border-[#0F340F]/10 rounded-2xl bg-[#F8FAF5] font-sans text-sm text-[#0F340F] transition-all focus:outline-none focus:border-[#0F340F] focus:bg-white focus:ring-4 focus:ring-[#7EB138]/10"
                    placeholder="••••••••"
                  />
                </div>
              </div>
            </div>

            <div className="pt-2 flex flex-col gap-3">
              <button 
                type="submit"
                disabled={loading || backendStatus === 'offline'}
                className="w-full py-3.5 bg-[#0F340F] hover:bg-[#1C4A1C] disabled:bg-[#0F340F]/40 text-white font-bold text-sm rounded-2xl shadow-md hover:shadow-lg transition-all cursor-pointer uppercase tracking-wider"
              >
                {loading ? 'Authenticating...' : 'Sign In as Admin'}
              </button>

              <button 
                type="button"
                onClick={handleDemoSignIn}
                className="w-full py-3 bg-amber-50 hover:bg-amber-100 border border-amber-200 text-amber-900 font-bold text-xs rounded-2xl transition-all cursor-pointer flex items-center justify-center gap-1.5"
              >
                ⚡ Quick Demo Login (admin@gmail.com / admin123)
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
