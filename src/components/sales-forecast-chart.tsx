"use client";

import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  ReferenceDot,
} from "recharts";
import type {
  Formatter,
  ValueType,
  NameType,
} from "recharts/types/component/DefaultTooltipContent";

export function SalesForecastChart({
  data,
  prediction,
}: {
  data: { month: string; revenue: number }[];
  prediction: { month: string; revenue: number } | null;
}) {
  const chartData = prediction ? [...data, { ...prediction, forecast: true }] : data;

  return (
    <div className="h-64 w-full">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={chartData} margin={{ top: 10, right: 20, left: 0, bottom: 0 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
          <XAxis dataKey="month" fontSize={11} stroke="#64748b" tick={{ fill: "#94a3b8" }} />
          <YAxis fontSize={11} stroke="#64748b" tick={{ fill: "#94a3b8" }} tickFormatter={(v) => `₹${(v / 1000).toFixed(0)}k`} />
          <Tooltip
            contentStyle={{ backgroundColor: "#1e293b", border: "1px solid #334155", borderRadius: "0.75rem", color: "#f1f5f9" }}
            formatter={
              ((value: ValueType): [string, string] => [
                `₹${Number(value).toLocaleString("en-IN")}`,
                "Revenue",
              ]) as Formatter<ValueType, NameType>
            }
          />
          <Line type="monotone" dataKey="revenue" stroke="#6366f1" strokeWidth={2.5} dot={{ r: 3, fill: "#6366f1" }} />
          {prediction && (
            <ReferenceDot x={prediction.month} y={prediction.revenue} r={5} fill="#22c55e" stroke="#22c55e" />
          )}
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
