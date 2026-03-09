'use client';
import { useState, useEffect } from 'react';

const MOTIVATION = [
  "One day at a time. You're doing amazing! ✨",
  "Every moment is a fresh start. Proud of you. 💙",
  "Your future self is thanking you right now. 🏃‍♂️",
  "Strength doesn't come from what you can do; it comes from overcoming things you once thought you couldn't. 💪",
  "Progress, not perfection. Keep walking the path. 🌱"
];

interface DiaryEntry {
  date: string;
  urgeLevel: number;
  notes: string;
}

export default function Checkin() {
  const [userId, setUserId] = useState('');
  const [password, setPassword] = useState('');
  const [isLogin, setIsLogin] = useState(false);
  const [checkins, setCheckins] = useState<string[]>([]);
  const [slips, setSlips] = useState<string[]>([]);
  const [freezesUsed, setFreezesUsed] = useState<string[]>([]);
  const [diaryEntries, setDiaryEntries] = useState<DiaryEntry[]>([]);
  const [streak, setStreak] = useState(0);
  const [freezes, setFreezes] = useState(0);
  const [msg, setMsg] = useState('');
  const [quote, setQuote] = useState('');
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [showDiaryForm, setShowDiaryForm] = useState(false);
  const [urgeLevel, setUrgeLevel] = useState(5);
  const [diaryNotes, setDiaryNotes] = useState('');
  const [activeTab, setActiveTab] = useState<'checkin' | 'report'>('checkin');

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
    setFreezesUsed(data.freezesUsed || []);
    setDiaryEntries(data.diaryEntries || []);
    setStreak(data.streak || 0);
    setFreezes(data.freezes || 0);
  }

  async function doCheckin(action: 'strong' | 'slip') {
    if (action === 'strong') {
      setShowDiaryForm(true);
      return;
    }
    
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
      setFreezesUsed(data.freezesUsed || []);
      setDiaryEntries(data.diaryEntries || []);
      setStreak(data.streak || 0);
      setFreezes(data.freezes || 0);
      const usedFreezes = (data.freezesUsed || []).length;
      const earnedFreezes = data.freezes || 0;
      if (usedFreezes < earnedFreezes) {
        setMsg("You used a freeze! Your streak is safe. 🛡️");
        setQuote("Your consistency has rewards. Keep pushing!");
      } else {
        setMsg("It's okay. Tomorrow is a new start. 🫂");
        setQuote("Failure is just a bruise, not a tattoo. Rest, and restart.");
      }
    }
  }

  async function submitDiary() {
    const res = await fetch('/api/checkin', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ code: userId, action: 'strong', urgeLevel, notes: diaryNotes })
    });
    const data = await res.json();
    if (data.error) {
      setMsg(data.error);
    } else {
      setCheckins(data.checkins || []);
      setSlips(data.slips || []);
      setFreezesUsed(data.freezesUsed || []);
      setDiaryEntries(data.diaryEntries || []);
      setStreak(data.streak || 0);
      setFreezes(data.freezes || 0);
      setMsg('Success saved! 💙');
      setQuote(MOTIVATION[Math.floor(Math.random() * MOTIVATION.length)]);
      setShowDiaryForm(false);
      setUrgeLevel(5);
      setDiaryNotes('');
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

          {/* TAB NAVIGATION */}
          <div className="flex gap-2 bg-slate-100 p-2 rounded-2xl">
            <button 
              onClick={() => setActiveTab('checkin')}
              className={`flex-1 py-3 rounded-xl font-bold transition-all ${activeTab === 'checkin' ? 'bg-white text-slate-900 shadow-md' : 'text-slate-500'}`}
            >
              Check-in
            </button>
            <button 
              onClick={() => setActiveTab('report')}
              className={`flex-1 py-3 rounded-xl font-bold transition-all ${activeTab === 'report' ? 'bg-white text-slate-900 shadow-md' : 'text-slate-500'}`}
            >
              Report
            </button>
          </div>

          {activeTab === 'checkin' ? (
            <>
          <div className="space-y-4">
            <button onClick={() => doCheckin('strong')} className="w-full bg-emerald-500 hover:bg-emerald-600 text-white py-6 rounded-3xl font-black text-2xl shadow-xl shadow-emerald-100 active:scale-95 transition-all">
              I Stayed Strong!
            </button>

            <button onClick={() => doCheckin('slip')} className="w-full bg-rose-50 border-2 border-rose-100 text-rose-600 py-4 rounded-3xl font-bold active:scale-95 transition-all">
              I Slipped / I'm Struggling
            </button>
          </div>

          <div className="bg-slate-50 p-6 rounded-[32px] space-y-3">
            <div className="flex justify-between items-center">
              <span className="font-bold text-slate-400 uppercase tracking-widest text-xs">Streak</span>
              <span className="font-black text-4xl text-slate-900">{streak} Days</span>
            </div>
            <div className="border-t border-slate-200 pt-3 flex justify-between items-center">
              <span className="font-bold text-slate-400 uppercase tracking-widest text-xs">Freezes</span>
              <div className="flex gap-2">
                {[...Array(freezes)].map((_, i) => {
                  const used = freezesUsed.length > i;
                  return (
                    <div key={i} className={`text-2xl ${used ? 'opacity-40' : ''}`}>
                      ❄️
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* CALENDAR SECTION */}
          <div className="space-y-4">
            <h3 className="text-sm font-bold text-slate-400 uppercase tracking-[0.2em]">Activity Map</h3>
            <h4 className="text-lg font-black text-slate-900">{new Date(year, month).toLocaleString('default', { month: 'long', year: 'numeric' })}</h4>
            <div className="grid grid-cols-7 gap-2">
              {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((d, i) => (
                <div key={i} className="text-[10px] font-black text-slate-300">{d.charAt(0)}</div>
              ))}
              {calendarDays.map((day, i) => {
                if (!day) return <div key={`empty-${i}`} />;
                const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
                const isStrong = checkins.includes(dateStr);
                const isSlip = slips.includes(dateStr);
                const isFrozen = freezesUsed.includes(dateStr);
                
                let bgColor = 'bg-slate-100';
                let icon = '';
                if (isStrong) {
                  bgColor = 'bg-emerald-500 text-white';
                  icon = '✓';
                } else if (isFrozen) {
                  bgColor = 'bg-blue-400 text-white';
                  icon = '❄️';
                } else if (isSlip) {
                  bgColor = 'bg-rose-500 text-white';
                  icon = '✗';
                }

                return (
                  <div key={day} className={`aspect-square flex flex-col items-center justify-center rounded-xl text-xs font-bold ${bgColor}`}>
                    <div>{day}</div>
                    {icon && <div className="text-xs">{icon}</div>}
                  </div>
                );
              })}
            </div>
          </div>

          {/* FREEZE INFO SECTION */}
          <div className="bg-gradient-to-br from-blue-50 to-cyan-50 p-5 rounded-3xl border border-blue-200 space-y-3">
            <h4 className="font-black text-slate-900 text-sm">❄️ How Freezes Work</h4>
            <ul className="text-xs text-slate-700 space-y-2">
              <li><strong>3 days streak:</strong> Earn 1 freeze</li>
              <li><strong>6 days streak:</strong> Earn 2 freezes (maximum)</li>
              <li><strong>Miss a day?</strong> Freeze is used automatically, streak stays safe</li>
              <li><strong>No freezes left?</strong> Streak resets, but you can rebuild it</li>
            </ul>
          </div>

          {quote && (
            <div className="p-6 bg-blue-50 rounded-3xl border border-blue-100 animate-in zoom-in duration-500">
              <p className="text-blue-800 font-medium italic">"{quote}"</p>
            </div>
          )}
            </>
          ) : (
            <>
              {/* REPORT TAB */}
              <div className="space-y-4 text-left">
                <div className="bg-gradient-to-br from-emerald-50 to-teal-50 p-5 rounded-3xl border border-emerald-200 space-y-2">
                  <p className="text-xs font-bold text-slate-500 uppercase tracking-widest">Total Check-ins</p>
                  <p className="text-4xl font-black text-emerald-600">{checkins.length}</p>
                </div>
                
                <div className="bg-gradient-to-br from-blue-50 to-indigo-50 p-5 rounded-3xl border border-blue-200 space-y-2">
                  <p className="text-xs font-bold text-slate-500 uppercase tracking-widest">Current Streak</p>
                  <p className="text-4xl font-black text-blue-600">{streak} Days</p>
                </div>

                <div className="bg-gradient-to-br from-rose-50 to-pink-50 p-5 rounded-3xl border border-rose-200 space-y-2">
                  <p className="text-xs font-bold text-slate-500 uppercase tracking-widest">Slips</p>
                  <p className="text-4xl font-black text-rose-600">{slips.length}</p>
                </div>

                <div className="bg-gradient-to-br from-purple-50 to-violet-50 p-5 rounded-3xl border border-purple-200 space-y-3">
                  <p className="text-xs font-bold text-slate-500 uppercase tracking-widest">Average Urge Level</p>
                  <div className="space-y-2">
                    {diaryEntries.length > 0 ? (
                      <>
                        <p className="text-4xl font-black text-purple-600">{(diaryEntries.reduce((sum, entry) => sum + entry.urgeLevel, 0) / diaryEntries.length).toFixed(1)}/10</p>
                        <p className="text-xs text-slate-600">From {diaryEntries.length} entries</p>
                      </>
                    ) : (
                      <p className="text-sm text-slate-500">No diary entries yet</p>
                    )}
                  </div>
                </div>

                {diaryEntries.length > 0 && (
                  <div className="space-y-3 max-h-64 overflow-y-auto">
                    <p className="text-xs font-bold text-slate-500 uppercase tracking-widest">Recent Entries</p>
                    {[...diaryEntries].reverse().slice(0, 5).map((entry, idx) => (
                      <div key={idx} className="bg-slate-50 p-4 rounded-2xl border border-slate-200 space-y-2">
                        <div className="flex justify-between items-center">
                          <p className="text-xs font-bold text-slate-400">{new Date(entry.date).toLocaleDateString()}</p>
                          <p className="text-sm font-bold text-slate-600">Urge: {entry.urgeLevel}/10</p>
                        </div>
                        {entry.notes && <p className="text-sm text-slate-700">{entry.notes}</p>}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </>
          )}

          <button onClick={logout} className="text-slate-300 text-[10px] font-bold uppercase tracking-[0.2em] hover:text-red-400">Logout</button>
        </div>

        {/* DIARY FORM MODAL */}
        {showDiaryForm && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-[40px] shadow-2xl p-10 max-w-md w-full space-y-6">
              <h2 className="text-2xl font-black text-slate-900">Daily Diary</h2>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-bold text-slate-600 mb-3">How strong was your urge to relapse? (0-10)</label>
                  <div className="flex items-center gap-4">
                    <input 
                      type="range" 
                      min="0" 
                      max="10" 
                      value={urgeLevel}
                      onChange={(e) => setUrgeLevel(parseInt(e.target.value))}
                      className="flex-1 h-3 bg-slate-200 rounded-lg appearance-none cursor-pointer"
                    />
                    <div className="text-3xl font-black text-slate-900 w-12 text-center">{urgeLevel}</div>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-bold text-slate-600 mb-2">What are you feeling right now?</label>
                  <textarea 
                    value={diaryNotes}
                    onChange={(e) => setDiaryNotes(e.target.value)}
                    placeholder="Write your thoughts, feelings, and reflections..."
                    className="w-full bg-slate-50 border-2 border-slate-100 p-4 rounded-2xl font-medium text-slate-900 outline-none focus:border-blue-400 resize-none h-28"
                  />
                </div>
              </div>

              <div className="flex gap-3">
                <button 
                  onClick={() => {
                    setShowDiaryForm(false);
                    setUrgeLevel(5);
                    setDiaryNotes('');
                  }}
                  className="flex-1 bg-slate-100 text-slate-600 py-3 rounded-2xl font-bold hover:bg-slate-200 transition-all"
                >
                  Cancel
                </button>
                <button 
                  onClick={submitDiary}
                  className="flex-1 bg-emerald-500 hover:bg-emerald-600 text-white py-3 rounded-2xl font-bold shadow-lg transition-all"
                >
                  Save Entry
                </button>
              </div>
            </div>
          </div>
        )}
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
