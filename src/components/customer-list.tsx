"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { useAuth } from "@/components/auth-provider";
import { formatCurrency } from "@/lib/utils";
import { Users, Plus } from "lucide-react";
import type { Customer } from "@/lib/types";

export function CustomerList({ businessId }: { businessId: string }) {
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAdd, setShowAdd] = useState(false);
  const [newName, setNewName] = useState("");
  const [newPhone, setNewPhone] = useState("");
  const [addError, setAddError] = useState("");
  const { getIdToken } = useAuth();

  async function fetchCustomers() {
    setLoading(true);
    try {
      const token = await getIdToken();
      const headers: Record<string, string> = {};
      if (token) headers.authorization = `Bearer ${token}`;
      const res = await fetch(`/api/customers?businessId=${businessId}`, { headers });
      if (res.ok) {
        const data = await res.json();
        setCustomers(data.customers);
      }
    } catch {
      // silent
    }
    setLoading(false);
  }

  useEffect(() => {
    /* eslint-disable react-hooks/set-state-in-effect */
    fetchCustomers();
  }, [businessId]);

  async function addCustomer() {
    if (!newName.trim()) return;
    setAddError("");
    try {
      const token = await getIdToken();
      const headers: Record<string, string> = { "Content-Type": "application/json" };
      if (token) headers.authorization = `Bearer ${token}`;
      const res = await fetch("/api/customers", {
        method: "POST",
        headers,
        body: JSON.stringify({ businessId, name: newName, phone: newPhone }),
      });
      const data = await res.json();
      if (!res.ok) {
        setAddError(data.error ?? "Failed");
        return;
      }
      setCustomers((prev) => [data.customer, ...prev]);
      setNewName("");
      setNewPhone("");
      setShowAdd(false);
    } catch {
      setAddError("Failed to add customer");
    }
  }

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <div className="flex items-center gap-2">
          <CardTitle className="text-base">Customers</CardTitle>
          <Badge variant="outline">{customers.length}</Badge>
        </div>
        <Button variant="outline" size="sm" onClick={() => setShowAdd(!showAdd)}>
          <Plus className="mr-1 h-3 w-3" /> Add
        </Button>
      </CardHeader>
      <CardContent className="space-y-2">
        {showAdd && (
          <div className="space-y-2 rounded-lg border border-yellow-400/30 bg-yellow-500/10 p-3">
            <Input placeholder="Customer name" value={newName} onChange={(e) => setNewName(e.target.value)} />
            <Input placeholder="Phone (optional)" value={newPhone} onChange={(e) => setNewPhone(e.target.value)} />
            {addError && <p className="text-xs text-red-400">{addError}</p>}
            <div className="flex gap-2">
              <Button size="sm" onClick={addCustomer}>Save</Button>
              <Button size="sm" variant="ghost" onClick={() => setShowAdd(false)}>Cancel</Button>
            </div>
          </div>
        )}

        {loading ? (
          <p className="text-sm text-slate-400">Loading…</p>
        ) : customers.length === 0 ? (
          <div className="flex items-center gap-2 text-sm text-slate-400">
            <Users className="h-4 w-4" /> No customers yet. Record a sale to start tracking.
          </div>
        ) : (
          customers.map((c) => (
            <div key={c.customerId} className="flex items-center justify-between rounded-lg border border-white/10 bg-white/5 p-3 text-sm">
              <div>
                <p className="font-medium text-white">{c.name}</p>
                {c.phone && <p className="text-xs text-slate-400">{c.phone}</p>}
              </div>
              <div className="text-right">
                <p className="font-semibold text-white">{formatCurrency(c.totalPurchases)}</p>
                {c.lastPurchaseDate && (
                  <p className="text-xs text-slate-400">Last: {c.lastPurchaseDate}</p>
                )}
              </div>
            </div>
          ))
        )}
      </CardContent>
    </Card>
  );
}
