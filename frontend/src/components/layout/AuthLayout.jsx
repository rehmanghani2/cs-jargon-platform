import { Outlet, Link } from 'react-router-dom';
import { useTheme } from '@hooks/useTheme';
import { FiCode, FiSun, FiMoon, FiCheckCircle, FiShield, FiTrendingUp } from 'react-icons/fi';

function AuthLayout() {
  const { toggleTheme, isDark } = useTheme();

  const jargonPills = [
    { text: 'Recursion', delay: '0s' },
    { text: 'Big-O Notation', delay: '1s' },
    { text: 'Async/Await', delay: '2s' },
    { text: 'Polymorphism', delay: '3s' },
    { text: 'Memoization', delay: '1.5s' },
    { text: 'Binary Search', delay: '2.5s' },
  ];

  return (
    <div className="min-h-screen flex bg-gradient-to-br from-gray-50 via-indigo-50/30 to-purple-50/20 dark:from-gray-950 dark:via-gray-900 dark:to-slate-900 transition-colors duration-300 relative overflow-hidden">
      {/* Background ambient glow orbs */}
      <div className="absolute top-[-10%] left-[-5%] w-96 h-96 bg-primary-500/10 rounded-full blur-3xl pointer-events-none animate-pulse-subtle" />
      <div className="absolute bottom-[-10%] right-[40%] w-96 h-96 bg-purple-500/10 rounded-full blur-3xl pointer-events-none animate-pulse-subtle" />

      {/* Left side - Auth form container */}
      <div className="flex-1 flex flex-col justify-between py-10 px-4 sm:px-6 lg:px-16 xl:px-20 z-10">
        {/* Header bar */}
        <div className="flex items-center justify-between w-full max-w-md mx-auto">
          <Link to="/" className="flex items-center gap-3 group">
            <div className="p-2.5 bg-gradient-to-br from-primary-600 to-indigo-600 rounded-xl shadow-lg shadow-primary-500/25 group-hover:scale-105 transition-transform">
              <FiCode className="w-6 h-6 text-white" />
            </div>
            <div className="flex flex-col">
              <span className="text-xl font-display font-extrabold text-gray-900 dark:text-white tracking-tight">
                CS Jargon
              </span>
              <span className="text-xs text-primary-600 dark:text-primary-400 font-medium tracking-wide">
                PAF-IAST Platform
              </span>
            </div>
          </Link>

          {/* Theme toggle */}
          <button
            onClick={toggleTheme}
            className="p-2.5 rounded-xl bg-white/80 dark:bg-gray-800/80 border border-gray-200 dark:border-gray-700/60 shadow-sm text-gray-600 hover:text-primary-600 dark:text-gray-300 dark:hover:text-primary-400 hover:scale-105 transition-all"
            title="Toggle Theme"
          >
            {isDark ? <FiSun className="w-5 h-5 text-amber-400" /> : <FiMoon className="w-5 h-5 text-indigo-600" />}
          </button>
        </div>

        {/* Center content - Glass card container */}
        <div className="my-auto py-6 w-full max-w-md mx-auto">
          <div className="glass-card rounded-2xl p-8 sm:p-10 shadow-2xl relative overflow-hidden">
            <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-primary-500 via-indigo-500 to-purple-500" />
            <Outlet />
          </div>

          <div className="mt-6 text-center">
            <Link
              to="/"
              className="inline-flex items-center gap-1.5 text-xs font-semibold text-gray-500 hover:text-primary-600 dark:text-gray-400 dark:hover:text-primary-400 transition-colors group"
            >
              <span className="group-hover:-translate-x-1 transition-transform">←</span>
              <span>Back to Home</span>
            </Link>
          </div>
        </div>

        {/* Footer info */}
        <div className="text-center text-xs text-gray-400 dark:text-gray-500">
          Computer Science Jargon Learning Study © {new Date().getFullYear()}
        </div>
      </div>

      {/* Right side - Dynamic Hero Showcase */}
      <div className="hidden lg:flex relative flex-1 bg-gradient-to-br from-slate-900 via-indigo-950 to-purple-950 items-center justify-center p-12 overflow-hidden border-l border-white/10">
        {/* Background Mesh Grid pattern */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff08_1px,transparent_1px),linear-gradient(to_bottom,#ffffff08_1px,transparent_1px)] bg-[size:32px_32px]" />

        {/* Floating Jargon Pills */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          {jargonPills.map((pill, idx) => (
            <span
              key={idx}
              style={{
                top: `${15 + (idx * 14)}%`,
                left: idx % 2 === 0 ? `${10 + (idx * 5)}%` : `${65 - (idx * 4)}%`,
                animationDelay: pill.delay
              }}
              className="absolute px-3.5 py-1.5 rounded-full text-xs font-mono font-semibold bg-white/10 backdrop-blur-md border border-white/15 text-indigo-200 animate-float-slow shadow-lg"
            >
              &lt;{pill.text} /&gt;
            </span>
          ))}
        </div>

        {/* Hero Card Content */}
        <div className="max-w-md text-white z-10 relative">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-indigo-500/20 border border-indigo-400/30 text-indigo-300 text-xs font-medium mb-6 backdrop-blur-md">
            <FiShield className="w-4 h-4 text-emerald-400" />
            <span>Technical Vocabulary Mastery</span>
          </div>

          <h2 className="text-4xl font-display font-black leading-tight mb-4 tracking-tight">
            Level Up Your <br />
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-cyan-400 via-indigo-300 to-purple-300">
              Computer Science
            </span> Vocabulary
          </h2>

          <p className="text-base text-gray-300 leading-relaxed mb-8">
            Empowering PAF-IAST Computer Science students with precise jargon fluency, interactive quizzes, automated placement scoring, and verified academic certificates.
          </p>

          {/* Feature Highlights */}
          <div className="space-y-4">
            <div className="flex items-start gap-3.5 p-3.5 rounded-xl bg-white/5 border border-white/10 backdrop-blur-sm hover:bg-white/10 transition-colors">
              <div className="w-8 h-8 rounded-lg bg-emerald-500/20 flex items-center justify-center text-emerald-400 flex-shrink-0">
                <FiCheckCircle className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-semibold text-sm text-white">Adaptive Flashcards & Jargon Vault</h3>
                <p className="text-xs text-gray-400">Audio pronunciations, complexity tiers, and active recall streak counters.</p>
              </div>
            </div>

            <div className="flex items-start gap-3.5 p-3.5 rounded-xl bg-white/5 border border-white/10 backdrop-blur-sm hover:bg-white/10 transition-colors">
              <div className="w-8 h-8 rounded-lg bg-indigo-500/20 flex items-center justify-center text-indigo-400 flex-shrink-0">
                <FiTrendingUp className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-semibold text-sm text-white">Placement Test & Progress Analytics</h3>
                <p className="text-xs text-gray-400">Instant placement level assignment and milestone tracking.</p>
              </div>
            </div>
          </div>
        </div>

        {/* Ambient Blur */}
        <div className="absolute top-1/4 right-1/4 w-72 h-72 bg-indigo-500/20 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-1/4 left-1/4 w-72 h-72 bg-purple-500/20 rounded-full blur-3xl pointer-events-none" />
      </div>
    </div>
  );
}

export default AuthLayout;