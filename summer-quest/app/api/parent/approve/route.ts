import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

type ApproveBody = {
  lessonId?: string;
  action?: "approve" | "reject";
};

export async function POST(request: Request) {
  const body = (await request.json()) as ApproveBody;

  if (!body.lessonId || (body.action !== "approve" && body.action !== "reject")) {
    return NextResponse.json({ ok: false, message: "Thiếu thông tin duyệt nội dung." }, { status: 400 });
  }

  try {
    if (body.action === "approve") {
      await prisma.lesson.update({
        where: { id: body.lessonId },
        data: { approved: true },
      });
    }

    if (body.action === "reject") {
      await prisma.$transaction([
        prisma.mistake.deleteMany({ where: { lessonId: body.lessonId } }),
        prisma.attempt.deleteMany({ where: { lessonId: body.lessonId } }),
        prisma.lesson.delete({ where: { id: body.lessonId } }),
      ]);
    }
  } catch {
    return NextResponse.json({ ok: false, message: "Lưu thao tác thất bại." }, { status: 500 });
  }

  return NextResponse.json({ ok: true });
}
