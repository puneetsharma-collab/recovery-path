'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Sun, Cloud, CloudRain, ArrowLeft, Sparkles } from 'lucide-react';

const MOTIVATION = [
  "The sun rises on a new beginning. Your mind is your temple. ✨",
  "Every breath is a chance to return to the path. Proud of you. 💙",
  "Your future self is walking this path with you. 🏃‍♂️",
  "Strength is found in the stillness of the storm. 💪",
  "The path is long, but every step is sacred. 🌱"
];

interface DiaryEntry {
  date: string;
  resistanceLevel: number;
  notes: string;
}

export default function Checkin() {
  const [userId, setUserId] = useState('');
  const [password, setPassword] = useState('');
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [showDiaryForm, setShowDiaryForm] = useState(false);
  const [resistanceLevel, setResistanceLevel] = useState(5);
  const [diaryNotes, setDiaryNotes] = useState('');
  const [streak, setStreak] = useState(0);
  const [freezes, setFreezes] = useState(0);
  const [msg, setMsg] = useState('');
  const [quote, setQuote] = useState('');
  const [checkins, setCheckins] = useState<string[]>([]);
  const [slips, setSlips] = useState<string[]>([]);
  const [freezesUsed, setFreezesUsed] = useState<string[]>([]);
  const [selectedState, setSelectedState] = useState<'Steady' | 'Flickering' | 'Clouded' | null>(null);

  useEffect(() => {
    const savedId = localStorage.getItem('recovery_user_id');
    const savedPass = localStorage.getItem('recovery_password');
    if (savedId && savedPass) {
      handleAuth(savedId, savedPass, true);
    } else {
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
      if (auto) {
        localStorage.clear();
        window.location.href = '/';
      }
    } else {
      setUserId(data.userId);
      setPassword(pass);
      setIsLoggedIn(true);
      loadData(data.userId);
    }
  }

  async function loadData(id: string) {
    const res = await fetch(`/api/checkin?code=${id}`);
    const data = await res.json();
    setCheckins(data.checkins || []);
    setSlips(data.slips || []);
    setFreezesUsed(data.freezesUsed || []);
    setStreak(data.streak || 0);
    setFreezes(data.freezes || 0);
  }

  async function doCheckin(state: 'Steady' | 'Flickering' | 'Clouded') {
    setSelectedState(state);
    if (state === 'Steady' || state === 'Flickering') {
      setShowDiaryForm(true);
    } else {
      const res = await fetch('/api/checkin', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ code: userId, action: 'slip' })
      });
      const data = await res.json();
      if (!data.error) {
        setStreak(data.streak || 0);
        setFreezes(data.freezes || 0);
        setMsg("The path is still there. Tomorrow is a new ascent. 🫂");
        setQuote("Failure is just a detour, not the end of the journey.");
      }
    }
  }

  async function submitDiary() {
    const res = await fetch('/api/checkin', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ 
        code: userId, 
        action: 'strong', 
        resistanceLevel, 
        notes: diaryNotes 
      })
    });
    const data = await res.json();
    if (!data.error) {
      setCheckins(data.checkins || []);
      setStreak(data.streak || 0);
      setFreezes(data.freezes || 0);
      setMsg('Your reflection is recorded. 💙');
      setQuote(MOTIVATION[Math.floor(Math.random() * MOTIVATION.length)]);
      setShowDiaryForm(false);
      setDiaryNotes('');
    }
  }

  if (!isLoggedIn) return null;

  return (
    <main className="min-h-screen bg-gradient-to-b from-[#FFEDD5] via-[#FFFBEB] to-[#F8FAFC] flex justify-center p-4 py-8 md:py-12">
      <div className="bg-white/80 backdrop-blur-md rounded-[40px] shadow-xl shadow-orange-200/20 p-8 md:p-12 max-w-md w-full space-y-10 border border-orange-100/50 relative overflow-hidden">
        <div className="absolute top-0 right-0 -mr-20 -mt-20 w-40 h-40 bg-orange-100/30 rounded-full blur-3xl"></div>
        
        <div className="text-center space-y-4 relative z-10">
          <div className="w-16 h-16 bg-gradient-to-br from-orange-400 to-yellow-400 rounded-2xl flex items-center justify-center text-white mx-auto shadow-lg shadow-orange-200">
            <Sun size={32} className="animate-pulse" />
          </div>
          <div className="space-y-1">
            <h1 className="text-3xl font-black text-slate-900 tracking-tight">Morning Sadhana</h1>
            <p className="text-sm text-slate-500 font-bold uppercase tracking-widest">How steady is your mind today?</p>
          </div>
        </div>

        <div className="space-y-4 relative z-10">
          <button 
            onClick={() => doCheckin('Steady')} 
            className="w-full bg-white hover:bg-emerald-50 border-2 border-slate-100 hover:border-emerald-200 p-6 rounded-[24px] font-bold text-lg transition-all active:scale-[0.98] flex items-center justify-between group"
          >
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 bg-emerald-100 rounded-xl flex items-center justify-center text-emerald-600">
                <Sparkles size={20} />
              </div>
              <span className="text-slate-700">Steady</span>
            </div>
            <span className="text-slate-300 group-hover:text-emerald-400 transition-colors">→</span>
          </button>

          <button 
            onClick={() => doCheckin('Flickering')} 
            className="w-full bg-white hover:bg-orange-50 border-2 border-slate-100 hover:border-orange-200 p-6 rounded-[24px] font-bold text-lg transition-all active:scale-[0.98] flex items-center justify-between group"
          >
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 bg-orange-100 rounded-xl flex items-center justify-center text-orange-600">
                <Cloud size={20} />
              </div>
              <span className="text-slate-700">Flickering</span>
            </div>
            <span className="text-slate-300 group-hover:text-orange-400 transition-colors">→</span>
          </button>

          <button 
            onClick={() => doCheckin('Clouded')} 
            className="w-full bg-white hover:bg-rose-50 border-2 border-slate-100 hover:border-rose-200 p-6 rounded-[24px] font-bold text-lg transition-all active:scale-[0.98] flex items-center justify-between group"
          >
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 bg-rose-100 rounded-xl flex items-center justify-center text-rose-600">
                <CloudRain size={20} />
              </div>
              <span className="text-slate-700">Clouded</span>
            </div>
            <span className="text-slate-300 group-hover:text-rose-400 transition-colors">→</span>
          </button>
        </div>

        {msg && (
          <div className="p-6 bg-white/50 rounded-3xl border border-slate-100 text-center space-y-2 animate-in fade-in slide-in-from-bottom-2">
            <p className="text-slate-900 font-bold">{msg}</p>
            {quote && <p className="text-xs text-slate-500 italic">"{quote}"</p>}
          </div>
        )}

        <div className="pt-4 flex gap-4">
          <Link href="/dashboard" className="flex-1 bg-slate-900 text-white py-5 rounded-[24px] font-bold hover:bg-slate-800 transition-all text-center flex items-center justify-center gap-2">
            <ArrowLeft size={18} />
            Dashboard
          </Link>
        </div>
      </div>

      {showDiaryForm && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-[40px] shadow-2xl p-10 max-w-md w-full space-y-8 border border-slate-100 animate-in zoom-in-95 duration-300">
            <h2 className="text-2xl font-black text-slate-900">Today's Reflection</h2>
            
            <div className="space-y-6">
              <div>
                <div className="flex justify-between items-center mb-4">
                  <label className="text-xs font-black text-slate-400 uppercase tracking-widest">Mind Presence</label>
                  <span className="text-lg font-black text-orange-500 bg-orange-50 px-4 py-1 rounded-full">{resistanceLevel}/10</span>
                </div>
                <input 
                  type="range" min="0" max="10" value={resistanceLevel}
                  onChange={(e) => setResistanceLevel(parseInt(e.target.value))}
                  className="w-full h-2 bg-slate-100 rounded-lg appearance-none cursor-pointer accent-orange-500"
                />
              </div>

              <div>
                <label className="block text-xs font-black text-slate-400 uppercase tracking-widest mb-4">Traveler's Journal</label>
                <textarea 
                  value={diaryNotes}
                  onChange={(e) => setDiaryNotes(e.target.value)}
                  placeholder="Record your thoughts on today's journey..."
                  className="w-full bg-[#F5F5DC]/30 border border-slate-100 p-6 rounded-3xl font-medium text-slate-900 outline-none focus:border-orange-300 transition-all resize-none h-40 text-sm"
                />
              </div>
            </div>

            <div className="flex gap-4">
              <button 
                onClick={() => setShowDiaryForm(false)}
                className="flex-1 bg-slate-50 text-slate-500 py-4 rounded-2xl font-bold hover:bg-slate-100 transition-all"
              >
                Cancel
              </button>
              <button 
                onClick={submitDiary}
                className="flex-1 bg-gradient-to-r from-orange-500 to-yellow-500 text-white py-4 rounded-2xl font-bold shadow-lg shadow-orange-200 transition-all active:scale-95"
              >
                Save Ritual
              </button>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}
