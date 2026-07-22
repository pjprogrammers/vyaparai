"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { getFirebase } from "@/lib/firebase/client";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { useAuth } from "@/components/auth-provider";

export function ExpenseUploader({ businessId }: { businessId: string }) {
  const [status, setStatus] = useState<"idle" | "uploading" | "processing" | "done" | "error">("idle");
  const [message, setMessage] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const { getIdToken } = useAuth();

  async function handleUpload() {
    if (!file) return;
    setStatus("uploading");
    setMessage("Uploading bill…");
    try {
      const { storage } = getFirebase();
      const path = `expenses/${businessId}/${Date.now()}_${file.name}`;
      const storageRef = ref(storage, path);
      await uploadBytes(storageRef, file);
      const fileUrl = await getDownloadURL(storageRef);

      setStatus("processing");
      setMessage("AI extracting category & amount…");
      const token = await getIdToken();
      const headers: Record<string, string> = { "Content-Type": "application/json" };
      if (token) headers.authorization = `Bearer ${token}`;
      const res = await fetch("/api/process-expense", {
        method: "POST",
        headers,
        body: JSON.stringify({ businessId, fileUrl }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? "Processing failed");
      setStatus("done");
      setMessage(`Expense logged: ${data.expense.category} — ₹${data.expense.amount}.`);
    } catch (e) {
      setStatus("error");
      setMessage(e instanceof Error ? e.message : "Error");
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Expense Intelligence</CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        <input
          type="file"
          accept="image/*,application/pdf"
          onChange={(e) => setFile(e.target.files?.[0] ?? null)}
          className="block w-full text-sm text-slate-400 file:mr-4 file:rounded-xl file:border-0 file:bg-yellow-500/20 file:px-4 file:py-2 file:text-sm file:font-semibold file:text-yellow-300"
        />
        <Button
          onClick={handleUpload}
          disabled={!file || status === "uploading" || status === "processing"}
          className="w-full"
        >
          {status === "processing" ? "Extracting…" : "Extract Expense"}
        </Button>
        {message && (
          <p className={status === "error" ? "text-sm text-red-400" : "text-sm text-emerald-400"}>
            {message}
          </p>
        )}
      </CardContent>
    </Card>
  );
}
