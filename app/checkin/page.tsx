'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import {
  ShieldCheck,
  TriangleAlert,
  ArrowLeft,
  Snowflake,
  Flame,
  Mountain,
} from 'lucide-react';

type AvatarStage =
  | 'drowsy'
  | 'waking'
  | 'steady'
  | 'strong'
  | 'radiant'
  | 'fit';

interface ProgressData {
  streak: number;
  freezes: number;
  level: 1 | 2;
  levelDay: number;
  checkpointReached: boolean;
  shrineReached: boolean;
  avatarStage: AvatarStage;
  totalSteps: number;
  diaryEntries: {
    date: string;
    resistanceLevel: number;
    notes: string;
  }[];
}

const strongQuotes = [
  'Every strong day is one more step toward freedom.',
  'Small honest wins build a new life.',
  'You stayed strong today. That matters.',
  'One day at a time is enough.',
  'Your future self is being built quietly today.',
];

const slipQuotes = [
  'A stumble is not the end of the path.',
  'Be honest, reset, and start again tomorrow.',
  'Your worth is bigger than one bad day.',
  'The journey continues even after a hard day.',
];

function getAvatarText(stage: AvatarStage) {
  switch (stage) {
    case 'drowsy':
      return 'Drowsy';
    case 'waking':
      return 'Waking';
    case 'steady':
      return 'Steady';
    case 'strong':
      return 'Strong';
    case 'radiant':
      return 'Radiant';
    case 'fit':
      return 'Fit';
    default:
      return 'Recovering';
  }
}

