'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';

interface DiaryEntry {
  date: string;
  urgeLevel: number;
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
      <main className="min-h-screen bg-[radial-gradient(ellipse_at_top_left,_var(--tw-gradient-stops))] from-blue-100 via-emerald-50 to-white flex items-center justify-center p-4">
        <div className="max-w-md w-full bg-white/70 backdrop-blur-2xl rounded-[40px] shadow-2xl border border-white/40 p-10 space-y-8">
          <div className="text-center space-y-2">
            <h1 className="text-4xl font-black text-slate-900 tracking-tighter">
              Recovery <span className="text-blue-600">Path</span>
            </h1>
            <p className="text-slate-500 font-medium">Your private journey starts here.</p>
          </div>

          <div className="bg-amber-50 border border-amber-200 p-4 rounded-2xl">
            <p className="text-xs font-bold text-amber-800 leading-relaxed">
              ⚠️ IMPORTANT: We value your privacy. Your data is stored anonymously. 
              <span className="block mt-1">PLEASE REMEMBER YOUR ID AND PASSWORD. We cannot recover them if lost.</span>
            </p>
          </div>

          <div className="space-y-4">
            <input
              placeholder="Anonymous User ID"
              className="w-full bg-white border-2 border-slate-100 p-5 rounded-3xl font-bold text-slate-900 outline-none focus:border-blue-400 transition-all"
              onChange={(e) => setUserId(e.target.value.toLowerCase())}
            />
            <input
              type="password"
              placeholder="Secret Password"
              className="w-full bg-white border-2 border-slate-100 p-5 rounded-3xl font-bold text-slate-900 outline-none focus:border-blue-400 transition-all"
              onChange={(e) => setPassword(e.target.value)}
            />
            <button 
              onClick={() => handleAuth(userId, password)} 
              className="w-full bg-slate-900 hover:bg-blue-600 text-white py-5 rounded-3xl font-black text-xl shadow-xl transition-all active:scale-95"
            >
              {isLogin ? 'Login' : 'Start My Journey'}
            </button>
            <button 
              onClick={() => setIsLogin(!isLogin)} 
              className="w-full text-slate-400 font-bold text-sm hover:text-slate-600 transition-colors"
            >
              {isLogin ? "Don't have an ID? Create one" : "Already have an ID? Login"}
            </button>
          </div>

          {msg && (
            <div className="text-center text-sm font-bold text-rose-600 bg-rose-50 p-4 rounded-2xl animate-in fade-in slide-in-from-top-2">
              {msg}
            </div>
          )}
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[radial-gradient(ellipse_at_top_left,_var(--tw-gradient-stops))] from-blue-100 via-emerald-50 to-white p-4 py-12">
      <div className="max-w-4xl mx-auto space-y-8">
        
        {/* HEADER */}
        <div className="flex justify-between items-center bg-white/40 backdrop-blur-md p-6 rounded-[32px] border border-white/40 shadow-sm">
          <div>
            <h2 className="text-sm font-bold text-slate-400 uppercase tracking-widest">Welcome Back</h2>
            <p className="text-2xl font-black text-slate-900">@{userId}</p>
          </div>
          <button onClick={logout} className="text-xs font-bold text-slate-400 hover:text-rose-500 uppercase tracking-widest transition-colors">Logout</button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          
          {/* ACTION SECTION */}
          <div className="space-y-6">
            <div className="bg-white/60 backdrop-blur-2xl rounded-[40px] shadow-xl border border-white/40 p-8 space-y-6">
              <h3 className="text-xl font-black text-slate-900">Quick Actions</h3>
              
              <div className="grid gap-4">
                <Link href="/checkin">
                  <button className="w-full bg-slate-900 hover:bg-blue-600 transition-all text-white px-8 py-6 rounded-[32px] font-bold text-xl shadow-2xl active:scale-95 flex items-center justify-between">
                    <span>Daily Check-in</span>
                    <span className="text-2xl">⚡</span>
                  </button>
                </Link>

