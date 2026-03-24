import { useDashboardData } from "@/hooks/use-mock-data";
import { TopNav } from "@/components/TopNav";
import { Sidebar } from "@/components/Sidebar";
import { TelemetryCards } from "@/components/TelemetryCards";
import { PredictiveChart } from "@/components/PredictiveChart";
import { SmsSimulator } from "@/components/SmsSimulator";

export function Dashboard() {
  const { nodes, activeNodeId, setActiveNodeId, activeNode } = useDashboardData();

  return (
    <div className="min-h-screen bg-background flex flex-col text-foreground overflow-hidden">
      <TopNav />
      
      <div className="flex-1 flex overflow-hidden">
        <Sidebar 
          nodes={nodes} 
          activeNodeId={activeNodeId} 
          onSelectNode={setActiveNodeId} 
        />
        
        <main className="flex-1 overflow-y-auto bg-slate-900/40 relative">
          {/* Subtle background glow effect behind main content */}
          <div className="absolute top-0 left-1/4 w-96 h-96 bg-emerald-900/10 rounded-full blur-[120px] pointer-events-none" />
          <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-blue-900/10 rounded-full blur-[120px] pointer-events-none" />

          <div className="p-6 md:p-8 max-w-7xl mx-auto">
            <header className="mb-8">
              <h2 className="text-3xl font-bold tracking-tight text-slate-100">Command Center</h2>
              <p className="text-slate-400 mt-1">Real-time hydrological monitoring and early warning system.</p>
            </header>

            <div className="animate-in fade-in slide-in-from-bottom-4 duration-700 ease-out fill-mode-both" key={activeNode.id}>
              <TelemetryCards node={activeNode} />
              <PredictiveChart node={activeNode} />
              <SmsSimulator />
            </div>
            
            <footer className="mt-12 py-6 border-t border-white/5 text-center text-xs font-mono text-slate-600">
              AngaWatch Systems © {new Date().getFullYear()} — Internal Proof of Concept. Simulated Data.
            </footer>
          </div>
        </main>
      </div>
    </div>
  );
}
