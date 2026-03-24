import { useEffect, useRef, useState } from "react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { Maximize2, Minimize2, Users } from "lucide-react";

interface MarkerConfig {
  lat: number;
  lng: number;
  name: string;
  depth: string;
  flow: string;
  status: "NORMAL" | "ELEVATED" | "CRITICAL";
  color: string;
  pulse?: boolean;
  population: number;
}

const MARKERS: MarkerConfig[] = [
  { lat: -0.4531, lng: 39.6413, name: "Garissa (Upstream)",     depth: "1.20m", flow: "1.4 m/s", status: "NORMAL",   color: "#10b981", population: 2400  },
  { lat: -1.1,    lng: 39.9,    name: "Bura",                    depth: "1.75m", flow: "1.9 m/s", status: "ELEVATED", color: "#f59e0b", population: 7200  },
  { lat: -1.5,    lng: 40.03,   name: "Hola Bridge (Midstream)", depth: "2.45m", flow: "2.8 m/s", status: "CRITICAL", color: "#ef4444", population: 34700, pulse: true },
  { lat: -2.26,   lng: 40.11,   name: "Garsen",                  depth: "3.10m", flow: "2.2 m/s", status: "ELEVATED", color: "#f59e0b", population: 18200 },
  { lat: -2.58,   lng: 40.47,   name: "Tana Delta",              depth: "0.90m", flow: "0.8 m/s", status: "NORMAL",   color: "#10b981", population: 3800  },
];

const INUNDATION_ZONES = [
  {
    name: "Hola Bridge — Critical Flood Zone",
    status: "CRITICAL",
    color: "#ef4444",
    coords: [
      [-1.38, 39.88], [-1.38, 40.17], [-1.45, 40.22],
      [-1.62, 40.18], [-1.65, 39.93], [-1.55, 39.85],
    ] as [number, number][],
  },
  {
    name: "Bura — Elevated Risk Zone",
    status: "ELEVATED",
    color: "#f59e0b",
    coords: [
      [-0.98, 39.78], [-0.98, 40.02], [-1.08, 40.05],
      [-1.22, 39.98], [-1.22, 39.78],
    ] as [number, number][],
  },
  {
    name: "Garsen — Elevated Risk Zone",
    status: "ELEVATED",
    color: "#f59e0b",
    coords: [
      [-2.12, 39.99], [-2.12, 40.22], [-2.22, 40.25],
      [-2.38, 40.20], [-2.40, 39.99],
    ] as [number, number][],
  },
];

const statusLabel: Record<string, string> = {
  NORMAL: "🟢 NORMAL",
  ELEVATED: "🟡 ELEVATED",
  CRITICAL: "🔴 CRITICAL",
};

const totalAtRisk = MARKERS.filter(m => m.status !== "NORMAL").reduce((s, m) => s + m.population, 0);

