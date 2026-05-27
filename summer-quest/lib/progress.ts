import type { Attempt, Lesson, Subject } from "@prisma/client";
import { getLessonStatus } from "@/lib/quiz";

export type LessonWithAttempts = Lesson & {
  attempts: Attempt[];
};

export type SubjectProgressInput = Subject & {
  lessons: LessonWithAttempts[];
};

export function latestAttempt(lesson: LessonWithAttempts): Attempt | undefined {
  return [...lesson.attempts].sort((a, b) => b.completedAt.getTime() - a.completedAt.getTime())[0];
}

export function subjectProgress(subject: SubjectProgressInput): {
  completed: number;
  needsReview: number;
  total: number;
  percent: number;
} {
  const total = subject.lessons.length;
  const completed = subject.lessons.filter((lesson) => getLessonStatus(latestAttempt(lesson)?.percentage) === "completed").length;
  const needsReview = subject.lessons.filter((lesson) => getLessonStatus(latestAttempt(lesson)?.percentage) === "needs_review").length;

  return {
    completed,
    needsReview,
    total,
    percent: total === 0 ? 0 : Math.round((completed / total) * 100),
  };
}

export function formatDateKey(date = new Date()): string {
  return new Intl.DateTimeFormat("en-CA", {
    timeZone: "Asia/Ho_Chi_Minh",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).format(date);
}

export function yesterdayKey(date = new Date()): string {
  const yesterday = new Date(date);
  yesterday.setDate(yesterday.getDate() - 1);
  return formatDateKey(yesterday);
}
