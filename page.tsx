export default function Home() {
  return (
    <main className="min-h-screen bg-gradient-to-br from-sky-50 via-emerald-50 to-white flex items-center justify-center p-4">
      <div className="max-w-2xl w-full bg-white/80 backdrop-blur-xl rounded-3xl shadow-2xl p-8 md:p-12 text-center space-y-8">

        <div className="space-y-2">
          <h1 className="text-4xl md:text-5xl font-extrabold text-slate-800 tracking-tight">
            Recovery Path
          </h1>
          <p className="text-slate-600 text-lg">
            Anonymous AI support for breaking compulsive habits and reclaiming control.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Feature
            title="100% Anonymous"
            text="No names. No emails. No accounts. Your device is your identity."
          />
          <Feature
            title="AI Support"
            text="Instant calming guidance during urges and emotional stress."
          />
          <Feature
            title="Daily Progress"
            text="Streak tracking, motivation, and accountability — privately."
          />
        </div>

        <div className="bg-gradient-to-r from-sky-100 to-emerald-100 p-4 rounded-xl italic text-slate-700">
          “Progress, not perfection.”
        </div>

        <div className="flex flex-col md:flex-row gap-4 justify-center">
          <a
            href="/chat"
            className="bg-sky-600 hover:bg-sky-700 transition text-white px-8 py-4 rounded-xl font-semibold text-lg shadow-lg"
          >
            Talk to AI Coach →
          </a>

          <a
            href="/checkin"
            className="border border-sky-600 text-sky-700 hover:bg-sky-50 transition px-8 py-4 rounded-xl font-semibold text-lg"
          >
            Daily Check-in
          </a>
        </div>

        <div className="text-xs text-slate-500">
          Designed for complete privacy. No tracking. No data selling. No judgment.
        </div>

      </div>
    </main>
  );
}

function Feature({ title, text }: { title: string; text: string }) {
  return (
    <div className="bg-white rounded-xl p-4 shadow-sm border border-slate-100">
      <h3 className="font-semibold text-slate-800 mb-1">{title}</h3>
      <p className="text-sm text-slate-600">{text}</p>
    </div>
  );
}