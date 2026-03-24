import { type NodeData } from "@/hooks/use-mock-data";
import { cn } from "@/lib/utils";
import { MapPin, Activity, AlertTriangle, CheckCircle2, X } from "lucide-react";

interface SidebarProps {
  basinName: string;
  nodes: NodeData[];
  activeNodeId: string;
  onSelectNode: (id: string) => void;
  mobileOpen?: boolean;
  onMobileClose?: () => void;
}

export function Sidebar({ basinName, nodes, activeNodeId, onSelectNode, mobileOpen, onMobileClose }: SidebarProps) {
  function handleSelect(id: string) {
    onSelectNode(id);
    onMobileClose?.();
  }

  const content = (
    <div className="p-3">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-[10px] font-mono uppercase tracking-widest text-slate-500 flex items-center gap-1.5">
          <MapPin className="w-3 h-3" />
          {basinName}
        </h2>
        {onMobileClose && (
          <button
            onClick={onMobileClose}
            className="md:hidden w-7 h-7 flex items-center justify-center rounded-lg bg-slate-800 border border-slate-700 text-slate-400 hover:text-white transition-all"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        )}
      </div>

      <div className="space-y-2">
        {nodes.map((node) => {
          const isActive = activeNodeId === node.id;
          const isCritical = node.status === "CRITICAL";
          const isElevated = node.status === "ELEVATED";

          return (
            <button
              key={node.id}
              onClick={() => handleSelect(node.id)}
              className={cn(
                "w-full text-left p-3 rounded-xl border transition-all duration-300 relative overflow-hidden group",
                isActive
                  ? "bg-slate-800/80 border-emerald-500/50 shadow-[0_0_16px_rgba(52,211,153,0.08)]"
                  : "bg-slate-900/40 border-white/5 hover:border-white/10 hover:bg-slate-800/40"
              )}
            >
              {isActive && (
                <div className="absolute left-0 top-0 bottom-0 w-[3px] bg-emerald-500 rounded-l-xl" />
              )}

              <div className="flex items-center justify-between gap-2">
                <div className="min-w-0">
                  <h3
                    className={cn(
                      "font-semibold text-xs leading-snug transition-colors truncate",
                      isActive ? "text-emerald-400" : "text-slate-200 group-hover:text-white"
                    )}
                  >
                    {node.name}
                  </h3>
                  <p className="text-[10px] font-mono text-slate-500 truncate mt-0.5">{node.location}</p>
                </div>

                <div className="flex items-center justify-center w-6 h-6 rounded-lg bg-slate-950/50 border border-white/5 shrink-0">
                  {isCritical ? (
                    <AlertTriangle className={cn("w-3.5 h-3.5", isActive ? "text-red-500" : "text-red-500/70")} />
                  ) : isElevated ? (
                    <Activity className={cn("w-3.5 h-3.5", isActive ? "text-amber-500" : "text-amber-500/70")} />
                  ) : (
                    <CheckCircle2 className={cn("w-3.5 h-3.5", isActive ? "text-emerald-500" : "text-emerald-500/70")} />
                  )}
                </div>
              </div>

              <div
                className={cn(
                  "mt-2 overflow-hidden transition-all duration-300",
                  isActive ? "max-h-6 opacity-100" : "max-h-0 opacity-0"
                )}
              >
                <span
                  className={cn(
                    "text-[9px] font-mono font-bold uppercase tracking-widest px-1.5 py-0.5 rounded border",
                    isCritical
                      ? "text-red-400 border-red-500/20 bg-red-950/30"
                      : isElevated
                      ? "text-amber-400 border-amber-500/20 bg-amber-950/30"
                      : "text-emerald-400 border-emerald-500/20 bg-emerald-950/30"
                  )}
                >
                  {node.status}
                </span>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );

  return (
    <>
      <aside className="hidden md:flex w-[200px] border-r border-white/5 bg-slate-900/50 flex-col h-full overflow-y-auto shrink-0">
        {content}
      </aside>

      {mobileOpen && (
        <div className="md:hidden fixed inset-0 z-[9000] flex">
          <div
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            onClick={onMobileClose}
          />
          <aside className="relative z-10 w-[260px] max-w-[85vw] bg-slate-900 border-r border-white/10 h-full overflow-y-auto shadow-2xl animate-in slide-in-from-left duration-300">
            {content}
          </aside>
        </div>
      )}
    </>
  );
}
