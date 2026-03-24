import { useState } from "react";
import { X, ChevronRight, ChevronLeft, Map, BarChart2, Smartphone, Sidebar, Activity, HelpCircle } from "lucide-react";
import { cn } from "@/lib/utils";

interface Step {
  icon: React.ReactNode;
  title: string;
  description: string;
  tip?: string;
  color: string;
}

const STEPS: Step[] = [
  {
    icon: <Activity className="w-6 h-6" />,
    title: "Welcome to AngaWatch",
    description:
      "AngaWatch is a real-time flood prediction command centre for the Tana River Basin, Kenya. It ingests sensor data, runs AI discharge models, and pushes life-saving SMS alerts to communities — all from this dashboard.",
    tip: "This is a proof-of-concept with simulated data.",
    color: "emerald",
  },
  {
    icon: <Sidebar className="w-6 h-6" />,
    title: "Monitoring Nodes — Left Sidebar",
    description:
      "The left panel lists three sensor stations along the Tana River: Garissa (Upstream), Hola Bridge (Midstream), and Garsen (Downstream). Click any node to instantly switch the entire dashboard to that station's live readings and forecast.",
    tip: "Hola Bridge is currently highlighted red — it is in CRITICAL state.",
    color: "blue",
  },
  {
    icon: <Activity className="w-6 h-6" />,
    title: "Live Telemetry Cards",
    description:
      "The three cards at the top show the selected node's real-time readings: current water height, river velocity (with trend vs. seasonal baseline), and the AI Predictive Status with a live countdown to projected flood impact.",
    tip: "The red pulsing dot on the AI card means a SURGE has been detected.",
    color: "cyan",
  },
  {
    icon: <BarChart2 className="w-6 h-6" />,
    title: "Predictive Discharge Chart",
    description:
      "The Recharts graph shows the past 5 days of observed discharge (solid blue line) and the AI's 4-day forward prediction (dashed blue line). The red dashed horizontal line marks the Critical Evacuation Threshold (1,500 m³/s). When the predicted line crosses it — evacuate.",
    tip: "Watch the lines animate in as you scroll down to the chart.",
    color: "blue",
  },
  {
    icon: <Map className="w-6 h-6" />,
    title: "Interactive Sensor Map",
    description:
      "A live Leaflet map plots all 5 sensor nodes along the Tana River. Green = Normal, Amber = Elevated, Red (pulsing) = Critical. Click any marker for a popup showing that node's water depth, flow rate, and status. The map is locked to Kenya's geographic bounds.",
    tip: "The pulsing red ring on Hola Bridge is a critical alert animation.",
    color: "emerald",
  },
  {
    icon: <Smartphone className="w-6 h-6" />,
    title: "Last-Mile SMS Gateway",
    description:
      "The bottom section simulates AngaWatch's SMS gateway — the system that sends flood warnings to rural communities with no internet. Use the preset English or Kiswahili buttons to simulate a two-way query. Each node returns different responses based on its alert status. Hit 'Trigger Manual Alert' to broadcast an emergency SMS.",
    tip: "Switch between EN and SW tabs to filter questions by language.",
    color: "amber",
  },
];

const colorMap: Record<string, string> = {
  emerald: "bg-emerald-500/10 border-emerald-500/30 text-emerald-400",
  blue: "bg-blue-500/10 border-blue-500/30 text-blue-400",
  cyan: "bg-cyan-500/10 border-cyan-500/30 text-cyan-400",
  amber: "bg-amber-500/10 border-amber-500/30 text-amber-400",
};

const dotMap: Record<string, string> = {
  emerald: "bg-emerald-500",
  blue: "bg-blue-500",
  cyan: "bg-cyan-500",
  amber: "bg-amber-500",
};

export function WalkthroughTour() {
  const [open, setOpen] = useState(false);
  const [step, setStep] = useState(0);

  const current = STEPS[step];

  function close() {
    setOpen(false);
    setStep(0);
  }

  return (
    <>
      {/* Help button — always visible in header area */}
      <button
        onClick={() => setOpen(true)}
        title="Take a guided tour"
        className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-slate-800 border border-slate-700 hover:border-emerald-500/50 hover:bg-slate-700 transition-all text-slate-400 hover:text-emerald-400 text-xs font-mono"
      >
        <HelpCircle className="w-4 h-4" />
        <span className="hidden sm:inline">Tour</span>
      </button>

      {/* Overlay */}
      {open && (
        <div className="fixed inset-0 z-[10000] flex items-center justify-center p-4">
          {/* Backdrop */}
          <div
            className="absolute inset-0 bg-black/70 backdrop-blur-sm"
            onClick={close}
          />

          {/* Modal */}
          <div className="relative bg-slate-900 border border-white/10 rounded-2xl shadow-2xl w-full max-w-lg overflow-hidden">
            {/* Top accent bar */}
            <div className={cn("h-1 w-full", dotMap[current.color])} />

            {/* Header */}
            <div className="flex items-center justify-between px-6 pt-5 pb-4 border-b border-white/5">
              <span className="text-[10px] font-mono text-slate-500 uppercase tracking-widest">
                Step {step + 1} of {STEPS.length}
              </span>
              <button
                onClick={close}
                className="text-slate-500 hover:text-white transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Body */}
            <div className="px-6 py-6">
              {/* Icon + Title */}
              <div className="flex items-start gap-4 mb-4">
                <div
                  className={cn(
                    "w-12 h-12 rounded-xl border flex items-center justify-center shrink-0",
                    colorMap[current.color]
                  )}
                >
                  {current.icon}
                </div>
                <div>
                  <h3 className="text-lg font-bold text-slate-100 leading-snug">
                    {current.title}
                  </h3>
                </div>
              </div>

              <p className="text-slate-300 text-sm leading-relaxed mb-4">
                {current.description}
              </p>

              {current.tip && (
                <div className="flex items-start gap-2.5 bg-slate-800/60 border border-slate-700 rounded-xl px-4 py-3">
                  <span className="text-amber-400 mt-0.5 text-sm">💡</span>
                  <p className="text-xs text-slate-400 leading-relaxed">{current.tip}</p>
                </div>
              )}
            </div>

            {/* Footer */}
            <div className="flex items-center justify-between px-6 pb-6">
              {/* Dot indicators */}
              <div className="flex gap-1.5">
                {STEPS.map((_, i) => (
                  <button
                    key={i}
                    onClick={() => setStep(i)}
                    className={cn(
                      "w-2 h-2 rounded-full transition-all",
                      i === step
                        ? dotMap[current.color]
                        : "bg-slate-700 hover:bg-slate-600"
                    )}
                  />
                ))}
              </div>

              {/* Navigation */}
              <div className="flex gap-2">
                {step > 0 && (
                  <button
                    onClick={() => setStep((s) => s - 1)}
                    className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-slate-800 border border-slate-700 hover:border-slate-500 text-slate-300 hover:text-white text-sm transition-all"
                  >
                    <ChevronLeft className="w-4 h-4" />
                    Back
                  </button>
                )}
                {step < STEPS.length - 1 ? (
                  <button
                    onClick={() => setStep((s) => s + 1)}
                    className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-sm font-semibold transition-all"
                  >
                    Next
                    <ChevronRight className="w-4 h-4" />
                  </button>
                ) : (
                  <button
                    onClick={close}
                    className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-sm font-semibold transition-all"
                  >
                    Get started
                    <ChevronRight className="w-4 h-4" />
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
