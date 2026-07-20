"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { getFirebase } from "@/lib/firebase/client";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";

export function ExpenseUploader({ businessId }: { businessId: string }) {
  const [status, setStatus] = useState<"idle" | "uploading" | "processing" | "done" | "error">("idle");
  const [message, setMessage] = useState("");
  const [file, setFile] = useState<File | null>(null);

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
      const res = await fetch("/api/process-expense", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
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
          className="block w-full text-sm text-slate-500 file:mr-4 file:rounded-xl file:border-0 file:bg-indigo-50 file:px-4 file:py-2 file:text-sm file:font-semibold file:text-indigo-700"
        />
        <Button
          onClick={handleUpload}
          disabled={!file || status === "uploading" || status === "processing"}
          className="w-full"
        >
          {status === "processing" ? "Extracting…" : "Extract Expense"}
        </Button>
        {message && (
          <p className={status === "error" ? "text-sm text-red-600" : "text-sm text-emerald-600"}>
            {message}
          </p>
        )}
      </CardContent>
    </Card>
  );
}
