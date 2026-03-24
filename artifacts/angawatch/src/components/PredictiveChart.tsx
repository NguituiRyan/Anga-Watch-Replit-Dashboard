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
  Legend
} from "recharts";

interface PredictiveChartProps {
  node: NodeData;
}

const CRITICAL_THRESHOLD = 1500;

export function PredictiveChart({ node }: PredictiveChartProps) {
  return (
    <div className="bg-slate-800/50 backdrop-blur-sm border border-white/10 rounded-2xl p-6 mb-6">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h3 className="text-lg font-semibold text-slate-200">14-Day Predictive Discharge Model</h3>
          <p className="text-sm font-mono text-slate-500 mt-1">{node.name} — Tana River Basin</p>
        </div>
        <div className="flex items-center gap-4 text-xs font-mono">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-blue-500"></div>
            <span className="text-slate-300">Predicted (m³/s)</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-0 border-t-2 border-dashed border-red-500"></div>
            <span className="text-slate-300">Critical Threshold</span>
          </div>
        </div>
      </div>
      
      <div className="h-[350px] w-full">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart
            data={node.chartData}
            margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
          >
            <CartesianGrid strokeDasharray="3 3" stroke="#334155" vertical={false} />
            <XAxis 
              dataKey="day" 
              stroke="#64748b" 
              tick={{ fill: '#64748b', fontSize: 12, fontFamily: 'monospace' }} 
              axisLine={false}
              tickLine={false}
              dy={10}
            />
            <YAxis 
              stroke="#64748b" 
              tick={{ fill: '#64748b', fontSize: 12, fontFamily: 'monospace' }} 
              axisLine={false}
              tickLine={false}
              dx={-10}
            />
            <Tooltip
              contentStyle={{ 
                backgroundColor: 'rgba(15, 23, 42, 0.9)', 
                backdropFilter: 'blur(8px)',
                borderColor: '#334155', 
                color: '#f8fafc',
                borderRadius: '8px',
                boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.5)'
              }}
              itemStyle={{ color: '#3b82f6', fontWeight: 'bold' }}
              labelStyle={{ color: '#94a3b8', marginBottom: '4px', fontSize: '12px', fontFamily: 'monospace' }}
            />
            
            <ReferenceLine 
              y={CRITICAL_THRESHOLD} 
              stroke="#ef4444" 
              strokeDasharray="4 4" 
              strokeWidth={2}
              label={{ 
                position: 'insideTopLeft', 
                value: 'CRITICAL EVACUATION THRESHOLD', 
                fill: '#ef4444', 
                fontSize: 11,
                fontFamily: 'monospace',
                fontWeight: 'bold',
                dy: -10
              }} 
            />
            
            <Line 
              type="monotone" 
              dataKey="discharge" 
              name="Discharge"
              stroke="#3b82f6" 
              strokeWidth={4} 
              dot={{ r: 4, fill: '#1e293b', stroke: '#3b82f6', strokeWidth: 2 }} 
              activeDot={{ r: 6, fill: '#3b82f6', stroke: '#fff', strokeWidth: 2 }}
              animationDuration={1500}
              animationEasing="ease-out"
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
