import { NextResponse } from "next/server";

import {
  hashStudentAccessCode,
  isValidStudentAccessCode,
  studentAccessCookieName,
  studentAccessCookieOptions,
  studentAccessToken,
} from "@/lib/student-access";
import { prisma } from "@/lib/prisma";

type UnlockBody = {
  studentId?: string;
  accessCode?: string;
};

export async function POST(request: Request) {
  const body = (await request.json()) as UnlockBody;

  if (!body.studentId || !body.accessCode || !isValidStudentAccessCode(body.accessCode)) {
    return NextResponse.json({ ok: false }, { status: 400 });
  }

  const student = await prisma.student.findUnique({
    where: { id: body.studentId },
    select: { id: true, accessCodeHash: true },
  });

  if (!student) {
    return NextResponse.json({ ok: false }, { status: 404 });
  }

  if (!student.accessCodeHash) {
    return NextResponse.json({ ok: true });
  }

  if (hashStudentAccessCode(body.accessCode) !== student.accessCodeHash) {
    return NextResponse.json({ ok: false }, { status: 401 });
  }

  const response = NextResponse.json({ ok: true });
  response.cookies.set(
    studentAccessCookieName(student.id),
    studentAccessToken(student.id, student.accessCodeHash),
    studentAccessCookieOptions,
  );
  return response;
}
