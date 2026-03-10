'use client';

import { useState, useEffect } from 'react';
import { Sparkles, Wind, TrendingUp, Sun, Cloud, Moon, ArrowLeft } from 'lucide-react';
import Link from 'next/link';

export default function Dashboard() {
  const [streak, setStreak] = useState(0);
  const [lastDate, setLastDate] = useState<string | null>(null);
  const [mood, setMood] = useState(3);

  useEffect(() => {
    const savedStreak = localStorage.getItem('streak');
    const savedDate = localStorage.getItem('lastDate');

    if (savedStreak) setStreak(Number(savedStreak));
    if (savedDate) setLastDate(savedDate);
  }, []);

  function markClean() {
    const today = new Date().toDateString();

    if (lastDate === today) return;

    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);

    if (lastDate === yesterday.toDateString()) {
      setStreak(prev => prev + 1);
      localStorage.setItem('streak', String(streak + 1));
    } else {
      setStreak(1);
      localStorage.setItem('streak', '1');
    }

    setLastDate(today);
    localStorage.setItem('lastDate', today);
  }

  return (
    <main className="min-h-screen bg-[#F8F9FA] p-4 py-8 md:py-12">
      <div className="max-w-2xl mx-auto space-y-8">
        
        {/* HEADER */}
        <div className="flex items-center gap-4">
          <Link href="/">
            <button className="p-2 hover:bg-slate-100 rounded-full transition-colors">
              <ArrowLeft size={20} className="text-slate-400" />
            </button>
          </Link>
          <h1 className="text-2xl font-black text-slate-900">Pilgrim's Dashboard</h1>
        </div>

        <div className="grid grid-cols-1 gap-8">
          
          {/* DAILY SADHANA SECTION */}
          <div className="bg-white rounded-[32px] shadow-lg shadow-gold/5 border border-slate-100 p-8 space-y-6">
            <div className="flex items-center justify-between">
              <h3 className="text-xl font-black text-slate-900">Pilgrim's Daily Sadhana</h3>
              <div className="w-10 h-10 bg-saffron/10 rounded-xl flex items-center justify-center text-saffron">
                <Sparkles size={24} />
              </div>
            </div>

            <div className="bg-saffron/5 rounded-[24px] p-8 text-center border border-saffron/10">
              <div className="text-6xl font-black text-saffron mb-2">
                {streak}
              </div>
              <p className="text-xs font-bold text-slate-400 uppercase tracking-[0.2em]">Ascent Streak (Steps)</p>
            </div>

            <button
              onClick={markClean}
              className="w-full bg-saffron hover:bg-[#e68a2e] text-white py-5 rounded-2xl font-bold text-lg shadow-lg shadow-saffron/10 transition-all active:scale-[0.98]"
            >
              I stayed on the path today
            </button>

            <div className="space-y-4">
              <label className="block text-sm font-bold text-slate-700 uppercase tracking-wider">
                Presence Level
              </label>

              <div className="flex items-center gap-4">
                <Cloud size={20} className="text-slate-300" />
                <input
                  type="range"
                  min="1"
                  max="5"
                  value={mood}
                  onChange={(e) => setMood(Number(e.target.value))}
                  className="w-full accent-saffron h-2 bg-slate-100 rounded-lg appearance-none cursor-pointer"
                />
                <Sun size={20} className="text-saffron" />
              </div>

              <div className="text-center text-xs font-black text-slate-400 uppercase tracking-widest">
                Mindfulness: {mood} / 5
              </div>
            </div>
          </div>

          {/* BREATH OF STILLNESS CARD */}
          <div className="bg-slate-900 text-white rounded-[32px] p-8 space-y-4 relative overflow-hidden group shadow-lg shadow-gold/5">
            <div className="absolute top-0 right-0 w-32 h-32 bg-saffron/10 rounded-full blur-3xl -mr-16 -mt-16"></div>
            <div className="relative z-10">
              <div className="flex items-center gap-3 mb-2">
                <div className="w-8 h-8 bg-saffron/20 rounded-lg flex items-center justify-center text-saffron">
                  <Wind size={20} />
                </div>
                <h4 className="text-xs font-bold uppercase tracking-widest text-slate-400">The Breath of Stillness</h4>
              </div>
              <p className="text-slate-300 text-sm leading-relaxed">
                When the mind wanders toward old shadows, return to the breath. Inhale for four, hold for four, exhale for four. Find the silence within the movement.
              </p>
            </div>
          </div>

          {/* JOURNEY PROGRESS SECTION */}
          <div className="bg-white rounded-[32px] shadow-lg shadow-gold/5 border border-slate-100 p-8 space-y-6">
            <div className="flex items-center gap-3">
              <TrendingUp size={24} className="text-gold-deep" />
              <h3 className="text-xl font-black text-slate-900">Journey Progress</h3>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-emerald-50/50 p-6 rounded-[24px] border border-emerald-100/50">
                <p className="text-[10px] font-bold text-emerald-600 uppercase tracking-widest mb-1">Steps Climbed!</p>
                <p className="text-3xl font-black text-slate-900">{streak}</p>
              </div>
              <div className="bg-orange-50/50 p-6 rounded-[24px] border border-orange-100/50">
                <p className="text-[10px] font-bold text-orange-600 uppercase tracking-widest mb-1">Detours Taken</p>
                <p className="text-3xl font-black text-slate-900">{0}</p>
              </div>
              <div className="bg-gold/5 p-6 rounded-[24px] border border-gold/10">
                <p className="text-[10px] font-bold text-gold-deep uppercase tracking-widest mb-1">Current Ascent</p>
                <p className="text-3xl font-black text-slate-900">{streak}</p>
              </div>
              <div className="bg-blue-50/50 p-6 rounded-[24px] border border-blue-100/50">
                <p className="text-[10px] font-bold text-blue-600 uppercase tracking-widest mb-1">Mindful Resistance</p>
                <p className="text-3xl font-black text-slate-900">{mood}/5</p>
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
