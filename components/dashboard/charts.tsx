"use client";
import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

export function DashboardCharts({
  category,
  district,
}: {
  category: { name: string; value: number }[];
  district: { name: string; value: number }[];
}) {
  const colors = ["#176b57", "#65a30d", "#f59e0b"];
  const trend = [
    { name: "Jan", value: 0 },
    { name: "Feb", value: 0 },
    { name: "Mar", value: 0 },
    { name: "Apr", value: 0 },
    { name: "Mei", value: 0 },
    { name: "Jun", value: 0 },
  ];
  return (
    <div className="grid gap-5 xl:grid-cols-[1.4fr_.8fr]">
      <article className="rounded-lg border border-slate-200 bg-white p-5">
        <h2 className="font-semibold">Tren pendataan UMKM</h2>
        <p className="mt-1 text-xs text-slate-500">
          Akumulasi berdasarkan bulan
        </p>
        <div className="mt-5 h-64">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={trend}>
              <defs>
                <linearGradient id="g" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#176b57" stopOpacity={0.25} />
                  <stop offset="95%" stopColor="#176b57" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" vertical={false} />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Area
                type="monotone"
                dataKey="value"
                stroke="#176b57"
                fill="url(#g)"
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </article>
      <article className="rounded-lg border border-slate-200 bg-white p-5">
        <h2 className="font-semibold">Kategori usaha</h2>
        <p className="mt-1 text-xs text-slate-500">Komposisi kondisi terkini</p>
        <div className="mt-3 h-48">
          <ResponsiveContainer>
            <PieChart>
              <Pie
                data={category}
                dataKey="value"
                nameKey="name"
                innerRadius={50}
                outerRadius={76}
                paddingAngle={3}
              >
                {category.map((_, i) => (
                  <Cell key={i} fill={colors[i]} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>
        <div className="space-y-2">
          {category.map((x, i) => (
            <div key={x.name} className="flex justify-between text-sm">
              <span className="flex items-center gap-2">
                <i
                  className="h-2.5 w-2.5 rounded-full"
                  style={{ background: colors[i] }}
                />
                {x.name}
              </span>
              <b>{x.value}</b>
            </div>
          ))}
        </div>
      </article>
      <article className="rounded-lg border border-slate-200 bg-white p-5 xl:col-span-2">
        <h2 className="font-semibold">Distribusi kecamatan</h2>
        <div className="mt-5 h-52">
          <ResponsiveContainer>
            <BarChart data={district} layout="vertical">
              <CartesianGrid strokeDasharray="3 3" horizontal={false} />
              <XAxis type="number" />
              <YAxis dataKey="name" type="category" width={150} />
              <Tooltip />
              <Bar dataKey="value" fill="#176b57" radius={[0, 4, 4, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </article>
    </div>
  );
}
