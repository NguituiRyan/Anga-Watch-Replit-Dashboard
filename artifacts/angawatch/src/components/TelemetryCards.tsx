import { type NodeData } from "@/hooks/use-mock-data";
import { Waves, Zap, ShieldAlert, CheckCircle } from "lucide-react";
import { cn } from "@/lib/utils";

interface TelemetryCardsProps {
  node: NodeData;
}

export function TelemetryCards({ node }: TelemetryCardsProps) {
  const isCritical = node.status === "CRITICAL";

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
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
          <span className="text-4xl font-bold font-mono tracking-tight text-slate-100">{node.metrics.height}</span>
        </div>
      </div>

      {/* Card 2: River Velocity (Highlighted) */}
      <div className="bg-gradient-to-br from-cyan-950/40 to-slate-800/80 backdrop-blur-sm border border-cyan-500/30 rounded-2xl p-6 relative overflow-hidden group hover:border-cyan-400/50 transition-colors shadow-[0_0_20px_rgba(6,182,212,0.05)]">
        <div className="absolute -right-6 -top-6 w-32 h-32 bg-cyan-500/10 rounded-full blur-3xl group-hover:bg-cyan-500/20 transition-all" />
        <div className="flex items-center gap-4 mb-4 relative z-10">
          <div className="w-10 h-10 rounded-xl bg-cyan-950 border border-cyan-500/30 flex items-center justify-center">
            <Zap className="w-5 h-5 text-cyan-400" />
          </div>
          <div>
            <p className="text-sm font-medium text-slate-300">River Velocity</p>
            <p className="text-xs font-mono text-cyan-500/70 uppercase">Momentum Tracking</p>
          </div>
        </div>
        <div className="relative z-10">
          <span className="text-4xl font-bold font-mono tracking-tight text-cyan-400">{node.metrics.velocity}</span>
        </div>
      </div>

      {/* Card 3: AI Predictive Status */}
      <div className={cn(
        "backdrop-blur-sm border rounded-2xl p-6 relative overflow-hidden transition-colors",
        isCritical 
          ? "bg-red-950/20 border-red-500/30 glow-destructive" 
          : "bg-slate-800/50 border-white/10"
      )}>
        {isCritical && (
          <div className="absolute inset-0 bg-red-500/5 animate-pulse-slow pointer-events-none" />
        )}
        <div className="flex items-center gap-4 mb-4 relative z-10">
          <div className={cn(
            "w-10 h-10 rounded-xl border flex items-center justify-center",
            isCritical ? "bg-red-950 border-red-500/50" : "bg-slate-900 border-slate-700"
          )}>
            {isCritical ? (
              <ShieldAlert className="w-5 h-5 text-red-500 animate-bounce" style={{ animationDuration: '2s' }} />
            ) : (
              <CheckCircle className="w-5 h-5 text-emerald-500" />
            )}
          </div>
          <div>
            <p className="text-sm font-medium text-slate-400">AI Predictive Status</p>
            <p className={cn(
              "text-xs font-mono uppercase",
              isCritical ? "text-red-400 font-bold" : "text-slate-500"
            )}>
              {node.metrics.aiSubtitle}
            </p>
          </div>
        </div>
        <div className="relative z-10 flex items-center gap-3">
          <span className={cn(
            "text-2xl lg:text-3xl font-bold font-mono tracking-tight",
            isCritical ? "text-red-500" : "text-emerald-400"
          )}>
            {node.metrics.aiStatus}
          </span>
          {isCritical && (
            <span className="relative flex h-3 w-3">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-3 w-3 bg-red-500"></span>
            </span>
          )}
        </div>
      </div>
    </div>
  );
}
