'use client';

import { useState, useEffect } from 'react';

export default function Checkin() {
  const [code, setCode] = useState('');
  const [inputCode, setInputCode] = useState('');
  const [checkins, setCheckins] = useState<string[]>([]);
  const [msg, setMsg] = useState('');

  useEffect(() => {
    const saved = localStorage.getItem('my_code');
    if (saved) {
      setCode(saved);
      loadData(saved);
    }
  }, []);

  async function createCode() {
    const res = await fetch('/api/code', { method: 'POST' });
    const data = await res.json();
    setCode(data.code);
    localStorage.setItem('my_code', data.code);
    loadData(data.code);
    setMsg('Your anonymous code has been created. Save it somewhere safe.');
  }

  async function loadData(c: string) {
    const res = await fetch(`/api/checkin?code=${c}`);
    const data = await res.json();

    if (data.error) {
      setMsg('Invalid code. Please check and try again.');
      return;
    }

    setCheckins(data.checkins || []);
    setMsg('Progress loaded successfully.');
  }

  async function checkin() {
    if (!code) {
      setMsg('Please create or load a code first.');
      return;
    }

    const res = await fetch('/api/checkin', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ code })
    });

    const data = await res.json();
    setCheckins(data.checkins);
    setMsg('Daily check-in saved 💙');
  }

  return (
    <main className="min-h-screen bg-gradient-to-b from-sky-50 to-emerald-50 flex justify-center p-4">
      <div className="bg-white rounded-2xl shadow-xl p-6 max-w-md w-full space-y-5">

        <h1 className="text-2xl font-bold text-sky-700 text-center">
          Daily Check-in
        </h1>

        {/* Create New Code */}
        <button
          onClick={createCode}
          className="w-full bg-emerald-600 text-white py-3 rounded-xl font-semibold"
        >
          Create My 6-digit Code
        </button>

        {/* Enter Existing Code */}
        <div className="space-y-2">
          <input
            value={inputCode}
            onChange={(e) => setInputCode(e.target.value.replace(/\D/g, '').slice(0, 6))}
            placeholder="Enter your existing 6-digit code"
            className="w-full border p-3 rounded-lg text-center tracking-widest font-mono text-lg text-slate-800"
          />
          <button
            onClick={() => {
              setCode(inputCode);
              localStorage.setItem('my_code', inputCode);
              loadData(inputCode);
            }}
            className="w-full bg-sky-600 text-white py-2 rounded-lg font-semibold"
          >
            Load My Progress
          </button>
        </div>

        {/* Display Code */}
        {code && (
          <div className="bg-sky-100 p-4 rounded-xl text-center">
            <p className="text-sm text-slate-600">Your Anonymous Code</p>
            <p className="text-3xl font-mono tracking-widest text-slate-900">
              {code}
            </p>
          </div>
        )}

        {/* Check-in Button */}
        {code && (
          <button
            onClick={checkin}
            className="w-full bg-sky-700 text-white py-3 rounded-xl font-semibold"
          >
            Check In For Today
          </button>
        )}

        {/* Message */}
        {msg && (
          <div className="text-center text-sm text-slate-700 bg-slate-100 p-2 rounded-lg">
            {msg}
          </div>
        )}

        {/* Stats */}
        {code && (
          <div className="text-center text-sm text-slate-600">
            Total check-ins: <span className="font-semibold">{checkins.length}</span>
          </div>
        )}

        <div className="text-xs text-slate-500 text-center">
          No names • No emails • Fully anonymous
        </div>

      </div>
    </main>
  );
}