export default function CheckinPage() {
  const [userId, setUserId] = useState('');
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [loading, setLoading] = useState(true);

  const [streak, setStreak] = useState(0);
  const [freezes, setFreezes] = useState(0);
  const [level, setLevel] = useState<1 | 2>(1);
  const [levelDay, setLevelDay] = useState(0);
  const [avatarStage, setAvatarStage] = useState<AvatarStage>('drowsy');

  const [showReflection, setShowReflection] = useState(false);
  const [resistanceLevel, setResistanceLevel] = useState(5);
  const [diaryNotes, setDiaryNotes] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const [msg, setMsg] = useState('');
  const [quote, setQuote] = useState('');

  useEffect(() => {
    const savedId = localStorage.getItem('recovery_user_id');
    const savedPass = localStorage.getItem('recovery_password');

    if (!savedId || !savedPass) {
      window.location.href = '/';
      return;
    }

    handleAuth(savedId, savedPass);
  }, []);

  async function handleAuth(id: string, pass: string) {
    const res = await fetch('/api/code', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        userId: id,
        password: pass,
        isLogin: true,
      }),
    });

    const data = await res.json();

    if (data.error) {
      localStorage.clear();
      window.location.href = '/';
      return;
    }

    setUserId(data.userId);
    setIsLoggedIn(true);
    await loadData(data.userId);
    setLoading(false);
  }

  async function loadData(id: string) {
    const res = await fetch(`/api/checkin?code=${id}`);
    const  ProgressData = await res.json();

    setStreak(data.streak || 0);
    setFreezes(data.freezes || 0);
    setLevel(data.level || 1);
    setLevelDay(data.levelDay || 0);
    setAvatarStage(data.avatarStage || 'drowsy');
  }

  async function submitStrong() {
    setSubmitting(true);

    const res = await fetch('/api/checkin', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        code: userId,
        action: 'strong',
        resistanceLevel,
        notes: diaryNotes,
      }),
    });

    const  ProgressData = await res.json();

    setStreak(data.streak || 0);
    setFreezes(data.freezes || 0);
    setLevel(data.level || 1);
    setLevelDay(data.levelDay || 0);
    setAvatarStage(data.avatarStage || 'drowsy');

    setMsg('Beautiful. Your step has been recorded.');
    setQuote(strongQuotes[Math.floor(Math.random() * strongQuotes.length)]);
    setShowReflection(false);
    setDiaryNotes('');
    setResistanceLevel(5);
    setSubmitting(false);
  }

  async function submitSlip() {
    setSubmitting(true);

    const res = await fetch('/api/checkin', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        code: userId,
        action: 'slip',
      }),
    });

    const  ProgressData = await res.json();

    setStreak(data.streak || 0);
    setFreezes(data.freezes || 0);
    setLevel(data.level || 1);
    setLevelDay(data.levelDay || 0);
    setAvatarStage(data.avatarStage || 'drowsy');

    setMsg('Today was hard, but honesty keeps the journey real.');
    setQuote(slipQuotes[Math.floor(Math.random() * slipQuotes.length)]);
    setShowReflection(false);
    setSubmitting(false);
  }

  if (loading || !isLoggedIn) return null;

  return (
    <main className="min-h-screen bg-gradient-to-b from-[#E8F5F7] via-[#F7FBFC] to-[#FFF8EC] p-4 py-8">
      <div className="max-w-md mx-auto space-y-6">
        <div className="flex items-center gap-3">
          <Link
            href="/"
            className="w-11 h-11 rounded-2xl bg-white border border-slate-100 shadow-sm flex items-center justify-center text-slate-500"
          >
            <ArrowLeft size={18} />
          </Link>

          <div className="bg-white border border-slate-100 rounded-2xl px-4 py-3 shadow-sm flex-1">
            <p className="text-[10px] uppercase tracking-widest font-bold text-slate-400">
              Anonymous pilgrim
            </p>
            <p className="text-sm font-black text-slate-900">@{userId}</p>
          </div>
        </div>

        <div className="bg-gradient-to-b from-[#F9F5E8] to-white border border-amber-100 rounded-[36px] shadow-lg p-6 space-y-5">
          <div className="text-center space-y-2">
            <div className="w-16 h-16 bg-amber-400 rounded-3xl mx-auto flex items-center justify-center text-white shadow-lg">
              <Mountain size={30} />
            </div>

            <p className="text-xs font-bold uppercase tracking-[0.25em] text-amber-700">
              Daily Check-in
            </p>

            <h1 className="text-3xl font-black text-slate-900">
              Did you resist your bad habit today?
            </h1>

            <p className="text-slate-600">
              One honest answer decides your next step on the path.
            </p>
          </div>

          <div className="grid grid-cols-3 gap-3">
            <div className="bg-white border border-slate-100 rounded-2xl p-4 text-center">
              <div className="flex justify-center text-orange-500 mb-2">
                <Flame size={18} />
              </div>
              <p className="text-xl font-black text-slate-900">{streak}</p>
              <p className="text-[10px] uppercase tracking-widest text-slate-400 font-bold">
                Streak
              </p>
            </div>

            <div className="bg-white border border-slate-100 rounded-2xl p-4 text-center">
              <div className="flex justify-center text-cyan-500 mb-2">
                <Snowflake size={18} />
              </div>
              <p className="text-xl font-black text-slate-900">{freezes}</p>
              <p className="text-[10px] uppercase tracking-widest text-slate-400 font-bold">
                Freeze
              </p>
            </div>

            <div className="bg-white border border-slate-100 rounded-2xl p-4 text-center">
              <p className="text-xl font-black text-slate-900">{levelDay}/7</p>
              <p className="text-[10px] uppercase tracking-widest text-slate-400 font-bold">
                Level {level}
              </p>
            </div>
          </div>

          <div className="bg-[#FFF9EC] border border-amber-100 rounded-3xl p-4 text-center">
            <p className="text-[10px] uppercase tracking-widest text-slate-400 font-bold">
              Avatar state
            </p>
            <p className="text-lg font-black text-slate-900 mt-1">
              {getAvatarText(avatarStage)}
            </p>
          </div>

          <div className="space-y-3">
            <button
              onClick={() => {
                setMsg('');
                setQuote('');
                setShowReflection(true);
              }}
              className="w-full bg-emerald-500 hover:bg-emerald-600 text-white rounded-[24px] p-5 font-bold text-lg shadow-lg transition-all flex items-center justify-center gap-3"
            >
              <ShieldCheck size={22} />
              Yes, I stayed strong
            </button>

            <button
              onClick={submitSlip}
              disabled={submitting}
              className="w-full bg-rose-100 hover:bg-rose-200 text-rose-700 rounded-[24px] p-5 font-bold text-lg transition-all flex items-center justify-center gap-3 disabled:opacity-60"
            >
              <TriangleAlert size={22} />
              No, I stumbled
            </button>
          </div>

          <div className="bg-slate-50 border border-slate-100 rounded-2xl p-4 text-sm text-slate-600">
            Freeze points are used automatically only when you miss a day, not when you choose “No, I stumbled.”
          </div>
        </div>

        {msg && (
          <div className="bg-white border border-slate-100 rounded-[28px] shadow-sm p-5 text-center space-y-2">
            <p className="font-bold text-slate-900">{msg}</p>
            {quote && <p className="text-sm text-slate-500 italic">{quote}</p>}
          </div>
        )}

        {showReflection && (
          <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-sm flex items-center justify-center p-4">
            <div className="bg-white rounded-[36px] shadow-2xl border border-slate-100 p-6 max-w-md w-full space-y-6">
              <div>
                <h2 className="text-2xl font-black text-slate-900">
                  Record today’s win
                </h2>
                <p className="text-sm text-slate-500 mt-1">
                  This is optional, but it helps the app feel personal.
                </p>
              </div>

              <div className="space-y-5">
                <div>
                  <div className="flex justify-between items-center mb-3">
                    <label className="text-xs font-bold uppercase tracking-widest text-slate-400">
                      Strength today
                    </label>
                    <span className="text-sm font-black text-amber-600 bg-amber-50 px-3 py-1 rounded-full">
                      {resistanceLevel}/10
                    </span>
                  </div>

                  <input
                    type="range"
                    min="0"
                    max="10"
                    value={resistanceLevel}
                    onChange={(e) => setResistanceLevel(parseInt(e.target.value))}
                    className="w-full accent-amber-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-widest text-slate-400 mb-3">
                    Reflection
                  </label>
                  <textarea
                    value={diaryNotes}
                    onChange={(e) => setDiaryNotes(e.target.value)}
                    placeholder="What helped you stay strong today?"
                    className="w-full h-32 resize-none rounded-3xl border border-slate-100 bg-slate-50 p-4 outline-none focus:border-amber-300 focus:bg-white text-slate-800"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <button
                  onClick={() => setShowReflection(false)}
                  className="w-full bg-slate-100 hover:bg-slate-200 text-slate-700 py-4 rounded-2xl font-bold transition-all"
                >
                  Cancel
                </button>

                <button
                  onClick={submitStrong}
                  disabled={submitting}
                  className="w-full bg-gradient-to-r from-amber-400 to-orange-400 hover:from-amber-500 hover:to-orange-500 text-white py-4 rounded-2xl font-bold shadow-lg transition-all disabled:opacity-60"
                >
                  Save
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </main>
  );
}
