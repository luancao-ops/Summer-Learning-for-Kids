import { timingSafeEqual } from "crypto";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";

import {
  PARENT_ACCESS_COOKIE,
  getParentPinHash,
  hashParentPin,
  isValidParentPin,
  parentAccessCookieOptions,
  parentAccessToken,
} from "@/lib/parent-access";

function safeCompare(a: string, b: string): boolean {
  const ab = Buffer.from(a);
  const bb = Buffer.from(b);
  if (ab.length !== bb.length) return false;
  return timingSafeEqual(ab, bb);
}

export async function POST(request: Request) {
  const body = (await request.json()) as { pin?: unknown };
  const pin = typeof body.pin === "string" ? body.pin : "";

  if (!isValidParentPin(pin)) {
    return NextResponse.json({ ok: false, error: "invalid" }, { status: 400 });
  }

  const storedHash = await getParentPinHash();
  if (!storedHash) {
    return NextResponse.json({ ok: false, error: "no_pin" }, { status: 400 });
  }

  if (!safeCompare(hashParentPin(pin), storedHash)) {
    return NextResponse.json({ ok: false, error: "wrong" }, { status: 401 });
  }

  const cookieStore = await cookies();
  cookieStore.set(PARENT_ACCESS_COOKIE, parentAccessToken(storedHash), parentAccessCookieOptions);

  return NextResponse.json({ ok: true });
}
