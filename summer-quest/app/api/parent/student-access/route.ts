import { NextResponse } from "next/server";

import { hashStudentAccessCode, isValidStudentAccessCode } from "@/lib/student-access";
import { prisma } from "@/lib/prisma";

type StudentAccessBody = {
  studentId?: string;
  action?: "set" | "clear";
  accessCode?: string;
};

export async function POST(request: Request) {
  const body = (await request.json()) as StudentAccessBody;

  if (!body.studentId || (body.action !== "set" && body.action !== "clear")) {
    return NextResponse.json({ ok: false }, { status: 400 });
  }

  const student = await prisma.student.findUnique({
    where: { id: body.studentId },
    select: { id: true },
  });

  if (!student) {
    return NextResponse.json({ ok: false }, { status: 404 });
  }

  if (body.action === "clear") {
    await prisma.student.update({
      where: { id: student.id },
      data: { accessCodeHash: null, accessCodeUpdatedAt: null },
    });
    return NextResponse.json({ ok: true });
  }

  if (!body.accessCode || !isValidStudentAccessCode(body.accessCode)) {
    return NextResponse.json({ ok: false }, { status: 400 });
  }

  await prisma.student.update({
    where: { id: student.id },
    data: {
      accessCodeHash: hashStudentAccessCode(body.accessCode),
      accessCodeUpdatedAt: new Date(),
    },
  });

  return NextResponse.json({ ok: true });
}
