import { useState } from "react";

export type NodeStatus = "NORMAL" | "ELEVATED" | "CRITICAL";

export interface ChartPoint {
  day: string;
  discharge_observed: number | null;
  discharge_predicted: number | null;
  rainfall: number | null;
  ci_lower: number | null;
  ci_band: number | null;
}

export interface NodeData {
  id: string;
  name: string;
  location: string;
  status: NodeStatus;
  lat: number;
  lng: number;
  floodProbability: number;
  populationAtRisk: number;
  installedDate: string;
  uptime: string;
  meshId: string;
  battery: number;
  signal: number;
  lastPing: string;
  metrics: {
    height: string;
    velocity: string;
    velocitySubtitle: string;
    aiStatus: string;
    aiSubtitle: string;
  };
  chartData: ChartPoint[];
}

export interface MarkerConfig {
  lat: number;
  lng: number;
  name: string;
  depth: string;
  flow: string;
  status: NodeStatus;
  color: string;
  pulse?: boolean;
  population: number;
}

export interface InundationZone {
  name: string;
  status: string;
  color: string;
  coords: [number, number][];
}

export interface MeshNodeData {
  id: string;
  name: string;
  location: string;
  battery: number;
  signal: number;
  lastPing: string;
  fault?: string;
  status: "online" | "fault" | "warning";
}

export interface BasinConfig {
  id: string;
  name: string;
  region: string;
  river: string;
  defaultNodeId: string;
  mapCenter: [number, number];
  mapZoom: number;
  nodes: NodeData[];
  markers: MarkerConfig[];
  inundationZones: InundationZone[];
  meshNodes: MeshNodeData[];
}

function ci(predicted: number | null): { ci_lower: number | null; ci_band: number | null } {
  if (predicted === null) return { ci_lower: null, ci_band: null };
  return { ci_lower: Math.round(predicted * 0.84), ci_band: Math.round(predicted * 0.32) };
}

const holaChartData: ChartPoint[] = [
  { day: "Day -5", discharge_observed: 820,  discharge_predicted: null, rainfall: 18,  ...ci(null) },
  { day: "Day -4", discharge_observed: 790,  discharge_predicted: null, rainfall: 24,  ...ci(null) },
  { day: "Day -3", discharge_observed: 700,  discharge_predicted: null, rainfall: 38,  ...ci(null) },
  { day: "Day -2", discharge_observed: 620,  discharge_predicted: null, rainfall: 52,  ...ci(null) },
  { day: "Day -1", discharge_observed: 740,  discharge_predicted: null, rainfall: 61,  ...ci(null) },
  { day: "TODAY",  discharge_observed: 900,  discharge_predicted: 900,  rainfall: 58,  ...ci(900)  },
  { day: "Day +1", discharge_observed: null, discharge_predicted: 1100, rainfall: null, ...ci(1100) },
  { day: "Day +2", discharge_observed: null, discharge_predicted: 1450, rainfall: null, ...ci(1450) },
  { day: "Day +3", discharge_observed: null, discharge_predicted: 2000, rainfall: null, ...ci(2000) },
  { day: "Day +4", discharge_observed: null, discharge_predicted: 2820, rainfall: null, ...ci(2820) },
];

const garissaChartData: ChartPoint[] = [
  { day: "Day -5", discharge_observed: 380, discharge_predicted: null, rainfall: 3,  ...ci(null) },
  { day: "Day -4", discharge_observed: 360, discharge_predicted: null, rainfall: 4,  ...ci(null) },
  { day: "Day -3", discharge_observed: 340, discharge_predicted: null, rainfall: 5,  ...ci(null) },
  { day: "Day -2", discharge_observed: 350, discharge_predicted: null, rainfall: 4,  ...ci(null) },
  { day: "Day -1", discharge_observed: 370, discharge_predicted: null, rainfall: 6,  ...ci(null) },
  { day: "TODAY",  discharge_observed: 390, discharge_predicted: 390,  rainfall: 7,  ...ci(390)  },
  { day: "Day +1", discharge_observed: null, discharge_predicted: 410, rainfall: null, ...ci(410)  },
  { day: "Day +2", discharge_observed: null, discharge_predicted: 430, rainfall: null, ...ci(430)  },
  { day: "Day +3", discharge_observed: null, discharge_predicted: 420, rainfall: null, ...ci(420)  },
  { day: "Day +4", discharge_observed: null, discharge_predicted: 440, rainfall: null, ...ci(440)  },
];

