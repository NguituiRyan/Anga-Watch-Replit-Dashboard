import { Smartphone, Send, Globe2, Clock } from "lucide-react";

export function SmsSimulator() {
  return (
    <div className="bg-slate-800/50 backdrop-blur-sm border border-white/10 rounded-2xl p-6 lg:p-8">
      <div className="flex flex-col lg:flex-row gap-10 items-center">
        
        {/* Feature Phone Mockup */}
        <div className="shrink-0 w-64 h-[440px] bg-slate-950 rounded-[2.5rem] border-[8px] border-slate-700 relative shadow-2xl overflow-hidden flex flex-col justify-between">
          {/* Speaker slit */}
          <div className="absolute top-4 left-1/2 -translate-x-1/2 w-12 h-1 bg-slate-800 rounded-full"></div>
          
          {/* Screen Area */}
          <div className="mt-10 mx-3 h-[200px] bg-[#07160c] border-4 border-slate-900 rounded-xl flex flex-col overflow-hidden relative shadow-inner">
            {/* Screen Header */}
            <div className="bg-emerald-500 text-slate-950 font-bold px-2 py-0.5 text-center text-[10px] tracking-widest shrink-0">
              ANGAWATCH ALERT
            </div>
            
            {/* Screen Content */}
            <div className="p-2.5 text-[10px] font-mono text-emerald-400/90 leading-tight flex-1 overflow-y-auto">
              <p>FROM: AngaWatch</p>
              <p className="mb-2">DATE: 24 MAR 2026 09:30</p>
              
              <p className="font-bold text-red-500">FLOOD ALERT - LEVEL 3</p>
              <br/>
              <p>Hola Bridge (Tana River)</p>
              <p>Water rising rapidly.</p>
              <p className="font-bold text-emerald-300">EVACUATE LOW-LYING AREAS IMMEDIATELY.</p>
              <br/>
              <p className="text-[9px] text-emerald-500/60">Next update: 3 hours</p>
              <p className="text-[9px] text-emerald-500/60">Reply STOP to unsubscribe</p>
            </div>

            {/* Screen Footer */}
            <div className="bg-[#050f08] border-t border-emerald-900/50 px-2 py-1 flex justify-between items-center text-[8px] text-emerald-500/80 font-mono shrink-0">
              <span>OPTIONS</span>
              <span>INBOX | 1/1</span>
              <span>BACK</span>
            </div>
            
            {/* Scanline overlay for realism */}
            <div className="absolute inset-0 bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.1)_50%)] bg-[length:100%_4px] pointer-events-none opacity-20"></div>
          </div>

          {/* Keypad Mockup */}
          <div className="h-32 px-4 pb-4 w-full flex flex-col gap-1.5 mt-2">
            <div className="flex justify-between px-2 mb-1">
              <div className="w-10 h-4 bg-slate-800 rounded-full"></div>
              <div className="w-12 h-6 bg-slate-800 rounded-full border-2 border-slate-700"></div>
              <div className="w-10 h-4 bg-slate-800 rounded-full"></div>
            </div>
            <div className="grid grid-cols-3 gap-2 flex-1">
              {Array.from({ length: 12 }).map((_, i) => (
                <div key={i} className="bg-slate-800/80 rounded flex items-center justify-center shadow-sm border border-white/5">
                  <div className="w-1.5 h-1.5 bg-slate-700 rounded-full"></div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Info Panel */}
        <div className="flex-1">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-800 border border-slate-700 mb-4">
            <Smartphone className="w-4 h-4 text-emerald-400" />
            <span className="text-xs font-medium text-slate-300">Last-Mile Communication</span>
          </div>
          
          <h3 className="text-2xl font-bold text-slate-100 mb-3">Community Alert Gateway</h3>
          <p className="text-slate-400 text-sm leading-relaxed mb-8 max-w-lg">
            AngaWatch's SMS gateway reaches rural communities with no internet access, delivering life-saving flood warnings directly to basic feature phones via telecom mesh routing.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
            <div className="bg-slate-900/50 border border-slate-700 rounded-xl p-4">
              <Send className="w-5 h-5 text-blue-400 mb-2" />
              <div className="text-2xl font-mono font-bold text-slate-200">2,847</div>
              <div className="text-xs text-slate-500 uppercase tracking-wide mt-1">SMS Dispatched</div>
            </div>
            <div className="bg-slate-900/50 border border-slate-700 rounded-xl p-4">
              <Globe2 className="w-5 h-5 text-emerald-400 mb-2" />
              <div className="text-2xl font-mono font-bold text-slate-200">3</div>
              <div className="text-xs text-slate-500 uppercase tracking-wide mt-1">Languages (EN, SW, OR)</div>
            </div>
            <div className="bg-slate-900/50 border border-slate-700 rounded-xl p-4">
              <Clock className="w-5 h-5 text-amber-400 mb-2" />
              <div className="text-2xl font-mono font-bold text-slate-200">~2m</div>
              <div className="text-xs text-slate-500 uppercase tracking-wide mt-1">Avg Delivery Time</div>
            </div>
          </div>

          <div className="space-y-3">
            <h4 className="text-xs font-mono text-slate-500 uppercase tracking-widest border-b border-slate-700 pb-2">Recent Gateway Activity</h4>
            <div className="flex items-center justify-between text-sm py-2 hover:bg-slate-800/50 px-2 rounded transition-colors cursor-default">
              <div className="flex items-center gap-3">
                <div className="w-2 h-2 rounded-full bg-emerald-500"></div>
                <span className="text-slate-300 font-medium">Batch Broadcast - Hola Region</span>
              </div>
              <span className="text-slate-500 font-mono text-xs">Just now</span>
            </div>
            <div className="flex items-center justify-between text-sm py-2 hover:bg-slate-800/50 px-2 rounded transition-colors cursor-default">
              <div className="flex items-center gap-3">
                <div className="w-2 h-2 rounded-full bg-emerald-500"></div>
                <span className="text-slate-300 font-medium">System Ping - Garsen Node</span>
              </div>
              <span className="text-slate-500 font-mono text-xs">14 mins ago</span>
            </div>
            <div className="flex items-center justify-between text-sm py-2 hover:bg-slate-800/50 px-2 rounded transition-colors cursor-default">
              <div className="flex items-center gap-3">
                <div className="w-2 h-2 rounded-full bg-slate-600"></div>
                <span className="text-slate-400">Weekly Summary Report</span>
              </div>
              <span className="text-slate-500 font-mono text-xs">2 days ago</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
