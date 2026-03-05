import Link from 'next/link';

export default function Home() {
  return (
    <main className="min-h-screen bg-[radial-gradient(ellipse_at_top_left,_var(--tw-gradient-stops))] from-blue-100 via-emerald-50 to-white flex items-center justify-center p-4 py-20">

      <div className="max-w-2xl w-full space-y-12">

        {/* --- MAIN HERO CARD --- */}
        <div className="bg-white/60 backdrop-blur-2xl rounded-[40px] shadow-[0_32px_64px_-12px_rgba(0,0,0,0.1)] border border-white/40 p-10 md:p-16 text-center space-y-10">
          <div className="space-y-4">
            <div className="inline-block px-4 py-1.5 mb-2 text-xs font-bold uppercase tracking-widest text-emerald-700 bg-emerald-100 rounded-full">
              ✨ Your Private Space
            </div>
            <h1 className="text-5xl md:text-6xl font-black text-slate-900 tracking-tighter">
              Recovery <span className="text-blue-600">Path</span>
            </h1>
            <p className="text-slate-600 text-xl font-medium max-w-sm mx-auto">
              Break habits. Reclaim control.
            </p>
          </div>

          <div className="flex flex-col gap-4">
            <Link href="/checkin">
              <button className="w-full bg-slate-900 hover:bg-blue-600 transition-all text-white px-8 py-5 rounded-2xl font-bold text-xl shadow-2xl active:scale-95">
                Daily Check-in
              </button>
            </Link>

            <Link href="/test">
              <button className="w-full bg-white border-2 border-slate-200 text-slate-700 hover:border-blue-400 transition-all px-8 py-5 rounded-2xl font-bold text-xl active:scale-95">
                Take Dependency Test
              </button>
            </Link>

            {/* --- ADDED: EMERGENCY PANIC BUTTON --- */}
            <Link href="/panic">
              <button className="w-full mt-2 bg-rose-50 border-2 border-rose-200 text-rose-600 py-4 rounded-2xl font-black text-lg hover:bg-rose-100 transition-all flex items-center justify-center gap-2 active:scale-95">
                🚨 EMERGENCY: I need to calm down
              </button>
            </Link>
          </div>
        </div>

        {/* --- EDUCATION SECTION --- */}
        <div className="space-y-8 px-4">
          <div className="text-center">
            <h2 className="text-3xl font-extrabold text-slate-800">Why Recovery Path?</h2>
            <p className="text-slate-500 mt-2">Understanding the "Brain Itch"</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Education Card 1 */}
            <div className="bg-white p-8 rounded-[32px] shadow-sm border border-slate-100 space-y-4">
              <div className="w-12 h-12 bg-orange-100 rounded-2xl flex items-center justify-center text-2xl">⚡</div>
              <h3 className="font-bold text-slate-800 text-lg">The Dopamine Loop</h3>
              <p className="text-slate-500 text-sm leading-relaxed">
                Compulsive habits trick your brain into a "craving loop." We help you recognize the trigger before the loop starts.
              </p>
            </div>

            {/* Education Card 2 */}
            <div className="bg-white p-8 rounded-[32px] shadow-sm border border-slate-100 space-y-4">
              <div className="w-12 h-12 bg-blue-100 rounded-2xl flex items-center justify-center text-2xl">🧠</div>
              <h3 className="font-bold text-slate-800 text-lg">Brain Rewiring</h3>
              <p className="text-slate-500 text-sm leading-relaxed">
                Your brain is "plastic"—it can change! Every day you choose a different path, you are physically building a stronger mind.
              </p>
            </div>
          </div>

          {/* Large Education "Deep Dive" Box */}
          <div className="bg-emerald-900 text-emerald-50 rounded-[40px] p-10 space-y-6">
            <h3 className="text-2xl font-bold">The Need for Privacy</h3>
            <p className="opacity-80 text-lg leading-relaxed">
              Struggling with addiction often comes with <b>shame</b>. Shame thrives in secret, but heals in community and support.
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4">
              <div className="flex items-center gap-3">
                <div className="w-6 h-6 bg-emerald-500 rounded-full flex items-center justify-center text-[10px]">✓</div>
                <span className="text-sm font-medium">Zero Data Tracking</span>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-6 h-6 bg-emerald-500 rounded-full flex items-center justify-center text-[10px]">✓</div>
                <span className="text-sm font-medium">Device-Only Storage</span>
              </div>
            </div>
          </div>
        </div>

        {/* --- FOOTER --- */}
        <div className="text-center opacity-40 text-xs font-bold uppercase tracking-[0.3em] pb-10">
          Built for Freedom • 2026
        </div>

      </div>
    </main>
  );
}
