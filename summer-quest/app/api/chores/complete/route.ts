import { Prisma } from "@prisma/client";
import { NextResponse } from "next/server";

import { choreLevelRewards, type ChoreLevel } from "@/lib/habits";
import { hasStudentAccess } from "@/lib/student-access";
import { prisma } from "@/lib/prisma";

type CompleteBody = {
  assignmentId?: string;
  studentId?: string;
  level?: string;
  description?: string;
};

function isChoreLevel(value: string): value is ChoreLevel {
  return value === "great" || value === "okay" || value === "partial";
}

export async function POST(request: Request) {
  const body = (await request.json()) as CompleteBody;
  const description = body.description?.trim() ?? "";

  if (!body.assignmentId || !body.studentId || !body.level || !isChoreLevel(body.level) || !description) {
    return NextResponse.json({ ok: false, message: "Thiếu thông tin báo cáo việc nhà." }, { status: 400 });
  }

  const assignment = await prisma.choreAssignment.findUnique({
    where: { id: body.assignmentId },
    include: {
      completion: true,
      student: { select: { accessCodeHash: true } },
    },
  });

  if (!assignment || assignment.studentId !== body.studentId) {
    return NextResponse.json({ ok: false, message: "Không tìm thấy việc phù hợp." }, { status: 403 });
  }

  if (!(await hasStudentAccess(assignment.studentId, assignment.student.accessCodeHash))) {
    return NextResponse.json({ ok: false, message: "Cần mở khóa hồ sơ trước khi báo cáo việc nhà." }, { status: 403 });
  }

  if (assignment.completion) {
    return NextResponse.json({ ok: false, message: "Việc này đã được báo cáo rồi." }, { status: 409 });
  }

  const reward = choreLevelRewards[body.level];

  try {
    const completion = await prisma.$transaction(async (tx) => {
      const created = await tx.choreCompletion.create({
        data: {
          assignmentId: assignment.id,
          level: body.level as ChoreLevel,
          description,
        },
      });

      await tx.student.update({
        where: { id: body.studentId },
        data: {
          xp: { increment: reward.xpEarned },
          coins: { increment: reward.coinsEarned },
        },
      });

      return created;
    });

    return NextResponse.json({ ok: true, completion, xpEarned: reward.xpEarned, coinsEarned: reward.coinsEarned });
  } catch (error) {
    if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === "P2002") {
      return NextResponse.json({ ok: false, message: "Việc này đã được báo cáo rồi." }, { status: 409 });
    }

    return NextResponse.json({ ok: false, message: "Chưa lưu được báo cáo. Thử lại sau một chút nhé." }, { status: 500 });
  }
}
