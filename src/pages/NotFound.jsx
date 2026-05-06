import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  Home,
  ArrowLeft,
  Search,
  Compass,
  MapPin,
  Sparkles,
  Ghost,
} from "lucide-react";

export default function NotFound() {
  const navigate = useNavigate();
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const [seconds, setSeconds] = useState(15);

  // Auto-redirect countdown
  useEffect(() => {
    const timer = setInterval(() => {
      setSeconds((prev) => {
        if (prev <= 1) {
          navigate("/", { replace: true });
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, [navigate]);

  // Parallax mouse tracking
  useEffect(() => {
    const handleMouseMove = (e) => {
      const x = (e.clientX / window.innerWidth - 0.5) * 2;
      const y = (e.clientY / window.innerHeight - 0.5) * 2;
      setMousePos({ x, y });
    };
    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  return (
    <div className="min-h-screen bg-[#0a0e1a] relative overflow-hidden flex items-center justify-center px-4">
      {/* ── Ambient Background ───────────────────────────────────────────── */}

      {/* Gradient orbs */}
      <div
        className="absolute w-[600px] h-[600px] rounded-full opacity-20 blur-[120px] pointer-events-none"
        style={{
          background:
            "radial-gradient(circle, #f59e0b 0%, transparent 70%)",
          top: "10%",
          left: "15%",
          transform: `translate(${mousePos.x * 20}px, ${mousePos.y * 20}px)`,
          transition: "transform 0.3s ease-out",
        }}
      />
      <div
        className="absolute w-[500px] h-[500px] rounded-full opacity-15 blur-[100px] pointer-events-none"
        style={{
          background:
            "radial-gradient(circle, #8b5cf6 0%, transparent 70%)",
          bottom: "5%",
          right: "10%",
          transform: `translate(${mousePos.x * -15}px, ${mousePos.y * -15}px)`,
          transition: "transform 0.3s ease-out",
        }}
      />
      <div
        className="absolute w-[400px] h-[400px] rounded-full opacity-10 blur-[80px] pointer-events-none"
        style={{
          background:
            "radial-gradient(circle, #06b6d4 0%, transparent 70%)",
          top: "50%",
          left: "60%",
          transform: `translate(${mousePos.x * 10}px, ${mousePos.y * -10}px)`,
          transition: "transform 0.3s ease-out",
        }}
      />

      {/* Subtle grid pattern */}
      <div
        className="absolute inset-0 opacity-[0.03] pointer-events-none"
        style={{
          backgroundImage: `
            linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px),
            linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)
          `,
          backgroundSize: "60px 60px",
        }}
      />

      {/* Floating particles */}
      {[...Array(6)].map((_, i) => (
        <div
          key={i}
          className="absolute w-1 h-1 bg-amber-400/30 rounded-full pointer-events-none animate-pulse"
          style={{
            top: `${15 + i * 15}%`,
            left: `${10 + i * 16}%`,
            animationDelay: `${i * 0.5}s`,
            animationDuration: `${2 + i * 0.5}s`,
          }}
        />
      ))}

      {/* ── Main Content ─────────────────────────────────────────────────── */}
      <div className="relative z-10 max-w-2xl w-full text-center">
        {/* Ghost icon floating animation */}
        <div className="flex justify-center mb-8">
          <div
            className="relative"
            style={{
              transform: `translate(${mousePos.x * 8}px, ${mousePos.y * 8}px)`,
              transition: "transform 0.4s ease-out",
            }}
          >
            <div className="w-24 h-24 rounded-3xl bg-gradient-to-br from-amber-500/20 to-purple-500/20 border border-white/10 flex items-center justify-center backdrop-blur-sm animate-[float_3s_ease-in-out_infinite]">
              <Ghost size={40} className="text-amber-400" />
            </div>
            {/* Sparkle accents */}
            <Sparkles
              size={16}
              className="absolute -top-2 -right-2 text-amber-400 animate-pulse"
            />
            <Sparkles
              size={12}
              className="absolute -bottom-1 -left-3 text-purple-400 animate-pulse"
              style={{ animationDelay: "0.5s" }}
            />
          </div>
        </div>

        {/* 404 number – large, gradient */}
        <div className="relative mb-6">
          <h1
            className="text-[140px] sm:text-[180px] font-black leading-none tracking-tighter select-none"
            style={{
              background:
                "linear-gradient(135deg, #f59e0b 0%, #d97706 25%, #8b5cf6 50%, #06b6d4 75%, #f59e0b 100%)",
              backgroundSize: "200% 200%",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              animation: "gradientShift 4s ease-in-out infinite",
            }}
          >
            404
          </h1>
          {/* Shadow / reflection */}
          <div
            className="absolute bottom-0 left-1/2 -translate-x-1/2 w-48 h-8 rounded-full blur-2xl opacity-20"
            style={{
              background:
                "linear-gradient(90deg, #f59e0b, #8b5cf6, #06b6d4)",
            }}
          />
        </div>

        {/* Message */}
        <div className="space-y-3 mb-10">
          <h2 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">
            Page Not Found
          </h2>
          <p className="text-slate-400 text-base sm:text-lg max-w-md mx-auto leading-relaxed">
            The page you're looking for has drifted into the void.
            It may have been moved, deleted, or never existed.
          </p>
        </div>

        {/* Search hint card */}
        <div className="bg-white/[0.04] backdrop-blur-xl border border-white/[0.08] rounded-2xl p-4 mb-8 max-w-sm mx-auto">
          <div className="flex items-center gap-3 text-left">
            <div className="w-10 h-10 rounded-xl bg-amber-500/10 flex items-center justify-center flex-shrink-0">
              <Compass size={18} className="text-amber-400" />
            </div>
            <div>
              <p className="text-white text-sm font-medium">Lost your way?</p>
              <p className="text-slate-500 text-xs">
                Try navigating back to the homepage or use the buttons below.
              </p>
            </div>
          </div>
        </div>

        {/* Action buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3 mb-10">
          {/* Primary – Go Home */}
          <button
            onClick={() => navigate("/")}
            className="group relative w-full sm:w-auto px-8 py-3.5 rounded-2xl font-semibold text-sm text-black overflow-hidden transition-all duration-300 hover:shadow-lg hover:shadow-amber-500/25 hover:scale-[1.02] active:scale-[0.98]"
            style={{
              background:
                "linear-gradient(135deg, #f59e0b 0%, #d97706 100%)",
            }}
          >
            <span className="relative z-10 flex items-center justify-center gap-2">
              <Home size={16} />
              Back to Homepage
            </span>
            {/* Hover shimmer */}
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700" />
          </button>

          {/* Secondary – Go Back */}
          <button
            onClick={() => navigate(-1)}
            className="w-full sm:w-auto px-8 py-3.5 rounded-2xl font-semibold text-sm text-slate-300 bg-white/[0.06] border border-white/[0.1] hover:bg-white/[0.1] hover:border-white/[0.15] hover:text-white transition-all duration-300 hover:scale-[1.02] active:scale-[0.98] flex items-center justify-center gap-2"
          >
            <ArrowLeft size={16} />
            Go Back
          </button>
        </div>

        {/* Auto-redirect timer */}
        <div className="flex items-center justify-center gap-2 text-slate-600 text-xs">
          <div className="relative w-5 h-5">
            <svg className="w-5 h-5 -rotate-90" viewBox="0 0 20 20">
              <circle
                cx="10"
                cy="10"
                r="8"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                opacity="0.2"
              />
              <circle
                cx="10"
                cy="10"
                r="8"
                fill="none"
                stroke="#f59e0b"
                strokeWidth="2"
                strokeLinecap="round"
                strokeDasharray={`${(seconds / 15) * 50.26} 50.26`}
                className="transition-all duration-1000 ease-linear"
              />
            </svg>
          </div>
          <span>
            Redirecting to homepage in{" "}
            <span className="text-amber-400 font-mono font-bold">
              {seconds}s
            </span>
          </span>
        </div>

        {/* Breadcrumb / URL hint */}
        <div className="mt-8 flex items-center justify-center gap-2 text-slate-600">
          <MapPin size={12} />
          <code className="text-xs bg-white/[0.04] border border-white/[0.06] px-3 py-1 rounded-lg font-mono">
            {window.location.pathname}
          </code>
          <span className="text-xs">→ not found</span>
        </div>
      </div>

      {/* ── Keyframes ────────────────────────────────────────────────────── */}
      <style>{`
        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50%      { transform: translateY(-12px); }
        }
        @keyframes gradientShift {
          0%   { background-position: 0% 50%; }
          50%  { background-position: 100% 50%; }
          100% { background-position: 0% 50%; }
        }
      `}</style>
    </div>
  );
}