const garsenChartData: ChartPoint[] = [
  { day: "Day -5", discharge_observed: 980,  discharge_predicted: null, rainfall: 8,  ...ci(null) },
  { day: "Day -4", discharge_observed: 960,  discharge_predicted: null, rainfall: 12, ...ci(null) },
  { day: "Day -3", discharge_observed: 1020, discharge_predicted: null, rainfall: 20, ...ci(null) },
  { day: "Day -2", discharge_observed: 1080, discharge_predicted: null, rainfall: 28, ...ci(null) },
  { day: "Day -1", discharge_observed: 1100, discharge_predicted: null, rainfall: 35, ...ci(null) },
  { day: "TODAY",  discharge_observed: 1150, discharge_predicted: 1150, rainfall: 32, ...ci(1150) },
  { day: "Day +1", discharge_observed: null, discharge_predicted: 1250, rainfall: null, ...ci(1250) },
  { day: "Day +2", discharge_observed: null, discharge_predicted: 1320, rainfall: null, ...ci(1320) },
  { day: "Day +3", discharge_observed: null, discharge_predicted: 1390, rainfall: null, ...ci(1390) },
  { day: "Day +4", discharge_observed: null, discharge_predicted: 1450, rainfall: null, ...ci(1450) },
];

const kibweziChartData: ChartPoint[] = [
  { day: "Day -5", discharge_observed: 680,  discharge_predicted: null, rainfall: 16,  ...ci(null) },
  { day: "Day -4", discharge_observed: 710,  discharge_predicted: null, rainfall: 24,  ...ci(null) },
  { day: "Day -3", discharge_observed: 760,  discharge_predicted: null, rainfall: 38,  ...ci(null) },
  { day: "Day -2", discharge_observed: 830,  discharge_predicted: null, rainfall: 50,  ...ci(null) },
  { day: "Day -1", discharge_observed: 890,  discharge_predicted: null, rainfall: 58,  ...ci(null) },
  { day: "TODAY",  discharge_observed: 960,  discharge_predicted: 960,  rainfall: 55,  ...ci(960)  },
  { day: "Day +1", discharge_observed: null, discharge_predicted: 1150, rainfall: null, ...ci(1150) },
  { day: "Day +2", discharge_observed: null, discharge_predicted: 1480, rainfall: null, ...ci(1480) },
  { day: "Day +3", discharge_observed: null, discharge_predicted: 1850, rainfall: null, ...ci(1850) },
  { day: "Day +4", discharge_observed: null, discharge_predicted: 2350, rainfall: null, ...ci(2350) },
];

const athiTownChartData: ChartPoint[] = [
  { day: "Day -5", discharge_observed: 310, discharge_predicted: null, rainfall: 2,  ...ci(null) },
  { day: "Day -4", discharge_observed: 295, discharge_predicted: null, rainfall: 3,  ...ci(null) },
  { day: "Day -3", discharge_observed: 285, discharge_predicted: null, rainfall: 4,  ...ci(null) },
  { day: "Day -2", discharge_observed: 290, discharge_predicted: null, rainfall: 3,  ...ci(null) },
  { day: "Day -1", discharge_observed: 305, discharge_predicted: null, rainfall: 5,  ...ci(null) },
  { day: "TODAY",  discharge_observed: 320, discharge_predicted: 320,  rainfall: 6,  ...ci(320)  },
  { day: "Day +1", discharge_observed: null, discharge_predicted: 335, rainfall: null, ...ci(335)  },
  { day: "Day +2", discharge_observed: null, discharge_predicted: 345, rainfall: null, ...ci(345)  },
  { day: "Day +3", discharge_observed: null, discharge_predicted: 340, rainfall: null, ...ci(340)  },
  { day: "Day +4", discharge_observed: null, discharge_predicted: 350, rainfall: null, ...ci(350)  },
];

