import { NextResponse } from "next/server";

import { prisma } from "@/lib/prisma";

type ResetDataBody = {
  confirmation?: string;
  resetAccessCodes?: boolean;
};

type ResetDataCounts = {
  attempts: number;
  mistakes: number;
  choreAssignments: number;
  readingEntries: number;
  studentBadges: number;
  studentRewards: number;
};

async function getResetCounts(): Promise<ResetDataCounts> {
  const [attempts, mistakes, choreAssignments, readingEntries, studentBadges, studentRewards] = await Promise.all([
    prisma.attempt.count(),
    prisma.mistake.count(),
    prisma.choreAssignment.count(),
    prisma.readingEntry.count(),
    prisma.studentBadge.count(),
    prisma.studentReward.count(),
  ]);

  return {
    attempts,
    mistakes,
    choreAssignments,
    readingEntries,
    studentBadges,
    studentRewards,
  };
}

export async function POST(request: Request) {
  const body = (await request.json()) as ResetDataBody;

  if (body.confirmation?.trim().toUpperCase() !== "RESET") {
    return NextResponse.json({ ok: false, message: "Cần gõ RESET để xác nhận." }, { status: 400 });
  }

  const deleted = await getResetCounts();

  await prisma.$transaction(async (tx) => {
    await tx.mistake.deleteMany();
    await tx.attemptAnswer.deleteMany();
    await tx.attempt.deleteMany();
    await tx.studentBadge.deleteMany();
    await tx.studentReward.deleteMany();
    await tx.choreCompletion.deleteMany();
    await tx.choreAssignment.deleteMany();
    await tx.readingEntry.deleteMany();

    await tx.student.updateMany({
      data: {
        xp: 0,
        coins: 0,
        streak: 0,
        readingStreak: 0,
        lastActiveDate: null,
        ...(body.resetAccessCodes
          ? {
              accessCodeHash: null,
              accessCodeUpdatedAt: null,
            }
          : {}),
      },
    });
  });

  return NextResponse.json({
    ok: true,
    deleted,
    resetAccessCodes: Boolean(body.resetAccessCodes),
  });
}
