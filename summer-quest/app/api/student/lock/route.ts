import { NextResponse } from "next/server";

import { studentAccessCookieName } from "@/lib/student-access";

type LockBody = {
  studentId?: string;
};

export async function POST(request: Request) {
  const body = (await request.json()) as LockBody;

  if (!body.studentId) {
    return NextResponse.json({ ok: false }, { status: 400 });
  }

  const response = NextResponse.json({ ok: true });
  response.cookies.delete(studentAccessCookieName(body.studentId));
  return response;
}
