import { Smartphone, Send, Globe2, Clock } from "lucide-react";
import { useState, useRef, useEffect } from "react";
import { type NodeData } from "@/hooks/use-mock-data";

interface ChatEntry {
  role: "user" | "system";
  text: string;
}

interface PresetQuery {
  label: string;
  lang: "en" | "sw";
  text: string;
  replies: Record<string, string>; // keyed by node id
}

const PRESETS: PresetQuery[] = [
  {
    label: "River status?",
    lang: "en",
    text: "What is the current river status?",
    replies: {
      "n-garissa":
        "NORMAL: Tana River at Garissa — Depth 1.20m | Velocity 1.4 m/s (STABLE). Flow is within seasonal norms. No flood risk detected at this time.",
      "n-hola":
        "CRITICAL ALERT: Tana River at Hola Bridge — Depth 2.45m | Velocity 2.8 m/s (RISING FAST). River at 58% of critical capacity. Evacuation advisory in effect for low-lying areas.",
      "n-garsen":
        "ELEVATED: Tana River at Garsen — Depth 3.10m | Velocity 2.2 m/s (RISING). River at 72% of critical capacity. Precautionary advisory issued. Stay alert.",
    },
  },
  {
    label: "Hali ya mto?",
    lang: "sw",
    text: "Hali ya mto sasa hivi ni nini?",
    replies: {
      "n-garissa":
        "KAWAIDA: Mto Tana huko Garissa — Kina 1.20m | Kasi 1.4 m/s (IMARA). Mtiririko ndani ya mipaka ya kawaida. Hakuna hatari ya mafuriko kwa sasa.",
      "n-hola":
        "TAHADHARI KUU: Mto Tana — Daraja la Hola — Kina 2.45m | Kasi 2.8 m/s (INAZIDI HARAKA). Mto uko asilimia 58 ya kiwango cha hatari. Watu wa maeneo ya chini waalike kuhama.",
      "n-garsen":
        "IMEONGEZEKA: Mto Tana huko Garsen — Kina 3.10m | Kasi 2.2 m/s (INAZIDI). Mto uko asilimia 72 ya kiwango cha hatari. Tahadhari imetolewa.",
    },
  },
  {
    label: "Is it safe?",
    lang: "en",
    text: "Is it safe to stay near the river?",
    replies: {
      "n-garissa":
        "YES — Conditions at Garissa are NORMAL. No evacuation advisory is in effect. Continue monitoring AngaWatch for any changes.",
      "n-hola":
        "NO — It is NOT safe near Hola Bridge. Evacuation order likely within 48hrs. Move to higher ground immediately. Nearest shelter: Upper Hill Community Centre (3.2km north).",
      "n-garsen":
        "EXERCISE CAUTION — River at Garsen is ELEVATED. Avoid areas within 200m of the riverbank. Prepare an emergency kit and monitor hourly updates.",
    },
  },
  {
    label: "Je, ni salama?",
    lang: "sw",
    text: "Je, ni salama kukaa karibu na mto?",
    replies: {
      "n-garissa":
        "NDIYO — Hali huko Garissa ni ya KAWAIDA. Hakuna amri ya kuhama. Endelea kufuatilia arifa za AngaWatch kwa mabadiliko yoyote.",
      "n-hola":
        "HAPANA — Si salama karibu na Daraja la Hola. Amri ya kuhama inatarajiwa ndani ya masaa 48. Hamia sehemu ya juu mara moja. Kituo: Upper Hill (km 3.2 kaskazini).",
      "n-garsen":
        "TAHADHARI — Mto huko Garsen uko katika hali ya JUU. Epuka maeneo ndani ya mita 200 kutoka ukingoni. Andaa vifaa vya dharura na ufuatilie kila saa.",
    },
  },
  {
    label: "Flood ETA?",
    lang: "en",
    text: "When will the flood peak arrive?",
    replies: {
      "n-garissa":
        "NO IMMEDIATE FLOOD RISK at Garissa. Discharge predicted stable at ~440 m³/s over the next 4 days — well below the 1,500 m³/s threshold. Monitor upstream conditions.",
      "n-hola":
        "AI FORECAST: Peak discharge at Hola Bridge predicted at ~2,820 m³/s by Day+4 (28 Mar). This WILL exceed the Critical Evacuation Threshold of 1,500 m³/s. Confidence: 87%.",
      "n-garsen":
        "AI FORECAST: Garsen discharge may reach 1,450 m³/s by Day+4 — just below the 1,500 m³/s threshold. Risk of crossing if upstream conditions at Hola worsen further.",
    },
  },
  {
    label: "Mafuriko lini?",
    lang: "sw",
    text: "Mafuriko yatafika lini?",
    replies: {
      "n-garissa":
        "HAKUNA HATARI KWA SASA huko Garissa. Mtiririko unatarajiwa kuwa imara (~440 m³/s) kwa siku 4 zijazo — chini ya kiwango cha hatari cha 1,500 m³/s. Fuatilia mabadiliko.",
      "n-hola":
        "UTABIRI WA AI: Kilele cha mafuriko huko Daraja la Hola kinatarajiwa tarehe 28 Mar (Siku+4) — mtiririko wa 2,820 m³/s. ITAZIDI kiwango cha hatari cha 1,500 m³/s. Uhakika: 87%.",
      "n-garsen":
        "UTABIRI: Mtiririko wa Garsen unaweza kufikia 1,450 m³/s siku +4 — karibu na kiwango cha hatari cha 1,500 m³/s. Hatari inaongezeka kama hali ya Hola itazidi.",
    },
  },
  {
    label: "Help / SOS",
    lang: "en",
    text: "HELP — I need emergency assistance!",
    replies: {
      "n-garissa":
        "EMERGENCY LINE: Call FREE: 0800-FLOOD. Kenya Red Cross: +254 20 395 0000. Note: Garissa conditions are currently NORMAL — no immediate threat at your location.",
      "n-hola":
        "EMERGENCY RECEIVED at Hola Bridge zone. Call FREE: 0800-FLOOD. Kenya Red Cross: +254 20 395 0000. Nearest shelter: Upper Hill Evacuation Centre. Evacuate to high ground NOW.",
      "n-garsen":
        "EMERGENCY RECEIVED. Call FREE: 0800-FLOOD. Kenya Red Cross: +254 20 395 0000. Nearest shelter: Garsen Town Hall (1.8km east). Conditions ELEVATED — be ready to evacuate.",
    },
  },
  {
    label: "Msaada / SOS",
    lang: "sw",
    text: "MSAADA — Nahitaji msaada wa dharura!",
    replies: {
      "n-garissa":
        "SIMU YA DHARURA: Piga BURE: 0800-FLOOD. Red Cross Kenya: +254 20 395 0000. Kumbuka: Hali huko Garissa ni ya KAWAIDA — hakuna hatari ya haraka mahali pako.",
      "n-hola":
        "DHARURA IMEPOKELEWA eneo la Daraja la Hola. Piga BURE: 0800-FLOOD. Red Cross: +254 20 395 0000. Kituo: Upper Hill. HAMIA MAHALI PA JUU SASA HIVI.",
      "n-garsen":
        "DHARURA IMEPOKELEWA. Piga BURE: 0800-FLOOD. Red Cross: +254 20 395 0000. Kituo cha karibu: Garsen Town Hall (mashariki, km 1.8). Jiandae kuhama mara moja.",
    },
  },
  {
    label: "Water depth?",
    lang: "en",
    text: "What is the current water depth?",
    replies: {
      "n-garissa":
        "Garissa (Upstream) — Depth: 1.20m | Critical threshold: 3.00m | Safety margin: 1.80m. Status: STABLE. No significant change in the last 6hrs.",
      "n-hola":
        "Hola Bridge (Midstream) — Depth: 2.45m | Critical threshold: 3.00m | Safety margin: 0.55m and FALLING. Rate of rise: +0.18m per 6hrs. Estimated time to critical: ~18 hours.",
      "n-garsen":
        "Garsen (Downstream) — Depth: 3.10m | Critical threshold: 4.30m | Safety margin: 1.20m and FALLING. Rate of rise: +0.22m per 6hrs. Close monitoring required.",
    },
  },
  {
    label: "Kina cha mto?",
    lang: "sw",
    text: "Kina cha mto ni kiasi gani sasa?",
    replies: {
      "n-garissa":
        "Garissa (Chanzo) — Kina: 1.20m | Kiwango cha hatari: 3.00m | Pembejeo: 1.80m. Hali: IMARA. Hakuna mabadiliko makubwa kwa masaa 6 iliyopita.",
      "n-hola":
        "Daraja la Hola (Katikati) — Kina: 2.45m | Kiwango cha hatari: 3.00m | Pembejeo: 0.55m INASHUKA. Muda wa kufikia hatari: masaa ~18.",
      "n-garsen":
        "Garsen (Chini ya Mto) — Kina: 3.10m | Kiwango cha hatari: 4.30m | Pembejeo: 1.20m INASHUKA. Fuatilia kwa makini.",
    },
  },
];

