import { Prisma } from "@prisma/client";
import { NextResponse } from "next/server";

import { prisma } from "@/lib/prisma";

type AssignBody = {
  choreId?: string;
  studentId?: string;
  date?: string;
  assignmentId?: string;
};

function isDateKey(value: string): boolean {
  return /^\d{4}-\d{2}-\d{2}$/.test(value);
}

export async function POST(request: Request) {
  const body = (await request.json()) as AssignBody;

  if (!body.choreId || !body.studentId || !body.date || !isDateKey(body.date)) {
    return NextResponse.json({ ok: false, message: "Thiếu thông tin giao việc." }, { status: 400 });
  }

  try {
    const assignment = await prisma.choreAssignment.create({
      data: {
        choreId: body.choreId,
        studentId: body.studentId,
        assignedDate: body.date,
      },
      include: { chore: true, completion: true },
    });

    return NextResponse.json({ ok: true, assignment });
  } catch (error) {
    if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === "P2002") {
      return NextResponse.json({ ok: false, message: "Việc này đã được giao cho ngày đã chọn." }, { status: 409 });
    }

    return NextResponse.json({ ok: false, message: "Chưa giao được việc. Thử lại sau một chút nhé." }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  const body = (await request.json()) as AssignBody;

  if (!body.assignmentId) {
    return NextResponse.json({ ok: false, message: "Thiếu mã việc cần xoá." }, { status: 400 });
  }

  const assignment = await prisma.choreAssignment.findUnique({
    where: { id: body.assignmentId },
    include: { completion: true },
  });

  if (!assignment) {
    return NextResponse.json({ ok: false, message: "Không tìm thấy việc đã giao." }, { status: 404 });
  }

  if (assignment.completion) {
    return NextResponse.json({ ok: false, message: "Bé đã báo cáo việc này nên không thể xoá." }, { status: 400 });
  }

  await prisma.choreAssignment.delete({ where: { id: assignment.id } });

  return NextResponse.json({ ok: true });
}
