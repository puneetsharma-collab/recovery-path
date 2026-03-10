'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';

const MOTIVATION = [
  "One day at a time. You're doing amazing! ✨",
  "Every moment is a fresh start. Proud of you. 💙",
  "Your future self is thanking you right now. 🏃‍♂️",
  "Strength doesn't come from what you can do; it comes from overcoming things you once thought you couldn't. 💪",
  "Progress, not perfection. Keep walking the path. 🌱"
];

interface DiaryEntry {
  date: string;
  resistanceLevel: number;
  notes: string;
}

export default function Checkin() {
  const [userId, setUserId] = useState('');
  const [password, setPassword] = useState('');
  const [isLogin, setIsLogin] = useState(false);
  const [checkins, setCheckins] = useState<string[]>([]);
  const [slips, setSlips] = useState<string[]>([]);
  const [freezesUsed, setFreezesUsed] = useState<string[]>([]);
  const [diaryEntries, setDiaryEntries] = useState<DiaryEntry[]>([]);
  const [streak, setStreak] = useState(0);
  const [freezes, setFreezes] = useState(0);
  const [msg, setMsg] = useState('');
  const [quote, setQuote] = useState('');
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [showDiaryForm, setShowDiaryForm] = useState(false);
  const [resistanceLevel, setResistanceLevel] = useState(5);
  const [diaryNotes, setDiaryNotes] = useState('');
  const [activeTab, setActiveTab] = useState<'checkin' | 'report'>('checkin');

  useEffect(() => {
    const savedId = localStorage.getItem('recovery_user_id');
    const savedPass = localStorage.getItem('recovery_password');
    if (savedId && savedPass) {
      handleAuth(savedId, savedPass, true);
    } else {
      // If no credentials, redirect to home to login
      window.location.href = '/';
    }
  }, []);

  async function handleAuth(id: string, pass: string, auto: boolean = false) {
    const res = await fetch('/api/code', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ userId: id, password: pass, isLogin: true })
    });
    const data = await res.json();
    if (data.error) {
      setMsg(data.error);
      if (auto) logout();
    } else {
      setUserId(data.userId);
      setPassword(pass);
      setIsLoggedIn(true);
      localStorage.setItem('recovery_user_id', data.userId);
      localStorage.setItem('recovery_password', pass);
      loadData(data.userId);
    }
  }

  async function loadData(id: string) {
    const res = await fetch(`/api/checkin?code=${id}`);
    const data = await res.json();
    setCheckins(data.checkins || []);
    setSlips(data.slips || []);
    setFreezesUsed(data.freezesUsed || []);
    setDiaryEntries(data.diaryEntries || []);
    setStreak(data.streak || 0);
    setFreezes(data.freezes || 0);
  }

  async function doCheckin(action: 'strong' | 'slip') {
    if (action === 'strong') {
      setShowDiaryForm(true);
      return;
    }
    
    const res = await fetch('/api/checkin', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ code: userId, action })
    });
    const data = await res.json();
    if (data.error) {
      setMsg(data.error);
    } else {
      setCheckins(data.checkins || []);
      setSlips(data.slips || []);
      setFreezesUsed(data.freezesUsed || []);
      setDiaryEntries(data.diaryEntries || []);
      setStreak(data.streak || 0);
      setFreezes(data.freezes || 0);
      const usedFreezes = (data.freezesUsed || []).length;
      const earnedFreezes = data.freezes || 0;
      if (usedFreezes < earnedFreezes) {
        setMsg("You used a freeze! Your streak is safe. 🛡️");
        setQuote("Your consistency has rewards. Keep pushing!");
      } else {
        setMsg("It's okay. Tomorrow is a new start. 🫂");
        setQuote("Failure is just a bruise, not a tattoo. Rest, and restart.");
      }
    }
  }

  async function submitDiary() {
    const res = await fetch('/api/checkin', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ code: userId, action: 'strong', resistanceLevel, notes: diaryNotes })
    });
    const data = await res.json();
    if (data.error) {
      setMsg(data.error);
    } else {
      setCheckins(data.checkins || []);
      setSlips(data.slips || []);
      setFreezesUsed(data.freezesUsed || []);
      setDiaryEntries(data.diaryEntries || []);
      setStreak(data.streak || 0);
      setFreezes(data.freezes || 0);
      setMsg('Success saved! 💙');
      setQuote(MOTIVATION[Math.floor(Math.random() * MOTIVATION.length)]);
      setShowDiaryForm(false);
      setResistanceLevel(5);
      setDiaryNotes('');
    }
  }

  function logout() {
    localStorage.clear();
    window.location.reload();
  }

  // Calendar Logic
  const today = new Date();
  const year = today.getFullYear();
  const month = today.getMonth();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const firstDay = new Date(year, month, 1).getDay();
  
  const calendarDays = [];
  for (let i = 0; i < firstDay; i++) calendarDays.push(null);
  for (let i = 1; i <= daysInMonth; i++) calendarDays.push(i);

  if (isLoggedIn) {
    return (
      <main className="min-h-screen bg-[#F8FAFC] flex justify-center p-4 py-8 md:py-12">
        <div className="bg-white rounded-[32px] shadow-sm p-8 md:p-10 max-w-md w-full space-y-8 border border-slate-100">
          <div className="text-center space-y-2">
            <h1 className="text-2xl font-black text-slate-900 tracking-tight">Journey Check-in</h1>
            <p className="text-sm text-slate-500 font-medium">Be honest with your path, @{userId}.</p>
          </div>

          <div className="space-y-4">
            <button 
              onClick={() => doCheckin('strong')} 
              className="w-full bg-saffron hover:bg-[#e68a2e] text-white py-5 rounded-[20px] font-bold text-lg shadow-lg shadow-saffron/10 active:scale-[0.98] transition-all flex items-center justify-center gap-3"
            >
              <span>✨</span>
              I Continued My Ascent!
            </button>

            <button 
              onClick={() => doCheckin('slip')} 
              className="w-full bg-slate-50 border border-slate-200 text-slate-600 py-4 rounded-[20px] font-bold hover:bg-orange-50 hover:text-orange-600 hover:border-orange-100 transition-all active:scale-[0.98]"
            >
              I Took a Detour
            </button>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="bg-slate-50 p-5 rounded-2xl border border-slate-100 text-center">
              <span className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Current Ascent</span>
              <span className="text-3xl font-black text-slate-900">{streak} <span className="text-xs font-bold text-slate-400">steps</span></span>
            </div>
            <div className="bg-slate-50 p-5 rounded-2xl border border-slate-100 text-center">
              <span className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Protections</span>
              <div className="flex justify-center gap-1.5 mt-2">
                {[...Array(2)].map((_, i) => {
                  const hasFreeze = freezes > i;
                  const used = freezesUsed.length > i;
                  return (
                    <div key={i} className={`text-xl ${!hasFreeze ? 'opacity-10 grayscale' : used ? 'opacity-30' : 'drop-shadow-sm animate-pulse'}`}>
                      ❄️
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* ACTIVITY MAP */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-xs font-bold text-slate-400 uppercase tracking-[0.2em]">Activity Map</h3>
              <span className="text-[10px] font-black text-slate-900">{new Date(year, month).toLocaleString('default', { month: 'short' })}</span>
            </div>
            <div className="grid grid-cols-7 gap-1.5">
              {['S', 'M', 'T', 'W', 'T', 'F', 'S'].map((d, i) => (
                <div key={i} className="text-[8px] font-black text-slate-300 text-center">{d}</div>
              ))}
              {calendarDays.map((day, i) => {
                if (!day) return <div key={`empty-${i}`} />;
                const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
                const isStrong = checkins.includes(dateStr);
                const isSlip = slips.includes(dateStr);
                const isFrozen = freezesUsed.includes(dateStr);
                
                let bgColor = 'bg-slate-50';
                let dotColor = '';
                if (isStrong) {
                  bgColor = 'bg-blue-600 text-white';
                } else if (isFrozen) {
                  bgColor = 'bg-cyan-400 text-white';
                } else if (isSlip) {
                  bgColor = 'bg-rose-500 text-white';
                }

                return (
                  <div key={day} className={`aspect-square flex items-center justify-center rounded-lg text-[10px] font-bold transition-colors ${bgColor} ${!isStrong && !isSlip && !isFrozen ? 'text-slate-400 hover:bg-slate-100' : ''}`}>
                    {day}
                  </div>
                );
              })}
            </div>
          </div>

          {quote && (
            <div className="p-5 bg-blue-50/50 rounded-2xl border border-blue-100/50 animate-in fade-in slide-in-from-bottom-2">
              <p className="text-blue-800 text-sm font-medium italic text-center leading-relaxed">"{quote}"</p>
            </div>
          )}

          <div className="pt-4">
            <Link href="/" className="group w-full bg-slate-900 text-white py-4 rounded-[20px] font-bold hover:bg-slate-800 transition-all active:scale-[0.98] flex items-center justify-center gap-2">
              <span>←</span>
              Go Back
            </Link>
          </div>
        </div>

        {/* DIARY MODAL (Updated) */}
        {showDiaryForm && (
          <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm flex items-center justify-center p-4 z-50 animate-in fade-in duration-300">
            <div className="bg-white rounded-[32px] shadow-2xl p-8 max-w-md w-full space-y-6 border border-slate-100 animate-in zoom-in-95 duration-300">
              <h2 className="text-xl font-black text-slate-900">Daily Reflection</h2>
              
              <div className="space-y-6">
                <div>
                  <div className="flex justify-between items-center mb-3">
                    <label className="text-xs font-bold text-slate-500 uppercase tracking-widest">Resistance Level</label>
                    <span className="text-xl font-black text-saffron bg-saffron/5 px-3 py-1 rounded-xl">{resistanceLevel}</span>
                  </div>
                  <input 
                    type="range" 
                    min="0" 
                    max="10" 
                    value={resistanceLevel}
                    onChange={(e) => setResistanceLevel(parseInt(e.target.value))}
                    className="w-full h-2 bg-slate-100 rounded-lg appearance-none cursor-pointer accent-saffron"
                  />
                  <div className="flex justify-between mt-2">
                    <span className="text-[10px] font-bold text-slate-300 uppercase">None</span>
                    <span className="text-[10px] font-bold text-slate-300 uppercase">Extreme</span>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-3">Today's Notes</label>
                  <textarea 
                    value={diaryNotes}
                    onChange={(e) => setDiaryNotes(e.target.value)}
                    placeholder="How was your day? Any triggers?"
                    className="w-full bg-slate-50 border border-slate-100 p-4 rounded-2xl font-medium text-slate-900 outline-none focus:border-blue-400 focus:bg-white transition-all resize-none h-32 text-sm"
                  />
                </div>
              </div>

              <div className="flex gap-3">
                <button 
                  onClick={() => {
                    setShowDiaryForm(false);
                    setUrgeLevel(5);
                    setDiaryNotes('');
                  }}
                  className="flex-1 bg-slate-50 text-slate-500 py-3.5 rounded-xl font-bold hover:bg-slate-100 transition-all"
                >
                  Cancel
                </button>
                <button 
                  onClick={submitDiary}
                  className="flex-1 bg-saffron hover:bg-[#e68a2e] text-white py-3.5 rounded-xl font-bold shadow-lg shadow-saffron/10 transition-all"
                >
                  Save Entry
                </button>
              </div>
            </div>
          </div>
        )}
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
      <div className="animate-pulse flex flex-col items-center space-y-4">
        <div className="w-12 h-12 bg-blue-200 rounded-full"></div>
        <p className="text-slate-400 font-bold animate-bounce">Resuming Session...</p>
      </div>
    </main>
  );
}
