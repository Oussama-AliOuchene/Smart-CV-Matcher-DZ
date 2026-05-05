"use client";

import { useEffect, useState } from "react";

import {
  Legend,
  PolarAngleAxis,
  PolarGrid,
  PolarRadiusAxis,
  Radar,
  RadarChart as RechartsRadarChart,
  ResponsiveContainer,
  Tooltip,
} from "recharts";

type RadarDataPoint = {
  skill: string;
  candidate: number;
  ideal: number;
};

type SkillRadarChartProps = {
  data: RadarDataPoint[];
};

export function SkillRadarChart({ data }: SkillRadarChartProps) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return <div className="h-80 w-full rounded-xl bg-muted/50" />;
  }

  return (
    <div className="h-80 w-full">
      <ResponsiveContainer width="100%" height="100%">
        <RechartsRadarChart data={data} outerRadius="70%">
          <PolarGrid stroke="rgba(148, 163, 184, 0.35)" />
          <PolarAngleAxis dataKey="skill" tick={{ fill: "#64748b", fontSize: 12 }} />
          <PolarRadiusAxis angle={90} domain={[0, 100]} tick={false} axisLine={false} />
          <Radar
            name="Candidate"
            dataKey="candidate"
            stroke="#2563eb"
            fill="#2563eb"
            fillOpacity={0.3}
            strokeWidth={2}
          />
          <Radar
            name="Ideal Profile"
            dataKey="ideal"
            stroke="#16a34a"
            fill="#16a34a"
            fillOpacity={0.15}
            strokeWidth={2}
          />
          <Tooltip
            cursor={false}
            contentStyle={{
              borderRadius: "0.75rem",
              border: "1px solid #cbd5e1",
              background: "rgba(255,255,255,0.92)",
            }}
          />
          <Legend />
        </RechartsRadarChart>
      </ResponsiveContainer>
    </div>
  );
}