                <Link href="/test">
                  <button className="w-full bg-white border-2 border-slate-200 text-slate-700 hover:border-blue-400 transition-all px-8 py-5 rounded-[28px] font-bold text-lg active:scale-95 flex items-center justify-between">
                    <span>Dependency Test</span>
                    <span className="text-2xl">📝</span>
                  </button>
                </Link>

                <Link href="/panic">
                  <button className="w-full bg-rose-50 border-2 border-rose-100 text-rose-600 py-4 rounded-[28px] font-black text-lg hover:bg-rose-100 transition-all flex items-center justify-center gap-3 active:scale-95">
                    🚨 EMERGENCY CALM DOWN
                  </button>
                </Link>
              </div>
            </div>

            {/* EDUCATIONAL TIP */}
            <div className="bg-emerald-900 text-emerald-50 rounded-[40px] p-8 space-y-4">
              <h4 className="text-lg font-bold">Pro Tip: The 15-Minute Rule</h4>
              <p className="opacity-80 text-sm leading-relaxed">
                Most intense cravings last less than 15 minutes. If you can distract yourself for just a quarter of an hour, the urge will significantly subside. You've got this.
              </p>
            </div>
          </div>

          {/* REPORT SECTION (Moved to Homepage) */}
          <div className="space-y-6">
            <div className="bg-white/60 backdrop-blur-2xl rounded-[40px] shadow-xl border border-white/40 p-8 space-y-6">
              <h3 className="text-xl font-black text-slate-900">Your Progress Report</h3>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-emerald-50 p-6 rounded-3xl border border-emerald-100">
                  <p className="text-[10px] font-bold text-emerald-600 uppercase tracking-widest mb-1">Total Strong</p>
                  <p className="text-3xl font-black text-emerald-700">{checkins.length}</p>
                </div>
                <div className="bg-blue-50 p-6 rounded-3xl border border-blue-100">
                  <p className="text-[10px] font-bold text-blue-600 uppercase tracking-widest mb-1">Current Streak</p>
                  <p className="text-3xl font-black text-blue-700">{streak} Days</p>
                </div>
                <div className="bg-rose-50 p-6 rounded-3xl border border-rose-100">
                  <p className="text-[10px] font-bold text-rose-600 uppercase tracking-widest mb-1">Total Slips</p>
                  <p className="text-3xl font-black text-rose-700">{slips.length}</p>
                </div>
                <div className="bg-purple-50 p-6 rounded-3xl border border-purple-100">
                  <p className="text-[10px] font-bold text-purple-600 uppercase tracking-widest mb-1">Avg Urge</p>
                  <p className="text-3xl font-black text-purple-700">
                    {diaryEntries.length > 0 
                      ? (diaryEntries.reduce((sum, e) => sum + e.urgeLevel, 0) / diaryEntries.length).toFixed(1) 
                      : '0.0'}
                  </p>
                </div>
              </div>

              {diaryEntries.length > 0 && (
                <div className="space-y-4 pt-4 border-t border-slate-100">
                  <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">Recent Reflections</p>
                  <div className="space-y-3 max-h-60 overflow-y-auto pr-2 custom-scrollbar">
                    {[...diaryEntries].reverse().slice(0, 3).map((entry, idx) => (
                      <div key={idx} className="bg-slate-50/50 p-4 rounded-2xl border border-slate-100 space-y-2">
                        <div className="flex justify-between items-center">
                          <p className="text-[10px] font-bold text-slate-400">{new Date(entry.date).toLocaleDateString()}</p>
                          <p className="text-[10px] font-bold text-slate-500 bg-white px-2 py-0.5 rounded-full border border-slate-100">Urge: {entry.urgeLevel}/10</p>
                        </div>
                        {entry.notes && <p className="text-sm text-slate-600 line-clamp-2">{entry.notes}</p>}
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>

        </div>

        {/* FOOTER */}
        <div className="text-center opacity-30 text-[10px] font-bold uppercase tracking-[0.3em] py-8">
          Built for Freedom • 2026
        </div>

      </div>
    </main>
  );
}
