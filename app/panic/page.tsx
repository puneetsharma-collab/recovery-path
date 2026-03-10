'use client';

import { useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import {
  ArrowLeft,
  Wind,
  TimerReset,
  HeartHandshake,
  Shield,
} from 'lucide-react';

const TOTAL_TIME = 180;

type BreathPhase = 'Get Ready' | 'Breathe In' | 'Hold' | 'Breathe Out' | 'Finished';

const rescueLines = [
  'This urge is a wave, not a command.',
  'You do not need to obey this feeling.',
  'Delay, breathe, and let the peak pass.',
  'The body can be loud while the mind stays steady.',
];

export default function PanicPage() {
  const [isAuthorized, setIsAuthorized] = useState(false);
  const [phase, setPhase] = useState<BreathPhase>('Get Ready');
  const [phaseSeconds, setPhaseSeconds] = useState(3);
  const [isActive, setIsActive] = useState(false);
  const [timeLeft, setTimeLeft] = useState(TOTAL_TIME);
  const [isFinished, setIsFinished] = useState(false);
  const [lineIndex, setLineIndex] = useState(0);

  useEffect(() => {
    const savedId = localStorage.getItem('recovery_user_id');
    const savedPass = localStorage.getItem('recovery_password');

    if (savedId && savedPass) {
      setIsAuthorized(true);
    } else {
      window.location.href = '/';
    }
  }, []);

  useEffect(() => {
    if (!isActive || isFinished) return;

    const interval = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          setIsFinished(true);
          setPhase('Finished');
          setPhaseSeconds(0);
          return 0;
        }
        return prev - 1;
      });

      setPhaseSeconds((prev) => {
        if (prev > 1) return prev - 1;

        if (phase === 'Get Ready' || phase === 'Breathe Out') {
          setPhase('Breathe In');
          return 4;
        }

        if (phase === 'Breathe In') {
          setPhase('Hold');
          return 2;
        }

        if (phase === 'Hold') {
          setPhase('Breathe Out');
          return 6;
        }

        return prev;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [isActive, phase, isFinished]);

  useEffect(() => {
    if (!isActive || isFinished) return;

    const quoteInterval = setInterval(() => {
      setLineIndex((prev) => (prev + 1) % rescueLines.length);
    }, 6000);

    return () => clearInterval(quoteInterval);
  }, [isActive, isFinished]);

  const progress = useMemo(() => {
    return ((TOTAL_TIME - timeLeft) / TOTAL_TIME) * 100;
  }, [timeLeft]);

  function formatTime(seconds: number) {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  }

  function resetSession() {
    setPhase('Get Ready');
    setPhaseSeconds(3);
    setIsActive(false);
    setTimeLeft(TOTAL_TIME);
    setIsFinished(false);
    setLineIndex(0);
  }

  if (!isAuthorized) return null;

  return (
    <main className="min-h-screen bg-gradient-to-b from-[#FFEEDB] via-[#FFF7EC] to-[#EEF9FB] p-4 py-8">
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
              Urge rescue
            </p>
            <p className="text-sm font-black text-slate-900">
              Stay here until the wave drops
            </p>
          </div>
        </div>

        <div className="bg-white/85 backdrop-blur rounded-[36px] border border-white shadow-xl p-6 space-y-6">
          <div className="text-center space-y-3">
            <div className="w-20 h-20 rounded-3xl bg-orange-100 text-orange-500 flex items-center justify-center mx-auto shadow-sm">
              <Wind size={34} />
            </div>

            <p className="text-xs font-bold uppercase tracking-[0.3em] text-orange-600">
              Emergency support
            </p>

            <h1 className="text-3xl font-black text-slate-900">
              Ride the urge, don’t act on it
            </h1>

            <p className="text-slate-600">
              Breathe with the timer and let your nervous system settle before you decide anything.
            </p>
          </div>

          <div className="bg-[#FFF8EE] border border-orange-100 rounded-[28px] p-5 space-y-5">
            <div className="w-full bg-orange-100 rounded-full h-3 overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-orange-400 to-amber-400 transition-all duration-1000"
                style={{ width: `${progress}%` }}
              />
            </div>

            <div className="text-center space-y-2">
              <p className="text-[10px] uppercase tracking-[0.3em] font-bold text-slate-400">
                Current phase
              </p>
              <h2 className="text-2xl font-black text-slate-900">
                {isFinished ? 'Completed' : isActive ? phase : 'Ready'}
              </h2>
              <div className="text-7xl font-black text-orange-500 tabular-nums">
                {isFinished ? '✓' : isActive ? phaseSeconds : '—'}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="bg-white border border-slate-100 rounded-2xl p-4 text-center">
                <p className="text-[10px] uppercase tracking-widest text-slate-400 font-bold">
                  Session time
                </p>
                <p className="text-2xl font-black text-slate-900 mt-1">
                  {formatTime(timeLeft)}
                </p>
              </div>

              <div className="bg-white border border-slate-100 rounded-2xl p-4 text-center">
                <p className="text-[10px] uppercase tracking-widest text-slate-400 font-bold">
                  Pattern
                </p>
                <p className="text-2xl font-black text-slate-900 mt-1">
                  4-2-6
                </p>
              </div>
            </div>

            <div className="bg-white border border-slate-100 rounded-2xl p-4 text-center min-h-[88px] flex items-center justify-center">
              <p className="text-sm font-semibold text-slate-700">
                {isFinished
                  ? 'Good. The wave passed without control over you.'
                  : rescueLines[lineIndex]}
              </p>
            </div>
          </div>

          <div className="space-y-3">
            {!isActive && !isFinished && (
              <button
                onClick={() => setIsActive(true)}
                className="w-full bg-gradient-to-r from-orange-400 to-amber-400 hover:from-orange-500 hover:to-amber-500 text-white py-5 rounded-[24px] font-black text-lg shadow-lg transition-all"
              >
                Start Urge Rescue
              </button>
            )}

            {isActive && !isFinished && (
              <button
                onClick={resetSession}
                className="w-full bg-slate-100 hover:bg-slate-200 text-slate-700 py-5 rounded-[24px] font-bold text-lg transition-all flex items-center justify-center gap-2"
              >
                <TimerReset size={20} />
                Restart Timer
              </button>
            )}

            {isFinished && (
              <div className="space-y-3">
                <Link href="/" className="block">
                  <button className="w-full bg-emerald-500 hover:bg-emerald-600 text-white py-5 rounded-[24px] font-black text-lg shadow-lg transition-all">
                    Return to Journey
                  </button>
                </Link>

                <button
                  onClick={resetSession}
                  className="w-full bg-slate-100 hover:bg-slate-200 text-slate-700 py-5 rounded-[24px] font-bold text-lg transition-all"
                >
                  Do Another Round
                </button>
              </div>
            )}
          </div>
        </div>

        <div className="grid grid-cols-3 gap-3">
          <div className="bg-white border border-slate-100 rounded-2xl p-4 text-center">
            <div className="flex justify-center mb-2 text-orange-500">
              <Shield size={18} />
            </div>
            <p className="text-xs font-bold text-slate-700 leading-snug">
              Delay action
            </p>
          </div>

          <div className="bg-white border border-slate-100 rounded-2xl p-4 text-center">
            <div className="flex justify-center mb-2 text-cyan-500">
              <Wind size={18} />
            </div>
            <p className="text-xs font-bold text-slate-700 leading-snug">
              Slow the body
            </p>
          </div>

          <div className="bg-white border border-slate-100 rounded-2xl p-4 text-center">
            <div className="flex justify-center mb-2 text-emerald-500">
              <HeartHandshake size={18} />
            </div>
            <p className="text-xs font-bold text-slate-700 leading-snug">
              Choose again
            </p>
          </div>
        </div>
      </div>
    </main>
  );
}
