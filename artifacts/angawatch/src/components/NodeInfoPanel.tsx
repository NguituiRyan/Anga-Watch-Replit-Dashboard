import { X, MapPin, Calendar, Cpu, Wifi, Zap, Radio, Droplets, ShieldCheck } from "lucide-react";
import { type NodeData } from "@/hooks/use-mock-data";
import protoImg from "@assets/prototype_1774370092966.png";

interface NodeInfoPanelProps {
  node: NodeData;
  onClose: () => void;
}

const specs = [
  { icon: <Cpu className="w-4 h-4 text-slate-400" />, label: "MCU", value: "Arduino Mega 2560" },
  { icon: <Droplets className="w-4 h-4 text-slate-400" />, label: "Sensor", value: "HC-SR04 Ultrasonic (waterproof)" },
  { icon: <Radio className="w-4 h-4 text-slate-400" />, label: "Comms", value: "SIM800L GSM + LoRa 915 MHz" },
  { icon: <Zap className="w-4 h-4 text-slate-400" />, label: "Power", value: "6V 3W Solar + 18650 Li-ion" },
  { icon: <Wifi className="w-4 h-4 text-slate-400" />, label: "Mesh", value: "Daisy-chain topology, self-healing" },
  { icon: <ShieldCheck className="w-4 h-4 text-slate-400" />, label: "Enclosure", value: "IP65 polycarbonate, UV-stable" },
];

export function NodeInfoPanel({ node, onClose }: NodeInfoPanelProps) {
  const batteryColor = node.battery > 70 ? "text-emerald-400" : node.battery > 40 ? "text-amber-400" : "text-red-400";

  return (
    <>
      <div
        className="fixed inset-0 z-[8000] bg-black/50 backdrop-blur-sm"
        onClick={onClose}
      />

      <div className="fixed right-0 top-0 bottom-0 z-[8001] w-full max-w-[440px] bg-slate-950 border-l border-white/10 overflow-y-auto shadow-2xl animate-in slide-in-from-right duration-300">
        <div className="sticky top-0 bg-slate-950/95 backdrop-blur-sm border-b border-white/10 px-6 py-4 flex items-center justify-between z-10">
          <div>
            <p className="text-[10px] font-mono uppercase tracking-widest text-slate-500">Hardware Details</p>
            <h2 className="text-lg font-bold text-slate-100">{node.name} — {node.location}</h2>
          </div>
          <button
            onClick={onClose}
            className="w-9 h-9 rounded-xl bg-slate-800 border border-slate-700 flex items-center justify-center text-slate-400 hover:text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 space-y-6">
          <div className="rounded-2xl overflow-hidden border border-white/10 bg-slate-900">
            <img
              src={protoImg}
              alt="AngaWatch sensor unit prototype"
              className="w-full object-cover"
            />
            <div className="px-4 py-2.5 flex items-center justify-between">
              <span className="text-[10px] font-mono text-slate-500">AngaWatch Sensor Unit v1.2</span>
              <span className="text-[10px] font-mono text-emerald-400 border border-emerald-500/30 bg-emerald-950/30 px-2 py-0.5 rounded">PROTOTYPE</span>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="bg-slate-900/60 border border-slate-700/50 rounded-xl p-4">
              <p className="text-[10px] font-mono text-slate-500 uppercase tracking-widest mb-1">Mesh ID</p>
              <p className="text-lg font-bold font-mono text-slate-100">{node.meshId}</p>
            </div>
            <div className="bg-slate-900/60 border border-slate-700/50 rounded-xl p-4">
              <p className="text-[10px] font-mono text-slate-500 uppercase tracking-widest mb-1">Uptime</p>
              <p className="text-lg font-bold font-mono text-emerald-400">{node.uptime}</p>
            </div>
            <div className="bg-slate-900/60 border border-slate-700/50 rounded-xl p-4">
              <p className="text-[10px] font-mono text-slate-500 uppercase tracking-widest mb-1">Battery</p>
              <p className={`text-lg font-bold font-mono ${batteryColor}`}>{node.battery}%</p>
            </div>
            <div className="bg-slate-900/60 border border-slate-700/50 rounded-xl p-4">
              <p className="text-[10px] font-mono text-slate-500 uppercase tracking-widest mb-1">Last Ping</p>
              <p className="text-lg font-bold font-mono text-slate-200">{node.lastPing}</p>
            </div>
          </div>

          <div className="bg-slate-900/60 border border-slate-700/50 rounded-xl p-4 space-y-3">
            <div className="flex items-center gap-2.5">
              <MapPin className="w-4 h-4 text-emerald-400 shrink-0" />
              <div>
                <p className="text-[10px] font-mono text-slate-500 uppercase">GPS Coordinates</p>
                <p className="text-sm font-mono text-slate-200 tabular-nums">
                  {node.lat.toFixed(4)}°, {node.lng.toFixed(4)}°
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2.5">
              <Calendar className="w-4 h-4 text-blue-400 shrink-0" />
              <div>
                <p className="text-[10px] font-mono text-slate-500 uppercase">Installed</p>
                <p className="text-sm font-mono text-slate-200">{node.installedDate}</p>
              </div>
            </div>
            <div className="flex items-center gap-2.5">
              <Wifi className="w-4 h-4 text-cyan-400 shrink-0" />
              <div>
                <p className="text-[10px] font-mono text-slate-500 uppercase">Signal Strength</p>
                <div className="flex items-end gap-0.5 h-3 mt-0.5">
                  {Array.from({ length: 4 }).map((_, i) => (
                    <div
                      key={i}
                      className={`w-2 rounded-sm ${i < node.signal ? "bg-emerald-400" : "bg-slate-700"}`}
                      style={{ height: `${((i + 1) / 4) * 100}%` }}
                    />
                  ))}
                </div>
              </div>
            </div>
          </div>

          <div>
            <h3 className="text-xs font-mono text-slate-500 uppercase tracking-widest border-b border-slate-700 pb-2 mb-3">
              Hardware Specifications
            </h3>
            <div className="space-y-2.5">
              {specs.map((s) => (
                <div key={s.label} className="flex items-start gap-3">
                  <div className="mt-0.5 shrink-0">{s.icon}</div>
                  <div className="flex-1 flex items-baseline justify-between gap-4 border-b border-slate-800 pb-2">
                    <span className="text-xs font-mono text-slate-500 uppercase shrink-0">{s.label}</span>
                    <span className="text-xs font-mono text-slate-200 text-right">{s.value}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-emerald-950/30 border border-emerald-500/20 rounded-xl p-4 flex items-center gap-4">
            <ShieldCheck className="w-8 h-8 text-emerald-400 shrink-0" />
            <div>
              <p className="text-sm font-semibold text-emerald-300">Production-grade reliability</p>
              <p className="text-[11px] text-emerald-400/60 font-mono mt-0.5">
                {node.uptime} uptime last 30 days · Auto-restarts on fault · Self-healing mesh fallback
              </p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
