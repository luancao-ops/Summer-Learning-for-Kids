import { NextResponse } from "next/server";
import { formatDateKey, yesterdayKey } from "@/lib/progress";
import { calculateRewards, scoreQuiz, type AnswerInput, type QuestionType, type QuizOption, type QuizQuestion } from "@/lib/quiz";
import { awardBadges, unlockRewards } from "@/lib/rewards";
import { hasStudentAccess } from "@/lib/student-access";
import { prisma } from "@/lib/prisma";

type SubmitBody = {
  studentId?: string;
  lessonId?: string;
  answers?: AnswerInput[];
};

function parseOptions(options: string): QuizOption[] {
  try {
    return JSON.parse(options) as QuizOption[];
  } catch {
    return [];
  }
}

function displayAnswer(question: QuizQuestion, rawAnswer: string): string {
  if (question.type === "fill_blank") return rawAnswer;
  return question.options.find((option) => option.id === rawAnswer)?.text ?? rawAnswer;
}

export async function POST(request: Request) {
  const body = (await request.json()) as SubmitBody;

  if (!body.studentId || !body.lessonId || !Array.isArray(body.answers)) {
    return NextResponse.json({ message: "Thiếu dữ liệu bài làm." }, { status: 400 });
  }

  const student = await prisma.student.findUnique({ where: { id: body.studentId } });
  const lesson = await prisma.lesson.findUnique({
    where: { id: body.lessonId },
    include: {
      questions: {
        orderBy: { orderIndex: "asc" },
      },
    },
  });

  if (!student || !lesson || lesson.studentTarget !== student.id || !lesson.approved) {
    return NextResponse.json({ message: "Không tìm thấy bài học phù hợp." }, { status: 404 });
  }

  if (!(await hasStudentAccess(student.id, student.accessCodeHash))) {
    return NextResponse.json({ message: "Cần mở khóa hồ sơ trước khi lưu bài làm." }, { status: 403 });
  }

  const questions: QuizQuestion[] = lesson.questions.map((question) => ({
    id: question.id,
    type: question.type as QuestionType,
    text: question.text,
    options: parseOptions(question.options),
    correctAnswer: question.correctAnswer,
    explanation: question.explanation,
    hint: question.hint,
  }));

  const score = scoreQuiz(questions, body.answers);
  const rewards = calculateRewards(score);
  const today = formatDateKey();
  const nextStreak = student.lastActiveDate === today ? student.streak : student.lastActiveDate === yesterdayKey() ? student.streak + 1 : 1;

  await prisma.$transaction(async (tx) => {
    const attempt = await tx.attempt.create({
      data: {
        studentId: student.id,
        lessonId: lesson.id,
        score: score.score,
        totalQuestions: score.totalQuestions,
        percentage: score.percentage,
        xpEarned: rewards.xpEarned,
        coinsEarned: rewards.coinsEarned,
      },
    });

    for (const answer of score.answers) {
      const attemptAnswer = await tx.attemptAnswer.create({
        data: {
          attemptId: attempt.id,
          questionId: answer.questionId,
          selectedAnswer: answer.selectedAnswer,
          isCorrect: answer.isCorrect,
        },
      });

      if (!answer.isCorrect) {
        const question = questions.find((item) => item.id === answer.questionId);
        if (question) {
          await tx.mistake.create({
            data: {
              studentId: student.id,
              lessonId: lesson.id,
              questionId: answer.questionId,
              attemptAnswerId: attemptAnswer.id,
              selectedAnswer: displayAnswer(question, answer.selectedAnswer),
              correctAnswer: displayAnswer(question, answer.correctAnswer),
              explanation: answer.explanation,
            },
          });
        }
      }
    }

    await tx.student.update({
      where: { id: student.id },
      data: {
        xp: { increment: rewards.xpEarned },
        coins: { increment: rewards.coinsEarned },
        streak: nextStreak,
        lastActiveDate: today,
      },
    });
  });

  const badgeXp = await awardBadges(prisma, {
    studentId: student.id,
    subjectId: lesson.subjectId,
    percentage: score.percentage,
    streak: nextStreak,
  });

  if (badgeXp > 0) {
    await prisma.student.update({
      where: { id: student.id },
      data: {
        xp: { increment: badgeXp },
      },
    });
  }

  await unlockRewards(prisma, student.id);

  return NextResponse.json({
    score: score.score,
    totalQuestions: score.totalQuestions,
    percentage: score.percentage,
    xpEarned: rewards.xpEarned + badgeXp,
    coinsEarned: rewards.coinsEarned,
    mistakesSaved: score.answers.filter((answer) => !answer.isCorrect).length,
  });
}
