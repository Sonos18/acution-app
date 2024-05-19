"use client";

import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  ResponsiveContainer,
  CartesianGrid,
} from "recharts";
interface PaymentChartProps {
  data: { date: string; total: number }[];
}
export function PaymentChart({ data }: PaymentChartProps) {
  return (
    <ResponsiveContainer width="100%" minHeight={300}>
      <LineChart data={data}>
        <CartesianGrid stroke="hsl(var(--muted))" />
        <XAxis dataKey="date" stroke="hsl(var(--primary))" />
        <YAxis dataKey="total" stroke="hsl(var(--primary))" />
        <Tooltip />
        <Legend />
        <Line
          type="monotone"
          dataKey="total"
          stroke="#8884d8"
          name="Total"
          activeDot={false}
        />
      </LineChart>
    </ResponsiveContainer>
  );
}
