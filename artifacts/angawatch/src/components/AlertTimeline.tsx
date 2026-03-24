import { cn } from "@/lib/utils";

interface TimelineEvent {
  hoursAgo: number;
  node: string;
  from: "NORMAL" | "ELEVATED" | "CRITICAL";
  to: "NORMAL" | "ELEVATED" | "CRITICAL";
}

const EVENTS: TimelineEvent[] = [
  { hoursAgo: 62, node: "Garsen",     from: "NORMAL",   to: "ELEVATED" },
  { hoursAgo: 48, node: "Hola Bridge", from: "NORMAL",  to: "ELEVATED" },
  { hoursAgo: 24, node: "Garsen",     from: "ELEVATED", to: "ELEVATED" },
  { hoursAgo: 18, node: "Hola Bridge", from: "ELEVATED", to: "CRITICAL" },
  { hoursAgo: 6,  node: "Hola Bridge", from: "CRITICAL", to: "CRITICAL" },
];

const statusColor = {
  NORMAL:   { dot: "bg-emerald-500", label: "text-emerald-400", ring: "ring-emerald-500/30" },
  ELEVATED: { dot: "bg-amber-500",   label: "text-amber-400",   ring: "ring-amber-500/30" },
  CRITICAL: { dot: "bg-red-500",     label: "text-red-400",     ring: "ring-red-500/30" },
};

export function AlertTimeline() {
  const totalHours = 72;

  return (
    <div className="bg-slate-800/40 border border-white/5 rounded-2xl px-4 py-3 mb-6">
      <div className="flex items-center justify-between mb-3">
        <p className="text-[10px] font-mono uppercase tracking-widest text-slate-500">
          72-Hour Status Timeline
        </p>
        <div className="flex items-center gap-4 text-[9px] font-mono text-slate-600">
          <span className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-emerald-500 inline-block" />Normal</span>
          <span className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-amber-500 inline-block" />Elevated</span>
          <span className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-red-500 inline-block" />Critical</span>
        </div>
      </div>

      {/* Track */}
      <div className="relative h-8">
        {/* Background bar */}
        <div className="absolute top-1/2 left-0 right-0 -translate-y-1/2 h-1 bg-slate-700/60 rounded-full" />

        {/* Hour ticks */}
        {[72, 60, 48, 36, 24, 12, 0].map((h) => (
          <div
            key={h}
            className="absolute top-1/2 -translate-y-1/2 flex flex-col items-center"
            style={{ left: `${((totalHours - h) / totalHours) * 100}%` }}
          >
            <div className="w-px h-2 bg-slate-600" />
            <span className="text-[8px] font-mono text-slate-600 mt-1 whitespace-nowrap">
              {h === 0 ? "NOW" : `-${h}h`}
            </span>
          </div>
        ))}

        {/* Event dots */}
        {EVENTS.map((ev, i) => {
          const pct = ((totalHours - ev.hoursAgo) / totalHours) * 100;
          const c = statusColor[ev.to];
          return (
            <div
              key={i}
              className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 group cursor-default"
              style={{ left: `${pct}%` }}
            >
              <div className={cn("w-3 h-3 rounded-full ring-2 ring-offset-1 ring-offset-slate-800", c.dot, c.ring)} />
              {/* Tooltip */}
              <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 hidden group-hover:block z-10 pointer-events-none">
                <div className="bg-slate-900 border border-slate-700 rounded-lg px-2.5 py-2 shadow-xl whitespace-nowrap">
                  <p className="text-[10px] font-mono text-slate-300 font-semibold">{ev.node}</p>
                  <p className="text-[9px] font-mono text-slate-500">
                    {ev.from} → <span className={cn("font-bold", c.label)}>{ev.to}</span>
                  </p>
                  <p className="text-[9px] font-mono text-slate-600">{ev.hoursAgo}h ago</p>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Node current statuses */}
      <div className="flex items-center gap-4 mt-2">
        {[
          { name: "Garissa", status: "NORMAL" as const },
          { name: "Hola Bridge", status: "CRITICAL" as const },
          { name: "Garsen", status: "ELEVATED" as const },
        ].map((n) => (
          <div key={n.name} className="flex items-center gap-1.5">
            <span className={cn("w-1.5 h-1.5 rounded-full", statusColor[n.status].dot)} />
            <span className="text-[9px] font-mono text-slate-500">{n.name}</span>
            <span className={cn("text-[9px] font-mono font-bold", statusColor[n.status].label)}>{n.status}</span>
          </div>
        ))}
        <div className="ml-auto text-[9px] font-mono text-slate-600">Hover events for details</div>
      </div>
    </div>
  );
}
