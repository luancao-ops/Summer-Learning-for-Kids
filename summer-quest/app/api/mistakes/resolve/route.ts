import { NextResponse } from "next/server";

import { hasStudentAccess } from "@/lib/student-access";
import { prisma } from "@/lib/prisma";

type Body = {
  mistakeId?: string;
  studentId?: string;
};

export async function POST(request: Request) {
  const body = (await request.json()) as Body;

  if (!body.mistakeId || !body.studentId) {
    return NextResponse.json({ ok: false }, { status: 400 });
  }

  const mistake = await prisma.mistake.findUnique({
    where: { id: body.mistakeId },
    include: {
      student: { select: { accessCodeHash: true } },
    },
  });

  if (!mistake || mistake.studentId !== body.studentId) {
    return NextResponse.json({ ok: false }, { status: 403 });
  }

  if (!(await hasStudentAccess(mistake.studentId, mistake.student.accessCodeHash))) {
    return NextResponse.json({ ok: false }, { status: 403 });
  }

  await prisma.mistake.update({
    where: { id: body.mistakeId },
    data: { resolved: true },
  });

  return NextResponse.json({ ok: true });
}
