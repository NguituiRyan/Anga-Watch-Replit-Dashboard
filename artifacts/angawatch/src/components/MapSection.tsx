import { useEffect, useRef } from "react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

interface MarkerConfig {
  lat: number;
  lng: number;
  name: string;
  depth: string;
  flow: string;
  status: "NORMAL" | "ELEVATED" | "CRITICAL";
  color: string;
  pulse?: boolean;
}

const MARKERS: MarkerConfig[] = [
  {
    lat: 0.4531,
    lng: 39.6413,
    name: "Garissa (Upstream)",
    depth: "1.20m",
    flow: "1.4 m/s",
    status: "NORMAL",
    color: "#10b981",
  },
  {
    lat: -1.1,
    lng: 39.9,
    name: "Bura",
    depth: "1.75m",
    flow: "1.9 m/s",
    status: "ELEVATED",
    color: "#f59e0b",
  },
  {
    lat: -1.5,
    lng: 40.03,
    name: "Hola Bridge (Midstream)",
    depth: "2.45m",
    flow: "2.8 m/s",
    status: "CRITICAL",
    color: "#ef4444",
    pulse: true,
  },
  {
    lat: -2.26,
    lng: 40.11,
    name: "Garsen",
    depth: "3.10m",
    flow: "2.2 m/s",
    status: "ELEVATED",
    color: "#f59e0b",
  },
  {
    lat: -2.58,
    lng: 40.47,
    name: "Tana Delta",
    depth: "0.90m",
    flow: "0.8 m/s",
    status: "NORMAL",
    color: "#10b981",
  },
];

const statusLabel: Record<string, string> = {
  NORMAL: "🟢 NORMAL",
  ELEVATED: "🟡 ELEVATED",
  CRITICAL: "🔴 CRITICAL",
};

export function MapSection() {
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);

  useEffect(() => {
    if (!mapRef.current || mapInstanceRef.current) return;

    // Fix default icon path issue in Vite builds
    // @ts-expect-error private property
    delete L.Icon.Default.prototype._getIconUrl;
    L.Icon.Default.mergeOptions({
      iconRetinaUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
      iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
      shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
    });

    const map = L.map(mapRef.current, {
      center: [0.0, 39.9],
      zoom: 7,
      zoomControl: true,
      attributionControl: true,
    });

    // Dark CartoDB tile layer
    L.tileLayer(
      "https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png",
      {
        attribution:
          '© <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> © <a href="https://carto.com/">CARTO</a>',
        subdomains: "abcd",
        maxZoom: 19,
      }
    ).addTo(map);

    MARKERS.forEach((m) => {
      const icon = L.divIcon({
        className: "",
        html: `<div class="sensor-marker" style="--mc:${m.color}">
                 <div class="sensor-dot"></div>
                 ${m.pulse ? '<div class="sensor-ring"></div>' : ""}
               </div>`,
        iconSize: [24, 24],
        iconAnchor: [12, 12],
      });

      const popup = L.popup({
        className: "anga-popup",
        closeButton: true,
        maxWidth: 230,
        offset: [0, -8],
      }).setContent(`
        <div style="font-family:monospace;font-size:11px;color:#e2e8f0;background:#1e293b;padding:12px 14px;border-radius:10px;border:1px solid #334155;min-width:200px;">
          <div style="font-weight:bold;font-size:13px;color:#f8fafc;margin-bottom:8px;padding-bottom:6px;border-bottom:1px solid #334155;">${m.name}</div>
          <div style="display:flex;justify-content:space-between;margin-bottom:5px;">
            <span style="color:#94a3b8;">Water Depth</span>
            <span style="color:#60a5fa;font-weight:bold;">${m.depth}</span>
          </div>
          <div style="display:flex;justify-content:space-between;margin-bottom:5px;">
            <span style="color:#94a3b8;">Flow Rate</span>
            <span style="color:#22d3ee;font-weight:bold;">${m.flow}</span>
          </div>
          <div style="display:flex;justify-content:space-between;margin-top:6px;padding-top:6px;border-top:1px solid #334155;">
            <span style="color:#94a3b8;">Status</span>
            <span style="font-weight:bold;">${statusLabel[m.status]}</span>
          </div>
        </div>
      `);

      L.marker([m.lat, m.lng], { icon }).addTo(map).bindPopup(popup);
    });

    mapInstanceRef.current = map;

    return () => {
      map.remove();
      mapInstanceRef.current = null;
    };
  }, []);

  return (
    <div className="bg-slate-800/50 backdrop-blur-sm border border-white/10 rounded-2xl p-6 mb-6">
      <div className="mb-5">
        <h3 className="text-lg font-semibold text-slate-200">
          Basin Overview — Sensor Network
        </h3>
        <p className="text-sm font-mono text-slate-500 mt-1">
          Tana River Basin, Kenya — 5 active monitoring nodes · Click a marker for readings
        </p>
      </div>

      <div
        ref={mapRef}
        className="w-full rounded-xl overflow-hidden border border-slate-700/50"
        style={{ height: 420, zIndex: 0 }}
      />

      <div className="flex flex-wrap gap-5 mt-4 text-xs font-mono">
        <span className="flex items-center gap-2">
          <span className="w-3 h-3 rounded-full bg-emerald-500 inline-block shadow-[0_0_6px_#10b981]" />
          <span className="text-slate-400">Normal</span>
        </span>
        <span className="flex items-center gap-2">
          <span className="w-3 h-3 rounded-full bg-amber-500 inline-block shadow-[0_0_6px_#f59e0b]" />
          <span className="text-slate-400">Elevated</span>
        </span>
        <span className="flex items-center gap-2">
          <span className="w-3 h-3 rounded-full bg-red-500 inline-block shadow-[0_0_6px_#ef4444]" />
          <span className="text-slate-400">Critical (pulsing)</span>
        </span>
      </div>
    </div>
  );
}
