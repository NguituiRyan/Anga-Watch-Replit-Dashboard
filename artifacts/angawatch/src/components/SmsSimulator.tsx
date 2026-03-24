import { Smartphone, Send, Globe2, Clock } from "lucide-react";
import { useState, useRef, useEffect } from "react";

interface ChatEntry {
  role: "user" | "system";
  text: string;
}

const RESPONSES: { keywords: string[]; reply: string }[] = [
  {
    keywords: ["hali", "status", "sasa"],
    reply:
      "Mto Tana: Kina 2.45m | Kasi JUU (2.8 m/s) | Hatari: WASTANI. Kaa macho na ujiandae kuhama.",
  },
  {
    keywords: ["safe", "salama", "hatari"],
    reply:
      "CAUTION: River at 58% capacity. Evacuation order likely within 48hrs. Monitor alerts closely.",
  },
  {
    keywords: ["help", "msaada", "flood", "mafuriko"],
    reply:
      "Piga simu 0800-FLOOD (Free). Kituo cha karibu: Upper Hill Evacuation Centre. Maelekezo: sogea juu ya mita 10.",
  },
  {
    keywords: ["depth", "kina", "height"],
    reply:
      "Current water depth at Hola Bridge: 2.45m. Critical threshold: 3.0m. Margin: 0.55m and falling.",
  },
  {
    keywords: ["velocity", "kasi", "speed", "flow"],
    reply:
      "Flow velocity: 2.8 m/s — 47% above seasonal baseline. Trend: RISING. AI predicts 4.1 m/s by Day+4.",
  },
];

const DEFAULT_REPLY =
  "Ujumbe wako umepokelewa. Jibu: Hola Bridge iko katika hali ya TAHADHARI. Angalia arifa zinazofuata. / Message received. Hola Bridge is in CAUTION state. Monitor subsequent alerts.";

function getReply(input: string): string {
  const lower = input.toLowerCase();
  for (const r of RESPONSES) {
    if (r.keywords.some((k) => lower.includes(k))) return r.reply;
  }
  return DEFAULT_REPLY;
}

