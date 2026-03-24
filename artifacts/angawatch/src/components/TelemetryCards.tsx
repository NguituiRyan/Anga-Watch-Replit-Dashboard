import { type NodeData } from "@/hooks/use-mock-data";
import { Waves, Zap, ShieldAlert, CheckCircle } from "lucide-react";
import { cn } from "@/lib/utils";
import { useEffect, useState } from "react";

interface TelemetryCardsProps {
  node: NodeData;
}

function useCountdown(hours: number) {
  const [secondsLeft, setSecondsLeft] = useState(hours * 3600);

  useEffect(() => {
    setSecondsLeft(hours * 3600);
  }, [hours]);

  useEffect(() => {
    const timer = setInterval(() => {
      setSecondsLeft((s) => (s > 0 ? s - 1 : 0));
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const h = String(Math.floor(secondsLeft / 3600)).padStart(2, "0");
  const m = String(Math.floor((secondsLeft % 3600) / 60)).padStart(2, "0");
  const s = String(secondsLeft % 60).padStart(2, "0");
  return `${h}:${m}:${s}`;
}

export function TelemetryCards({ node }: TelemetryCardsProps) {
  const isCritical = node.status === "CRITICAL";
  const countdown = useCountdown(48);

  return (
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 md:gap-6 mb-6">
      {/* Card 1: Water Height */}
      <div className="bg-slate-800/50 backdrop-blur-sm border border-white/10 rounded-2xl p-6 relative overflow-hidden group hover:bg-slate-800 transition-colors">
        <div className="absolute -right-6 -top-6 w-24 h-24 bg-blue-500/10 rounded-full blur-2xl group-hover:bg-blue-500/20 transition-all" />
        <div className="flex items-center gap-4 mb-4 relative z-10">
          <div className="w-10 h-10 rounded-xl bg-slate-900 border border-slate-700 flex items-center justify-center">
            <Waves className="w-5 h-5 text-blue-400" />
          </div>
          <div>
            <p className="text-sm font-medium text-slate-400">Water Height</p>
            <p className="text-xs font-mono text-slate-500 uppercase">Current Level</p>
          </div>
        </div>
        <div className="relative z-10">
          <span className="text-4xl font-bold font-mono tracking-tight text-slate-100">
            {node.metrics.height}
          </span>
        </div>
      </div>

      {/* Card 2: River Velocity */}
      <div className="bg-gradient-to-br from-cyan-950/40 to-slate-800/80 backdrop-blur-sm border border-cyan-500/30 rounded-2xl p-6 relative overflow-hidden group hover:border-cyan-400/50 transition-colors shadow-[0_0_20px_rgba(6,182,212,0.05)]">
        <div className="absolute -right-6 -top-6 w-32 h-32 bg-cyan-500/10 rounded-full blur-3xl group-hover:bg-cyan-500/20 transition-all" />
        <div className="flex items-center gap-4 mb-3 relative z-10">
          <div className="w-10 h-10 rounded-xl bg-cyan-950 border border-cyan-500/30 flex items-center justify-center">
            <Zap className="w-5 h-5 text-cyan-400" />
          </div>
          <div>
            <p className="text-sm font-medium text-slate-300">River Velocity</p>
            <p className="text-xs font-mono text-cyan-500/70 uppercase">Momentum Tracking</p>
          </div>
        </div>
        <div className="relative z-10">
          <span className="text-4xl font-bold font-mono tracking-tight text-cyan-400">
            {node.metrics.velocity}
          </span>
          <p className="text-[10px] font-mono text-cyan-400/60 mt-2 leading-relaxed">
            {node.metrics.velocitySubtitle}
          </p>
        </div>
      </div>

      {/* Card 3: AI Predictive Status */}
      <div
        className={cn(
          "backdrop-blur-sm border rounded-2xl p-6 relative overflow-hidden transition-colors",
          isCritical
            ? "bg-red-950/20 border-red-500/30"
            : "bg-slate-800/50 border-white/10"
        )}
      >
        {isCritical && (
          <div className="absolute inset-0 bg-red-500/5 animate-pulse pointer-events-none" />
        )}
        <div className="flex items-center gap-4 mb-3 relative z-10">
          <div
            className={cn(
              "w-10 h-10 rounded-xl border flex items-center justify-center",
              isCritical
                ? "bg-red-950 border-red-500/50"
                : "bg-slate-900 border-slate-700"
            )}
          >
            {isCritical ? (
              <ShieldAlert
                className="w-5 h-5 text-red-500 animate-bounce"
                style={{ animationDuration: "2s" }}
              />
            ) : (
              <CheckCircle className="w-5 h-5 text-emerald-500" />
            )}
          </div>
          <div>
            <p className="text-sm font-medium text-slate-400">AI Predictive Status</p>
            {isCritical ? (
              <p className="text-[10px] font-mono text-red-400 uppercase tracking-widest">
                PROJECTED IMPACT IN:
              </p>
            ) : (
              <p className="text-xs font-mono text-slate-500 uppercase">
                {node.metrics.aiSubtitle}
              </p>
            )}
          </div>
        </div>
        <div className="relative z-10">
          <span
            className={cn(
              "text-2xl lg:text-3xl font-bold font-mono tracking-tight",
              isCritical ? "text-red-500" : "text-emerald-400"
            )}
          >
            {node.metrics.aiStatus}
          </span>
          {isCritical && (
            <div className="mt-2 flex items-center gap-3">
              <span className="text-2xl font-mono font-bold text-red-400 tabular-nums tracking-widest">
                {countdown}
              </span>
              <span className="relative flex h-3 w-3">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75" />
                <span className="relative inline-flex rounded-full h-3 w-3 bg-red-500" />
              </span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
