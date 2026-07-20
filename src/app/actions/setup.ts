"use server";

import { upsertUser, createBusiness, getUser } from "@/lib/db";
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
  };
}) {
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
    ...input.business,
    owner: input.uid,
    createdAt: new Date().toISOString(),
  };
  await upsertUser(profile);
  await createBusiness(business);
  return { businessId };
}

export async function fetchUserAction(uid: string) {
  return getUser(uid);
}
