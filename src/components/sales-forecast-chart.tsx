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
          <CartesianGrid strokeDasharray="3 3" stroke="#eef2f7" />
          <XAxis dataKey="month" fontSize={11} />
          <YAxis fontSize={11} tickFormatter={(v) => `₹${(v / 1000).toFixed(0)}k`} />
          <Tooltip
            formatter={
              ((value: ValueType): [string, string] => [
                `₹${Number(value).toLocaleString("en-IN")}`,
                "Revenue",
              ]) as Formatter<ValueType, NameType>
            }
          />
          <Line type="monotone" dataKey="revenue" stroke="#4f46e5" strokeWidth={2.5} dot={{ r: 3 }} />
          {prediction && (
            <ReferenceDot x={prediction.month} y={prediction.revenue} r={5} fill="#16a34a" stroke="#16a34a" />
          )}
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
