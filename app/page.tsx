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
    <main className="min-h-screen bg-gradient-to-b from-blue-100 to-cyan-50 p-4 py-8 md:py-12 flex flex-col items-center justify-center animate-in fade-in duration-1000">
      <div className="w-full max-w-sm space-y-8">
        
        {/* WELCOME HERO SECTION */}
        <div className="space-y-6 text-center animate-in slide-in-from-top-4 duration-700">
          {/* TAGLINE */}
          <p className="text-lg md:text-xl text-slate-700 font-medium leading-relaxed">
            Identify your resolve and walk toward peace.
          </p>

          {/* CTA BUTTON */}
          <Link href="/checkin">
            <button className="w-full bg-gradient-to-r from-yellow-500 to-amber-500 hover:from-yellow-600 hover:to-amber-600 text-white px-8 py-4 rounded-full font-bold text-lg shadow-lg shadow-yellow-500/30 active:scale-[0.98] transition-all duration-300 uppercase tracking-widest">
              Begin My Journey
            </button>
          </Link>
        </div>

        {/* QUICK ACTIONS */}
        <div className="grid grid-cols-2 gap-4 animate-in slide-in-from-bottom-4 duration-900">
          <Link href="/test">
            <button className="w-full bg-white/80 backdrop-blur border border-white shadow-md text-slate-700 hover:bg-white hover:shadow-lg transition-all p-4 rounded-2xl font-bold text-sm active:scale-[0.98] flex flex-col items-center gap-2">
              <Pencil size={24} className="text-saffron" />
              <span>Introspection</span>
            </button>
          </Link>

          <Link href="/panic">
            <button className="w-full bg-white/80 backdrop-blur border border-white shadow-md text-orange-600 hover:bg-white hover:shadow-lg transition-all p-4 rounded-2xl font-bold text-sm active:scale-[0.98] flex flex-col items-center gap-2">
              <AlertCircle size={24} />
              <span>Ground Your Soul</span>
            </button>
          </Link>
        </div>

        {/* PILGRIM INFO & LOGOUT */}
        <div className="space-y-3 animate-in slide-in-from-bottom-3 duration-1000">
          <div className="bg-white/60 backdrop-blur border border-white rounded-2xl p-4 text-center">
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em] mb-1">Pilgrim</p>
            <p className="text-lg font-black text-slate-900">@{userId}</p>
          </div>
          <button 
            onClick={logout}
            className="w-full text-slate-400 hover:text-slate-600 font-bold text-xs hover:underline uppercase tracking-widest transition-colors"
          >
            Depart the Journey
          </button>
        </div>

        {/* FOOTER */}
        <div className="text-center opacity-40 text-[10px] font-bold uppercase tracking-[0.4em] py-6">
          The Sacred Yatra • Secure & Anonymous
        </div>

      </div>
    </main>
  );
}
