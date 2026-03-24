import { Wifi, Battery, AlertTriangle, Clock } from "lucide-react";
import { cn } from "@/lib/utils";
import { type MeshNodeData } from "@/hooks/use-mock-data";

interface MeshPanelProps {
  meshNodes: MeshNodeData[];
  basinName: string;
}

function SignalBars({ bars, max = 4 }: { bars: number; max?: number }) {
  return (
    <div className="flex items-end gap-0.5 h-4">
      {Array.from({ length: max }).map((_, i) => (
        <div
          key={i}
          className={cn(
            "w-1 rounded-sm transition-all",
            i < bars ? "bg-emerald-400" : "bg-slate-700"
          )}
          style={{ height: `${((i + 1) / max) * 100}%` }}
        />
      ))}
    </div>
  );
}

function BatteryIndicator({ pct }: { pct: number }) {
  const color = pct > 70 ? "text-emerald-400" : pct > 40 ? "text-amber-400" : "text-red-400";
  return (
    <span className={cn("font-mono text-xs font-bold", color)}>
      {pct}%
    </span>
  );
}

export function MeshPanel({ meshNodes, basinName }: MeshPanelProps) {
  return (
    <div className="bg-slate-800/50 backdrop-blur-sm border border-white/10 rounded-2xl p-4 md:p-6 mb-6">
      <div className="flex items-center gap-3 mb-5">
        <Wifi className="w-5 h-5 text-emerald-400" />
        <div>
          <h3 className="text-lg font-semibold text-slate-200">Mesh Node Network</h3>
          <p className="text-xs font-mono text-slate-500 mt-0.5">
            {meshNodes.length} nodes · {basinName} · Daisy-chain topology · Self-healing mesh
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-3">
        {meshNodes.map((node) => (
          <div
            key={node.id}
            className={cn(
              "rounded-xl border p-4 flex flex-col gap-3 relative",
              node.status === "fault"
                ? "bg-amber-950/20 border-amber-500/30"
                : node.status === "warning"
                ? "bg-blue-950/20 border-blue-500/20"
                : "bg-slate-900/60 border-slate-700/50"
            )}
          >
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-mono font-bold text-slate-500 uppercase tracking-widest">
                {node.id}
              </span>
              <span
                className={cn(
                  "w-2 h-2 rounded-full",
                  node.status === "fault"
                    ? "bg-amber-400 animate-pulse"
                    : node.status === "warning"
                    ? "bg-blue-400"
                    : "bg-emerald-500"
                )}
              />
            </div>

            <div>
              <p className="text-sm font-semibold text-slate-200">{node.name}</p>
              <p className="text-[10px] font-mono text-slate-500">{node.location}</p>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center gap-1.5">
                <Battery className="w-3.5 h-3.5 text-slate-500" />
                <BatteryIndicator pct={node.battery} />
              </div>
              <SignalBars bars={node.signal} />
            </div>

            <div className="flex items-center gap-1.5 text-[10px] font-mono text-slate-500">
              <Clock className="w-3 h-3" />
              <span>Last ping: {node.lastPing}</span>
            </div>

            {node.fault && (
              <div className="flex items-start gap-1.5 bg-amber-900/30 border border-amber-500/30 rounded-lg p-2">
                <AlertTriangle className="w-3 h-3 text-amber-400 mt-0.5 shrink-0" />
                <p className="text-[9px] font-mono text-amber-300 leading-tight">{node.fault}</p>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
