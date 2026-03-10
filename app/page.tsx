'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Mountain, User, Lock, ArrowRight, Sparkles, Pencil, AlertCircle } from 'lucide-react';

interface DiaryEntry {
  date: string;
  resistanceLevel: number;
  notes: string;
}

export default function Home() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userId, setUserId] = useState('');
  const [password, setPassword] = useState('');
  const [isLogin, setIsLogin] = useState(true);
  const [msg, setMsg] = useState('');
  
  // Stats state
  const [checkins, setCheckins] = useState<string[]>([]);
  const [slips, setSlips] = useState<string[]>([]);
  const [diaryEntries, setDiaryEntries] = useState<DiaryEntry[]>([]);
  const [streak, setStreak] = useState(0);

  useEffect(() => {
    const savedId = localStorage.getItem('recovery_user_id');
    const savedPass = localStorage.getItem('recovery_password');
    if (savedId && savedPass) {
      handleAuth(savedId, savedPass, true);
    }
  }, []);

  async function handleAuth(id: string, pass: string, auto: boolean = false) {
    if (!id || !pass) return;
    const res = await fetch('/api/code', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ userId: id, password: pass, isLogin: isLogin || auto })
    });
    const data = await res.json();
    if (data.error) {
      if (!auto) setMsg(data.error);
      if (auto) logout();
    } else {
      setUserId(data.userId);
      setPassword(pass);
      setIsLoggedIn(true);
      localStorage.setItem('recovery_user_id', data.userId);
      localStorage.setItem('recovery_password', pass);
      loadStats(data.userId);
    }
  }

  async function loadStats(id: string) {
    const res = await fetch(`/api/checkin?code=${id}`);
    const data = await res.json();
    setCheckins(data.checkins || []);
    setSlips(data.slips || []);
    setDiaryEntries(data.diaryEntries || []);
    setStreak(data.streak || 0);
  }

  function logout() {
    localStorage.clear();
    setIsLoggedIn(false);
    setUserId('');
    setPassword('');
  }

  if (!isLoggedIn) {
    return (
      <main className="min-h-screen bg-[#F8F9FA] flex items-center justify-center p-4">
        <div className="max-w-md w-full space-y-8 animate-in fade-in zoom-in-95 duration-700">
          <div className="text-center space-y-4">
            <div className="w-20 h-20 bg-saffron rounded-[28px] mx-auto flex items-center justify-center shadow-2xl shadow-saffron/20 transform rotate-3 hover:rotate-0 transition-transform duration-500 text-white">
              <Mountain size={40} />
            </div>
            <div className="space-y-1">
              <h1 className="text-4xl font-black text-slate-900 tracking-tight">
                The Sacred <span className="text-saffron">Yatra</span>
              </h1>
              <p className="text-slate-400 font-medium">Your Spiritual Journey to Self-Mastery.</p>
            </div>
          </div>

          <div className="bg-white rounded-[32px] shadow-sm border border-slate-100 p-8 md:p-10 space-y-6">
            <div className="space-y-4">
              <div className="relative group">
                <span className="absolute left-5 top-5 text-slate-300 group-focus-within:text-saffron transition-colors">
                  <User size={20} />
                </span>
                <input
                  placeholder="Anonymous Pilgrim ID"
                  className="w-full bg-slate-50 border border-slate-100 p-5 pl-12 rounded-2xl font-bold text-slate-900 outline-none focus:border-saffron/40 focus:bg-white transition-all"
                  onChange={(e) => setUserId(e.target.value.toLowerCase())}
                />
              </div>
              <div className="relative group">
                <span className="absolute left-5 top-5 text-slate-300 group-focus-within:text-saffron transition-colors">
                  <Lock size={20} />
                </span>
                <input
                  type="password"
                  placeholder="Secret Key"
                  className="w-full bg-slate-50 border border-slate-100 p-5 pl-12 rounded-2xl font-bold text-slate-900 outline-none focus:border-saffron/40 focus:bg-white transition-all"
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>
              
              <button 
                onClick={() => handleAuth(userId, password)} 
                className="w-full bg-saffron hover:bg-[#e68a2e] text-white py-5 rounded-2xl font-bold text-lg shadow-lg shadow-saffron/10 transition-all active:scale-[0.98]"
              >
                {isLogin ? 'Begin Your Ascent' : 'Start My Pilgrimage'}
              </button>
              
              <button 
                onClick={() => setIsLogin(!isLogin)} 
                className="w-full text-slate-400 font-bold text-xs hover:text-slate-600 transition-colors uppercase tracking-widest"
              >
                {isLogin ? "New Pilgrim? Join the Yatra" : "Already a Pilgrim? Login"}
              </button>
            </div>

            <div className="bg-gold/5 border border-gold/10 p-4 rounded-xl">
              <p className="text-[10px] font-bold text-gold-deep leading-relaxed text-center uppercase tracking-wider">
                ⚠️ Sacred Vow: Your identity remains hidden. We cannot recover lost keys.
              </p>
            </div>
          </div>

          {msg && (
            <div className="text-center text-xs font-bold text-rose-500 bg-rose-50 p-4 rounded-xl animate-in fade-in slide-in-from-top-2">
              {msg}
            </div>
          )}
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[#F8F9FA] p-4 py-8 md:py-12">
      <div className="max-w-4xl mx-auto space-y-8">
        
        {/* HEADER */}
        <div className="flex justify-between items-center bg-white p-6 rounded-[24px] shadow-sm border border-slate-100">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-saffron rounded-2xl flex items-center justify-center text-white text-xl font-black shadow-lg shadow-saffron/20">
              {userId.charAt(0).toUpperCase()}
            </div>
            <div>
              <h2 className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em]">Pilgrim</h2>
              <p className="text-lg font-black text-slate-900">@{userId}</p>
            </div>
          </div>
          <button 
            onClick={logout} 
            className="group flex items-center gap-2 px-4 py-2 rounded-xl hover:bg-rose-50 transition-all"
          >
            <span className="text-xs font-bold text-slate-400 group-hover:text-rose-500 uppercase tracking-widest transition-colors">Depart</span>
            <ArrowRight size={16} className="text-slate-300 group-hover:text-rose-400 transition-colors" />
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 md:gap-8">
          
          {/* ACTION SECTION */}
          <div className="space-y-6">
            <div className="bg-white rounded-[32px] shadow-sm border border-slate-100 p-8 space-y-6">
              <div className="flex items-center justify-between">
                <h3 className="text-xl font-black text-slate-900">Daily Sadhana</h3>
                <span className="text-xs font-bold text-saffron bg-saffron/5 px-3 py-1 rounded-full uppercase tracking-wider">Active Path</span>
              </div>
              
              <div className="grid gap-4">
                <Link href="/checkin">
                  <button className="w-full bg-saffron hover:bg-[#e68a2e] transition-all text-white px-8 py-5 rounded-[20px] font-bold text-lg shadow-lg shadow-saffron/10 active:scale-[0.98] flex items-center justify-between group">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center">
                        <Sparkles size={24} />
                      </div>
                      <span>Spiritual Check-in</span>
                    </div>
                    <ArrowRight className="opacity-0 group-hover:opacity-100 transition-all translate-x-[-10px] group-hover:translate-x-0" />
                  </button>
                </Link>

                <div className="grid grid-cols-2 gap-4">
                  <Link href="/test">
                    <button className="w-full bg-slate-50 border border-slate-200 text-slate-700 hover:border-saffron/20 hover:bg-white transition-all p-5 rounded-[20px] font-bold text-sm active:scale-[0.98] flex flex-col items-center gap-2">
                      <Pencil size={24} className="text-saffron" />
                      <span>Introspection</span>
                    </button>
                  </Link>

                  <Link href="/panic">
                    <button className="w-full bg-orange-50 border border-orange-100 text-orange-600 hover:bg-orange-100 transition-all p-5 rounded-[20px] font-bold text-sm active:scale-[0.98] flex flex-col items-center gap-2">
                      <AlertCircle size={24} />
                      <span>Ground Your Soul</span>
                    </button>
                  </Link>
                </div>
              </div>
            </div>

            {/* EDUCATIONAL TIP */}
            <div className="bg-slate-900 text-white rounded-[32px] p-8 space-y-4 relative overflow-hidden group">
              <div className="absolute top-0 right-0 w-32 h-32 bg-saffron/10 rounded-full blur-3xl -mr-16 -mt-16 group-hover:bg-saffron/20 transition-colors"></div>
              <div className="relative z-10">
                <div className="flex items-center gap-2 mb-2">
                  <span className="w-2 h-2 bg-saffron rounded-full animate-pulse"></span>
                  <h4 className="text-xs font-bold uppercase tracking-widest text-slate-400">The Path of Patience</h4>
                </div>
                <p className="text-slate-300 text-sm leading-relaxed">
                  Cravings are temporary storms on your spiritual ascent. Stay centered for 15 minutes, and the sky will clear. You are the master of your journey.
                </p>
              </div>
            </div>
          </div>

          {/* REPORT SECTION */}
          <div className="space-y-6">
            <div className="bg-white rounded-[32px] shadow-sm border border-slate-100 p-8 space-y-6">
              <h3 className="text-xl font-black text-slate-900">Your Pilgrimage</h3>
              
              <div className="grid grid-cols-3 gap-3">
                <div className="bg-purple-50 p-4 rounded-xl border border-purple-100 text-center">
                  <p className="text-[10px] font-bold text-purple-600 uppercase tracking-widest mb-1">Sankalpa Resolution</p>
                  <p className="text-2xl font-black text-slate-900">{checkins.length}</p>
                </div>
                <div className="bg-amber-50 p-4 rounded-xl border border-amber-100 text-center">
                  <p className="text-[10px] font-bold text-amber-600 uppercase tracking-widest mb-1">Abhyasa Practice</p>
                  <p className="text-2xl font-black text-slate-900">{streak}</p>
                </div>
                <div className="bg-indigo-50 p-4 rounded-xl border border-indigo-100 text-center">
                  <p className="text-[10px] font-bold text-indigo-600 uppercase tracking-widest mb-1">Dhyana Meditation</p>
                  <p className="text-2xl font-black text-slate-900">
                    {diaryEntries.length > 0 
                      ? (diaryEntries.reduce((sum, e) => sum + (e.resistanceLevel || 0), 0) / diaryEntries.length).toFixed(0) 
                      : '0'}
                  </p>
                </div>
              </div>

              <div className="space-y-3 pt-4 border-t border-slate-50">
                <div className="flex justify-between items-center">
                  <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">Progress Calendar</p>
                  <p className="text-xs font-bold text-saffron">+{slips.length === 0 ? '🔥' : ''}</p>
                </div>
                <div className="bg-slate-50 p-4 rounded-2xl">
                  <div className="grid grid-cols-7 gap-2">
                    {['S', 'M', 'T', 'W', 'T', 'F', 'S'].map((day, idx) => (
                      <div key={idx} className="text-center text-[10px] font-bold text-slate-400 mb-2">{day}</div>
                    ))}
                    {Array.from({ length: 35 }).map((_, i) => {
                      const date = new Date();
                      date.setDate(date.getDate() - (34 - i));
                      const dateStr = date.toISOString().split('T')[0];
                      const isActive = checkins.includes(dateStr);
                      return (
                        <div 
                          key={i}
                          className={`aspect-square rounded-lg flex items-center justify-center text-sm font-bold transition-all ${
                            isActive 
                              ? 'bg-saffron text-white shadow-lg shadow-saffron/20' 
                              : 'bg-slate-100 text-slate-300 hover:bg-slate-200'
                          }`}
                        >
                          {isActive ? '🕯️' : ''}
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>

              {diaryEntries.length > 0 && (
                <div className="space-y-4 pt-4 border-t border-slate-50">
                  <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">Pilgrim's Reflections</p>
                  <div className="space-y-3">
                    {[...diaryEntries].reverse().slice(0, 2).map((entry, idx) => (
                      <div key={idx} className="bg-slate-50 p-4 rounded-xl border border-slate-100 space-y-1">
                        <div className="flex justify-between items-center mb-1">
                          <p className="text-[10px] font-bold text-slate-400">{new Date(entry.date).toLocaleDateString()}</p>
                          <span className="text-[10px] font-bold text-saffron px-2 py-0.5 bg-saffron/5 rounded-full">Resistance: {entry.resistanceLevel}/10</span>
                        </div>
                        {entry.notes && <p className="text-sm text-slate-600 line-clamp-2 leading-relaxed italic">"{entry.notes}"</p>}
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>

        </div>

        {/* FOOTER */}
        <div className="text-center opacity-20 text-[10px] font-bold uppercase tracking-[0.4em] py-12">
          The Sacred Yatra • Secure & Anonymous
        </div>

      </div>
    </main>
  );
}
