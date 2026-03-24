import { type NodeData } from "@/hooks/use-mock-data";
import { Waves, Zap, ShieldAlert, CheckCircle, Users } from "lucide-react";
import { cn } from "@/lib/utils";
import { useEffect, useState } from "react";

interface TelemetryCardsProps {
  node: NodeData;
  onAboutNode: () => void;
}

function useCountdown(hours: number) {
  const [secondsLeft, setSecondsLeft] = useState(hours * 3600);
  useEffect(() => { setSecondsLeft(hours * 3600); }, [hours]);
  useEffect(() => {
    const timer = setInterval(() => setSecondsLeft((s) => (s > 0 ? s - 1 : 0)), 1000);
    return () => clearInterval(timer);
  }, []);
  const h = String(Math.floor(secondsLeft / 3600)).padStart(2, "0");
  const m = String(Math.floor((secondsLeft % 3600) / 60)).padStart(2, "0");
  const s = String(secondsLeft % 60).padStart(2, "0");
  return `${h}:${m}:${s}`;
}

function FloodGauge({ pct }: { pct: number }) {
  const r = 36, cx = 50, cy = 50;
  const color = pct >= 70 ? "#ef4444" : pct >= 40 ? "#f59e0b" : "#10b981";
  const glow = pct >= 70 ? "drop-shadow(0 0 6px rgba(239,68,68,0.6))" : pct >= 40 ? "drop-shadow(0 0 6px rgba(245,158,11,0.5))" : "drop-shadow(0 0 4px rgba(16,185,129,0.5))";

  const toXY = (deg: number) => ({
    x: cx + r * Math.cos((deg * Math.PI) / 180),
    y: cy + r * Math.sin((deg * Math.PI) / 180),
  });

  const bgStart = toXY(-180);
  const bgEnd   = toXY(0);
  const endDeg  = -180 + (pct / 100) * 180;
  const end     = toXY(endDeg);
  const large   = pct > 50 ? 1 : 0;

  return (
    <svg viewBox="0 0 100 58" className="w-full max-w-[160px]" style={{ filter: glow }}>
      <path d={`M ${bgStart.x} ${bgStart.y} A ${r} ${r} 0 0 1 ${bgEnd.x} ${bgEnd.y}`} fill="none" stroke="#1e293b" strokeWidth="10" strokeLinecap="round" />
      {pct > 0 && (
        <path d={`M ${bgStart.x} ${bgStart.y} A ${r} ${r} 0 ${large} 1 ${end.x} ${end.y}`} fill="none" stroke={color} strokeWidth="10" strokeLinecap="round" />
      )}
      <text x="50" y="49" textAnchor="middle" fill={color} fontSize="16" fontWeight="bold" fontFamily="monospace">{pct}%</text>
    </svg>
  );
}

