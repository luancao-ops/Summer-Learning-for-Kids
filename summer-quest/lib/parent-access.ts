import { createHash, timingSafeEqual } from "crypto";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

import { prisma } from "@/lib/prisma";

const ACCESS_COOKIE_MAX_AGE = 60 * 60 * 8;
const PARENT_PIN_SALT = "summer-quest-parent-pin";
const PARENT_TOKEN_SALT = "summer-quest-parent-token";

export const PARENT_ACCESS_COOKIE = "sq_parent_access";
export const PARENT_PIN_CONFIG_KEY = "parentPinHash";

export const parentAccessCookieOptions = {
  httpOnly: true,
  sameSite: "lax" as const,
  path: "/",
  maxAge: ACCESS_COOKIE_MAX_AGE,
};

export function normalizeParentPin(pin: string): string {
  return pin.trim();
}

export function isValidParentPin(pin: string): boolean {
  const normalized = normalizeParentPin(pin);
  return normalized.length >= 4 && normalized.length <= 24;
}

export function hashParentPin(pin: string): string {
  return createHash("sha256")
    .update(`${PARENT_PIN_SALT}:${normalizeParentPin(pin)}`)
    .digest("hex");
}

export function parentAccessToken(pinHash: string): string {
  return createHash("sha256")
    .update(`${PARENT_TOKEN_SALT}:${pinHash}`)
    .digest("hex");
}

function safeEqual(left: string, right: string): boolean {
  const leftBuffer = Buffer.from(left);
  const rightBuffer = Buffer.from(right);
  if (leftBuffer.length !== rightBuffer.length) return false;
  return timingSafeEqual(leftBuffer, rightBuffer);
}

export async function getParentPinHash(): Promise<string | null> {
  const rows = await prisma.$queryRaw<Array<{ value: string }>>`
    SELECT value FROM "SiteConfig" WHERE key = ${PARENT_PIN_CONFIG_KEY}
  `;
  return rows[0]?.value ?? null;
}

export async function hasParentAccess(pinHash: string | null): Promise<boolean> {
  if (!pinHash) return true;
  const cookieStore = await cookies();
  const cookieValue = cookieStore.get(PARENT_ACCESS_COOKIE)?.value;
  if (!cookieValue) return false;
  return safeEqual(cookieValue, parentAccessToken(pinHash));
}

export async function requireParentAccess(): Promise<void> {
  const pinHash = await getParentPinHash();
  if (!(await hasParentAccess(pinHash))) {
    redirect("/parent/unlock");
  }
}
