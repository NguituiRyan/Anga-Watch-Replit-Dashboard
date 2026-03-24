import { useEffect, useState } from "react";
import { BarChart2, ChevronLeft, ChevronRight, HelpCircle, Map, Smartphone, Sidebar, Sparkles, X } from "lucide-react";
import { cn } from "@/lib/utils";

type StepTarget = "sidebar" | "telemetry" | "chart" | "map" | "mesh" | "sms";

interface Step {
  icon: React.ReactNode;
  title: string;
  description: string;
  tip?: string;
  color: string;
  target: StepTarget;
}

const STEPS: Step[] = [
  {
    icon: <HelpCircle className="w-6 h-6" />,
    title: "Quick walkthrough",
    description: "I’ll guide you through the dashboard and move the page as you go.",
    tip: "This opens automatically when the site loads.",
    color: "emerald",
    target: "telemetry",
  },
  {
    icon: <Sidebar className="w-6 h-6" />,
    title: "Switch between river nodes",
    description: "Use the left sidebar to move between Garissa, Hola Bridge, and Garsen.",
    tip: "This controls the whole command centre.",
    color: "blue",
    target: "sidebar",
  },
  {
    icon: <Sparkles className="w-6 h-6" />,
    title: "Read the live telemetry",
    description: "These cards show water height, velocity, and AI status for the selected node.",
    tip: "Watch for the red surge warning.",
    color: "cyan",
    target: "telemetry",
  },
  {
    icon: <BarChart2 className="w-6 h-6" />,
    title: "Check the predictive model",
    description: "This chart compares observed discharge with the AI forecast and marks the evacuation threshold.",
    tip: "If the forecast crosses the red line, risk is rising.",
    color: "blue",
    target: "chart",
  },
  {
    icon: <Map className="w-6 h-6" />,
    title: "Open the map",
    description: "The map shows all sensor nodes across the Tana basin. Click a marker to see local readings.",
    tip: "Red pulsing markers mean critical conditions.",
    color: "emerald",
    target: "map",
  },
  {
    icon: <Smartphone className="w-6 h-6" />,
    title: "Use the SMS gateway",
    description: "The bottom panel simulates community alerts and quick replies in English and Kiswahili.",
    tip: "This is where last-mile communication happens.",
    color: "amber",
    target: "sms",
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

const sectionIds: Partial<Record<StepTarget, string>> = {
  telemetry: "section-telemetry",
  chart:     "section-chart",
  map:       "section-map",
  mesh:      "section-mesh",
  sms:       "section-sms",
};

function scrollToSection(target: StepTarget) {
  if (target === "sidebar") {
    document.querySelector("main")?.scrollTo({ top: 0, behavior: "smooth" });
    return;
  }
  const id = sectionIds[target];
  if (!id) return;
  const el = document.getElementById(id);
  if (!el) return;
  el.scrollIntoView({ behavior: "smooth", block: "start" });
}

export function WalkthroughTour() {
  const [open, setOpen] = useState(false);
  const [step, setStep] = useState(0);
  const current = STEPS[step];
  const indicator = current.target;

  useEffect(() => {
    const t = setTimeout(() => setOpen(true), 700);
    return () => clearTimeout(t);
  }, []);

  useEffect(() => {
    if (!open) return;
    scrollToSection(indicator);
  }, [indicator, open]);

  function close() {
    setOpen(false);
    setStep(0);
    document.querySelector("main")?.scrollTo({ top: 0, behavior: "smooth" });
  }

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        title="Need a walkthrough?"
        className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-emerald-500 text-slate-950 font-semibold shadow-lg shadow-emerald-500/20 border border-emerald-300/40 hover:bg-emerald-400 transition-all animate-pulse-slow"
      >
        <HelpCircle className="w-4 h-4" />
        Walkthrough
      </button>

      {open && (
        <div className="fixed top-24 right-6 z-[10001] w-[360px] max-w-[calc(100vw-1.5rem)]">
          <div className="bg-slate-950/95 border border-white/10 rounded-2xl shadow-2xl overflow-hidden backdrop-blur-xl">
            <div className={cn("h-1 w-full", dotMap[current.color])} />
            <div className="flex items-center justify-between px-4 py-3 border-b border-white/5">
              <div>
                <p className="text-[10px] font-mono uppercase tracking-widest text-slate-500">Step {step + 1} of {STEPS.length}</p>
                <p className="text-sm font-semibold text-slate-100">Need a walkthrough?</p>
              </div>
              <button onClick={close} className="text-slate-500 hover:text-white transition-colors">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-4">
              <div className="flex items-start gap-3 mb-3">
                <div className={cn("w-11 h-11 rounded-xl border flex items-center justify-center shrink-0", colorMap[current.color])}>
                  {current.icon}
                </div>
                <div>
                  <h3 className="text-base font-bold text-slate-100">{current.title}</h3>
                  <p className="text-xs text-slate-400 mt-1 leading-relaxed">{current.description}</p>
                </div>
              </div>

              {current.tip && (
                <div className="bg-slate-800/70 border border-slate-700 rounded-xl px-3 py-2 mb-4">
                  <p className="text-[11px] text-slate-300 leading-relaxed">{current.tip}</p>
                </div>
              )}

              <div className="flex items-center justify-between gap-2">
                <button
                  onClick={() => setStep((s) => Math.max(0, s - 1))}
                  disabled={step === 0}
                  className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl bg-slate-800 border border-slate-700 text-slate-300 disabled:opacity-40 disabled:cursor-not-allowed"
                >
                  <ChevronLeft className="w-4 h-4" />
                  Back
                </button>
                <div className="flex gap-1.5">
                  {STEPS.map((_, i) => (
                    <button
                      key={i}
                      onClick={() => setStep(i)}
                      className={cn("w-2.5 h-2.5 rounded-full", i === step ? dotMap[current.color] : "bg-slate-700")}
                    />
                  ))}
                </div>
                {step < STEPS.length - 1 ? (
                  <button
                    onClick={() => setStep((s) => s + 1)}
                    className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl bg-emerald-600 text-white font-semibold"
                  >
                    Next
                    <ChevronRight className="w-4 h-4" />
                  </button>
                ) : (
                  <button onClick={close} className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl bg-emerald-600 text-white font-semibold">
                    Finish
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
