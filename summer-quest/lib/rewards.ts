import type { PrismaClient } from "@prisma/client";

type AwardContext = {
  studentId: string;
  subjectId: string;
  percentage: number;
  streak: number;
};

export async function awardBadges(prisma: PrismaClient, context: AwardContext): Promise<number> {
  const completedLessons = await prisma.attempt.groupBy({
    by: ["lessonId"],
    where: {
      studentId: context.studentId,
      percentage: { gte: 70 },
    },
  });

  const completedInSubject = await prisma.attempt.groupBy({
    by: ["lessonId"],
    where: {
      studentId: context.studentId,
      percentage: { gte: 70 },
      lesson: {
        subjectId: context.subjectId,
      },
    },
  });

  const badgeIds = new Set<string>();
  if (completedLessons.length >= 1) badgeIds.add("first_lesson");
  if (context.streak >= 3) badgeIds.add("streak_3");
  if (context.percentage >= 80) badgeIds.add("high_score");
  if (completedInSubject.length >= 5) badgeIds.add(`subject_${context.subjectId}_5`);

  let xpReward = 0;
  for (const badgeId of badgeIds) {
    const badge = await prisma.badge.findUnique({ where: { id: badgeId } });
    if (!badge) continue;

    const created = await prisma.studentBadge
      .create({
        data: {
          studentId: context.studentId,
          badgeId,
        },
      })
      .catch(() => null);

    if (created) {
      xpReward += badge.xpReward;
    }
  }

  return xpReward;
}

export async function unlockRewards(prisma: PrismaClient, studentId: string): Promise<void> {
  const student = await prisma.student.findUnique({ where: { id: studentId } });
  if (!student) return;

  const completedLessons = await prisma.attempt.groupBy({
    by: ["lessonId"],
    where: {
      studentId,
      percentage: { gte: 70 },
    },
  });

  const rewards = await prisma.reward.findMany({
    where: { themeId: student.themeId },
  });

  for (const reward of rewards) {
    const condition = JSON.parse(reward.unlockCondition) as { completedLessons: number };
    if (completedLessons.length >= condition.completedLessons) {
      await prisma.studentReward
        .create({
          data: {
            studentId,
            rewardId: reward.id,
          },
        })
        .catch(() => null);
    }
  }
}
