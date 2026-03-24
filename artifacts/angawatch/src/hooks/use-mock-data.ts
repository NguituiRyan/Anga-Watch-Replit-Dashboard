import { useState } from "react";

export type NodeStatus = "NORMAL" | "ELEVATED" | "CRITICAL";

export interface ChartPoint {
  day: string;
  discharge_observed: number | null;
  discharge_predicted: number | null;
}

export interface NodeData {
  id: string;
  name: string;
  location: string;
  status: NodeStatus;
  metrics: {
    height: string;
    velocity: string;
    velocitySubtitle: string;
    aiStatus: string;
    aiSubtitle: string;
  };
  chartData: ChartPoint[];
}

const holaChartData: ChartPoint[] = [
  { day: "Day -5", discharge_observed: 820,  discharge_predicted: null },
  { day: "Day -4", discharge_observed: 790,  discharge_predicted: null },
  { day: "Day -3", discharge_observed: 700,  discharge_predicted: null },
  { day: "Day -2", discharge_observed: 620,  discharge_predicted: null },
  { day: "Day -1", discharge_observed: 740,  discharge_predicted: null },
  { day: "TODAY",  discharge_observed: 900,  discharge_predicted: 900  },
  { day: "Day +1", discharge_observed: null, discharge_predicted: 1100 },
  { day: "Day +2", discharge_observed: null, discharge_predicted: 1450 },
  { day: "Day +3", discharge_observed: null, discharge_predicted: 2000 },
  { day: "Day +4", discharge_observed: null, discharge_predicted: 2820 },
];

const garissaChartData: ChartPoint[] = [
  { day: "Day -5", discharge_observed: 380,  discharge_predicted: null },
  { day: "Day -4", discharge_observed: 360,  discharge_predicted: null },
  { day: "Day -3", discharge_observed: 340,  discharge_predicted: null },
  { day: "Day -2", discharge_observed: 350,  discharge_predicted: null },
  { day: "Day -1", discharge_observed: 370,  discharge_predicted: null },
  { day: "TODAY",  discharge_observed: 390,  discharge_predicted: 390  },
  { day: "Day +1", discharge_observed: null, discharge_predicted: 410  },
  { day: "Day +2", discharge_observed: null, discharge_predicted: 430  },
  { day: "Day +3", discharge_observed: null, discharge_predicted: 420  },
  { day: "Day +4", discharge_observed: null, discharge_predicted: 440  },
];

const garsenChartData: ChartPoint[] = [
  { day: "Day -5", discharge_observed: 980,  discharge_predicted: null },
  { day: "Day -4", discharge_observed: 960,  discharge_predicted: null },
  { day: "Day -3", discharge_observed: 1020, discharge_predicted: null },
  { day: "Day -2", discharge_observed: 1080, discharge_predicted: null },
  { day: "Day -1", discharge_observed: 1100, discharge_predicted: null },
  { day: "TODAY",  discharge_observed: 1150, discharge_predicted: 1150 },
  { day: "Day +1", discharge_observed: null, discharge_predicted: 1250 },
  { day: "Day +2", discharge_observed: null, discharge_predicted: 1320 },
  { day: "Day +3", discharge_observed: null, discharge_predicted: 1390 },
  { day: "Day +4", discharge_observed: null, discharge_predicted: 1450 },
];

const mockNodes: NodeData[] = [
  {
    id: "n-garissa",
    name: "Garissa",
    location: "Upstream",
    status: "NORMAL",
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

  return {
    nodes: mockNodes,
    activeNodeId,
    setActiveNodeId,
    activeNode,
  };
}
