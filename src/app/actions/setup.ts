"use server";

import { upsertUser, createBusiness, getUser, updateBusiness, getBusiness } from "@/lib/db";
import { businessSetupSchema } from "@/lib/ai/schemas";
import type { Business, BusinessCategory, UserProfile } from "@/lib/types";

export async function setupBusinessAction(input: {
  uid: string;
  email: string;
  displayName: string;
  business: {
    name: string;
    category: BusinessCategory;
    gst: string;
    address: string;
    currency: string;
    language: string;
    phone?: string;
    email?: string;
    website?: string;
    upiId?: string;
    bankDetails?: string;
  };
}) {
  try {
    if (!input.uid || !input.email) {
      return { error: "uid and email are required" };
    }
    const validation = businessSetupSchema.safeParse(input.business);
    if (!validation.success) {
      return { error: validation.error.issues[0]?.message ?? "Invalid business data" };
    }

    const existing = await getUser(input.uid);
    if (existing?.businessId) {
      await updateBusiness(existing.businessId, validation.data);
      return { businessId: existing.businessId };
    }

    const businessId = `biz_${input.uid}`;
    const profile: UserProfile = {
      uid: input.uid,
      name: input.displayName || input.email.split("@")[0],
      email: input.email,
      businessId,
      createdAt: new Date().toISOString(),
    };
    const business: Business = {
      businessId,
      ...validation.data,
      gst: validation.data.gst ?? "",
      owner: input.uid,
      createdAt: new Date().toISOString(),
    };
    await upsertUser(profile);
    await createBusiness(business);
    return { businessId };
  } catch {
    return { error: "Failed to set up business. Please try again." };
  }
}

export async function fetchUserAction(uid: string) {
  if (!uid) return null;
  return getUser(uid);
}

export async function updateBusinessAction(businessId: string, data: Partial<Business>) {
  try {
    await updateBusiness(businessId, data);
    return { ok: true };
  } catch {
    return { error: "Failed to update business" };
  }
}

export async function getBusinessAction(businessId: string) {
  return getBusiness(businessId);
}
