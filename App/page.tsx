'use client';

import { useState, useEffect } from 'react';

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
    <main className="min-h-screen bg-gradient-to-b from-emerald-50 to-sky-50 p-4 flex justify-center">
      <div className="max-w-xl w-full bg-white rounded-xl shadow-lg p-6">
        <h2 className="text-2xl font-bold text-sky-700 mb-4">
          Daily Check-in
        </h2>

        <div className="bg-sky-50 rounded-lg p-4 mb-4 text-center">
          <div className="text-4xl font-bold text-emerald-600">
            {streak}
          </div>
          <p className="text-slate-600">Day Streak</p>
        </div>

        <button
          onClick={markClean}
          className="w-full bg-emerald-600 text-white py-3 rounded-lg font-semibold mb-4"
        >
          I stayed clean today ✅
        </button>

        <div>
          <label className="block mb-2 text-slate-700">
            How was your mood today?
          </label>

          <input
            type="range"
            min="1"
            max="5"
            value={mood}
            onChange={(e) => setMood(Number(e.target.value))}
            className="w-full"
          />

          <div className="text-center text-slate-600 mt-1">
            Mood: {mood} / 5
          </div>
        </div>

        <p className="text-xs text-slate-400 mt-6 text-center">
          Progress > Perfection · 100% Anonymous
        </p>
      </div>
    </main>
  );
}