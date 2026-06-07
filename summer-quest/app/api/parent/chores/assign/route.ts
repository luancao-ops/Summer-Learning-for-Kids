import { NextResponse } from "next/server";

import { todayKey, type DaySession } from "@/lib/habits";
import { prisma } from "@/lib/prisma";

type AssignBody = {
  choreId?: string;
  studentId?: string;
  dueDate?: string;
  dueSession?: DaySession;
  assignmentId?: string;
};

type ExistingAssignmentRow = {
  id: string;
  completionId: string | null;
};

function isDateKey(value: string): boolean {
  return /^\d{4}-\d{2}-\d{2}$/.test(value);
}

function isDaySession(value: string): value is DaySession {
  return value === "morning" || value === "afternoon" || value === "evening";
}

async function findConflictingAssignment(body: Required<Pick<AssignBody, "choreId" | "studentId" | "dueDate" | "dueSession">> & { assignmentId?: string }) {
  if (body.assignmentId) {
    return prisma.$queryRaw<ExistingAssignmentRow[]>`
      SELECT id, NULL AS completionId
      FROM "ChoreAssignment"
      WHERE choreId = ${body.choreId}
        AND studentId = ${body.studentId}
        AND COALESCE(dueDate, assignedDate) = ${body.dueDate}
        AND COALESCE(dueSession, 'evening') = ${body.dueSession}
        AND id <> ${body.assignmentId}
      LIMIT 1
    `;
  }

  return prisma.$queryRaw<ExistingAssignmentRow[]>`
    SELECT id, NULL AS completionId
    FROM "ChoreAssignment"
    WHERE choreId = ${body.choreId}
      AND studentId = ${body.studentId}
      AND COALESCE(dueDate, assignedDate) = ${body.dueDate}
      AND COALESCE(dueSession, 'evening') = ${body.dueSession}
    LIMIT 1
  `;
}

export async function POST(request: Request) {
  const body = (await request.json()) as AssignBody;

  if (!body.choreId || !body.studentId || !body.dueDate || !isDateKey(body.dueDate) || !body.dueSession || !isDaySession(body.dueSession)) {
    return NextResponse.json({ ok: false, message: "Thiếu thông tin giao việc." }, { status: 400 });
  }

  const existing = await findConflictingAssignment({
    choreId: body.choreId,
    studentId: body.studentId,
    dueDate: body.dueDate,
    dueSession: body.dueSession,
  });

  if (existing.length > 0) {
    return NextResponse.json({ ok: false, message: "Việc này đã được giao cho khung giờ đã chọn." }, { status: 409 });
  }

  const assignmentId = crypto.randomUUID();

  await prisma.$executeRaw`
    INSERT INTO "ChoreAssignment" (id, choreId, studentId, assignedDate, dueDate, dueSession, createdAt)
    VALUES (${assignmentId}, ${body.choreId}, ${body.studentId}, ${todayKey()}, ${body.dueDate}, ${body.dueSession}, ${new Date()})
  `;

  return NextResponse.json({ ok: true, assignmentId });
}

export async function PATCH(request: Request) {
  const body = (await request.json()) as AssignBody;

  if (!body.assignmentId || !body.choreId || !body.studentId || !body.dueDate || !isDateKey(body.dueDate) || !body.dueSession || !isDaySession(body.dueSession)) {
    return NextResponse.json({ ok: false, message: "Thiếu thông tin cập nhật việc." }, { status: 400 });
  }

  const assignment = await prisma.$queryRaw<ExistingAssignmentRow[]>`
    SELECT ca.id, cc.id AS completionId
    FROM "ChoreAssignment" ca
    LEFT JOIN "ChoreCompletion" cc ON cc.assignmentId = ca.id
    WHERE ca.id = ${body.assignmentId}
    LIMIT 1
  `;

  if (assignment.length === 0) {
    return NextResponse.json({ ok: false, message: "Không tìm thấy việc đã giao." }, { status: 404 });
  }

  if (assignment[0].completionId) {
    return NextResponse.json({ ok: false, message: "Bé đã báo cáo việc này nên không thể sửa." }, { status: 400 });
  }

  const conflict = await findConflictingAssignment({
    assignmentId: body.assignmentId,
    choreId: body.choreId,
    studentId: body.studentId,
    dueDate: body.dueDate,
    dueSession: body.dueSession,
  });

  if (conflict.length > 0) {
    return NextResponse.json({ ok: false, message: "Đã có một việc trùng cho khung giờ này." }, { status: 409 });
  }

  await prisma.$executeRaw`
    UPDATE "ChoreAssignment"
    SET choreId = ${body.choreId},
        studentId = ${body.studentId},
        dueDate = ${body.dueDate},
        dueSession = ${body.dueSession}
    WHERE id = ${body.assignmentId}
  `;

  return NextResponse.json({ ok: true, assignmentId: body.assignmentId });
}

export async function DELETE(request: Request) {
  const body = (await request.json()) as AssignBody;

  if (!body.assignmentId) {
    return NextResponse.json({ ok: false, message: "Thiếu mã việc cần xoá." }, { status: 400 });
  }

  const assignment = await prisma.$queryRaw<ExistingAssignmentRow[]>`
    SELECT ca.id, cc.id AS completionId
    FROM "ChoreAssignment" ca
    LEFT JOIN "ChoreCompletion" cc ON cc.assignmentId = ca.id
    WHERE ca.id = ${body.assignmentId}
    LIMIT 1
  `;

  if (assignment.length === 0) {
    return NextResponse.json({ ok: false, message: "Không tìm thấy việc đã giao." }, { status: 404 });
  }

  if (assignment[0].completionId) {
    return NextResponse.json({ ok: false, message: "Bé đã báo cáo việc này nên không thể xoá." }, { status: 400 });
  }

  await prisma.$executeRaw`DELETE FROM "ChoreAssignment" WHERE id = ${body.assignmentId}`;

  return NextResponse.json({ ok: true });
}
