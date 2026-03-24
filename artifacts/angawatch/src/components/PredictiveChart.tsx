import { type NodeData } from "@/hooks/use-mock-data";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  ReferenceLine,
  Legend,
} from "recharts";
import { useEffect, useRef, useState } from "react";

interface PredictiveChartProps {
  node: NodeData;
}

const CRITICAL_THRESHOLD = 1500;

export function PredictiveChart({ node }: PredictiveChartProps) {
  const ref = useRef<HTMLDivElement>(null);
  const [animated, setAnimated] = useState(false);
  const [showLine, setShowLine] = useState(false);

  useEffect(() => {
    setAnimated(false);
    setShowLine(false);
    const timeout = setTimeout(() => setShowLine(true), 100);
    return () => clearTimeout(timeout);
  }, [node.id]);

  useEffect(() => {
    if (!ref.current) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !animated) {
          setAnimated(true);
        }
      },
      { threshold: 0.3 }
    );
    observer.observe(ref.current);
    return () => observer.disconnect();
  }, [animated]);

  return (
    <div
      ref={ref}
      className="bg-slate-800/50 backdrop-blur-sm border border-white/10 rounded-2xl p-6 mb-6"
    >
      <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-6 gap-3">
        <div>
          <h3 className="text-lg font-semibold text-slate-200">
            Predictive Discharge Model
          </h3>
          <p className="text-sm font-mono text-slate-500 mt-1">
            {node.name} — Tana River Basin
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-4 text-xs font-mono">
          <div className="flex items-center gap-2">
            <div className="w-8 h-0 border-t-2 border-blue-400" />
            <span className="text-slate-300">Observed</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-8 h-0 border-t-2 border-dashed border-blue-400/60" />
            <span className="text-slate-300">AI Predicted</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-0 border-t-2 border-dashed border-red-500" />
            <span className="text-slate-300">Critical Threshold</span>
          </div>
        </div>
      </div>

      <div className="h-[320px] w-full">
        {showLine && (
          <ResponsiveContainer width="100%" height="100%">
            <LineChart
              data={node.chartData}
              margin={{ top: 10, right: 40, left: 0, bottom: 0 }}
            >
              <CartesianGrid strokeDasharray="3 3" stroke="#334155" vertical={false} />
              <XAxis
                dataKey="day"
                stroke="#64748b"
                tick={{ fill: "#64748b", fontSize: 11, fontFamily: "monospace" }}
                axisLine={false}
                tickLine={false}
                dy={10}
              />
              <YAxis
                stroke="#64748b"
                tick={{ fill: "#64748b", fontSize: 11, fontFamily: "monospace" }}
                axisLine={false}
                tickLine={false}
                dx={-10}
                domain={[0, 3200]}
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: "rgba(15, 23, 42, 0.95)",
                  borderColor: "#334155",
                  color: "#f8fafc",
                  borderRadius: "8px",
                  boxShadow: "0 10px 25px -5px rgba(0,0,0,0.5)",
                  fontFamily: "monospace",
                  fontSize: 12,
                }}
                itemStyle={{ color: "#60a5fa" }}
                labelStyle={{ color: "#94a3b8", marginBottom: "4px" }}
                formatter={(val: number, name: string) => [
                  `${val} m³/s`,
                  name === "discharge_observed" ? "Observed" : "AI Predicted",
                ]}
              />

              {/* Critical threshold */}
              <ReferenceLine
                y={CRITICAL_THRESHOLD}
                stroke="#ef4444"
                strokeDasharray="5 5"
                strokeWidth={2}
                label={{
                  position: "insideTopLeft",
                  value: "CRITICAL EVACUATION THRESHOLD",
                  fill: "#ef4444",
                  fontSize: 10,
                  fontFamily: "monospace",
                  fontWeight: "bold",
                  dy: -10,
                }}
              />

              {/* TODAY vertical line */}
              <ReferenceLine
                x="TODAY"
                stroke="rgba(255,255,255,0.5)"
                strokeDasharray="4 4"
                strokeWidth={2}
                label={{
                  position: "insideTopRight",
                  value: "NOW",
                  fill: "rgba(255,255,255,0.7)",
                  fontSize: 10,
                  fontFamily: "monospace",
                  fontWeight: "bold",
                  dy: -10,
                  dx: -5,
                }}
              />

              {/* Observed — solid blue */}
              <Line
                type="monotone"
                dataKey="discharge_observed"
                name="discharge_observed"
                stroke="#3b82f6"
                strokeWidth={3}
                dot={{ r: 3, fill: "#1e293b", stroke: "#3b82f6", strokeWidth: 2 }}
                activeDot={{ r: 5, fill: "#3b82f6", stroke: "#fff", strokeWidth: 2 }}
                connectNulls={false}
                isAnimationActive={animated}
                animationDuration={1800}
                animationEasing="ease-out"
              />

              {/* Predicted — dashed blue */}
              <Line
                type="monotone"
                dataKey="discharge_predicted"
                name="discharge_predicted"
                stroke="#3b82f6"
                strokeWidth={3}
                strokeDasharray="8 4"
                strokeOpacity={0.7}
                dot={{ r: 3, fill: "#1e293b", stroke: "#60a5fa", strokeWidth: 2 }}
                activeDot={{ r: 5, fill: "#60a5fa", stroke: "#fff", strokeWidth: 2 }}
                connectNulls={false}
                isAnimationActive={animated}
                animationDuration={2400}
                animationEasing="ease-out"
              />
            </LineChart>
          </ResponsiveContainer>
        )}
      </div>

      <p className="text-center text-[10px] font-mono text-slate-600 mt-3">
        ← Observed &nbsp;|&nbsp; Predicted →
      </p>
    </div>
  );
}
