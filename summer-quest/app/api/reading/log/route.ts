import { Prisma } from "@prisma/client";
import { NextResponse } from "next/server";

import { previousDateKey, todayKey } from "@/lib/habits";
import { hasStudentAccess } from "@/lib/student-access";
import { prisma } from "@/lib/prisma";

type ReadingBody = {
  entryId?: string;
  studentId?: string;
  bookTitle?: string;
  pagesRead?: number | string | null;
  summary?: string;
  feelings?: string;
};

function cleanReadingBody(body: ReadingBody) {
  return {
    bookTitle: body.bookTitle?.trim() ?? "",
    pagesRead: Math.max(0, Number(body.pagesRead || 0) || 0),
    summary: body.summary?.trim() ?? "",
    feelings: body.feelings?.trim() ?? "",
  };
}

export async function POST(request: Request) {
  const body = (await request.json()) as ReadingBody;
  const data = cleanReadingBody(body);
  const readDate = todayKey();

  if (!body.studentId || !data.bookTitle || !data.summary || !data.feelings) {
    return NextResponse.json({ ok: false, message: "Con điền tên sách, tóm tắt và cảm nhận nhé." }, { status: 400 });
  }

  const student = await prisma.student.findUnique({
    where: { id: body.studentId },
    select: { id: true, accessCodeHash: true },
  });

  if (!student || !(await hasStudentAccess(student.id, student.accessCodeHash))) {
    return NextResponse.json({ ok: false, message: "Cần mở khóa hồ sơ trước khi lưu nhật ký." }, { status: 403 });
  }

  const existingEntry = await prisma.readingEntry.findUnique({
    where: { studentId_readDate: { studentId: body.studentId, readDate } },
  });

  if (existingEntry) {
    return NextResponse.json({ ok: false, message: "Hôm nay con đã lưu nhật ký đọc sách rồi. Con có thể chỉnh sửa nhé." }, { status: 409 });
  }

  const yesterdayEntry = await prisma.readingEntry.findFirst({
    where: { studentId: body.studentId, readDate: previousDateKey(readDate) },
  });

  try {
    const result = await prisma.$transaction(async (tx) => {
      const entry = await tx.readingEntry.create({
        data: {
          studentId: body.studentId!,
          readDate,
          ...data,
        },
      });

      const student = await tx.student.update({
        where: { id: body.studentId },
        data: {
          xp: { increment: 15 },
          coins: { increment: 8 },
          readingStreak: yesterdayEntry ? { increment: 1 } : 1,
        },
        select: { readingStreak: true },
      });

      return { entry, readingStreak: student.readingStreak };
    });

    return NextResponse.json({ ok: true, entry: result.entry, xpEarned: 15, coinsEarned: 8, readingStreak: result.readingStreak });
  } catch (error) {
    if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === "P2002") {
      return NextResponse.json({ ok: false, message: "Hôm nay con đã lưu nhật ký đọc sách rồi. Con có thể chỉnh sửa nhé." }, { status: 409 });
    }

    return NextResponse.json({ ok: false, message: "Chưa lưu được nhật ký. Thử lại sau một chút nhé." }, { status: 500 });
  }
}

export async function PUT(request: Request) {
  const body = (await request.json()) as ReadingBody;
  const data = cleanReadingBody(body);

  if (!body.entryId || !body.studentId || !data.bookTitle || !data.summary || !data.feelings) {
    return NextResponse.json({ ok: false, message: "Thiếu thông tin cập nhật nhật ký." }, { status: 400 });
  }

  const entry = await prisma.readingEntry.findUnique({ where: { id: body.entryId } });

  if (!entry || entry.studentId !== body.studentId) {
    return NextResponse.json({ ok: false, message: "Không tìm thấy nhật ký phù hợp." }, { status: 403 });
  }

  const student = await prisma.student.findUnique({
    where: { id: entry.studentId },
    select: { id: true, accessCodeHash: true },
  });

  if (!student || !(await hasStudentAccess(student.id, student.accessCodeHash))) {
    return NextResponse.json({ ok: false, message: "Cần mở khóa hồ sơ trước khi sửa nhật ký." }, { status: 403 });
  }

  const updatedEntry = await prisma.readingEntry.update({
    where: { id: entry.id },
    data,
  });

  return NextResponse.json({ ok: true, entry: updatedEntry });
}