export function MapSection() {
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);
  const [fullscreen, setFullscreen] = useState(false);

  useEffect(() => {
    if (!mapRef.current || mapInstanceRef.current) return;

    // @ts-expect-error private property
    delete L.Icon.Default.prototype._getIconUrl;
    L.Icon.Default.mergeOptions({
      iconRetinaUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
      iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
      shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
    });

    const kenyaBounds: L.LatLngBoundsExpression = [[-5.0, 33.5], [5.5, 42.5]];

    const map = L.map(mapRef.current, {
      center: [-1.5, 40.0],
      zoom: 7,
      minZoom: 6,
      maxZoom: 10,
      maxBounds: kenyaBounds,
      maxBoundsViscosity: 1.0,
      zoomControl: true,
      attributionControl: true,
    });

    L.tileLayer("https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png", {
      attribution: '© <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> © <a href="https://carto.com/">CARTO</a>',
      subdomains: "abcd",
      maxZoom: 19,
    }).addTo(map);

    map.setMaxBounds(kenyaBounds);

    // Flood inundation zones
    INUNDATION_ZONES.forEach((zone) => {
      const poly = L.polygon(zone.coords, {
        color: zone.color,
        fillColor: zone.color,
        fillOpacity: zone.status === "CRITICAL" ? 0.18 : 0.10,
        weight: 1.5,
        opacity: 0.5,
        dashArray: zone.status === "CRITICAL" ? undefined : "6 4",
      }).addTo(map);

      poly.bindTooltip(
        `<div class="anga-zone-tooltip ${zone.status === "CRITICAL" ? "anga-zone-critical" : "anga-zone-elevated"}">${zone.name}</div>`,
        { sticky: true, className: "anga-zone-tip" }
      );
    });

    // Sensor markers
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
        maxWidth: 240,
        offset: [0, -8],
      }).setContent(`
        <div style="font-family:monospace;font-size:11px;color:#e2e8f0;background:#1e293b;padding:12px 14px;border-radius:10px;border:1px solid #334155;min-width:210px;">
          <div style="font-weight:bold;font-size:13px;color:#f8fafc;margin-bottom:8px;padding-bottom:6px;border-bottom:1px solid #334155;">${m.name}</div>
          <div style="display:flex;justify-content:space-between;margin-bottom:5px;">
            <span style="color:#94a3b8;">Water Depth</span>
            <span style="color:#60a5fa;font-weight:bold;">${m.depth}</span>
          </div>
          <div style="display:flex;justify-content:space-between;margin-bottom:5px;">
            <span style="color:#94a3b8;">Flow Rate</span>
            <span style="color:#22d3ee;font-weight:bold;">${m.flow}</span>
          </div>
          <div style="display:flex;justify-content:space-between;margin-bottom:5px;">
            <span style="color:#94a3b8;">Population at Risk</span>
            <span style="color:#fcd34d;font-weight:bold;">${m.population.toLocaleString()}</span>
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
    return () => { map.remove(); mapInstanceRef.current = null; };
  }, []);

  // Invalidate map size after fullscreen toggle — needs a beat for CSS to settle
  useEffect(() => {
    const id = setTimeout(() => {
      mapInstanceRef.current?.invalidateSize({ pan: false });
    }, 250);
    return () => clearTimeout(id);
  }, [fullscreen]);

  return (
    <div
      className={
        fullscreen
          ? "fixed inset-0 z-[7000] bg-slate-950 flex flex-col p-4 md:p-6"
          : "bg-slate-800/50 backdrop-blur-sm border border-white/10 rounded-2xl p-4 md:p-6 mb-6"
      }
    >
      <div className="flex items-start justify-between mb-4 shrink-0">
        <div>
          <h3 className="text-lg font-semibold text-slate-200">Basin Overview — Sensor Network</h3>
          <p className="text-sm font-mono text-slate-500 mt-0.5">
            Tana River Basin, Kenya · 5 nodes · Click markers for readings
          </p>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 bg-amber-950/40 border border-amber-500/30 rounded-xl px-3 py-1.5">
            <Users className="w-4 h-4 text-amber-400 shrink-0" />
            <div className="text-right">
              <p className="text-[9px] font-mono text-amber-400/70 uppercase tracking-wider leading-none">Population at Risk</p>
              <p className="text-sm font-bold font-mono text-amber-300 tabular-nums">{totalAtRisk.toLocaleString()}</p>
            </div>
          </div>
          <button
            onClick={() => setFullscreen(!fullscreen)}
            className="w-9 h-9 rounded-xl bg-slate-800 border border-slate-700 flex items-center justify-center text-slate-400 hover:text-white hover:border-slate-500 transition-all shrink-0"
            title={fullscreen ? "Exit full screen" : "Full screen map"}
          >
            {fullscreen ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
          </button>
        </div>
      </div>

      {/* Map container — flex-1 + min-h-0 lets it fill remaining space in fullscreen */}
      <div
        ref={mapRef}
        className="w-full rounded-xl overflow-hidden border border-slate-700/50 flex-1 min-h-0"
        style={{ height: fullscreen ? undefined : "clamp(260px, 50vw, 440px)" }}
      />

      <div className="flex flex-wrap gap-x-5 gap-y-2 mt-4 text-xs font-mono items-center shrink-0">
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
        <span className="flex items-center gap-2 ml-2">
          <span className="w-7 h-2.5 rounded-sm bg-red-500/20 border border-red-500/40 inline-block" />
          <span className="text-slate-500">Critical flood zone</span>
        </span>
        <span className="flex items-center gap-2">
          <span className="w-7 h-2.5 rounded-sm bg-amber-500/15 border border-dashed border-amber-500/40 inline-block" />
          <span className="text-slate-500">Elevated risk zone</span>
        </span>
      </div>
    </div>
  );
}
