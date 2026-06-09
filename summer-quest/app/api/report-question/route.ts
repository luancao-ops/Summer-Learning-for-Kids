import { prisma } from "@/lib/prisma";
import { randomUUID } from "crypto";

export async function POST(request: Request) {
  let body: {
    questionId?: string;
    lessonId?: string;
    studentId?: string;
    reportedBy?: string;
    reason?: string;
    note?: string;
  };

  try {
    body = await request.json();
  } catch {
    return Response.json({ ok: false, error: "Invalid JSON" }, { status: 400 });
  }

  const { questionId, lessonId, studentId, reportedBy, reason, note = "" } = body;

  if (!questionId || !lessonId || !reportedBy || !reason) {
    return Response.json({ ok: false, error: "Missing required fields" }, { status: 400 });
  }

  const id = randomUUID();

  await prisma.$executeRaw`
    INSERT INTO "QuestionReport" ("id", "questionId", "lessonId", "studentId", "reportedBy", "reason", "note", "resolved", "createdAt")
    VALUES (${id}, ${questionId}, ${lessonId}, ${studentId ?? null}, ${reportedBy}, ${reason}, ${note}, false, datetime('now'))
  `;

  return Response.json({ ok: true });
}