export function TelemetryCards({ node, onAboutNode }: TelemetryCardsProps) {
  const isCritical = node.status === "CRITICAL";
  const isElevated = node.status === "ELEVATED";
  const countdown = useCountdown(48);
  const probColor = node.floodProbability >= 70 ? "text-red-400" : node.floodProbability >= 40 ? "text-amber-400" : "text-emerald-400";
  const popColor  = node.status === "CRITICAL" ? "text-red-300" : node.status === "ELEVATED" ? "text-amber-300" : "text-emerald-300";

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-4 mb-6">

      {/* Card 1: Water Height */}
      <div className="bg-slate-800/50 backdrop-blur-sm border border-white/10 rounded-2xl p-4 md:p-5 relative overflow-hidden group hover:bg-slate-800 transition-colors">
        <div className="absolute -right-4 -top-4 w-20 h-20 bg-blue-500/10 rounded-full blur-2xl group-hover:bg-blue-500/20 transition-all" />
        <div className="flex items-center gap-3 mb-3 relative z-10">
          <div className="w-9 h-9 rounded-xl bg-slate-900 border border-slate-700 flex items-center justify-center shrink-0">
            <Waves className="w-4 h-4 text-blue-400" />
          </div>
          <div>
            <p className="text-xs font-medium text-slate-400">Water Height</p>
            <p className="text-[10px] font-mono text-slate-500 uppercase">Current Level</p>
          </div>
        </div>
        <span className="text-3xl md:text-4xl font-bold font-mono tracking-tight text-slate-100 relative z-10">
          {node.metrics.height}
        </span>
      </div>

      {/* Card 2: River Velocity */}
      <div className="bg-gradient-to-br from-cyan-950/40 to-slate-800/80 backdrop-blur-sm border border-cyan-500/30 rounded-2xl p-4 md:p-5 relative overflow-hidden group hover:border-cyan-400/50 transition-colors">
        <div className="absolute -right-4 -top-4 w-24 h-24 bg-cyan-500/10 rounded-full blur-3xl group-hover:bg-cyan-500/20 transition-all" />
        <div className="flex items-center gap-3 mb-3 relative z-10">
          <div className="w-9 h-9 rounded-xl bg-cyan-950 border border-cyan-500/30 flex items-center justify-center shrink-0">
            <Zap className="w-4 h-4 text-cyan-400" />
          </div>
          <div>
            <p className="text-xs font-medium text-slate-300">Velocity</p>
            <p className="text-[10px] font-mono text-cyan-500/70 uppercase">Momentum</p>
          </div>
        </div>
        <span className="text-3xl md:text-4xl font-bold font-mono tracking-tight text-cyan-400 relative z-10">
          {node.metrics.velocity}
        </span>
        <p className="text-[9px] font-mono text-cyan-400/50 mt-1.5 leading-relaxed relative z-10 line-clamp-2">
          {node.metrics.velocitySubtitle}
        </p>
      </div>

      {/* Card 3: Flood Probability Gauge */}
      <div className={cn(
        "backdrop-blur-sm border rounded-2xl p-4 md:p-5 relative overflow-hidden transition-colors",
        node.floodProbability >= 70 ? "bg-red-950/20 border-red-500/30" :
        node.floodProbability >= 40 ? "bg-amber-950/20 border-amber-500/20" :
        "bg-slate-800/50 border-white/10"
      )}>
        <div className="flex items-center gap-2 mb-2">
          <Users className={cn("w-4 h-4 shrink-0", probColor)} />
          <div>
            <p className="text-xs font-medium text-slate-300">Flood Probability</p>
            <p className={cn("text-[10px] font-mono uppercase tracking-wider", probColor)}>AI Confidence</p>
          </div>
        </div>
        <div className="flex justify-center">
          <FloodGauge pct={node.floodProbability} />
        </div>
        <div className="mt-1 text-center">
          <p className={cn("text-[10px] font-mono font-bold uppercase tracking-widest", probColor)}>
            {node.floodProbability >= 70 ? "HIGH RISK" : node.floodProbability >= 40 ? "MODERATE RISK" : "LOW RISK"}
          </p>
        </div>
      </div>

      {/* Card 4: AI Predictive Status + Population at Risk */}
      <div className={cn(
        "backdrop-blur-sm border rounded-2xl p-4 md:p-5 relative overflow-hidden transition-colors",
        isCritical ? "bg-red-950/20 border-red-500/30" : "bg-slate-800/50 border-white/10"
      )}>
        {isCritical && <div className="absolute inset-0 bg-red-500/5 animate-pulse pointer-events-none" />}
        <div className="flex items-center gap-3 mb-2 relative z-10">
          <div className={cn("w-9 h-9 rounded-xl border flex items-center justify-center shrink-0",
            isCritical ? "bg-red-950 border-red-500/50" : "bg-slate-900 border-slate-700"
          )}>
            {isCritical
              ? <ShieldAlert className="w-4 h-4 text-red-500 animate-bounce" style={{ animationDuration: "2s" }} />
              : <CheckCircle className="w-4 h-4 text-emerald-500" />}
          </div>
          <div>
            <p className="text-xs font-medium text-slate-400">AI Status</p>
            <p className={cn("text-[10px] font-mono uppercase tracking-wider",
              isCritical ? "text-red-400" : "text-slate-500"
            )}>
              {isCritical ? "PROJECTED IMPACT IN:" : node.metrics.aiSubtitle}
            </p>
          </div>
        </div>
        <div className="relative z-10">
          <span className={cn("text-xl md:text-2xl font-bold font-mono tracking-tight",
            isCritical ? "text-red-500" : isElevated ? "text-amber-400" : "text-emerald-400"
          )}>
            {node.metrics.aiStatus}
          </span>
          {isCritical && (
            <div className="mt-1 flex items-center gap-2">
              <span className="text-lg font-mono font-bold text-red-400 tabular-nums">{countdown}</span>
              <span className="relative flex h-2.5 w-2.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75" />
                <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-red-500" />
              </span>
            </div>
          )}
          {/* Population at risk */}
          <div className={cn("mt-2 pt-2 border-t",
            isCritical ? "border-red-500/20" : "border-slate-700/50"
          )}>
            <p className="text-[9px] font-mono text-slate-500 uppercase tracking-widest">Population at Risk</p>
            <p className={cn("text-sm font-bold font-mono tabular-nums", popColor)}>
              {node.populationAtRisk.toLocaleString()}
            </p>
          </div>
        </div>

        {/* About node button */}
        <button
          onClick={onAboutNode}
          className="mt-2 w-full text-[9px] font-mono uppercase tracking-widest text-slate-500 hover:text-slate-300 border border-slate-700/50 hover:border-slate-500 rounded-lg py-1 transition-all relative z-10"
        >
          About this node ›
        </button>
      </div>
    </div>
  );
}
