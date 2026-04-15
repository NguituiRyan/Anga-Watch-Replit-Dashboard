import { useState, useEffect, useCallback } from "react";
import { useDashboardData, type BasinConfig } from "@/hooks/use-mock-data";
import { TopNav } from "@/components/TopNav";
import { Sidebar } from "@/components/Sidebar";
import { TelemetryCards } from "@/components/TelemetryCards";
import { PredictiveChart } from "@/components/PredictiveChart";
import { SmsSimulator } from "@/components/SmsSimulator";
import { MapSection } from "@/components/MapSection";
import { MeshPanel } from "@/components/MeshPanel";
import { WalkthroughTour } from "@/components/WalkthroughTour";
import { NodeInfoPanel } from "@/components/NodeInfoPanel";
import { CheckCircle2, X, Download, ShieldCheck, Droplets } from "lucide-react";
import { cn } from "@/lib/utils";

function Toast({ message, onClose }: { message: string; onClose: () => void }) {
  useEffect(() => {
    const t = setTimeout(onClose, 5000);
    return () => clearTimeout(t);
  }, [onClose]);

  return (
    <div className="fixed bottom-4 right-4 md:bottom-6 md:right-6 z-[9999] flex items-center gap-3 bg-emerald-900/90 border border-emerald-500/50 text-emerald-200 rounded-xl px-4 py-3 shadow-2xl backdrop-blur-xl animate-in slide-in-from-bottom-4 fade-in duration-300 max-w-[calc(100vw-2rem)]">
      <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
      <span className="text-sm font-mono">{message}</span>
      <button onClick={onClose} className="ml-2 text-emerald-400 hover:text-white transition-colors">
        <X className="w-4 h-4" />
      </button>
    </div>
  );
}

function BasinTabs({
  basins,
  activeBasinId,
  onSelect,
}: {
  basins: BasinConfig[];
  activeBasinId: string;
  onSelect: (id: string) => void;
}) {
  return (
    <div className="w-full bg-slate-900/80 border-b border-white/5 flex items-end overflow-x-auto shrink-0">
      {basins.map((basin) => {
        const isActive = basin.id === activeBasinId;
        return (
          <button
            key={basin.id}
            onClick={() => onSelect(basin.id)}
            className={cn(
              "relative flex items-center gap-2 px-5 py-3 text-sm font-semibold whitespace-nowrap transition-all duration-200 border-b-2 focus:outline-none",
              isActive
                ? "text-emerald-400 border-emerald-500 bg-emerald-950/20"
                : "text-slate-400 border-transparent hover:text-slate-200 hover:bg-slate-800/40"
            )}
          >
            <Droplets
              className={cn(
                "w-3.5 h-3.5 shrink-0 transition-colors",
                isActive ? "text-emerald-400" : "text-slate-500"
              )}
            />
            <span>{basin.name}</span>
            <span
              className={cn(
                "ml-1 text-[9px] font-mono px-1.5 py-0.5 rounded border transition-colors",
                isActive
                  ? "text-emerald-400 border-emerald-500/30 bg-emerald-950/40"
                  : "text-slate-500 border-slate-700/50 bg-slate-800/40"
              )}
            >
              {basin.nodes.length} nodes
            </span>
          </button>
        );
      })}
      <div className="ml-auto px-4 py-3 hidden sm:flex items-center gap-1.5 shrink-0">
        <span className="text-[10px] font-mono text-slate-600 uppercase tracking-widest">Active Basin</span>
      </div>
    </div>
  );
}