const malindiChartData: ChartPoint[] = [
  { day: "Day -5", discharge_observed: 540,  discharge_predicted: null, rainfall: 10,  ...ci(null) },
  { day: "Day -4", discharge_observed: 560,  discharge_predicted: null, rainfall: 15,  ...ci(null) },
  { day: "Day -3", discharge_observed: 590,  discharge_predicted: null, rainfall: 22,  ...ci(null) },
  { day: "Day -2", discharge_observed: 640,  discharge_predicted: null, rainfall: 30,  ...ci(null) },
  { day: "Day -1", discharge_observed: 690,  discharge_predicted: null, rainfall: 36,  ...ci(null) },
  { day: "TODAY",  discharge_observed: 720,  discharge_predicted: 720,  rainfall: 34,  ...ci(720)  },
  { day: "Day +1", discharge_observed: null, discharge_predicted: 800, rainfall: null, ...ci(800)  },
  { day: "Day +2", discharge_observed: null, discharge_predicted: 880, rainfall: null, ...ci(880)  },
  { day: "Day +3", discharge_observed: null, discharge_predicted: 950, rainfall: null, ...ci(950)  },
  { day: "Day +4", discharge_observed: null, discharge_predicted: 1020, rainfall: null, ...ci(1020) },
];

const TANA_BASIN: BasinConfig = {
  id: "tana",
  name: "Tana River Basin",
  region: "Eastern Kenya",
  river: "Tana River",
  defaultNodeId: "n-hola",
  mapCenter: [-1.5, 40.0],
  mapZoom: 7,
  nodes: [
    {
      id: "n-garissa",
      name: "Garissa",
      location: "Upstream",
      status: "NORMAL",
      lat: -0.4531,
      lng: 39.6413,
      floodProbability: 12,
      populationAtRisk: 2400,
      installedDate: "14 Jan 2025",
      uptime: "99.8%",
      meshId: "A-01",
      battery: 91,
      signal: 4,
      lastPing: "12s ago",
      metrics: {
        height: "1.20m",
        velocity: "1.4 m/s",
        velocitySubtitle: "+0.1 m/s from 6h ago | 5% above seasonal baseline",
        aiStatus: "SYSTEM NORMAL",
        aiSubtitle: "FLOW STABLE",
      },
      chartData: garissaChartData,
    },
    {
      id: "n-hola",
      name: "Hola Bridge",
      location: "Midstream",
      status: "CRITICAL",
      lat: -1.5,
      lng: 40.03,
      floodProbability: 87,
      populationAtRisk: 34700,
      installedDate: "09 Feb 2025",
      uptime: "99.4%",
      meshId: "A-03",
      battery: 78,
      signal: 3,
      lastPing: "8s ago",
      metrics: {
        height: "2.45m",
        velocity: "2.8 m/s",
        velocitySubtitle: "+0.9 m/s from 6h ago | 47% above seasonal baseline",
        aiStatus: "SURGE DETECTED",
        aiSubtitle: "IMPACT IN 48 HOURS",
      },
      chartData: holaChartData,
    },
    {
      id: "n-garsen",
      name: "Garsen",
      location: "Downstream",
      status: "ELEVATED",
      lat: -2.26,
      lng: 40.11,
      floodProbability: 63,
      populationAtRisk: 18200,
      installedDate: "22 Feb 2025",
      uptime: "99.6%",
      meshId: "A-04",
      battery: 87,
      signal: 3,
      lastPing: "22s ago",
      metrics: {
        height: "3.10m",
        velocity: "2.2 m/s",
        velocitySubtitle: "+0.4 m/s from 6h ago | 28% above seasonal baseline",
        aiStatus: "MONITORING",
        aiSubtitle: "ELEVATED INFLOW",
      },
      chartData: garsenChartData,
    },
  ],
  markers: [
    { lat: -0.4531, lng: 39.6413, name: "Garissa (Upstream)",     depth: "1.20m", flow: "1.4 m/s", status: "NORMAL",   color: "#10b981", population: 2400  },
    { lat: -1.1,    lng: 39.9,    name: "Bura",                    depth: "1.75m", flow: "1.9 m/s", status: "ELEVATED", color: "#f59e0b", population: 7200  },
    { lat: -1.5,    lng: 40.03,   name: "Hola Bridge (Midstream)", depth: "2.45m", flow: "2.8 m/s", status: "CRITICAL", color: "#ef4444", population: 34700, pulse: true },
    { lat: -2.26,   lng: 40.11,   name: "Garsen",                  depth: "3.10m", flow: "2.2 m/s", status: "ELEVATED", color: "#f59e0b", population: 18200 },
    { lat: -2.58,   lng: 40.47,   name: "Tana Delta",              depth: "0.90m", flow: "0.8 m/s", status: "NORMAL",   color: "#10b981", population: 3800  },
  ],
  inundationZones: [
    {
      name: "Hola Bridge — Critical Flood Zone",
      status: "CRITICAL",
      color: "#ef4444",
      coords: [
        [-1.38, 39.88], [-1.38, 40.17], [-1.45, 40.22],
        [-1.62, 40.18], [-1.65, 39.93], [-1.55, 39.85],
      ],
    },
    {
      name: "Bura — Elevated Risk Zone",
      status: "ELEVATED",
      color: "#f59e0b",
      coords: [
        [-0.98, 39.78], [-0.98, 40.02], [-1.08, 40.05],
        [-1.22, 39.98], [-1.22, 39.78],
      ],
    },
    {
      name: "Garsen — Elevated Risk Zone",
      status: "ELEVATED",
      color: "#f59e0b",
      coords: [
        [-2.12, 39.99], [-2.12, 40.22], [-2.22, 40.25],
        [-2.38, 40.20], [-2.40, 39.99],
      ],
    },
  ],
  meshNodes: [
    { id: "A-01", name: "Node A-01", location: "Garissa (Upstream)", battery: 91, signal: 4, lastPing: "12s ago", status: "online" },
    { id: "A-02", name: "Node A-02", location: "Bura", battery: 63, signal: 2, lastPing: "4m 18s ago", fault: "⚠ SENSOR FAULT — Interpolating from Node A-01 & A-03", status: "fault" },
    { id: "A-03", name: "Node A-03", location: "Hola Bridge", battery: 78, signal: 3, lastPing: "8s ago", status: "online" },
    { id: "A-04", name: "Node A-04", location: "Garsen", battery: 87, signal: 3, lastPing: "22s ago", status: "warning" },
    { id: "A-05", name: "Node A-05", location: "Tana Delta", battery: 55, signal: 2, lastPing: "1m 07s ago", status: "online" },
  ],
};

