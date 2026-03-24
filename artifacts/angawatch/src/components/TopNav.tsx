import { useEffect, useState } from "react";
import { format } from "date-fns";
import { Droplets, Activity } from "lucide-react";
import { cn } from "@/lib/utils";

export function TopNav() {
  const [time, setTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  return (
    <header className="h-16 w-full border-b border-white/5 bg-slate-900/90 backdrop-blur-xl flex items-center justify-between px-6 z-50 sticky top-0">
      {/* Brand */}
      <div className="flex items-center gap-3">
        <div className="relative flex items-center justify-center w-10 h-10 rounded-xl bg-slate-800 border border-emerald-500/20 glow-primary">
          <Droplets className="w-5 h-5 text-emerald-400" />
        </div>
        <div>
          <h1 className="text-xl font-bold tracking-tight text-slate-100 flex items-center gap-2">
            AngaWatch
            <span className="px-2 py-0.5 rounded bg-slate-800 text-slate-400 text-[10px] font-mono uppercase tracking-wider border border-white/5">
              POC V1.2
            </span>
          </h1>
        </div>
      </div>

      {/* Right Controls */}
      <div className="flex items-center gap-6">
        {/* Clock */}
        <div className="font-mono text-sm text-slate-400 flex flex-col items-end">
          <span className="text-slate-200">{format(time, "HH:mm:ss 'UTC'")}</span>
          <span className="text-[10px]">{format(time, "dd MMM yyyy")}</span>
        </div>

        {/* Status Badge */}
        <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 glow-primary">
          <Activity className="w-4 h-4 text-emerald-400" />
          <span className="text-xs font-mono text-emerald-400 uppercase tracking-wide font-medium">
            System Status: Mesh Active
          </span>
          <span className="relative flex h-2 w-2 ml-1">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
          </span>
        </div>
      </div>
    </header>
  );
}
