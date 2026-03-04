use client';

import { useState } from 'react';

export default function Chat() {
  const [text, setText] = useState('');
  const [messages, setMessages] = useState<string[]>([
    "You're safe here. What are you feeling right now?"
  ]);
  const [loading, setLoading] = useState(false);

  async function sendMessage() {
    if (!text.trim()) return;

    const userText = text.trim();
    setMessages(prev => [...prev, `You: ${userText}`]);
    setText('');
    setLoading(true);

    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: userText })
      });

      const data = await res.json();

      setMessages(prev => [
        ...prev,
        data.reply || "I'm here with you. Take a slow breath."
      ]);
    } catch (err) {
      setMessages(prev => [
        ...prev,
        "Something went wrong. You're not alone — try again."
      ]);
    }

    setLoading(false);
  }

  return (
    <main className="min-h-screen bg-gradient-to-b from-sky-50 to-emerald-50 p-4 flex justify-center">
      <div className="max-w-xl w-full bg-white rounded-2xl shadow-xl p-4 flex flex-col">

        <h2 className="text-xl font-bold text-sky-700 mb-1">
          Anonymous Support Chat
        </h2>

        <p className="text-sm text-slate-600 mb-3">
          No names. No judgment. Just support.
        </p>

        <div className="flex-1 overflow-y-auto space-y-3 mb-3">
          {messages.map((msg, i) => {
            const isUser = msg.startsWith('You:');
            return (
              <div
                key={i}
                className={`p-3 rounded-xl text-sm whitespace-pre-wrap text-slate-800 ${
                  isUser
                    ? 'bg-sky-100 self-end'
                    : 'bg-emerald-100 self-start'
                }`}
              >
                {msg}
              </div>
            );
          })}
        </div>

        <div className="flex gap-2">
          <textarea
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="Describe what you're feeling..."
            className="flex-1 border border-slate-300 rounded-lg p-2 text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-sky-400"
            rows={2}
          />

          <button
            onClick={sendMessage}
            disabled={loading}
            className="bg-sky-600 hover:bg-sky-700 transition text-white px-4 rounded-lg font-semibold"
          >
            {loading ? '...' : 'Send'}
          </button>
        </div>

      </div>
    </main>
  );
}
