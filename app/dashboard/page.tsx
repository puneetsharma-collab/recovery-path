'use client';

import { useState, useEffect } from 'react';
import { Sparkles, Wind, TrendingUp, Sun, Cloud, Moon, ArrowLeft, X, PartyPopper, CheckCircle2, Circle, Scroll, ChevronRight, History } from 'lucide-react';
import Link from 'next/link';
import YatraMap from '@/components/YatraMap';

const milestones = [
  { day: 7, name: 'Forest of Silence' },
  { day: 14, name: 'Valley of Patience' },
  { day: 21, name: 'High Pass' },
  { day: 28, name: 'River of Reflection' },
  { day: 35, name: 'Sanctuary of Peace' },
  { day: 42, name: 'The Peak' },
];

interface DiaryEntry {
  date: string;
  notes: string;
  resistanceLevel: number;
}

export default function Dashboard() {
  const [userId, setUserId] = useState('');
  const [streak, setStreak] = useState(0);
  const [punya, setPunya] = useState(0);
  const [morningDone, setMorningDone] = useState(false);
  const [eveningDone, setEveningDone] = useState(false);
  const [mood, setMood] = useState(3);
  const [showCelebration, setShowCelebration] = useState(false);
  const [celebrationSite, setCelebrationSite] = useState('');
  const [journalEntries, setJournalEntries] = useState<DiaryEntry[]>([]);

  useEffect(() => {
    const savedId = localStorage.getItem('recovery_user_id') || 'Pilgrim';
    setUserId(savedId);
    const savedStreak = localStorage.getItem('streak');
    const savedPunya = localStorage.getItem('punya');
    if (savedStreak) setStreak(Number(savedStreak));
    if (savedPunya) setPunya(Number(savedPunya));

    const today = new Date().toDateString();
    setMorningDone(localStorage.getItem(`morning_${today}`) === 'true');
    setEveningDone(localStorage.getItem(`evening_${today}`) === 'true');

    // Load journal from API
    fetch(`/api/checkin?code=${savedId}`)
      .then(res => res.json())
      .then(data => {
        if (data.diaryEntries) setJournalEntries(data.diaryEntries.reverse());
      });
  }, []);

  const toggleRitual = (type: 'morning' | 'evening') => {
    const today = new Date().toDateString();
    if (type === 'morning') {
      const newState = !morningDone;
      setMorningDone(newState);
      localStorage.setItem(`morning_${today}`, String(newState));
      if (newState && eveningDone) rewardPunya();
    } else {
      const newState = !eveningDone;
      setEveningDone(newState);
      localStorage.setItem(`evening_${today}`, String(newState));
      if (newState && morningDone) rewardPunya();
    }
  };

  const rewardPunya = () => {
    const newPunya = punya + 5;
    setPunya(newPunya);
    localStorage.setItem('punya', String(newPunya));
  };

  return (
    <main className="min-h-screen bg-[#F8F9FA] p-4 py-8 md:py-12">
      {showCelebration && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-300">
          <div className="bg-white rounded-[40px] p-10 max-w-sm w-full text-center space-y-6 shadow-2xl relative overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-saffron to-gold" />
            <div className="w-20 h-20 bg-saffron/10 rounded-full flex items-center justify-center text-saffron mx-auto">
              <PartyPopper size={40} />
            </div>
            <div className="space-y-2">
              <h2 className="text-3xl font-black text-slate-900">Sacred Milestone!</h2>
              <p className="text-slate-500 font-medium">You have reached the <span className="text-saffron font-bold">{celebrationSite}</span></p>
            </div>
            <button onClick={() => setShowCelebration(false)} className="w-full bg-slate-900 text-white py-4 rounded-2xl font-bold">Continue the Journey</button>
          </div>
        </div>
      )}

      <div className="max-w-3xl mx-auto space-y-8">
        
        {/* HEADER */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link href="/">
              <button className="p-2 hover:bg-slate-100 rounded-full transition-colors">
                <ArrowLeft size={20} className="text-slate-400" />
              </button>
            </Link>
            <div>
              <h1 className="text-2xl font-black text-slate-900">Pilgrim {userId}</h1>
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Steady on the path</p>
            </div>
          </div>
          <div className="flex items-center gap-2 bg-amber-50 px-4 py-2 rounded-2xl border border-amber-100">
            <Sparkles size={16} className="text-amber-500" />
            <span className="text-sm font-black text-amber-700">+{punya} Punya</span>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-start">
          
          <div className="space-y-8">
            {/* DAILY SADHANA (Updated with Rituals) */}
            <div className="bg-white rounded-[32px] shadow-lg shadow-gold/5 border border-slate-100 p-8 space-y-8">
              <div className="flex items-center justify-between">
                <h3 className="text-xl font-black text-slate-900">Daily Sadhana</h3>
                <Link href="/checkin">
                  <button className="px-4 py-2 bg-saffron text-white rounded-xl font-bold text-xs shadow-lg shadow-saffron/20 hover:scale-105 transition-all">Check-in</button>
                </Link>
              </div>

              <div className="space-y-4">
                <div 
                  onClick={() => toggleRitual('morning')}
                  className={`p-4 rounded-2xl border-2 cursor-pointer transition-all flex items-center justify-between ${morningDone ? 'bg-emerald-50 border-emerald-100' : 'bg-slate-50 border-transparent hover:border-slate-100'}`}
                >
                  <div className="flex items-center gap-3">
                    {morningDone ? <CheckCircle2 size={20} className="text-emerald-500" /> : <Circle size={20} className="text-slate-300" />}
                    <span className={`text-sm font-bold ${morningDone ? 'text-emerald-700' : 'text-slate-600'}`}>Morning Meditation (5 mins)</span>
                  </div>
                  <Sun size={16} className={morningDone ? 'text-emerald-400' : 'text-slate-300'} />
                </div>

                <div 
                  onClick={() => toggleRitual('evening')}
                  className={`p-4 rounded-2xl border-2 cursor-pointer transition-all flex items-center justify-between ${eveningDone ? 'bg-indigo-50 border-indigo-100' : 'bg-slate-50 border-transparent hover:border-slate-100'}`}
                >
                  <div className="flex items-center gap-3">
                    {eveningDone ? <CheckCircle2 size={20} className="text-indigo-500" /> : <Circle size={20} className="text-slate-300" />}
                    <span className={`text-sm font-bold ${eveningDone ? 'text-indigo-700' : 'text-slate-600'}`}>Evening Reflection</span>
                  </div>
                  <Moon size={16} className={eveningDone ? 'text-indigo-400' : 'text-slate-300'} />
                </div>
              </div>

              <div className="bg-saffron/5 rounded-[24px] p-6 text-center border border-saffron/10">
                <div className="text-4xl font-black text-saffron mb-1">{streak}</div>
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Ascent Streak</p>
              </div>
              
              <Link href="/trials" className="block">
                <div className="bg-slate-900 text-white p-4 rounded-2xl flex items-center justify-between hover:bg-slate-800 transition-all">
                  <div className="flex items-center gap-3">
                    <Scroll size={20} className="text-amber-400" />
                    <span className="text-sm font-bold">Trial of Will</span>
                  </div>
                  <ChevronRight size={16} />
                </div>
              </Link>
            </div>

            {/* MAP INTEGRATION */}
            <YatraMap currentStreak={streak} />
          </div>

          <div className="space-y-8">
            {/* TRAVELER'S JOURNAL */}
            <div className="bg-white rounded-[32px] shadow-lg shadow-gold/5 border border-slate-100 p-8 space-y-6">
              <div className="flex items-center gap-3">
                <History size={24} className="text-saffron" />
                <h3 className="text-xl font-black text-slate-900">Traveler's Journal</h3>
              </div>
              
              <div className="space-y-4 max-h-[500px] overflow-y-auto pr-2 scrollbar-hide">
                {journalEntries.length > 0 ? journalEntries.map((entry, i) => (
                  <div key={i} className="bg-[#F5F5DC] p-5 rounded-2xl border border-[#E3D5B0] space-y-3">
                    <div className="flex justify-between items-center border-b border-[#8B4513]/10 pb-2">
                      <span className="text-[10px] font-black text-[#8B4513] uppercase tracking-widest">{new Date(entry.date).toLocaleDateString()}</span>
                      <span className="text-[10px] font-bold text-[#8B4513]/60 bg-[#8B4513]/5 px-2 py-0.5 rounded-full">Mind: {entry.resistanceLevel}/10</span>
                    </div>
                    <p className="text-sm text-[#5D4037] font-medium leading-relaxed italic">
                      "{entry.notes || 'A day of quiet focus.'}"
                    </p>
                  </div>
                )) : (
                  <div className="text-center py-10 space-y-2 opacity-30">
                    <Scroll size={40} className="mx-auto" />
                    <p className="text-xs font-bold uppercase tracking-widest">The journal is empty</p>
                  </div>
                )}
              </div>
            </div>
          </div>

        </div>

        <p className="text-[10px] font-bold text-slate-300 mt-12 text-center uppercase tracking-[0.4em]">
          The Sacred Yatra • Secure & Anonymous
        </p>
      </div>
    </main>
  );
}
