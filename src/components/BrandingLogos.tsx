export function OrcaLogo({ size = 36, className = "" }: { size?: number; className?: string }) {
  return (
    <div className={`relative flex items-center justify-center ${className}`}>
      <svg
        width={size}
        height={size}
        viewBox="0 0 100 100"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="shrink-0 drop-shadow-[0_0_12px_rgba(6,182,212,0.4)]"
      >
        <defs>
          <linearGradient id="orcaGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#22d3ee" />
            <stop offset="50%" stopColor="#06b6d4" />
            <stop offset="100%" stopColor="#0d9488" />
          </linearGradient>
          <linearGradient id="ringGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#38bdf8" stopOpacity="0.8" />
            <stop offset="100%" stopColor="#0891b2" stopOpacity="0.2" />
          </linearGradient>
        </defs>

        {/* Outer Orbital Sonar Ring */}
        <circle cx="50" cy="50" r="46" stroke="url(#ringGrad)" strokeWidth="2" strokeDasharray="4 3" />
        <circle cx="50" cy="50" r="38" stroke="#0891b2" strokeWidth="1" strokeOpacity="0.4" />

        {/* Aerodynamic Orca / Marine Wave Silhouette */}
        <path
          d="M25 58 C32 42, 45 35, 68 32 C78 30, 84 34, 88 40 C76 43, 62 48, 54 62 C48 72, 36 78, 22 75 C26 70, 28 65, 25 58 Z"
          fill="url(#orcaGrad)"
        />
        {/* Dorsal Fin */}
        <path
          d="M48 37 L56 16 C59 24, 62 31, 65 33 Z"
          fill="#38bdf8"
        />
        {/* Sonar Pulse Core */}
        <circle cx="68" cy="42" r="3.5" fill="#ffffff" />
        <circle cx="68" cy="42" r="7" stroke="#ffffff" strokeWidth="1" strokeOpacity="0.6" className="animate-ping" />

        {/* Ocean Hydrodynamic Ripple Wave */}
        <path
          d="M15 72 C30 68, 45 76, 60 72 C75 68, 85 74, 90 73"
          stroke="#22d3ee"
          strokeWidth="2.5"
          strokeLinecap="round"
        />
      </svg>
    </div>
  );
}

export function IsroBadge({ size = 14, className = "" }: { size?: number; className?: string }) {
  return (
    <div className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-slate-900 border border-slate-700/80 shadow-xs ${className}`}>
      <svg width={size} height={size} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <circle cx="12" cy="12" r="10" stroke="#f97316" strokeWidth="2" />
        <path d="M12 2 L12 22" stroke="#f97316" strokeWidth="1.5" />
        <path d="M2 12 L22 12" stroke="#22c55e" strokeWidth="1.5" />
        <polygon points="12,4 16,12 12,10 8,12" fill="#38bdf8" />
      </svg>
      <span className="text-[10px] font-mono font-bold tracking-wider text-orange-400">ISRO</span>
      <span className="text-[9px] font-mono text-gray-400">MOSDAC</span>
    </div>
  );
}

export function IncoisBadge({ size = 8, className = "" }: { size?: number; className?: string }) {
  return (
    <div className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-slate-900 border border-slate-700/80 shadow-xs ${className}`}>
      <span style={{ width: size, height: size }} className="rounded-full bg-cyan-400 animate-pulse inline-block"></span>
      <span className="text-[10px] font-mono font-bold tracking-wider text-cyan-300">INCOIS</span>
      <span className="text-[9px] font-mono text-gray-400">MoES</span>
    </div>
  );
}

export function CoastGuardBadge({ size = 14, className = "" }: { size?: number; className?: string }) {
  return (
    <div className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-red-950/80 border border-red-700/60 shadow-xs ${className}`}>
      <span className="text-red-400 font-bold" style={{ fontSize: `${size}px` }}>🛡️</span>
      <span className="text-[10px] font-mono font-bold tracking-wider text-red-300">MRCC 1554</span>
    </div>
  );
}

export function SihBadge({ size = 14, className = "" }: { size?: number; className?: string }) {
  return (
    <div className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-indigo-950/80 border border-indigo-700/60 shadow-xs ${className}`}>
      <span className="text-amber-400 font-bold" style={{ fontSize: `${size}px` }}>🇮🇳</span>
      <span className="text-[10px] font-mono font-bold tracking-wider text-indigo-200">SIH 2026</span>
      <span className="text-[9px] font-mono text-amber-300 font-extrabold">PS 26176</span>
    </div>
  );
}