const ATHI_BASIN: BasinConfig = {
  id: "athi",
  name: "Athi River Basin",
  region: "South-Eastern Kenya",
  river: "Athi River",
  defaultNodeId: "n-kibwezi",
  mapCenter: [-2.2, 38.0],
  mapZoom: 7,
  nodes: [
    {
      id: "n-athi-town",
      name: "Athi River Town",
      location: "Upstream",
      status: "NORMAL",
      lat: -1.45,
      lng: 36.98,
      floodProbability: 9,
      populationAtRisk: 1800,
      installedDate: "03 Mar 2025",
      uptime: "99.7%",
      meshId: "B-01",
      battery: 89,
      signal: 4,
      lastPing: "14s ago",
      metrics: {
        height: "0.95m",
        velocity: "1.1 m/s",
        velocitySubtitle: "+0.05 m/s from 6h ago | 3% above seasonal baseline",
        aiStatus: "SYSTEM NORMAL",
        aiSubtitle: "FLOW STABLE",
      },
      chartData: athiTownChartData,
    },
    {
      id: "n-kibwezi",
      name: "Kibwezi",
      location: "Midstream",
      status: "CRITICAL",
      lat: -2.41,
      lng: 37.97,
      floodProbability: 78,
      populationAtRisk: 29400,
      installedDate: "18 Mar 2025",
      uptime: "99.2%",
      meshId: "B-03",
      battery: 76,
      signal: 3,
      lastPing: "5s ago",
      metrics: {
        height: "2.80m",
        velocity: "3.1 m/s",
        velocitySubtitle: "+1.2 m/s from 6h ago | 52% above seasonal baseline",
        aiStatus: "SURGE DETECTED",
        aiSubtitle: "IMPACT IN 36 HOURS",
      },
      chartData: kibweziChartData,
    },
    {
      id: "n-malindi",
      name: "Malindi",
      location: "Downstream",
      status: "ELEVATED",
      lat: -3.22,
      lng: 40.12,
      floodProbability: 52,
      populationAtRisk: 16500,
      installedDate: "28 Mar 2025",
      uptime: "99.5%",
      meshId: "B-05",
      battery: 71,
      signal: 3,
      lastPing: "19s ago",
      metrics: {
        height: "2.30m",
        velocity: "1.8 m/s",
        velocitySubtitle: "+0.5 m/s from 6h ago | 31% above seasonal baseline",
        aiStatus: "MONITORING",
        aiSubtitle: "RISING INFLOW",
      },
      chartData: malindiChartData,
    },
  ],
  markers: [
    { lat: -1.45, lng: 36.98, name: "Athi River Town (Upstream)", depth: "0.95m", flow: "1.1 m/s", status: "NORMAL",   color: "#10b981", population: 1800 },
    { lat: -1.52, lng: 37.26, name: "Machakos",                   depth: "1.65m", flow: "1.7 m/s", status: "ELEVATED", color: "#f59e0b", population: 8900 },
    { lat: -2.41, lng: 37.97, name: "Kibwezi (Midstream)",         depth: "2.80m", flow: "3.1 m/s", status: "CRITICAL", color: "#ef4444", population: 29400, pulse: true },
    { lat: -2.69, lng: 38.17, name: "Mtito Andei",                 depth: "2.15m", flow: "2.0 m/s", status: "ELEVATED", color: "#f59e0b", population: 12300 },
    { lat: -3.22, lng: 40.12, name: "Malindi (Downstream)",        depth: "1.10m", flow: "0.9 m/s", status: "NORMAL",   color: "#10b981", population: 4200 },
  ],
  inundationZones: [
    {
      name: "Kibwezi — Critical Flood Zone",
      status: "CRITICAL",
      color: "#ef4444",
      coords: [
        [-2.30, 37.82], [-2.30, 38.12], [-2.38, 38.18],
        [-2.52, 38.12], [-2.54, 37.88], [-2.45, 37.80],
      ],
    },
    {
      name: "Machakos — Elevated Risk Zone",
      status: "ELEVATED",
      color: "#f59e0b",
      coords: [
        [-1.42, 37.14], [-1.42, 37.38], [-1.52, 37.42],
        [-1.64, 37.35], [-1.64, 37.14],
      ],
    },
    {
      name: "Mtito Andei — Elevated Risk Zone",
      status: "ELEVATED",
      color: "#f59e0b",
      coords: [
        [-2.58, 38.04], [-2.58, 38.28], [-2.68, 38.32],
        [-2.82, 38.25], [-2.82, 38.04],
      ],
    },
  ],
  meshNodes: [
    { id: "B-01", name: "Node B-01", location: "Athi River Town", battery: 89, signal: 4, lastPing: "14s ago", status: "online" },
    { id: "B-02", name: "Node B-02", location: "Machakos", battery: 44, signal: 2, lastPing: "5m 12s ago", status: "warning" },
    { id: "B-03", name: "Node B-03", location: "Kibwezi", battery: 76, signal: 3, lastPing: "5s ago", status: "online" },
    { id: "B-04", name: "Node B-04", location: "Mtito Andei", battery: 58, signal: 1, lastPing: "9m 41s ago", fault: "⚠ COMMS DEGRADED — Switching to backup LoRa 868 MHz", status: "fault" },
    { id: "B-05", name: "Node B-05", location: "Malindi", battery: 71, signal: 3, lastPing: "19s ago", status: "online" },
  ],
};

export const BASINS: BasinConfig[] = [TANA_BASIN, ATHI_BASIN];

export function useDashboardData() {
  const [activeBasinId, setActiveBasinIdRaw] = useState<string>("tana");
  const [activeNodeId, setActiveNodeId] = useState<string>("n-hola");

  const activeBasin = BASINS.find((b) => b.id === activeBasinId) || BASINS[0];
  const activeNode = activeBasin.nodes.find((n) => n.id === activeNodeId) || activeBasin.nodes[0];

  function setActiveBasinId(id: string) {
    setActiveBasinIdRaw(id);
    const basin = BASINS.find((b) => b.id === id);
    if (basin) setActiveNodeId(basin.defaultNodeId);
  }

  return {
    basins: BASINS,
    activeBasinId,
    setActiveBasinId,
    activeBasin,
    nodes: activeBasin.nodes,
    activeNodeId,
    setActiveNodeId,
    activeNode,
  };
}
