"use client";

import {
  Line,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  ResponsiveContainer,
  CartesianGrid,
  BarChart,
  Bar,
} from "recharts";
interface PaymentChartProps {
  data: { date: string; total: number }[];
}
export function UserChart({ data }: PaymentChartProps) {
  return (
    <ResponsiveContainer width="100%" minHeight={300}>
      <BarChart data={data}>
        <CartesianGrid stroke="hsl(var(--muted))" />
        <XAxis dataKey="date" stroke="hsl(var(--primary))" />
        <YAxis dataKey="total" stroke="hsl(var(--primary))" />
        <Tooltip />
        <Legend />
        <Bar type="monotone" dataKey="total" fill="#8884d8" name="Total" />
      </BarChart>
    </ResponsiveContainer>
  );
}
