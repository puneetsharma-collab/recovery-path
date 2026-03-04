'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';

export default function PanicPage() {
  // 1. Breathing States
  const [phase, setPhase] = useState('Get Ready');
  const [phaseSeconds, setPhaseSeconds] = useState(3);
  const [isActive, setIsActive] = useState(false);

  // 2. Total Timer States (3 Minutes = 180 Seconds)
  const TOTAL_TIME = 180;
  const [timeLeft, setTimeLeft] = useState(TOTAL_TIME);
  const [isFinished, setIsFinished] = useState(false);

  // Constants for the Progress Ring
  const radius = 150; 
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (timeLeft / TOTAL_TIME) * circumference;

  useEffect(() => {
    if (!isActive || isFinished) return;

    const interval = setInterval(() => {
      // Global Countdown
      setTimeLeft((prev) => {
        if (prev <= 1) {
          setIsFinished(true);
          return 0;
        }
        return prev - 1;
      });

      // Breathing Phase Logic
      setPhaseSeconds((prev) => {
        if (prev > 1) return prev - 1;

        // Switch Phases
        if (phase === 'Get Ready' || phase === 'Breathe Out') {
          setPhase('Breathe In');
          return 4; // Inhale for 4s
        } else if (phase === 'Breathe In') {
          setPhase('Hold');
          return 2; // Hold for 2s
        } else if (phase === 'Hold') {
          setPhase('Breathe Out');
          return 6; // Exhale for 6s
        }
        return prev;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [isActive, phase, isFinished]);

  // Format time for the display (e.g., 2:59)
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };

  return (
    <main className="min-h-screen bg-slate-950 text-white flex flex-col items-center justify-center p-6 overflow-hidden relative">

      <Link href="/" className="absolute top-10 left-10 text-slate-500 hover:text-white transition-colors z-50 font-bold">
        ✕ Exit Emergency Mode
      </Link>

      <div className="text-center space-y-12 max-w-md relative z-10">
        <div className="space-y-2">
          <h1 className="text-3xl font-black text-blue-400 tracking-tighter">Emergency Calm</h1>
          <p className="text-slate-500 text-sm font-medium">Just follow the rhythm. You are safe.</p>
        </div>

        {/* --- THE PROGRESS & BREATHING CONTAINER --- */}
        <div className="relative flex items-center justify-center w-80 h-80">

          {/* 1. The Total Progress Ring (SVG) */}
          <svg className="absolute w-full h-full -rotate-90 pointer-events-none">
            <circle
              cx="160"
              cy="160"
              r={radius}
              stroke="currentColor"
              strokeWidth="4"
              fill="transparent"
              className="text-slate-800"
            />
            <circle
              cx="160"
              cy="160"
              r={radius}
              stroke="currentColor"
              strokeWidth="4"
              fill="transparent"
              strokeDasharray={circumference}
              style={{ 
                strokeDashoffset: offset,
                transition: 'stroke-dashoffset 1s linear'
              }}
              strokeLinecap="round"
              className="text-blue-500 drop-shadow-[0_0_8px_rgba(59,130,246,0.5)]"
            />
          </svg>

          {/* 2. The Animated Breathing Circle */}
          <div 
            className={`rounded-full border-2 border-white/10 flex items-center justify-center transition-all duration-[4000ms] ease-in-out relative z-10
              ${!isActive ? 'w-32 h-32 bg-blue-600/10' : ''}
              ${phase === 'Breathe In' ? 'w-64 h-64 bg-blue-500/20' : ''}
              ${phase === 'Hold' ? 'w-64 h-64 bg-emerald-500/20 border-emerald-400/30' : ''}
              ${phase === 'Breathe Out' ? 'w-32 h-32 bg-blue-900/20' : ''}
            `}
          >
            <div className="text-center">
              <p className="text-3xl font-black text-white">{isFinished ? 'Done' : phase}</p>
              {isActive && !isFinished && (
                <p className="text-sm font-mono opacity-40 mt-1">{phaseSeconds}s</p>
              )}
            </div>
          </div>
        </div>

        {/* --- CONTROLS & INFO --- */}
        <div className="space-y-6">
          {!isActive ? (
            <button 
              onClick={() => setIsActive(true)}
              className="bg-blue-600 px-12 py-5 rounded-full font-black text-xl shadow-2xl shadow-blue-500/40 animate-bounce active:scale-95 transition-all"
            >
              Start 3-Min Session
            </button>
          ) : isFinished ? (
            <div className="space-y-4 animate-in fade-in zoom-in duration-700">
              <p className="text-emerald-400 font-bold text-xl">Well done. The urge has lost its power. 💙</p>
              <Link href="/">
                <button className="bg-white text-slate-900 px-8 py-3 rounded-2xl font-bold">Return Home</button>
              </Link>
            </div>
          ) : (
            <div className="space-y-2">
              <p className="text-2xl font-mono text-slate-300">{formatTime(timeLeft)}</p>
              <p className="text-slate-500 text-xs uppercase tracking-widest font-bold">Time Remaining</p>
            </div>
          )}
        </div>
      </div>

      {/* Subtle Background Glow */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-blue-900/10 via-transparent to-transparent pointer-events-none" />
    </main>
  );
}
