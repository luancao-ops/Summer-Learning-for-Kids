import { cookies } from "next/headers";
import { NextResponse } from "next/server";

import {
  PARENT_ACCESS_COOKIE,
  PARENT_PIN_CONFIG_KEY,
  getParentPinHash,
  hasParentAccess,
  hashParentPin,
  isValidParentPin,
  parentAccessCookieOptions,
  parentAccessToken,
} from "@/lib/parent-access";
import { prisma } from "@/lib/prisma";

export async function POST(request: Request) {
  const body = (await request.json()) as { pin?: unknown };
  const newPin = typeof body.pin === "string" ? body.pin : "";

  if (!isValidParentPin(newPin)) {
    return NextResponse.json({ ok: false, error: "invalid_pin" }, { status: 400 });
  }

  const existingHash = await getParentPinHash();
  if (existingHash) {
    if (!(await hasParentAccess(existingHash))) {
      return NextResponse.json({ ok: false, error: "unauthorized" }, { status: 401 });
    }
  }

  const newHash = hashParentPin(newPin);

  await prisma.$executeRaw`
    INSERT INTO "SiteConfig" (key, value) VALUES (${PARENT_PIN_CONFIG_KEY}, ${newHash})
    ON CONFLICT(key) DO UPDATE SET value = excluded.value
  `;

  const cookieStore = await cookies();
  cookieStore.set(PARENT_ACCESS_COOKIE, parentAccessToken(newHash), parentAccessCookieOptions);

  return NextResponse.json({ ok: true });
}

export async function DELETE() {
  const existingHash = await getParentPinHash();

  if (!existingHash) {
    return NextResponse.json({ ok: true });
  }

  if (!(await hasParentAccess(existingHash))) {
    return NextResponse.json({ ok: false, error: "unauthorized" }, { status: 401 });
  }

  await prisma.$executeRaw`
    DELETE FROM "SiteConfig" WHERE key = ${PARENT_PIN_CONFIG_KEY}
  `;

  const cookieStore = await cookies();
  cookieStore.delete(PARENT_ACCESS_COOKIE);

  return NextResponse.json({ ok: true });
}
