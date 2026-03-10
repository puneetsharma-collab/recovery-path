'use client';

import { useState, useEffect } from 'react';
import { Sparkles, Wind, TrendingUp, Sun, Cloud, Moon, ArrowLeft, X, PartyPopper } from 'lucide-react';
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

export default function Dashboard() {
  const [streak, setStreak] = useState(0);
  const [lastDate, setLastDate] = useState<string | null>(null);
  const [mood, setMood] = useState(3);
  const [showCelebration, setShowCelebration] = useState(false);
  const [celebrationSite, setCelebrationSite] = useState('');

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

    let newStreak = 0;
    if (lastDate === yesterday.toDateString()) {
      newStreak = streak + 1;
    } else {
      newStreak = 1;
    }

    setStreak(newStreak);
    localStorage.setItem('streak', String(newStreak));
    setLastDate(today);
    localStorage.setItem('lastDate', today);

    // Check for milestone
    const milestone = milestones.find(m => m.day === newStreak);
    if (milestone) {
      setCelebrationSite(milestone.name);
      setShowCelebration(true);
    }
  }

  return (
    <main className="min-h-screen bg-[#F8F9FA] p-4 py-8 md:py-12">
      {/* Celebration Modal */}
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
            <button 
              onClick={() => setShowCelebration(false)}
              className="w-full bg-slate-900 text-white py-4 rounded-2xl font-bold hover:bg-slate-800 transition-colors"
            >
              Continue the Journey
            </button>
          </div>
        </div>
      )}

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

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-start">
          
          <div className="space-y-8">
            {/* DAILY SADHANA SECTION */}
            <div className="bg-white rounded-[32px] shadow-lg shadow-gold/5 border border-slate-100 p-8 space-y-6">
              <div className="flex items-center justify-between">
                <h3 className="text-xl font-black text-slate-900">Daily Sadhana</h3>
                <div className="w-10 h-10 bg-saffron/10 rounded-xl flex items-center justify-center text-saffron">
                  <Sparkles size={24} />
                </div>
              </div>

              <div className="bg-saffron/5 rounded-[24px] p-8 text-center border border-saffron/10">
                <div className="text-6xl font-black text-saffron mb-2">
                  {streak}
                </div>
                <p className="text-xs font-bold text-slate-400 uppercase tracking-[0.2em]">Ascent Streak</p>
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
                  <h4 className="text-xs font-bold uppercase tracking-widest text-slate-400">The Breath</h4>
                </div>
                <p className="text-slate-300 text-sm leading-relaxed">
                  Inhale for four, hold for four, exhale for four. Find the silence within.
                </p>
              </div>
            </div>
          </div>

          <div className="space-y-8">
            {/* MAP INTEGRATION */}
            <YatraMap currentStreak={streak} />

            {/* JOURNEY PROGRESS SECTION */}
            <div className="bg-white rounded-[32px] shadow-lg shadow-gold/5 border border-slate-100 p-8 space-y-6">
              <div className="flex items-center gap-3">
                <TrendingUp size={24} className="text-gold-deep" />
                <h3 className="text-xl font-black text-slate-900">Progress</h3>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-emerald-50/50 p-6 rounded-[24px] border border-emerald-100/50">
                  <p className="text-[10px] font-bold text-emerald-600 uppercase tracking-widest mb-1">Steps</p>
                  <p className="text-3xl font-black text-slate-900">{streak}</p>
                </div>
                <div className="bg-orange-50/50 p-6 rounded-[24px] border border-orange-100/50">
                  <p className="text-[10px] font-bold text-orange-600 uppercase tracking-widest mb-1">Detours</p>
                  <p className="text-3xl font-black text-slate-900">0</p>
                </div>
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


        <p className="text-[10px] font-bold text-slate-300 mt-12 text-center uppercase tracking-[0.4em]">
          The Sacred Yatra • Secure & Anonymous
        </p>
      </div>
    </main>
  );
}