export function SmsSimulator({
  onAlertTriggered,
  alertLog,
}: {
  onAlertTriggered: () => void;
  alertLog: string[];
}) {
  const [inputVal, setInputVal] = useState("");
  const [chat, setChat] = useState<ChatEntry[]>([]);
  const [isTyping, setIsTyping] = useState(false);
  const chatEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [chat, isTyping]);

  function handleSend() {
    const trimmed = inputVal.trim();
    if (!trimmed) return;
    setChat((prev) => [...prev, { role: "user", text: trimmed }]);
    setInputVal("");
    setIsTyping(true);
    setTimeout(() => {
      setIsTyping(false);
      setChat((prev) => [...prev, { role: "system", text: getReply(trimmed) }]);
    }, 1400);
  }

  return (
    <div className="bg-slate-800/50 backdrop-blur-sm border border-white/10 rounded-2xl p-6 lg:p-8 mb-6">
      <div className="flex flex-col lg:flex-row gap-10 items-start">

        {/* Feature Phone Mockup */}
        <div className="shrink-0 w-64">
          <div className="w-64 h-[440px] bg-slate-950 rounded-[2.5rem] border-[8px] border-slate-700 relative shadow-2xl overflow-hidden flex flex-col justify-between">
            {/* Speaker */}
            <div className="absolute top-4 left-1/2 -translate-x-1/2 w-12 h-1 bg-slate-800 rounded-full" />

            {/* Screen */}
            <div className="mt-10 mx-3 h-[200px] bg-[#07160c] border-4 border-slate-900 rounded-xl flex flex-col overflow-hidden relative shadow-inner">
              <div className="bg-emerald-500 text-slate-950 font-bold px-2 py-0.5 text-center text-[10px] tracking-widest shrink-0">
                ANGAWATCH ALERT
              </div>
              <div className="p-2.5 text-[10px] font-mono text-emerald-400/90 leading-tight flex-1 overflow-y-auto">
                <p>FROM: AngaWatch</p>
                <p className="mb-2">DATE: 24 MAR 2026 09:30</p>
                <p className="font-bold text-red-500">FLOOD ALERT - LEVEL 3</p>
                <br />
                <p>Hola Bridge (Tana River)</p>
                <p>Water rising rapidly.</p>
                <p className="font-bold text-emerald-300">
                  EVACUATE LOW-LYING AREAS IMMEDIATELY.
                </p>
                <br />
                <p className="text-[9px] text-emerald-500/60">Next update: 3 hours</p>
                <p className="text-[9px] text-emerald-500/60">Reply STOP to unsubscribe</p>
              </div>
              <div className="bg-[#050f08] border-t border-emerald-900/50 px-2 py-1 flex justify-between items-center text-[8px] text-emerald-500/80 font-mono shrink-0">
                <span>OPTIONS</span>
                <span>INBOX | 1/1</span>
                <span>BACK</span>
              </div>
              <div className="absolute inset-0 bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.1)_50%)] bg-[length:100%_4px] pointer-events-none opacity-20" />
            </div>

            {/* Keypad */}
            <div className="h-32 px-4 pb-4 w-full flex flex-col gap-1.5 mt-2">
              <div className="flex justify-between px-2 mb-1">
                <div className="w-10 h-4 bg-slate-800 rounded-full" />
                <div className="w-12 h-6 bg-slate-800 rounded-full border-2 border-slate-700" />
                <div className="w-10 h-4 bg-slate-800 rounded-full" />
              </div>
              <div className="grid grid-cols-3 gap-2 flex-1">
                {Array.from({ length: 12 }).map((_, i) => (
                  <div
                    key={i}
                    className="bg-slate-800/80 rounded flex items-center justify-center shadow-sm border border-white/5"
                  >
                    <div className="w-1.5 h-1.5 bg-slate-700 rounded-full" />
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* SMS Input */}
          <div className="mt-4">
            <div className="flex gap-2">
              <input
                type="text"
                value={inputVal}
                onChange={(e) => setInputVal(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleSend()}
                placeholder="Uliza hali ya mto... (Ask about river status)"
                className="flex-1 text-xs bg-slate-900 border border-slate-700 text-slate-200 rounded-lg px-3 py-2 font-mono placeholder:text-slate-600 focus:outline-none focus:border-emerald-500/60"
              />
              <button
                onClick={handleSend}
                className="px-3 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg flex items-center gap-1.5 text-xs font-semibold transition-colors"
              >
                <Send className="w-3.5 h-3.5" />
                Send
              </button>
            </div>

            {/* Chat bubbles */}
            {chat.length > 0 && (
              <div className="mt-3 max-h-48 overflow-y-auto space-y-2 pr-1">
                {chat.map((entry, i) => (
                  <div
                    key={i}
                    className={`flex ${entry.role === "user" ? "justify-end" : "justify-start"}`}
                  >
                    <div
                      className={`rounded-xl px-3 py-2 text-[11px] font-mono max-w-[90%] ${
                        entry.role === "user"
                          ? "bg-emerald-700/40 text-emerald-200 border border-emerald-700/30"
                          : "bg-slate-700/60 text-slate-200 border border-slate-600/30"
                      }`}
                    >
                      {entry.text}
                    </div>
                  </div>
                ))}
                {isTyping && (
                  <div className="flex justify-start">
                    <div className="bg-slate-700/60 border border-slate-600/30 rounded-xl px-4 py-2 text-[11px] font-mono text-slate-400 flex gap-1">
                      <span className="animate-bounce" style={{ animationDelay: "0ms" }}>·</span>
                      <span className="animate-bounce" style={{ animationDelay: "150ms" }}>·</span>
                      <span className="animate-bounce" style={{ animationDelay: "300ms" }}>·</span>
                    </div>
                  </div>
                )}
                <div ref={chatEndRef} />
              </div>
            )}
          </div>
        </div>

        {/* Info Panel */}
        <div className="flex-1 min-w-0">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-800 border border-slate-700 mb-4">
            <Smartphone className="w-4 h-4 text-emerald-400" />
            <span className="text-xs font-medium text-slate-300">Last-Mile Communication</span>
          </div>

          <h3 className="text-2xl font-bold text-slate-100 mb-3">Community Alert Gateway</h3>
          <p className="text-slate-400 text-sm leading-relaxed mb-6 max-w-lg">
            AngaWatch's SMS gateway reaches rural communities with no internet access, delivering
            life-saving flood warnings directly to basic feature phones via telecom mesh routing.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
            <div className="bg-slate-900/50 border border-slate-700 rounded-xl p-4">
              <Send className="w-5 h-5 text-blue-400 mb-2" />
              <div className="text-2xl font-mono font-bold text-slate-200">2,847</div>
              <div className="text-xs text-slate-500 uppercase tracking-wide mt-1">SMS Dispatched</div>
            </div>
            <div className="bg-slate-900/50 border border-slate-700 rounded-xl p-4">
              <Globe2 className="w-5 h-5 text-emerald-400 mb-2" />
              <div className="text-2xl font-mono font-bold text-slate-200">3</div>
              <div className="text-xs text-slate-500 uppercase tracking-wide mt-1">
                Languages (EN, SW, OR)
              </div>
            </div>
            <div className="bg-slate-900/50 border border-slate-700 rounded-xl p-4">
              <Clock className="w-5 h-5 text-amber-400 mb-2" />
              <div className="text-2xl font-mono font-bold text-slate-200">~2m</div>
              <div className="text-xs text-slate-500 uppercase tracking-wide mt-1">Avg Delivery Time</div>
            </div>
          </div>

          {/* Manual Alert Button */}
          <button
            onClick={onAlertTriggered}
            className="w-full sm:w-auto px-6 py-3 bg-red-600 hover:bg-red-500 active:scale-95 text-white font-bold rounded-xl transition-all flex items-center gap-2 mb-6 text-sm"
          >
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-200 opacity-75" />
              <span className="relative inline-flex rounded-full h-2 w-2 bg-white" />
            </span>
            Trigger Manual Alert
          </button>

          {/* Alert Log */}
          <div>
            <h4 className="text-xs font-mono text-slate-500 uppercase tracking-widest border-b border-slate-700 pb-2 mb-3">
              Gateway Activity Log
            </h4>
            <div className="space-y-2">
              {alertLog.map((entry, i) => (
                <div
                  key={i}
                  className="flex items-center gap-2 py-1.5 px-2 rounded bg-red-950/30 border border-red-500/20 text-xs font-mono text-red-300"
                >
                  <span className="w-2 h-2 rounded-full bg-red-500 shrink-0" />
                  {entry}
                </div>
              ))}
              <div className="flex items-center justify-between text-sm py-2 hover:bg-slate-800/50 px-2 rounded transition-colors cursor-default">
                <div className="flex items-center gap-3">
                  <div className="w-2 h-2 rounded-full bg-emerald-500" />
                  <span className="text-slate-300 font-medium text-xs font-mono">
                    Batch Broadcast — Hola Region
                  </span>
                </div>
                <span className="text-slate-500 font-mono text-xs">Just now</span>
              </div>
              <div className="flex items-center justify-between text-sm py-2 hover:bg-slate-800/50 px-2 rounded transition-colors cursor-default">
                <div className="flex items-center gap-3">
                  <div className="w-2 h-2 rounded-full bg-emerald-500" />
                  <span className="text-slate-300 font-medium text-xs font-mono">
                    System Ping — Garsen Node
                  </span>
                </div>
                <span className="text-slate-500 font-mono text-xs">14 mins ago</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
