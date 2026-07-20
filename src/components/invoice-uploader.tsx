"use client";

import { useRef, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { getFirebase } from "@/lib/firebase/client";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { useAuth } from "@/components/auth-provider";

export function InvoiceUploader({ businessId }: { businessId: string }) {
  const [status, setStatus] = useState<"idle" | "uploading" | "processing" | "done" | "error">("idle");
  const [message, setMessage] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const { getIdToken } = useAuth();

  async function handleUpload() {
    if (!file) return;
    setStatus("uploading");
    setMessage("Uploading to storage…");
    try {
      const { storage } = getFirebase();
      const path = `invoices/${businessId}/${Date.now()}_${file.name}`;
      const storageRef = ref(storage, path);
      await uploadBytes(storageRef, file);
      const fileUrl = await getDownloadURL(storageRef);

      setStatus("processing");
      setMessage("Running OCR + Gemini extraction…");
      const token = await getIdToken();
      const headers: Record<string, string> = { "Content-Type": "application/json" };
      if (token) headers.authorization = `Bearer ${token}`;
      const res = await fetch("/api/process-invoice", {
        method: "POST",
        headers,
        body: JSON.stringify({ businessId, fileUrl }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? "Processing failed");
      setStatus("done");
      setMessage(
        `Invoice from ${data.invoice.supplier} processed — ₹${data.invoice.amount}. Inventory updated.`,
      );
    } catch (e) {
      setStatus("error");
      setMessage(e instanceof Error ? e.message : "Error");
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Upload Supplier Invoice</CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        <input
          ref={inputRef}
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
          {status === "uploading"
            ? "Uploading…"
            : status === "processing"
              ? "Extracting with AI…"
              : "Extract with AI"}
        </Button>
        {message && (
          <p
            className={
              status === "error"
                ? "text-sm text-red-600"
                : status === "done"
                  ? "text-sm text-emerald-600"
                  : "text-sm text-slate-500"
            }
          >
            {message}
          </p>
        )}
      </CardContent>
    </Card>
  );
}
