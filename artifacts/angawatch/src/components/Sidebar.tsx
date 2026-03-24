import { type NodeData, type BasinConfig } from "@/hooks/use-mock-data";
import { cn } from "@/lib/utils";
import { MapPin, Activity, AlertTriangle, CheckCircle2, X, ChevronDown, Droplets } from "lucide-react";
import { useState, useRef, useEffect } from "react";

interface SidebarProps {
  basins: BasinConfig[];
  activeBasinId: string;
  onSelectBasin: (id: string) => void;
  nodes: NodeData[];
  activeNodeId: string;
  onSelectNode: (id: string) => void;
  mobileOpen?: boolean;
  onMobileClose?: () => void;
}

function BasinSelector({ basins, activeBasinId, onSelect }: { basins: BasinConfig[]; activeBasinId: string; onSelect: (id: string) => void }) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const activeBasin = basins.find((b) => b.id === activeBasinId) || basins[0];

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  return (
    <div ref={ref} className="relative">
      <button
        onClick={() => setOpen(!open)}
        className={cn(
          "w-full flex items-center gap-2 px-2.5 py-2 rounded-xl border text-left transition-all",
          open
            ? "bg-emerald-950/40 border-emerald-500/30"
            : "bg-slate-800/60 border-slate-700/50 hover:border-slate-600"
        )}
      >
        <Droplets className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
        <div className="flex-1 min-w-0">
          <p className="text-[10px] font-mono uppercase tracking-widest text-slate-500 leading-none">Basin</p>
          <p className="text-xs font-semibold text-slate-200 truncate mt-0.5">{activeBasin.name}</p>
        </div>
        <ChevronDown className={cn("w-3.5 h-3.5 text-slate-500 transition-transform", open && "rotate-180")} />
      </button>

      {open && (
        <div className="absolute top-full left-0 right-0 mt-1.5 bg-slate-900 border border-slate-700 rounded-xl shadow-2xl z-50 overflow-hidden">
          {basins.map((basin) => {
            const isActive = basin.id === activeBasinId;
            return (
              <button
                key={basin.id}
                onClick={() => { onSelect(basin.id); setOpen(false); }}
                className={cn(
                  "w-full text-left px-3 py-2.5 flex items-center gap-2.5 transition-all",
                  isActive
                    ? "bg-emerald-950/40 border-l-2 border-emerald-500"
                    : "hover:bg-slate-800/60 border-l-2 border-transparent"
                )}
              >
                <Droplets className={cn("w-3.5 h-3.5 shrink-0", isActive ? "text-emerald-400" : "text-slate-500")} />
                <div className="min-w-0">
                  <p className={cn("text-xs font-semibold truncate", isActive ? "text-emerald-400" : "text-slate-300")}>{basin.name}</p>
                  <p className="text-[9px] font-mono text-slate-500 truncate">{basin.region} · {basin.nodes.length} nodes</p>
                </div>
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}

export function Sidebar({ basins, activeBasinId, onSelectBasin, nodes, activeNodeId, onSelectNode, mobileOpen, onMobileClose }: SidebarProps) {
  function handleSelect(id: string) {
    onSelectNode(id);
    onMobileClose?.();
  }

  const content = (
    <div className="p-3">
      <div className="flex items-center justify-between mb-3">
        <h2 className="text-[10px] font-mono uppercase tracking-widest text-slate-500 flex items-center gap-1.5">
          <MapPin className="w-3 h-3" />
          Select Basin
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

      <BasinSelector basins={basins} activeBasinId={activeBasinId} onSelect={onSelectBasin} />

      <div className="mt-4 mb-2">
        <p className="text-[10px] font-mono uppercase tracking-widest text-slate-500">Monitoring Nodes</p>
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
      <aside className="hidden md:flex w-[200px] border-r border-white/5 bg-slate-900/50 flex-col h-[calc(100vh-3.5rem)] md:h-[calc(100vh-4rem)] overflow-y-auto shrink-0">
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
