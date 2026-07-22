"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useAuth } from "@/components/auth-provider";
import { formatCurrency } from "@/lib/utils";
import { FileText, TrendingUp, TrendingDown } from "lucide-react";
import type { Report } from "@/lib/types";

export function ReportsPanel({ businessId }: { businessId: string }) {
  const [reports, setReports] = useState<Report[]>([]);
  const [loading, setLoading] = useState(true);
  const [generating, setGenerating] = useState<string | null>(null);
  const { getIdToken } = useAuth();

  async function fetchReports() {
    setLoading(true);
    try {
      const token = await getIdToken();
      const headers: Record<string, string> = {};
      if (token) headers.authorization = `Bearer ${token}`;
      const res = await fetch(`/api/reports?businessId=${businessId}`, { headers });
      if (res.ok) {
        const data = await res.json();
        setReports(data.reports);
      }
    } catch {
      // silent
    }
    setLoading(false);
  }

  useEffect(() => {
    /* eslint-disable react-hooks/set-state-in-effect */
    fetchReports();
  }, [businessId]);

  async function generateReport(period: string) {
    setGenerating(period);
    try {
      const token = await getIdToken();
      const headers: Record<string, string> = { "Content-Type": "application/json" };
      if (token) headers.authorization = `Bearer ${token}`;
      const res = await fetch("/api/reports", {
        method: "POST",
        headers,
        body: JSON.stringify({ businessId, period }),
      });
      const data = await res.json();
      if (res.ok && data.report) {
        setReports((prev) => [data.report, ...prev]);
      }
    } catch {
      // silent
    }
    setGenerating(null);
  }

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="flex items-center gap-2 text-base">
          <FileText className="h-4 w-4" /> Reports
        </CardTitle>
        <div className="flex gap-1">
          {["daily", "weekly", "monthly", "yearly"].map((p) => (
            <Button
              key={p}
              variant="outline"
              size="sm"
              className="text-xs"
              disabled={generating === p}
              onClick={() => generateReport(p)}
            >
              {generating === p ? "…" : p}
            </Button>
          ))}
        </div>
      </CardHeader>
      <CardContent className="space-y-3 max-h-80 overflow-y-auto">
        {loading ? (
          <p className="text-sm text-slate-400">Loading…</p>
        ) : reports.length === 0 ? (
          <p className="text-sm text-slate-400">No reports yet. Click a period button to generate.</p>
        ) : (
          reports.map((r) => (
            <div key={r.reportId} className="rounded-lg border border-white/10 bg-white/5 p-3 text-sm space-y-1">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Badge variant="outline" className="capitalize">{r.period}</Badge>
                  <span className="text-xs text-slate-400">{r.startDate} to {r.endDate}</span>
                </div>
                <span className="text-xs text-slate-500">
                  {new Date(r.generatedAt).toLocaleString("en-IN")}
                </span>
              </div>
              <div className="grid grid-cols-3 gap-2 mt-2">
                <div>
                  <p className="text-xs text-slate-400">Revenue</p>
                  <p className="font-semibold text-white">{formatCurrency(r.totalRevenue)}</p>
                </div>
                <div>
                  <p className="text-xs text-slate-400">Expenses</p>
                  <p className="font-semibold text-white">{formatCurrency(r.totalExpenses)}</p>
                </div>
                <div>
                  <p className="text-xs text-slate-400">Profit</p>
                  <p className={`font-semibold ${r.profit >= 0 ? "text-emerald-400" : "text-red-400"}`}>
                    {formatCurrency(r.profit)}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2 mt-1">
                {r.growth >= 0 ? (
                  <TrendingUp className="h-3 w-3 text-emerald-400" />
                ) : (
                  <TrendingDown className="h-3 w-3 text-red-400" />
                )}
                <span className={`text-xs ${r.growth >= 0 ? "text-emerald-400" : "text-red-400"}`}>
                  {r.growth >= 0 ? "+" : ""}{r.growth}% growth
                </span>
              </div>
              {r.topProducts.length > 0 && (
                <div className="mt-1">
                  <p className="text-xs text-slate-400">Top products: {r.topProducts.map((p) => p.name).join(", ")}</p>
                </div>
              )}
            </div>
          ))
        )}
      </CardContent>
    </Card>
  );
}
