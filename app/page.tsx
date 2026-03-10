'use client';

import { useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import {
  Mountain,
  User,
  Lock,
  LogOut,
  Flame,
  Snowflake,
  Trophy,
  Sparkles,
  ChevronRight,
} from 'lucide-react';

type AvatarStage =
  | 'drowsy'
  | 'waking'
  | 'steady'
  | 'strong'
  | 'radiant'
  | 'fit';

interface DiaryEntry {
  date: string;
  resistanceLevel: number;
  notes: string;
}

interface ProgressData {
  checkins: string[];
  slips: string[];
  freezesUsed: string[];
  missedDays: string[];
  diaryEntries: DiaryEntry[];
  currentStreak: number;
  freezePoints: number;
  currentLevel: 1 | 2;
  currentPathDay: number;
  shrineVisits: number;
  totalStrongDays: number;
  completedJourney: boolean;
  avatarStage: AvatarStage;
  lastActionDate: string | null;
  streak: number;
  freezes: number;
  level: 1 | 2;
  levelDay: number;
  checkpointReached: boolean;
  shrineReached: boolean;
  totalSteps: number;
}

const levelTitles = {
  1: 'Level 1 • Sankalpa Begins',
  2: 'Level 2 • Recovery Path',
};

function getAvatarEmoji(stage: AvatarStage) {
  switch (stage) {
    case 'drowsy':
      return '😴';
    case 'waking':
      return '🙂';
    case 'steady':
      return '😌';
    case 'strong':
      return '💪';
    case 'radiant':
      return '✨';
    case 'fit':
      return '🧘‍♂️';
    default:
      return '🙂';
  }
}

export default function Home() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userId, setUserId] = useState('');
  const [password, setPassword] = useState('');
  const [isLogin, setIsLogin] = useState(true);
  const [msg, setMsg] = useState('');
  const [loading, setLoading] = useState(true);

  const [progress, setProgress] = useState<ProgressData | null>(null);

  useEffect(() => {
    const savedId = localStorage.getItem('recovery_user_id');
    const savedPass = localStorage.getItem('recovery_password');

    if (savedId && savedPass) {
      handleAuth(savedId, savedPass, true);
    } else {
      setLoading(false);
    }
  }, []);

  async function handleAuth(id: string, pass: string, auto: boolean = false) {
    if (!id || !pass) {
      if (!auto) setMsg('Please enter your anonymous ID and password.');
      return;
    }

    setLoading(true);
    setMsg('');

    const res = await fetch('/api/code', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        userId: id.toLowerCase(),
        password: pass,
        isLogin: isLogin || auto,
      }),
    });

    const data = await res.json();

    if (data.error) {
      if (auto) {
        logout();
      } else {
        setMsg(data.error);
      }
      setLoading(false);
      return;
    }

    const normalizedId = data.userId.toLowerCase();

    setUserId(normalizedId);
    setPassword(pass);
    setIsLoggedIn(true);

    localStorage.setItem('recovery_user_id', normalizedId);
    localStorage.setItem('recovery_password', pass);

    await loadProgress(normalizedId);
    setLoading(false);
  }

  async function loadProgress(id: string) {
    const res = await fetch(`/api/checkin?code=${id}`);
    const data = await res.json();
    setProgress(data);
  }

  function logout() {
    localStorage.clear();
    setIsLoggedIn(false);
    setUserId('');
    setPassword('');
    setProgress(null);
    setMsg('');
    setLoading(false);
  }

  const journeyNodes = useMemo(() => {
    const levelDay = progress?.levelDay || 0;

    return [
      {
        day: 1,
        label: 'Step 1',
        active: levelDay >= 1,
        special: '',
      },
      {
        day: 2,
        label: 'Step 2',
        active: levelDay >= 2,
        special: '',
      },
      {
        day: 3,
        label: 'Checkpoint',
        active: levelDay >= 3,
        special: 'Freeze +1',
      },
      {
        day: 4,
        label: 'Step 4',
        active: levelDay >= 4,
        special: '',
      },
      {
        day: 5,
        label: 'Step 5',
        active: levelDay >= 5,
        special: '',
      },
      {
        day: 6,
        label: 'Step 6',
        active: levelDay >= 6,
        special: '',
      },
      {
        day: 7,
        label: 'Shrine',
        active: levelDay >= 7,
        special: 'Healing',
      },
    ];
  }, [progress]);

  if (loading) {
    return (
      <main className="min-h-screen bg-gradient-to-b from-[#E7F4F7] to-[#F7FAFC] flex items-center justify-center p-6">
        <div className="bg-white rounded-[32px] px-8 py-10 shadow-lg border border-slate-100 text-center space-y-4 w-full max-w-sm">
          <div className="w-16 h-16 rounded-3xl bg-amber-400 text-white flex items-center justify-center mx-auto">
            <Mountain size={30} />
          </div>
          <div>
            <h1 className="text-2xl font-black text-slate-900">Loading your journey</h1>
            <p className="text-sm text-slate-500 mt-2">Please wait a moment...</p>
          </div>
        </div>
      </main>
    );
  }

  if (!isLoggedIn) {
    return (
      <main className="min-h-screen bg-gradient-to-b from-[#DDF0F4] via-[#EEF8FA] to-[#FAF8F1] flex items-center justify-center p-4">
        <div className="w-full max-w-md space-y-6">
          <div className="text-center space-y-4">
            <div className="w-20 h-20 bg-amber-400 rounded-[28px] mx-auto flex items-center justify-center shadow-xl text-white">
              <Mountain size={40} />
            </div>

            <div className="space-y-2">
              <h1 className="text-4xl font-black text-slate-900 leading-tight">
                Welcome to Your Sankalpa Journey
              </h1>
              <p className="text-slate-600 text-base">
                Build strength one honest day at a time.
              </p>
            </div>
          </div>

          <div className="bg-white rounded-[32px] shadow-sm border border-slate-100 p-8 space-y-5">
            <div className="space-y-4">
              <div className="relative">
                <span className="absolute left-4 top-4 text-slate-300">
                  <User size={20} />
                </span>
                <input
                  value={userId}
                  onChange={(e) => setUserId(e.target.value.toLowerCase())}
                  placeholder="Anonymous ID"
                  className="w-full bg-slate-50 border border-slate-100 p-4 pl-11 rounded-2xl font-semibold text-slate-900 outline-none focus:bg-white focus:border-amber-300"
                />
              </div>

              <div className="relative">
                <span className="absolute left-4 top-4 text-slate-300">
                  <Lock size={20} />
                </span>
                <input
                  value={password}
                  type="password"
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Anonymous Password"
                  className="w-full bg-slate-50 border border-slate-100 p-4 pl-11 rounded-2xl font-semibold text-slate-900 outline-none focus:bg-white focus:border-amber-300"
                />
              </div>

              <button
                onClick={() => handleAuth(userId, password)}
                className="w-full bg-gradient-to-r from-amber-400 to-orange-400 hover:from-amber-500 hover:to-orange-500 text-white py-4 rounded-2xl font-bold text-lg shadow-lg transition-all"
              >
                {isLogin ? 'Login to Journey' : 'Create Anonymous Account'}
              </button>

              <button
                onClick={() => {
                  setIsLogin(!isLogin);
                  setMsg('');
                }}
                className="w-full text-xs font-bold text-slate-500 uppercase tracking-widest hover:text-slate-700 transition-colors"
              >
                {isLogin
                  ? "Don't have an ID? Create one"
                  : 'Already have an ID? Login'}
              </button>
            </div>

            <div className="bg-amber-50 border border-amber-100 rounded-2xl p-4 text-center">
              <p className="text-xs text-amber-800 font-semibold leading-relaxed">
                Your ID stays anonymous. Save your password carefully because recovery is not available yet.
              </p>
            </div>
          </div>

          {msg && (
            <div className="bg-rose-50 border border-rose-100 rounded-2xl p-4 text-center text-sm font-semibold text-rose-600">
              {msg}
            </div>
          )}
        </div>
      </main>
    );
  }

  const level = progress?.level || 1;
  const levelDay = progress?.levelDay || 0;
  const streak = progress?.streak || 0;
  const freezes = progress?.freezes || 0;
  const avatarStage = progress?.avatarStage || 'drowsy';
  const totalSteps = progress?.totalSteps || 0;
  const shrineVisits = progress?.shrineVisits || 0;
  const completedJourney = progress?.completedJourney || false;
  const latestJournal = progress?.diaryEntries?.length
    ? [...progress.diaryEntries].sort((a, b) => b.date.localeCompare(a.date))[0]
    : null;

  return (
    <main className="min-h-screen bg-gradient-to-b from-[#DDEFF3] via-[#EEF8FB] to-[#FFF8EB] p-4 py-8">
      <div className="max-w-md mx-auto space-y-6">
        <div className="bg-white/80 backdrop-blur rounded-[32px] border border-white shadow-md p-5 flex items-center justify-between">
          <div>
            <p className="text-[11px] font-bold uppercase tracking-[0.25em] text-slate-400">
              Pilgrim
            </p>
            <h2 className="text-xl font-black text-slate-900">@{userId}</h2>
          </div>

          <button
            onClick={logout}
            className="w-11 h-11 rounded-2xl bg-slate-100 hover:bg-slate-200 transition-colors flex items-center justify-center text-slate-500"
          >
            <LogOut size={18} />
          </button>
        </div>

        <div className="bg-gradient-to-b from-[#F9F6EA] to-white rounded-[36px] border border-amber-100 shadow-lg p-6 space-y-5">
          <div className="text-center space-y-2">
            <p className="text-xs font-bold uppercase tracking-[0.25em] text-amber-700">
              {levelTitles[level]}
            </p>
            <h1 className="text-3xl font-black text-slate-900">
              {levelDay} Day{levelDay === 1 ? '' : 's'} Resisted
            </h1>
            <p className="text-slate-600">
              One day of honesty moves you one step forward.
            </p>
          </div>

          <div className="bg-[#FFF9EC] border border-amber-100 rounded-[28px] p-5 text-center space-y-3">
            <div className="text-6xl">{getAvatarEmoji(avatarStage)}</div>
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.2em] text-slate-400">
                Avatar state
              </p>
              <p className="text-lg font-black text-slate-900 capitalize">
                {avatarStage}
              </p>
            </div>

            <div className="grid grid-cols-3 gap-3 text-center">
              <div className="bg-white rounded-2xl p-3 border border-slate-100">
                <div className="flex justify-center mb-2 text-orange-500">
                  <Flame size={18} />
                </div>
                <p className="text-xl font-black text-slate-900">{streak}</p>
                <p className="text-[10px] uppercase tracking-widest text-slate-400 font-bold">
                  Streak
                </p>
              </div>

              <div className="bg-white rounded-2xl p-3 border border-slate-100">
                <div className="flex justify-center mb-2 text-cyan-500">
                  <Snowflake size={18} />
                </div>
                <p className="text-xl font-black text-slate-900">{freezes}</p>
                <p className="text-[10px] uppercase tracking-widest text-slate-400 font-bold">
                  Freeze
                </p>
              </div>

              <div className="bg-white rounded-2xl p-3 border border-slate-100">
                <div className="flex justify-center mb-2 text-amber-500">
                  <Trophy size={18} />
                </div>
                <p className="text-xl font-black text-slate-900">{shrineVisits}</p>
                <p className="text-[10px] uppercase tracking-widest text-slate-400 font-bold">
                  Shrines
                </p>
              </div>
            </div>
          </div>

          <Link href="/checkin" className="block">
            <button className="w-full bg-gradient-to-r from-amber-400 to-orange-400 hover:from-amber-500 hover:to-orange-500 text-white py-4 rounded-2xl font-bold text-lg shadow-lg transition-all flex items-center justify-center gap-2">
              Did you stay strong today?
              <ChevronRight size={20} />
            </button>
          </Link>
        </div>

        <div className="bg-white rounded-[32px] border border-slate-100 shadow-sm p-5 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-black text-slate-900">Journey Path</h3>
            <span className="text-xs font-bold uppercase tracking-widest text-slate-400">
              Day {levelDay}/7
            </span>
          </div>

          <div className="space-y-3">
            {journeyNodes.map((node) => (
              <div
                key={node.day}
                className={`rounded-2xl border p-4 flex items-center justify-between ${
                  node.active
                    ? 'bg-emerald-50 border-emerald-100'
                    : 'bg-slate-50 border-slate-100'
                }`}
              >
                <div>
                  <p
                    className={`font-bold ${
                      node.active ? 'text-emerald-700' : 'text-slate-500'
                    }`}
                  >
                    {node.label}
                  </p>
                  {node.special && (
                    <p className="text-xs text-slate-500 mt-1">{node.special}</p>
                  )}
                </div>

                <div
                  className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-black ${
                    node.active
                      ? 'bg-emerald-500 text-white'
                      : 'bg-slate-200 text-slate-500'
                  }`}
                >
                  {node.day}
                </div>
              </div>
            ))}
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="bg-slate-50 border border-slate-100 rounded-2xl p-4">
              <p className="text-[10px] uppercase tracking-widest text-slate-400 font-bold mb-1">
                Checkpoint
              </p>
              <p className="font-bold text-slate-900">
                {progress?.checkpointReached ? 'Unlocked' : 'Pending'}
              </p>
              <p className="text-xs text-slate-500 mt-1">Day 3 gives 1 freeze point.</p>
            </div>

            <div className="bg-slate-50 border border-slate-100 rounded-2xl p-4">
              <p className="text-[10px] uppercase tracking-widest text-slate-400 font-bold mb-1">
                Shrine
              </p>
              <p className="font-bold text-slate-900">
                {progress?.shrineReached ? 'Reached' : 'Ahead'}
              </p>
              <p className="text-xs text-slate-500 mt-1">Day 7 heals the avatar further.</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-[32px] border border-slate-100 shadow-sm p-5 space-y-4">
          <div className="flex items-center gap-2">
            <Sparkles size={18} className="text-amber-500" />
            <h3 className="text-lg font-black text-slate-900">Progress Snapshot</h3>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="bg-[#F9FAFB] rounded-2xl p-4 border border-slate-100">
              <p className="text-[10px] uppercase tracking-widest text-slate-400 font-bold">
                Current level
              </p>
              <p className="text-lg font-black text-slate-900 mt-1">{level}</p>
            </div>

            <div className="bg-[#F9FAFB] rounded-2xl p-4 border border-slate-100">
              <p className="text-[10px] uppercase tracking-widest text-slate-400 font-bold">
                Total strong days
              </p>
              <p className="text-lg font-black text-slate-900 mt-1">{totalSteps}</p>
            </div>
          </div>

          {completedJourney && (
            <div className="bg-emerald-50 border border-emerald-100 rounded-2xl p-4">
              <p className="font-bold text-emerald-700">
                You completed Level 2. Your avatar is now mentally and physically restored.
              </p>
            </div>
          )}

          {latestJournal && (
            <div className="bg-[#FFF9EC] border border-amber-100 rounded-2xl p-4">
              <p className="text-[10px] uppercase tracking-widest text-slate-400 font-bold mb-2">
                Latest reflection
              </p>
              <p className="text-sm font-semibold text-slate-700">
                {latestJournal.notes || 'A quiet but honest day.'}
              </p>
            </div>
          )}
        </div>
      </div>
    </main>
  );
}
