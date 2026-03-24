import { type NodeData } from "@/hooks/use-mock-data";
import {
  ComposedChart,
  Line,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  ReferenceLine,
} from "recharts";
import { useEffect, useRef, useState } from "react";

interface PredictiveChartProps {
  node: NodeData;
}

const CRITICAL_THRESHOLD = 1500;

function CustomTooltip({ active, payload, label }: any) {
  if (!active || !payload?.length) return null;
  const get = (key: string) => payload.find((p: any) => p.dataKey === key)?.value;
  const obs = get("discharge_observed");
  const pred = get("discharge_predicted");
  const rain = get("rainfall");

  return (
    <div className="bg-slate-900/95 border border-slate-700 rounded-xl px-4 py-3 shadow-2xl font-mono text-xs">
      <p className="text-slate-400 mb-2 font-semibold">{label}</p>
      {obs != null && <p className="text-blue-400">Observed: {obs} m³/s</p>}
      {pred != null && <p className="text-blue-300">AI Predicted: {pred} m³/s</p>}
      {rain != null && <p className="text-teal-400">Rainfall: {rain} mm/hr</p>}
    </div>
  );
}

export function PredictiveChart({ node }: PredictiveChartProps) {
  const ref = useRef<HTMLDivElement>(null);
  const [animated, setAnimated] = useState(false);
  const [showLine, setShowLine] = useState(false);
  const [showRainfall, setShowRainfall] = useState(true);
  const [showCI, setShowCI] = useState(true);

  useEffect(() => {
    setAnimated(false);
    setShowLine(false);
    const timeout = setTimeout(() => setShowLine(true), 100);
    return () => clearTimeout(timeout);
  }, [node.id]);

  useEffect(() => {
    if (!ref.current) return;
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting && !animated) setAnimated(true); },
      { threshold: 0.3 }
    );
    observer.observe(ref.current);
    return () => observer.disconnect();
  }, [animated]);

  return (
    <div ref={ref} className="bg-slate-800/50 backdrop-blur-sm border border-white/10 rounded-2xl p-4 md:p-6 mb-6">
      <div className="flex flex-col sm:flex-row sm:items-start justify-between mb-4 gap-3">
        <div>
          <h3 className="text-lg font-semibold text-slate-200">Predictive Discharge Model</h3>
          <p className="text-sm font-mono text-slate-500 mt-1">{node.name} — Tana River Basin</p>
        </div>
        <div className="flex flex-wrap items-center gap-3 text-[11px] font-mono">
          <div className="flex items-center gap-1.5">
            <div className="w-6 h-0 border-t-2 border-blue-400" />
            <span className="text-slate-300">Observed</span>
          </div>
          <div className="flex items-center gap-1.5">
            <div className="w-6 h-0 border-t-2 border-dashed border-blue-400/60" />
            <span className="text-slate-300">AI Forecast</span>
          </div>
          <button
            onClick={() => setShowCI(!showCI)}
            className={`flex items-center gap-1.5 px-2 py-0.5 rounded-md border transition-all ${showCI ? "border-blue-500/30 bg-blue-500/10" : "border-slate-700 bg-transparent opacity-50"}`}
          >
            <div className="w-5 h-2.5 rounded-sm bg-blue-400/20 border border-blue-400/40" />
            <span className="text-slate-300">CI ±15%</span>
          </button>
          <button
            onClick={() => setShowRainfall(!showRainfall)}
            className={`flex items-center gap-1.5 px-2 py-0.5 rounded-md border transition-all ${showRainfall ? "border-teal-500/30 bg-teal-500/10" : "border-slate-700 bg-transparent opacity-50"}`}
          >
            <div className="w-5 h-0 border-t-2 border-teal-400" />
            <span className="text-slate-300">Rainfall</span>
          </button>
          <div className="flex items-center gap-1.5">
            <div className="w-4 h-0 border-t-2 border-dashed border-red-500" />
            <span className="text-slate-300">Critical</span>
          </div>
        </div>
      </div>

      <div className="h-[220px] sm:h-[280px] md:h-[340px] w-full">
        {showLine && (
          <ResponsiveContainer width="100%" height="100%">
            <ComposedChart data={node.chartData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
              <defs>
                <linearGradient id="ciGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#3b82f6" stopOpacity={0.18} />
                  <stop offset="100%" stopColor="#3b82f6" stopOpacity={0.04} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#334155" vertical={false} />
              <XAxis
                dataKey="day"
                stroke="#64748b"
                tick={{ fill: "#64748b", fontSize: 10, fontFamily: "monospace" }}
                axisLine={false}
                tickLine={false}
                dy={10}
              />
              <YAxis
                yAxisId="left"
                stroke="#64748b"
                tick={{ fill: "#64748b", fontSize: 10, fontFamily: "monospace" }}
                axisLine={false}
                tickLine={false}
                dx={-8}
                domain={[0, 3200]}
                width={42}
              />
              {showRainfall && (
                <YAxis
                  yAxisId="right"
                  orientation="right"
                  stroke="#64748b"
                  tick={{ fill: "#0d9488", fontSize: 10, fontFamily: "monospace" }}
                  axisLine={false}
                  tickLine={false}
                  dx={8}
                  domain={[0, 120]}
                  width={36}
                  tickFormatter={(v) => `${v}mm`}
                />
              )}
              <Tooltip content={<CustomTooltip />} />

              <ReferenceLine
                yAxisId="left"
                y={CRITICAL_THRESHOLD}
                stroke="#ef4444"
                strokeDasharray="5 5"
                strokeWidth={2}
                label={{ position: "insideTopLeft", value: "CRITICAL THRESHOLD", fill: "#ef4444", fontSize: 9, fontFamily: "monospace", fontWeight: "bold", dy: -10 }}
              />
              <ReferenceLine
                yAxisId="left"
                x="TODAY"
                stroke="rgba(255,255,255,0.4)"
                strokeDasharray="4 4"
                strokeWidth={2}
                label={{ position: "insideTopRight", value: "NOW", fill: "rgba(255,255,255,0.6)", fontSize: 9, fontFamily: "monospace", fontWeight: "bold", dy: -10, dx: -5 }}
              />

              {/* Confidence interval band */}
              {showCI && (
                <>
                  <Area yAxisId="left" type="monotone" dataKey="ci_lower" stackId="ci" fill="transparent" stroke="none" dot={false} legendType="none" connectNulls={false} />
                  <Area yAxisId="left" type="monotone" dataKey="ci_band"  stackId="ci" fill="url(#ciGradient)" stroke="rgba(96,165,250,0.25)" strokeWidth={1} strokeDasharray="3 3" dot={false} legendType="none" connectNulls={false} isAnimationActive={false} />
                </>
              )}

              {/* Rainfall bar (right axis) */}
              {showRainfall && (
                <Line
                  yAxisId="right"
                  type="monotone"
                  dataKey="rainfall"
                  stroke="#0d9488"
                  strokeWidth={2}
                  dot={false}
                  connectNulls={false}
                  isAnimationActive={animated}
                  animationDuration={1400}
                  animationEasing="ease-out"
                  strokeDasharray="0"
                  strokeOpacity={0.8}
                />
              )}

              {/* Observed discharge */}
              <Line
                yAxisId="left"
                type="monotone"
                dataKey="discharge_observed"
                stroke="#3b82f6"
                strokeWidth={3}
                dot={{ r: 3, fill: "#1e293b", stroke: "#3b82f6", strokeWidth: 2 }}
                activeDot={{ r: 5, fill: "#3b82f6", stroke: "#fff", strokeWidth: 2 }}
                connectNulls={false}
                isAnimationActive={animated}
                animationDuration={1800}
                animationEasing="ease-out"
              />

              {/* Predicted discharge */}
              <Line
                yAxisId="left"
                type="monotone"
                dataKey="discharge_predicted"
                stroke="#60a5fa"
                strokeWidth={3}
                strokeDasharray="8 4"
                strokeOpacity={0.85}
                dot={{ r: 3, fill: "#1e293b", stroke: "#60a5fa", strokeWidth: 2 }}
                activeDot={{ r: 5, fill: "#60a5fa", stroke: "#fff", strokeWidth: 2 }}
                connectNulls={false}
                isAnimationActive={animated}
                animationDuration={2400}
                animationEasing="ease-out"
              />
            </ComposedChart>
          </ResponsiveContainer>
        )}
      </div>
      <p className="text-center text-[10px] font-mono text-slate-600 mt-2">
        ← Observed &nbsp;|&nbsp; AI Forecast → &nbsp;·&nbsp; Confidence: 87% &nbsp;·&nbsp; Model: LSTM-v3.1
      </p>
    </div>
  );
}
