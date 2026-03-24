import { useState, useEffect, useCallback, useRef } from "react";
import { useDashboardData } from "@/hooks/use-mock-data";
import { TopNav } from "@/components/TopNav";
import { Sidebar } from "@/components/Sidebar";
import { TelemetryCards } from "@/components/TelemetryCards";
import { PredictiveChart } from "@/components/PredictiveChart";
import { SmsSimulator } from "@/components/SmsSimulator";
import { MapSection } from "@/components/MapSection";
import { MeshPanel } from "@/components/MeshPanel";
import { WalkthroughTour } from "@/components/WalkthroughTour";
import { CheckCircle2, X } from "lucide-react";
import { cn } from "@/lib/utils";

function Toast({ message, onClose }: { message: string; onClose: () => void }) {
  useEffect(() => {
    const t = setTimeout(onClose, 5000);
    return () => clearTimeout(t);
  }, [onClose]);

  return (
    <div className="fixed bottom-6 right-6 z-[9999] flex items-center gap-3 bg-emerald-900/90 border border-emerald-500/50 text-emerald-200 rounded-xl px-5 py-3 shadow-2xl backdrop-blur-xl animate-in slide-in-from-bottom-4 fade-in duration-300">
      <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
      <span className="text-sm font-mono">{message}</span>
      <button onClick={onClose} className="ml-2 text-emerald-400 hover:text-white transition-colors">
        <X className="w-4 h-4" />
      </button>
    </div>
  );
}

export function Dashboard() {
  const { nodes, activeNodeId, setActiveNodeId, activeNode } = useDashboardData();
  const [flashOverlay, setFlashOverlay] = useState(false);
  const [toast, setToast] = useState<string | null>(null);
  const [alertLog, setAlertLog] = useState<string[]>([]);
  const mainRef = useRef<HTMLElement>(null);

  // Scroll to top whenever the active node changes
  useEffect(() => {
    mainRef.current?.scrollTo({ top: 0, behavior: "instant" });
  }, [activeNodeId]);

  const handleAlertTriggered = useCallback(() => {
    setFlashOverlay(true);
    setTimeout(() => setFlashOverlay(false), 600);

    const now = new Date();
    const hhmm = `${String(now.getHours()).padStart(2, "0")}:${String(now.getMinutes()).padStart(2, "0")}`;
    const entry = `[${hhmm}] Manual alert dispatched — 12,847 recipients notified`;
    setAlertLog((prev) => [entry, ...prev]);
    setToast("✓ Alert sent in 3.2 seconds");
  }, []);

  return (
    <div className="min-h-screen bg-background flex flex-col text-foreground overflow-hidden relative">
      {/* Red flash overlay */}
      <div
        className={cn(
          "fixed inset-0 bg-red-500/20 pointer-events-none z-[9998] transition-opacity duration-300",
          flashOverlay ? "opacity-100" : "opacity-0"
        )}
      />

      <TopNav />

      <div className="flex-1 flex overflow-hidden">
        <Sidebar
          nodes={nodes}
          activeNodeId={activeNodeId}
          onSelectNode={setActiveNodeId}
        />

        <main ref={mainRef} className="flex-1 overflow-y-auto bg-slate-900/40 relative">
          <div className="absolute top-0 left-1/4 w-96 h-96 bg-emerald-900/10 rounded-full blur-[120px] pointer-events-none" />
          <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-blue-900/10 rounded-full blur-[120px] pointer-events-none" />

          <div className="p-6 md:p-8 max-w-7xl mx-auto">
            <header className="mb-8 flex items-start justify-between gap-4">
              <div>
                <h2 className="text-3xl font-bold tracking-tight text-slate-100">Command Center</h2>
                <p className="text-slate-400 mt-1">
                  Real-time hydrological monitoring and early warning system.
                </p>
              </div>
              <div className="mt-1 shrink-0">
                <WalkthroughTour />
              </div>
            </header>

            <div className="animate-in fade-in duration-500 ease-out fill-mode-both">
              <TelemetryCards node={activeNode} />
              <PredictiveChart node={activeNode} />
              <MapSection />
              <MeshPanel />
              <SmsSimulator
                onAlertTriggered={handleAlertTriggered}
                alertLog={alertLog}
                activeNode={activeNode}
              />
            </div>

            <footer className="mt-12 py-6 border-t border-white/5 text-center text-xs font-mono text-slate-600">
              AngaWatch Systems © {new Date().getFullYear()} — Internal Proof of Concept. Simulated Data.
            </footer>
          </div>
        </main>
      </div>

      {toast && <Toast message={toast} onClose={() => setToast(null)} />}
    </div>
  );
}
