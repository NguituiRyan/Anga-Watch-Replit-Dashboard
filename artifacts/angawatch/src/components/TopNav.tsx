import { useEffect, useState } from "react";
import { format } from "date-fns";
import { Activity, Menu, Sun, Moon } from "lucide-react";
import { cn } from "@/lib/utils";
import logoUrl from "@assets/favicon_1774360352247.png";

interface TopNavProps {
  onMenuOpen?: () => void;
}

export function TopNav({ onMenuOpen }: TopNavProps) {
  const [time, setTime] = useState(new Date());
  const [lightMode, setLightMode] = useState(false);

  useEffect(() => {
    const timer = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    if (lightMode) {
      document.documentElement.classList.add("light-mode");
    } else {
      document.documentElement.classList.remove("light-mode");
    }
  }, [lightMode]);

  return (
    <header className="h-14 md:h-16 w-full border-b border-white/5 bg-slate-900/90 backdrop-blur-xl flex items-center justify-between px-4 md:px-6 z-50 sticky top-0">
      <div className="flex items-center gap-2 md:gap-3">
        {onMenuOpen && (
          <button
            onClick={onMenuOpen}
            className="md:hidden flex items-center justify-center w-9 h-9 rounded-lg bg-slate-800 border border-slate-700 text-slate-400 hover:text-white hover:border-slate-500 transition-all mr-1"
            aria-label="Open node menu"
          >
            <Menu className="w-5 h-5" />
          </button>
        )}

        <div className="flex items-center justify-center w-9 h-9 md:w-10 md:h-10 rounded-xl bg-slate-800 border border-emerald-500/20 glow-primary overflow-hidden shrink-0">
          <img src={logoUrl} alt="AngaWatch logo" className="w-full h-full object-cover" />
        </div>
        <div>
          <h1 className="text-lg md:text-xl font-bold tracking-tight text-slate-100 flex items-center gap-2">
            AngaWatch
            <span className="hidden sm:inline px-2 py-0.5 rounded bg-slate-800 text-slate-400 text-[10px] font-mono uppercase tracking-wider border border-white/5">
              POC V1.2
            </span>
          </h1>
        </div>
      </div>

      <div className="flex items-center gap-2 md:gap-4">
        <div className="font-mono text-sm text-slate-400 flex flex-col items-end">
          <span className="text-slate-200 text-xs md:text-sm">{format(time, "HH:mm:ss")}</span>
          <span className="text-[9px] md:text-[10px] hidden sm:block">{format(time, "dd MMM yyyy")}</span>
        </div>

        <div className="hidden sm:flex items-center gap-2 px-2 md:px-3 py-1 md:py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 glow-primary">
          <Activity className="w-3.5 h-3.5 md:w-4 md:h-4 text-emerald-400" />
          <span className={cn("text-[10px] md:text-xs font-mono text-emerald-400 uppercase tracking-wide font-medium hidden lg:inline")}>
            System Status: Mesh Active
          </span>
          <span className="relative flex h-2 w-2 ml-0 md:ml-1">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
            <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500" />
          </span>
        </div>

        {/* Mobile status dot */}
        <div className="sm:hidden flex items-center gap-1.5 px-2 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20">
          <Activity className="w-3.5 h-3.5 text-emerald-400" />
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
            <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500" />
          </span>
        </div>

        {/* Dark / Light mode toggle */}
        <button
          onClick={() => setLightMode(!lightMode)}
          className={cn(
            "flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl border text-xs font-mono transition-all",
            lightMode
              ? "bg-amber-400/15 border-amber-400/40 text-amber-300 hover:bg-amber-400/25"
              : "bg-slate-800 border-slate-700 text-slate-400 hover:border-slate-500 hover:text-slate-200"
          )}
          title={lightMode ? "Switch to dark mode" : "Switch to light mode"}
        >
          {lightMode ? <Sun className="w-3.5 h-3.5" /> : <Moon className="w-3.5 h-3.5" />}
          <span className="hidden sm:inline">{lightMode ? "Light" : "Dark"}</span>
        </button>
      </div>
    </header>
  );
}
