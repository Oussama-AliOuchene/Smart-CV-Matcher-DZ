"use client";

import { useEffect, useState } from "react";

import {
  Bar,
  BarChart,
  CartesianGrid,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

import { PageTransition } from "@/components/layout/PageTransition";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  commonMissingSkills,
  cvsPerDay,
  dashboardCards,
  recentSubmissions,
} from "@/lib/mock-data";

export default function DashboardPage() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <PageTransition className="space-y-8">
      <section>
        <h1 className="text-3xl font-bold">Admin Dashboard</h1>
        <p className="text-muted-foreground">Monitor platform activity and skill demand trends.</p>
      </section>

      <section className="grid gap-4 md:grid-cols-3">
        {dashboardCards.map((card) => (
          <Card key={card.title} className="rounded-xl border-border/70 bg-card/80 shadow-sm">
            <CardHeader>
              <CardDescription>{card.title}</CardDescription>
              <CardTitle className="text-3xl">{card.value}</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">{card.hint}</p>
            </CardContent>
          </Card>
        ))}
      </section>

      <section className="grid gap-6 lg:grid-cols-12">
        <Card className="rounded-xl border-border/70 bg-card/80 shadow-sm lg:col-span-7">
          <CardHeader>
            <CardTitle>Recent CV Submissions</CardTitle>
            <CardDescription>Latest processed candidates and their best matches.</CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Level</TableHead>
                  <TableHead>Top Match</TableHead>
                  <TableHead>Score</TableHead>
                  <TableHead>Date</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {recentSubmissions.map((row) => (
                  <TableRow key={`${row.name}-${row.date}`}>
                    <TableCell className="font-medium">{row.name}</TableCell>
                    <TableCell>{row.level}</TableCell>
                    <TableCell>{row.topMatch}</TableCell>
                    <TableCell>{row.score}</TableCell>
                    <TableCell>{row.date}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        <Card className="rounded-xl border-border/70 bg-card/80 shadow-sm lg:col-span-5">
          <CardHeader>
            <CardTitle>Most Common Missing Skills</CardTitle>
            <CardDescription>Frequency in analyzed CV gaps this month.</CardDescription>
          </CardHeader>
          <CardContent className="h-80">
            {mounted ? (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={commonMissingSkills} layout="vertical" margin={{ left: 8, right: 8 }}>
                  <CartesianGrid strokeDasharray="4 4" stroke="rgba(148, 163, 184, 0.2)" />
                  <XAxis type="number" stroke="#64748b" />
                  <YAxis dataKey="skill" type="category" width={90} stroke="#64748b" />
                  <Tooltip
                    cursor={{ fill: "rgba(37, 99, 235, 0.08)" }}
                    contentStyle={{
                      borderRadius: "0.75rem",
                      border: "1px solid #cbd5e1",
                      background: "rgba(255,255,255,0.95)",
                    }}
                  />
                  <Bar dataKey="value" fill="#2563eb" radius={[0, 8, 8, 0]} />
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-full w-full rounded-xl bg-muted/50" />
            )}
          </CardContent>
        </Card>
      </section>

      <section>
        <Card className="rounded-xl border-border/70 bg-card/80 shadow-sm">
          <CardHeader>
            <CardTitle>CVs Processed This Week</CardTitle>
            <CardDescription>Daily volume trend across the platform.</CardDescription>
          </CardHeader>
          <CardContent className="h-72">
            {mounted ? (
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={cvsPerDay} margin={{ top: 10, right: 20, left: 0, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="4 4" stroke="rgba(148, 163, 184, 0.2)" />
                  <XAxis dataKey="day" stroke="#64748b" />
                  <YAxis stroke="#64748b" />
                  <Tooltip
                    contentStyle={{
                      borderRadius: "0.75rem",
                      border: "1px solid #cbd5e1",
                      background: "rgba(255,255,255,0.95)",
                    }}
                  />
                  <Line
                    type="monotone"
                    dataKey="count"
                    stroke="#16a34a"
                    strokeWidth={3}
                    dot={{ fill: "#16a34a", r: 4 }}
                    activeDot={{ r: 6 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-full w-full rounded-xl bg-muted/50" />
            )}
          </CardContent>
        </Card>
      </section>
    </PageTransition>
  );
}
