import { useState } from "react";

export type NodeStatus = "NORMAL" | "ELEVATED" | "CRITICAL";

export interface NodeData {
  id: string;
  name: string;
  location: string;
  status: NodeStatus;
  metrics: {
    height: string;
    velocity: string;
    aiStatus: string;
    aiSubtitle: string;
  };
  chartData: Array<{ day: string; discharge: number }>;
}

const mockNodes: NodeData[] = [
  {
    id: "n-garissa",
    name: "Garissa",
    location: "Upstream",
    status: "NORMAL",
    metrics: {
      height: "1.20m",
      velocity: "5.4 m/s",
      aiStatus: "SYSTEM NORMAL",
      aiSubtitle: "FLOW STABLE",
    },
    chartData: [
      { day: "Day 1", discharge: 420 },
      { day: "Day 2", discharge: 410 },
      { day: "Day 3", discharge: 405 },
      { day: "Day 4", discharge: 400 },
      { day: "Day 5", discharge: 430 },
      { day: "Day 6", discharge: 450 },
      { day: "Day 7", discharge: 480 },
      { day: "Day 8", discharge: 470 },
      { day: "Day 9", discharge: 460 },
      { day: "Day 10", discharge: 490 },
      { day: "Day 11", discharge: 510 },
      { day: "Day 12", discharge: 505 },
      { day: "Day 13", discharge: 520 },
      { day: "Day 14", discharge: 515 },
    ]
  },
  {
    id: "n-hola",
    name: "Hola Bridge",
    location: "Midstream",
    status: "CRITICAL",
    metrics: {
      height: "2.45m",
      velocity: "14.2 m/s",
      aiStatus: "SURGE DETECTED",
      aiSubtitle: "IMPACT IN 48 HOURS",
    },
    chartData: [
      { day: "Day 1", discharge: 820 },
      { day: "Day 2", discharge: 790 },
      { day: "Day 3", discharge: 700 },
      { day: "Day 4", discharge: 620 },
      { day: "Day 5", discharge: 680 },
      { day: "Day 6", discharge: 750 },
      { day: "Day 7", discharge: 900 },
      { day: "Day 8", discharge: 1100 },
      { day: "Day 9", discharge: 1380 },
      { day: "Day 10", discharge: 1620 },
      { day: "Day 11", discharge: 1950 },
      { day: "Day 12", discharge: 2250 },
      { day: "Day 13", discharge: 2580 },
      { day: "Day 14", discharge: 2820 }
    ]
  },
  {
    id: "n-garsen",
    name: "Garsen",
    location: "Downstream",
    status: "ELEVATED",
    metrics: {
      height: "1.95m",
      velocity: "8.1 m/s",
      aiStatus: "MONITORING",
      aiSubtitle: "ELEVATED INFLOW",
    },
    chartData: [
      { day: "Day 1", discharge: 900 },
      { day: "Day 2", discharge: 890 },
      { day: "Day 3", discharge: 880 },
      { day: "Day 4", discharge: 850 },
      { day: "Day 5", discharge: 860 },
      { day: "Day 6", discharge: 890 },
      { day: "Day 7", discharge: 950 },
      { day: "Day 8", discharge: 1020 },
      { day: "Day 9", discharge: 1050 },
      { day: "Day 10", discharge: 1120 },
      { day: "Day 11", discharge: 1180 },
      { day: "Day 12", discharge: 1250 },
      { day: "Day 13", discharge: 1300 },
      { day: "Day 14", discharge: 1350 },
    ]
  }
];

export function useDashboardData() {
  const [activeNodeId, setActiveNodeId] = useState<string>("n-hola");
  
  const activeNode = mockNodes.find(n => n.id === activeNodeId) || mockNodes[1];

  return {
    nodes: mockNodes,
    activeNodeId,
    setActiveNodeId,
    activeNode
  };
}