export function SmsSimulator({
  onAlertTriggered,
  alertLog,
  activeNode,
}: {
  onAlertTriggered: () => void;
  alertLog: string[];
  activeNode: NodeData;
}) {
  const [chat, setChat] = useState<ChatEntry[]>([]);
  const [isTyping, setIsTyping] = useState(false);
  const [langFilter, setLangFilter] = useState<"all" | "en" | "sw">("all");
  const chatEndRef = useRef<HTMLDivElement>(null);

  // Clear chat when node changes
  useEffect(() => {
    setChat([]);
    setIsTyping(false);
  }, [activeNode?.id]);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [chat, isTyping]);

  if (!activeNode) return null;

  function handlePreset(preset: PresetQuery) {
    if (isTyping) return;
    const reply = preset.replies[activeNode.id] ?? preset.replies["n-hola"];
    setChat((prev) => [...prev, { role: "user", text: preset.text }]);
    setIsTyping(true);
    setTimeout(() => {
      setIsTyping(false);
      setChat((prev) => [...prev, { role: "system", text: reply }]);
    }, 1400);
  }

  const visiblePresets =
    langFilter === "all" ? PRESETS : PRESETS.filter((p) => p.lang === langFilter);

  const alertLevelText =
    activeNode.status === "CRITICAL"
      ? "FLOOD ALERT - LEVEL 3"
      : activeNode.status === "ELEVATED"
      ? "ELEVATED RISK - LEVEL 2"
      : "ALL CLEAR - NORMAL";

  const alertLevelColor =
    activeNode.status === "CRITICAL"
      ? "text-red-500"
      : activeNode.status === "ELEVATED"
      ? "text-amber-400"
      : "text-emerald-400";

  const phoneMsg =
    activeNode.status === "CRITICAL"
      ? { loc: "Hola Bridge (Tana River)", body: "Water rising rapidly.", action: "EVACUATE LOW-LYING AREAS IMMEDIATELY." }
      : activeNode.status === "ELEVATED"
      ? { loc: "Garsen (Tana River)", body: "Elevated flow detected.", action: "PREPARE EMERGENCY KIT. STAY ALERT." }
      : { loc: "Garissa (Tana River)", body: "Conditions normal.", action: "NO ACTION REQUIRED. MONITOR ALERTS." };

  return (
    <div className="bg-slate-800/50 backdrop-blur-sm border border-white/10 rounded-2xl p-6 lg:p-8 mb-6">
      <div className="flex flex-col lg:flex-row gap-10 items-start">

        {/* Feature Phone Mockup */}
        <div className="shrink-0 w-64">
          <div className="w-64 h-[440px] bg-slate-950 rounded-[2.5rem] border-[8px] border-slate-700 relative shadow-2xl overflow-hidden flex flex-col justify-between">
            <div className="absolute top-4 left-1/2 -translate-x-1/2 w-12 h-1 bg-slate-800 rounded-full" />

            <div className="mt-10 mx-3 h-[200px] bg-[#07160c] border-4 border-slate-900 rounded-xl flex flex-col overflow-hidden relative shadow-inner">
              <div className="bg-emerald-500 text-slate-950 font-bold px-2 py-0.5 text-center text-[10px] tracking-widest shrink-0">
                ANGAWATCH ALERT
              </div>
              <div className="p-2.5 text-[10px] font-mono text-emerald-400/90 leading-tight flex-1 overflow-y-auto">
                <p>FROM: AngaWatch</p>
                <p className="mb-2">DATE: 24 MAR 2026 09:30</p>
                <p className={`font-bold ${alertLevelColor}`}>{alertLevelText}</p>
                <br />
                <p>{phoneMsg.loc}</p>
                <p>{phoneMsg.body}</p>
                <p className="font-bold text-emerald-300">{phoneMsg.action}</p>
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

            <div className="h-32 px-4 pb-4 w-full flex flex-col gap-1.5 mt-2">
              <div className="flex justify-between px-2 mb-1">
                <div className="w-10 h-4 bg-slate-800 rounded-full" />
                <div className="w-12 h-6 bg-slate-800 rounded-full border-2 border-slate-700" />
                <div className="w-10 h-4 bg-slate-800 rounded-full" />
              </div>
              <div className="grid grid-cols-3 gap-2 flex-1">
                {Array.from({ length: 12 }).map((_, i) => (
                  <div key={i} className="bg-slate-800/80 rounded flex items-center justify-center shadow-sm border border-white/5">
                    <div className="w-1.5 h-1.5 bg-slate-700 rounded-full" />
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Quick-Reply Buttons */}
          <div className="mt-5">
            <div className="flex gap-1.5 mb-3">
              {(["all", "en", "sw"] as const).map((f) => (
                <button
                  key={f}
                  onClick={() => setLangFilter(f)}
                  className={`px-3 py-1 rounded-lg text-[10px] font-mono uppercase tracking-widest font-bold border transition-all ${
                    langFilter === f
                      ? "bg-emerald-600 border-emerald-500 text-white"
                      : "bg-slate-800 border-slate-700 text-slate-400 hover:border-slate-500"
                  }`}
                >
                  {f === "all" ? "All" : f === "en" ? "🇬🇧 EN" : "🇰🇪 SW"}
                </button>
              ))}
              <span className="ml-auto text-[9px] font-mono text-slate-600 self-center">tap to send</span>
            </div>

            <div className="grid grid-cols-1 gap-2 max-h-64 overflow-y-auto pr-0.5">
              {visiblePresets.map((p) => (
                <button
                  key={p.text}
                  onClick={() => handlePreset(p)}
                  disabled={isTyping}
                  className={`w-full text-left px-3 py-2.5 rounded-xl border transition-all group flex items-start gap-2.5 ${
                    p.lang === "sw"
                      ? "bg-slate-900/70 border-slate-700/60 hover:border-emerald-600/50 hover:bg-emerald-950/20"
                      : "bg-slate-900/70 border-slate-700/60 hover:border-blue-600/50 hover:bg-blue-950/10"
                  } disabled:opacity-50 disabled:cursor-not-allowed`}
                >
                  <span className={`mt-0.5 text-[9px] font-mono font-bold px-1.5 py-0.5 rounded shrink-0 ${
                    p.lang === "sw"
                      ? "bg-emerald-900/50 text-emerald-400 border border-emerald-700/40"
                      : "bg-blue-900/50 text-blue-400 border border-blue-700/40"
                  }`}>
                    {p.lang === "sw" ? "SW" : "EN"}
                  </span>
                  <span className="text-[11px] font-mono text-slate-200 leading-tight group-hover:text-white transition-colors">
                    {p.label}
                  </span>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Info Panel */}
        <div className="flex-1 min-w-0">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-800 border border-slate-700 mb-4">
            <Smartphone className="w-4 h-4 text-emerald-400" />
            <span className="text-xs font-medium text-slate-300">Last-Mile Communication</span>
          </div>

          <h3 className="text-2xl font-bold text-slate-100 mb-3">Community Alert Gateway</h3>
          <p className="text-slate-400 text-sm leading-relaxed mb-5 max-w-lg">
            AngaWatch's SMS gateway reaches rural communities with no internet access, delivering
            life-saving flood warnings in English and Kiswahili to basic feature phones.
          </p>

          {/* Chat area */}
          <div className="bg-slate-900/60 border border-slate-700/50 rounded-2xl p-4 mb-5 min-h-[120px] max-h-[280px] overflow-y-auto flex flex-col gap-2">
            {chat.length === 0 && !isTyping && (
              <p className="text-xs font-mono text-slate-600 m-auto text-center py-4">
                Select a quick-reply on the left to simulate an SMS query →
              </p>
            )}
            {chat.map((entry, i) => (
              <div key={i} className={`flex ${entry.role === "user" ? "justify-end" : "justify-start"}`}>
                <div className={`rounded-2xl px-4 py-2.5 text-[12px] font-mono max-w-[85%] leading-relaxed ${
                  entry.role === "user"
                    ? "bg-emerald-700/40 text-emerald-100 border border-emerald-700/30 rounded-br-sm"
                    : "bg-slate-700/60 text-slate-200 border border-slate-600/30 rounded-bl-sm"
                }`}>
                  {entry.role === "system" && (
                    <span className="block text-[9px] text-emerald-500 font-bold uppercase tracking-widest mb-1">
                      AngaWatch System
                    </span>
                  )}
                  {entry.text}
                </div>
              </div>
            ))}
            {isTyping && (
              <div className="flex justify-start">
                <div className="bg-slate-700/60 border border-slate-600/30 rounded-2xl rounded-bl-sm px-4 py-3 text-[11px] font-mono text-slate-400 flex items-center gap-1.5">
                  <span className="text-[9px] text-emerald-500 font-bold uppercase tracking-widest mr-1">AngaWatch</span>
                  <span className="animate-bounce" style={{ animationDelay: "0ms" }}>·</span>
                  <span className="animate-bounce" style={{ animationDelay: "150ms" }}>·</span>
                  <span className="animate-bounce" style={{ animationDelay: "300ms" }}>·</span>
                </div>
              </div>
            )}
            <div ref={chatEndRef} />
          </div>

          {/* Stats */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-5">
            <div className="bg-slate-900/50 border border-slate-700 rounded-xl p-4">
              <Send className="w-5 h-5 text-blue-400 mb-2" />
              <div className="text-2xl font-mono font-bold text-slate-200">2,847</div>
              <div className="text-xs text-slate-500 uppercase tracking-wide mt-1">SMS Dispatched</div>
            </div>
            <div className="bg-slate-900/50 border border-slate-700 rounded-xl p-4">
              <Globe2 className="w-5 h-5 text-emerald-400 mb-2" />
              <div className="text-2xl font-mono font-bold text-slate-200">2</div>
              <div className="text-xs text-slate-500 uppercase tracking-wide mt-1">Languages (EN, SW)</div>
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
            className="w-full sm:w-auto px-6 py-3 bg-red-600 hover:bg-red-500 active:scale-95 text-white font-bold rounded-xl transition-all flex items-center gap-2 mb-5 text-sm"
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
                <div key={i} className="flex items-center gap-2 py-1.5 px-2 rounded bg-red-950/30 border border-red-500/20 text-xs font-mono text-red-300">
                  <span className="w-2 h-2 rounded-full bg-red-500 shrink-0" />
                  {entry}
                </div>
              ))}
              <div className="flex items-center justify-between text-sm py-2 hover:bg-slate-800/50 px-2 rounded transition-colors cursor-default">
                <div className="flex items-center gap-3">
                  <div className="w-2 h-2 rounded-full bg-emerald-500" />
                  <span className="text-slate-300 font-medium text-xs font-mono">Batch Broadcast — Hola Region</span>
                </div>
                <span className="text-slate-500 font-mono text-xs">Just now</span>
              </div>
              <div className="flex items-center justify-between text-sm py-2 hover:bg-slate-800/50 px-2 rounded transition-colors cursor-default">
                <div className="flex items-center gap-3">
                  <div className="w-2 h-2 rounded-full bg-emerald-500" />
                  <span className="text-slate-300 font-medium text-xs font-mono">System Ping — Garsen Node</span>
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