export function Dashboard() {
  const { basins, activeBasinId, setActiveBasinId, activeBasin, nodes, activeNodeId, setActiveNodeId, activeNode } = useDashboardData();
  const [flashOverlay, setFlashOverlay] = useState(false);
  const [toast, setToast] = useState<string | null>(null);
  const [alertLog, setAlertLog] = useState<string[]>([]);
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
  const [nodeInfoOpen, setNodeInfoOpen] = useState(false);

  const handleAlertTriggered = useCallback(() => {
    setFlashOverlay(true);
    setTimeout(() => setFlashOverlay(false), 600);
    const now = new Date();
    const hhmm = `${String(now.getHours()).padStart(2, "0")}:${String(now.getMinutes()).padStart(2, "0")}`;
    const entry = `[${hhmm}] Manual alert dispatched — 12,847 recipients notified`;
    setAlertLog((prev) => [entry, ...prev]);
    setToast("✓ Alert sent in 3.2 seconds");
  }, []);

  const avgUptime = (activeBasin.nodes.reduce((s, n) => s + parseFloat(n.uptime), 0) / activeBasin.nodes.length).toFixed(1);

  return (
    <div className="min-h-screen bg-background flex flex-col text-foreground overflow-hidden relative">
      <div className={cn("fixed inset-0 bg-red-500/20 pointer-events-none z-[9998] transition-opacity duration-300", flashOverlay ? "opacity-100" : "opacity-0")} />

      <TopNav onMenuOpen={() => setMobileSidebarOpen(true)} />

      <BasinTabs basins={basins} activeBasinId={activeBasinId} onSelect={setActiveBasinId} />

      <div className="flex-1 flex overflow-hidden">
        <Sidebar
          nodes={nodes}
          activeNodeId={activeNodeId}
          onSelectNode={setActiveNodeId}
          basinName={activeBasin.name}
          mobileOpen={mobileSidebarOpen}
          onMobileClose={() => setMobileSidebarOpen(false)}
        />

        <main className="flex-1 overflow-y-auto overflow-x-hidden bg-slate-900/40 relative">
          <div className="absolute top-0 left-1/4 w-96 h-96 bg-emerald-900/10 rounded-full blur-[120px] pointer-events-none" />
          <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-blue-900/10 rounded-full blur-[120px] pointer-events-none" />

          <div className="p-4 md:p-6 lg:p-8 max-w-7xl mx-auto">
            <div id="section-top" />
            <header className="mb-4 md:mb-6 flex flex-wrap items-start justify-between gap-3">
              <div>
                <h2 className="text-2xl md:text-3xl font-bold tracking-tight text-slate-100">Command Center</h2>
                <p className="text-slate-400 mt-1 text-sm md:text-base">
                  {activeBasin.name} — {activeBasin.region}
                </p>
                <div className="flex items-center gap-2 mt-2">
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                  <span className="text-[10px] font-mono text-emerald-400/80 uppercase tracking-wider">
                    Mesh Active · Avg Uptime {avgUptime}% (30d) · {activeBasin.markers.length} sensors deployed
                  </span>
                </div>
              </div>
              <div className="flex items-center gap-2 flex-wrap">
                <button
                  onClick={() => setToast(`✓ Briefing PDF generated — angawatch_${activeBasin.id}_brief_24mar2026.pdf`)}
                  className="inline-flex items-center gap-2 px-3 py-2 rounded-xl bg-slate-800 border border-slate-700 text-slate-300 hover:border-slate-500 hover:text-white transition-all text-xs font-mono"
                >
                  <Download className="w-3.5 h-3.5" />
                  Export Report
                </button>
                <WalkthroughTour />
              </div>
            </header>

            <div className="animate-in fade-in duration-500 ease-out fill-mode-both">
              <div id="section-telemetry"><TelemetryCards node={activeNode} onAboutNode={() => setNodeInfoOpen(true)} /></div>
              <div id="section-chart"><PredictiveChart node={activeNode} /></div>
              <div id="section-map">
                <MapSection
                  key={activeBasinId}
                  markers={activeBasin.markers}
                  inundationZones={activeBasin.inundationZones}
                  mapCenter={activeBasin.mapCenter}
                  mapZoom={activeBasin.mapZoom}
                  basinName={activeBasin.name}
                  nodeCount={activeBasin.markers.length}
                />
              </div>
              <div id="section-mesh">
                <MeshPanel meshNodes={activeBasin.meshNodes} basinName={activeBasin.name} />
              </div>
              <div id="section-sms">
                <SmsSimulator onAlertTriggered={handleAlertTriggered} alertLog={alertLog} activeNode={activeNode} basinName={activeBasin.river} isAdmin={true} />
              </div>
            </div>

            <footer className="mt-10 md:mt-12 py-6 border-t border-white/5 text-center text-xs font-mono text-slate-600">
              AngaWatch Systems © {new Date().getFullYear()} — Internal Proof of Concept. Simulated Data.
            </footer>
          </div>
        </main>
      </div>

      {nodeInfoOpen && (
        <NodeInfoPanel node={activeNode} onClose={() => setNodeInfoOpen(false)} />
      )}

      {toast && <Toast message={toast} onClose={() => setToast(null)} />}
    </div>
  );
}
