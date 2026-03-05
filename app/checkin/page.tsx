'use client';
import { useState, useEffect } from 'react';

const MOTIVATION = [
  "One day at a time. You're doing amazing! ✨",
  "Every moment is a fresh start. Proud of you. 💙",
  "Your future self is thanking you right now. 🏃‍♂️",
  "Strength doesn't come from what you can do; it comes from overcoming things you once thought you couldn't. 💪",
  "Progress, not perfection. Keep walking the path. 🌱"
];

export default function Checkin() {
  const [userId, setUserId] = useState('');
  const [password, setPassword] = useState('');
  const [isLogin, setIsLogin] = useState(false);
  const [checkins, setCheckins] = useState<string[]>([]);
  const [slips, setSlips] = useState<string[]>([]);
  const [msg, setMsg] = useState('');
  const [quote, setQuote] = useState('');
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    const savedId = localStorage.getItem('recovery_user_id');
    const savedPass = localStorage.getItem('recovery_password');
    if (savedId && savedPass) {
      handleAuth(savedId, savedPass, true);
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
      if (auto) logout();
    } else {
      setUserId(data.userId);
      setPassword(pass);
      setIsLoggedIn(true);
      localStorage.setItem('recovery_user_id', data.userId);
      localStorage.setItem('recovery_password', pass);
      loadData(data.userId);
    }
  }

  async function loadData(id: string) {
    const res = await fetch(`/api/checkin?code=${id}`);
    const data = await res.json();
    setCheckins(data.checkins || []);
    setSlips(data.slips || []);
  }

  async function doCheckin(action: 'strong' | 'slip') {
    const res = await fetch('/api/checkin', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ code: userId, action })
    });
    const data = await res.json();
    if (data.error) {
      setMsg(data.error);
    } else {
      setCheckins(data.checkins || []);
      setSlips(data.slips || []);
      if (action === 'strong') {
        setMsg('Success saved! 💙');
        setQuote(MOTIVATION[Math.floor(Math.random() * MOTIVATION.length)]);
      } else {
        setMsg("It's okay. Tomorrow is a new start. 🫂");
        setQuote("Failure is just a bruise, not a tattoo. Rest, and restart.");
      }
    }
  }

  function logout() {
    localStorage.clear();
    window.location.reload();
  }

  // Calendar Logic
  const today = new Date();
  const year = today.getFullYear();
  const month = today.getMonth();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const firstDay = new Date(year, month, 1).getDay();
  
  const calendarDays = [];
  for (let i = 0; i < firstDay; i++) calendarDays.push(null);
  for (let i = 1; i <= daysInMonth; i++) calendarDays.push(i);

  if (isLoggedIn) {
    return (
      <main className="min-h-screen bg-slate-50 flex justify-center p-4 py-12">
        <div className="bg-white rounded-[40px] shadow-2xl p-10 max-w-md w-full space-y-8 text-center border border-slate-100">
          <h1 className="text-3xl font-black text-slate-900">Path of @{userId}</h1>

          <div className="space-y-4">
            <button onClick={() => doCheckin('strong')} className="w-full bg-emerald-500 hover:bg-emerald-600 text-white py-6 rounded-3xl font-black text-2xl shadow-xl shadow-emerald-100 active:scale-95 transition-all">
              I Stayed Strong!
            </button>

            <button onClick={() => doCheckin('slip')} className="w-full bg-rose-50 border-2 border-rose-100 text-rose-600 py-4 rounded-3xl font-bold active:scale-95 transition-all">
              I Slipped / I'm Struggling
            </button>
          </div>

          <div className="bg-slate-50 p-6 rounded-[32px] flex justify-between items-center">
            <span className="font-bold text-slate-400 uppercase tracking-widest text-xs">Streak</span>
            <span className="font-black text-4xl text-slate-900">{checkins.length} Days</span>
          </div>

          {/* CALENDAR SECTION */}
          <div className="space-y-4">
            <h3 className="text-sm font-bold text-slate-400 uppercase tracking-[0.2em]">Activity Map</h3>
            <div className="grid grid-cols-7 gap-2">
              {['S', 'M', 'T', 'W', 'T', 'F', 'S'].map(d => (
                <div key={d} className="text-[10px] font-black text-slate-300">{d}</div>
              ))}
              {calendarDays.map((day, i) => {
                if (!day) return <div key={`empty-${i}`} />;
                const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
                const isStrong = checkins.includes(dateStr);
                const isSlip = slips.includes(dateStr);
                
                let bgColor = 'bg-slate-100';
                if (isStrong) bgColor = 'bg-emerald-500 text-white';
                if (isSlip) bgColor = 'bg-rose-500 text-white';

                return (
                  <div key={day} className={`aspect-square flex items-center justify-center rounded-xl text-xs font-bold ${bgColor}`}>
                    {day}
                  </div>
                );
              })}
            </div>
          </div>

          {quote && (
            <div className="p-6 bg-blue-50 rounded-3xl border border-blue-100 animate-in zoom-in duration-500">
              <p className="text-blue-800 font-medium italic">"{quote}"</p>
            </div>
          )}

          <button onClick={logout} className="text-slate-300 text-[10px] font-bold uppercase tracking-[0.2em] hover:text-red-400">Logout</button>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-gradient-to-b from-blue-100 to-white flex justify-center p-4 py-12">
      <div className="bg-white rounded-[40px] shadow-2xl p-10 max-w-md w-full space-y-6">
        <h1 className="text-center text-4xl font-black text-slate-900">{isLogin ? 'Welcome Back' : 'New Path'}</h1>
        <div className="space-y-4">
          <input
            placeholder="User ID"
            className="w-full bg-slate-50 border-2 border-slate-100 p-5 rounded-3xl font-bold text-slate-900 outline-none focus:border-blue-400"
            onChange={(e) => setUserId(e.target.value.toLowerCase())}
          />
          <input
            type="password"
            placeholder="Password"
            className="w-full bg-slate-50 border-2 border-slate-100 p-5 rounded-3xl font-bold text-slate-900 outline-none focus:border-blue-400"
            onChange={(e) => setPassword(e.target.value)}
          />
          <button onClick={() => handleAuth(userId, password)} className="w-full bg-blue-600 text-white py-5 rounded-3xl font-black text-xl shadow-lg">
            {isLogin ? 'Login' : 'Create Identity'}
          </button>
          <button onClick={() => setIsLogin(!isLogin)} className="w-full text-slate-400 font-bold text-sm">
            {isLogin ? "Create a new ID" : "Already have an ID?"}
          </button>
        </div>
        {msg && <div className="text-center text-sm font-bold text-blue-900 bg-blue-50 p-4 rounded-2xl">{msg}</div>}
      </div>
    </main>
  );
}
