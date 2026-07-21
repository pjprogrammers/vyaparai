"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useAuth } from "@/components/auth-provider";
import { getBusinessAction, updateBusinessAction } from "@/app/actions/setup";
import { Settings, Upload, Save } from "lucide-react";
import dynamic from "next/dynamic";
import { GradientOrb, GridBackground } from "@/components/3d/backgrounds";

const DashboardScene3D = dynamic(
  () => import("@/components/3d/dashboard-scene").then((m) => m.DashboardScene3D),
  { ssr: false }
);
import type { Business } from "@/lib/types";

export default function SettingsPage() {
  const { user, loading } = useAuth();
  const [business, setBusiness] = useState<Business | null>(null);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");
  const [uploading, setUploading] = useState(false);

  const businessId = user?.uid ? `biz_${user.uid}` : null;

  useEffect(() => {
    if (loading || !businessId) return;
    getBusinessAction(businessId).then((b) => setBusiness(b));
  }, [businessId, loading]);

  async function handleLogoUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file || !businessId) return;
    setUploading(true);
    try {
      const { getStorage, ref, uploadBytes, getDownloadURL } = await import("firebase/storage");
      const { initializeApp, getApps } = await import("firebase/app");
      const firebaseConfig = {
        apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
        authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
        projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
        storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
      };
      const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApps()[0];
      const storage = getStorage(app);
      const storageRef = ref(storage, `logos/${businessId}/${file.name}`);
      await uploadBytes(storageRef, file);
      const url = await getDownloadURL(storageRef);
      setBusiness((prev) => (prev ? { ...prev, logoUrl: url } : prev));
      if (businessId) {
        await updateBusinessAction(businessId, { logoUrl: url });
      }
      setMessage("Logo uploaded successfully");
    } catch {
      setMessage("Failed to upload logo");
    }
    setUploading(false);
  }

  async function handleSave() {
    if (!business || !businessId) return;
    setSaving(true);
    setMessage("");
    try {
      const result = await updateBusinessAction(businessId, {
        name: business.name,
        address: business.address,
        gst: business.gst,
        phone: business.phone,
        email: business.email,
        website: business.website,
        upiId: business.upiId,
        bankDetails: business.bankDetails,
      });
      if (result.error) {
        setMessage(result.error);
      } else {
        setMessage("Settings saved successfully");
      }
    } catch {
      setMessage("Failed to save settings");
    }
    setSaving(false);
  }

  if (loading) return <div className="p-10 text-center text-slate-500">Loading…</div>;
  if (!business) return <div className="p-10 text-center text-slate-500">No business found. Complete setup first.</div>;

  return (
    <main className="relative min-h-screen bg-slate-950 text-white">
      <GridBackground />
      <GradientOrb className="top-20 -right-32 w-96 h-96" color="#6366f1" />
      <div className="pointer-events-none fixed inset-0 z-0"><DashboardScene3D /></div>

      <div className="relative z-10 mx-auto max-w-2xl space-y-6 p-6">
        <header className="flex items-center gap-3">
          <Settings className="h-6 w-6 text-indigo-400" />
          <h1 className="text-2xl font-bold text-white">Business Settings</h1>
        </header>

        <Card className="bg-slate-800/80 backdrop-blur-xl border-slate-700">
          <CardHeader><CardTitle className="text-base text-white">Business Logo</CardTitle></CardHeader>
          <CardContent className="flex items-center gap-4">
            {business.logoUrl ? (
              <img src={business.logoUrl} alt="Logo" className="h-16 w-16 rounded-lg object-cover border border-slate-600" />
            ) : (
              <div className="flex h-16 w-16 items-center justify-center rounded-lg border border-dashed border-slate-600 bg-slate-900/50 text-slate-400">
                <Upload className="h-6 w-6" />
              </div>
            )}
            <div>
              <label className="cursor-pointer rounded-xl bg-indigo-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-indigo-500">
                <Upload className="mr-1 inline h-4 w-4" />
                {uploading ? "Uploading…" : "Upload Logo"}
                <input type="file" accept="image/*" className="hidden" onChange={handleLogoUpload} disabled={uploading} />
              </label>
              <p className="mt-1 text-xs text-slate-500">PNG, JPG up to 2MB. Shows on invoices.</p>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-slate-800/80 backdrop-blur-xl border-slate-700">
          <CardHeader><CardTitle className="text-base text-white">Business Information</CardTitle></CardHeader>
          <CardContent className="space-y-3">
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-xs font-medium text-slate-400">Business Name</label>
                <Input className="bg-slate-900/50 border-slate-600 text-white" value={business.name} onChange={(e) => setBusiness({ ...business, name: e.target.value })} />
              </div>
              <div>
                <label className="text-xs font-medium text-slate-400">Category</label>
                <Input className="bg-slate-900/50 border-slate-600 text-white" value={business.category} disabled />
              </div>
            </div>
            <div>
              <label className="text-xs font-medium text-slate-400">Address</label>
              <Input className="bg-slate-900/50 border-slate-600 text-white" value={business.address} onChange={(e) => setBusiness({ ...business, address: e.target.value })} />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-xs font-medium text-slate-400">GSTIN</label>
                <Input className="bg-slate-900/50 border-slate-600 text-white" value={business.gst} onChange={(e) => setBusiness({ ...business, gst: e.target.value })} />
              </div>
              <div>
                <label className="text-xs font-medium text-slate-400">Phone</label>
                <Input className="bg-slate-900/50 border-slate-600 text-white" value={business.phone ?? ""} onChange={(e) => setBusiness({ ...business, phone: e.target.value })} placeholder="+91 XXXXX XXXXX" />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-xs font-medium text-slate-400">Email</label>
                <Input className="bg-slate-900/50 border-slate-600 text-white" value={business.email ?? ""} onChange={(e) => setBusiness({ ...business, email: e.target.value })} placeholder="business@example.com" />
              </div>
              <div>
                <label className="text-xs font-medium text-slate-400">Website</label>
                <Input className="bg-slate-900/50 border-slate-600 text-white" value={business.website ?? ""} onChange={(e) => setBusiness({ ...business, website: e.target.value })} placeholder="https://example.com" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-slate-800/80 backdrop-blur-xl border-slate-700">
          <CardHeader><CardTitle className="text-base text-white">Payment Details</CardTitle></CardHeader>
          <CardContent className="space-y-3">
            <div>
              <label className="text-xs font-medium text-slate-400">UPI ID</label>
              <Input className="bg-slate-900/50 border-slate-600 text-white" value={business.upiId ?? ""} onChange={(e) => setBusiness({ ...business, upiId: e.target.value })} placeholder="yourname@upi" />
            </div>
            <div>
              <label className="text-xs font-medium text-slate-400">Bank Details</label>
              <Input className="bg-slate-900/50 border-slate-600 text-white" value={business.bankDetails ?? ""} onChange={(e) => setBusiness({ ...business, bankDetails: e.target.value })} placeholder="Bank Name, A/C No, IFSC" />
            </div>
          </CardContent>
        </Card>

        <div className="flex items-center gap-3">
          <Button onClick={handleSave} disabled={saving} className="bg-indigo-600 hover:bg-indigo-500">
            <Save className="mr-1 h-4 w-4" />
            {saving ? "Saving…" : "Save Settings"}
          </Button>
          {message && (
            <p className={`text-sm ${message.includes("success") ? "text-emerald-500" : "text-red-500"}`}>
              {message}
            </p>
          )}
        </div>
      </div>
    </main>
  );
}
