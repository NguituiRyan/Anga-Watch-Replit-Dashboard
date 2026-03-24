import { type NodeData } from "@/hooks/use-mock-data";
import { cn } from "@/lib/utils";
import { MapPin, Activity, AlertTriangle, CheckCircle2, ChevronRight, X } from "lucide-react";

interface SidebarProps {
  nodes: NodeData[];
  activeNodeId: string;
  onSelectNode: (id: string) => void;
  mobileOpen?: boolean;
  onMobileClose?: () => void;
}

export function Sidebar({ nodes, activeNodeId, onSelectNode, mobileOpen, onMobileClose }: SidebarProps) {
  function handleSelect(id: string) {
    onSelectNode(id);
    onMobileClose?.();
  }

  const content = (
    <div className="p-5 md:p-6">
      <div className="flex items-center justify-between mb-5 md:mb-6">
        <h2 className="text-xs font-mono uppercase tracking-widest text-slate-500 flex items-center gap-2">
          <MapPin className="w-3.5 h-3.5" />
          Tana River Basin
        </h2>
        {/* Close button — mobile only */}
        {onMobileClose && (
          <button
            onClick={onMobileClose}
            className="md:hidden w-8 h-8 flex items-center justify-center rounded-lg bg-slate-800 border border-slate-700 text-slate-400 hover:text-white transition-all"
          >
            <X className="w-4 h-4" />
          </button>
        )}
      </div>

      <div className="space-y-3">
        {nodes.map((node) => {
          const isActive = activeNodeId === node.id;
          const isCritical = node.status === "CRITICAL";
          const isElevated = node.status === "ELEVATED";

          return (
            <button
              key={node.id}
              onClick={() => handleSelect(node.id)}
              className={cn(
                "w-full text-left p-4 rounded-xl border transition-all duration-300 relative overflow-hidden group",
                isActive
                  ? "bg-slate-800/80 border-emerald-500/50 shadow-[0_0_20px_rgba(52,211,153,0.1)]"
                  : "bg-slate-900/40 border-white/5 hover:border-white/10 hover:bg-slate-800/40"
              )}
            >
              {isActive && (
                <div className="absolute left-0 top-0 bottom-0 w-1 bg-emerald-500 rounded-l-xl" />
              )}

              <div className="flex items-start justify-between">
                <div>
                  <h3
                    className={cn(
                      "font-semibold mb-1 transition-colors text-sm",
                      isActive ? "text-emerald-400" : "text-slate-200 group-hover:text-white"
                    )}
                  >
                    {node.name}
                  </h3>
                  <p className="text-xs font-mono text-slate-500">{node.location}</p>
                </div>

                <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-slate-950/50 border border-white/5">
                  {isCritical ? (
                    <AlertTriangle className={cn("w-4 h-4", isActive ? "text-red-500" : "text-red-500/70")} />
                  ) : isElevated ? (
                    <Activity className={cn("w-4 h-4", isActive ? "text-amber-500" : "text-amber-500/70")} />
                  ) : (
                    <CheckCircle2 className={cn("w-4 h-4", isActive ? "text-emerald-500" : "text-emerald-500/70")} />
                  )}
                </div>
              </div>

              <div
                className={cn(
                  "mt-4 flex items-center text-[10px] font-mono uppercase tracking-wider overflow-hidden transition-all duration-300",
                  isActive ? "max-h-10 opacity-100" : "max-h-0 opacity-0"
                )}
              >
                <span
                  className={cn(
                    "px-2 py-1 rounded bg-slate-950/50 border",
                    isCritical
                      ? "text-red-400 border-red-500/20"
                      : isElevated
                      ? "text-amber-400 border-amber-500/20"
                      : "text-emerald-400 border-emerald-500/20"
                  )}
                >
                  STATUS: {node.status}
                </span>
                <div className="flex-1" />
                <ChevronRight className="w-3.5 h-3.5 text-slate-500" />
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );

  return (
    <>
      {/* Desktop sidebar — always visible on md+ */}
      <aside className="hidden md:flex w-72 lg:w-80 border-r border-white/5 bg-slate-900/50 flex-col h-[calc(100vh-3.5rem)] md:h-[calc(100vh-4rem)] overflow-y-auto shrink-0">
        {content}
      </aside>

      {/* Mobile drawer overlay */}
      {mobileOpen && (
        <div className="md:hidden fixed inset-0 z-[9000] flex">
          {/* Backdrop */}
          <div
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            onClick={onMobileClose}
          />
          {/* Drawer */}
          <aside className="relative z-10 w-[300px] max-w-[85vw] bg-slate-900 border-r border-white/10 h-full overflow-y-auto shadow-2xl animate-in slide-in-from-left duration-300">
            {content}
          </aside>
        </div>
      )}
    </>
  );
}
