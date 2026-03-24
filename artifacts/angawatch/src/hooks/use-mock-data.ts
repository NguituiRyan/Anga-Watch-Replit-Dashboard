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
  metrics: {
    height: string;
    velocity: string;
    velocitySubtitle: string;
    aiStatus: string;
    aiSubtitle: string;
  };
  chartData: ChartPoint[];
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

const mockNodes: NodeData[] = [
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
    metrics: {
      height: "3.10m",
      velocity: "2.2 m/s",
      velocitySubtitle: "+0.4 m/s from 6h ago | 28% above seasonal baseline",
      aiStatus: "MONITORING",
      aiSubtitle: "ELEVATED INFLOW",
    },
    chartData: garsenChartData,
  },
];

export function useDashboardData() {
  const [activeNodeId, setActiveNodeId] = useState<string>("n-hola");
  const activeNode = mockNodes.find((n) => n.id === activeNodeId) || mockNodes[1];
  return { nodes: mockNodes, activeNodeId, setActiveNodeId, activeNode };
}
