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

  if (body.action === "approve") {
    await prisma.lesson.update({
      where: { id: body.lessonId },
      data: { approved: true },
    });
  }

  if (body.action === "reject") {
    await prisma.lesson.delete({ where: { id: body.lessonId } });
  }

  return NextResponse.json({ ok: true });
}
