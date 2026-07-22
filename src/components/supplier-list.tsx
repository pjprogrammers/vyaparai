"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { useAuth } from "@/components/auth-provider";
import { Truck, Plus, Trash2 } from "lucide-react";
import type { Supplier } from "@/lib/types";

export function SupplierList({ businessId }: { businessId: string }) {
  const [suppliers, setSuppliers] = useState<Supplier[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAdd, setShowAdd] = useState(false);
  const [newName, setNewName] = useState("");
  const [newPhone, setNewPhone] = useState("");
  const [newEmail, setNewEmail] = useState("");
  const [addError, setAddError] = useState("");
  const { getIdToken } = useAuth();

  async function fetchSuppliers() {
    setLoading(true);
    try {
      const token = await getIdToken();
      const headers: Record<string, string> = {};
      if (token) headers.authorization = `Bearer ${token}`;
      const res = await fetch(`/api/suppliers?businessId=${businessId}`, { headers });
      if (res.ok) {
        const data = await res.json();
        setSuppliers(data.suppliers);
      }
    } catch {
      // silent
    }
    setLoading(false);
  }

  useEffect(() => {
    /* eslint-disable react-hooks/set-state-in-effect */
    fetchSuppliers();
  }, [businessId]);

  async function addSupplier() {
    if (!newName.trim()) return;
    setAddError("");
    try {
      const token = await getIdToken();
      const headers: Record<string, string> = { "Content-Type": "application/json" };
      if (token) headers.authorization = `Bearer ${token}`;
      const res = await fetch("/api/suppliers", {
        method: "POST",
        headers,
        body: JSON.stringify({ businessId, name: newName, phone: newPhone, email: newEmail }),
      });
      const data = await res.json();
      if (!res.ok) {
        setAddError(data.error ?? "Failed");
        return;
      }
      setSuppliers((prev) => [data.supplier, ...prev]);
      setNewName("");
      setNewPhone("");
      setNewEmail("");
      setShowAdd(false);
    } catch {
      setAddError("Failed to add supplier");
    }
  }

  async function removeSupplier(supplierId: string) {
    try {
      const token = await getIdToken();
      const headers: Record<string, string> = {};
      if (token) headers.authorization = `Bearer ${token}`;
      await fetch(`/api/suppliers?supplierId=${supplierId}`, { method: "DELETE", headers });
      setSuppliers((prev) => prev.filter((s) => s.supplierId !== supplierId));
    } catch {
      // silent
    }
  }

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <div className="flex items-center gap-2">
          <CardTitle className="text-base">Suppliers</CardTitle>
          <Badge variant="outline">{suppliers.length}</Badge>
        </div>
        <Button variant="outline" size="sm" onClick={() => setShowAdd(!showAdd)}>
          <Plus className="mr-1 h-3 w-3" /> Add
        </Button>
      </CardHeader>
      <CardContent className="space-y-2">
        {showAdd && (
          <div className="space-y-2 rounded-lg border border-yellow-400/30 bg-yellow-500/10 p-3">
            <Input placeholder="Supplier name" value={newName} onChange={(e) => setNewName(e.target.value)} />
            <Input placeholder="Phone (optional)" value={newPhone} onChange={(e) => setNewPhone(e.target.value)} />
            <Input placeholder="Email (optional)" value={newEmail} onChange={(e) => setNewEmail(e.target.value)} />
            {addError && <p className="text-xs text-red-400">{addError}</p>}
            <div className="flex gap-2">
              <Button size="sm" onClick={addSupplier}>Save</Button>
              <Button size="sm" variant="ghost" onClick={() => setShowAdd(false)}>Cancel</Button>
            </div>
          </div>
        )}

        {loading ? (
          <p className="text-sm text-slate-400">Loading…</p>
        ) : suppliers.length === 0 ? (
          <div className="flex items-center gap-2 text-sm text-slate-400">
            <Truck className="h-4 w-4" /> No suppliers yet. Add one to start tracking.
          </div>
        ) : (
          suppliers.map((s) => (
            <div key={s.supplierId} className="flex items-center justify-between rounded-lg border border-white/10 bg-white/5 p-3 text-sm">
              <div>
                <p className="font-medium text-white">{s.name}</p>
                {s.phone && <p className="text-xs text-slate-400">{s.phone}</p>}
                {s.email && <p className="text-xs text-slate-400">{s.email}</p>}
              </div>
              <Button
                variant="ghost"
                size="sm"
                className="text-red-400 hover:text-red-300"
                onClick={() => removeSupplier(s.supplierId)}
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          ))
        )}
      </CardContent>
    </Card>
  );
}
