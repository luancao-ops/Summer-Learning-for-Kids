"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";

export async function resolveReportAction(
  _prevState: unknown,
  formData: FormData,
): Promise<{ ok: boolean }> {
  const reportId = formData.get("reportId") as string;
  if (!reportId) return { ok: false };
  try {
    await prisma.$executeRaw`UPDATE "QuestionReport" SET "resolved" = true WHERE "id" = ${reportId}`;
    revalidatePath("/parent/review");
    return { ok: true };
  } catch {
    return { ok: false };
  }
}

export type ReviewActionState = { ok: boolean; action: "approve" | "reject" | null; error?: string };

export async function approveLessonAction(
  _prevState: ReviewActionState | null,
  formData: FormData,
): Promise<ReviewActionState> {
  const lessonId = formData.get("lessonId") as string;
  if (!lessonId) return { ok: false, action: "approve", error: "Thiếu mã bài học." };

  try {
    await prisma.lesson.update({
      where: { id: lessonId },
      data: { approved: true },
    });
    revalidatePath("/parent/review");
    return { ok: true, action: "approve" };
  } catch {
    return { ok: false, action: "approve", error: "Không thể duyệt bài học. Thử lại sau nhé." };
  }
}

export async function rejectLessonAction(
  _prevState: ReviewActionState | null,
  formData: FormData,
): Promise<ReviewActionState> {
  const lessonId = formData.get("lessonId") as string;
  if (!lessonId) return { ok: false, action: "reject", error: "Thiếu mã bài học." };

  try {
    await prisma.$transaction([
      prisma.mistake.deleteMany({ where: { lessonId } }),
      prisma.attempt.deleteMany({ where: { lessonId } }),
      prisma.lesson.delete({ where: { id: lessonId } }),
    ]);
    revalidatePath("/parent/review");
    return { ok: true, action: "reject" };
  } catch {
    return { ok: false, action: "reject", error: "Không thể ẩn bài học. Thử lại sau nhé." };
  }
}
