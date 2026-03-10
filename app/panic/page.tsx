'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';

export default function PanicPage() {
  const [isAuthorized, setIsAuthorized] = useState(false);

  useEffect(() => {
    const savedId = localStorage.getItem('recovery_user_id');
    const savedPass = localStorage.getItem('recovery_password');
    if (savedId && savedPass) {
      setIsAuthorized(true);
    } else {
      window.location.href = '/';
    }
  }, []);

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

  if (!isAuthorized) {
    return (
      <main className="min-h-screen bg-slate-950 flex items-center justify-center p-4">
        <div className="animate-pulse flex flex-col items-center space-y-4">
          <div className="w-12 h-12 bg-blue-900 rounded-full"></div>
          <p className="text-blue-500 font-bold animate-bounce">Resuming Session...</p>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-rose-600 flex flex-col items-center justify-center p-6 overflow-hidden relative">
      {/* Background blobs for modern feel */}
      <div className="absolute top-0 left-0 w-64 h-64 bg-rose-500 rounded-full blur-[100px] -translate-x-1/2 -translate-y-1/2 opacity-50"></div>
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-rose-700 rounded-full blur-[120px] translate-x-1/2 translate-y-1/2 opacity-50"></div>

      <div className="max-w-md w-full bg-white/10 backdrop-blur-xl rounded-[40px] border border-white/20 p-8 md:p-12 text-center space-y-10 relative z-10 shadow-2xl animate-in fade-in zoom-in-95 duration-700">
        <div className="space-y-4">
          <div className="w-24 h-24 bg-white/20 rounded-full mx-auto flex items-center justify-center animate-pulse shadow-2xl shadow-rose-900/20">
            <span className="text-5xl">🧘</span>
          </div>
          <h1 className="text-3xl font-black text-white tracking-tight">Breathe.</h1>
          <p className="text-rose-100 font-medium leading-relaxed">
            This feeling is temporary. You have survived every urge you've ever had. You will survive this one too.
          </p>
        </div>

        <div className="space-y-6">
          <div className="space-y-3">
            <div className="text-[10px] font-bold text-rose-200 uppercase tracking-[0.3em]">Follow the count</div>
            <div className="text-8xl font-black text-white tabular-nums transition-all duration-1000">
              {isActive ? phaseSeconds : '—'}
            </div>
            <div className="text-xl font-bold text-rose-100 uppercase tracking-widest">
              {isActive ? phase : 'Ready?'}
            </div>
          </div>
        </div>

        <div className="pt-4 space-y-4">
          {!isActive ? (
            <button 
              onClick={() => setIsActive(true)}
              className="w-full bg-white text-rose-600 py-5 rounded-[24px] font-black text-lg shadow-xl hover:bg-rose-50 transition-all active:scale-[0.98]"
            >
              Start 3-Min Session
            </button>
          ) : isFinished ? (
            <div className="space-y-4 animate-in fade-in zoom-in duration-700">
              <p className="text-rose-100 font-bold">The wave has passed. 💙</p>
              <Link href="/">
                <button className="w-full bg-white text-rose-600 py-5 rounded-[24px] font-black text-lg shadow-xl hover:bg-rose-50 transition-all active:scale-[0.98]">
                  Return Home
                </button>
              </Link>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="text-2xl font-mono text-white opacity-80">{formatTime(timeLeft)}</div>
              <Link href="/">
                <button className="text-rose-200 text-xs font-bold uppercase tracking-widest hover:text-white transition-colors">
                  Exit Emergency Mode
                </button>
              </Link>
            </div>
          )}
        </div>
      </div>
    </main>
  );
}
