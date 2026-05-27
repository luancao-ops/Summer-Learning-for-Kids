export type QuestionType = "multiple_choice" | "true_false" | "fill_blank";

export type QuizOption = {
  id: string;
  text: string;
};

export type QuizQuestion = {
  id: string;
  type: QuestionType;
  text: string;
  options: QuizOption[];
  correctAnswer: string;
  explanation: string;
  hint?: string | null;
};

export type AnswerInput = {
  questionId: string;
  selectedAnswer: string;
};

export type ScoredAnswer = AnswerInput & {
  correctAnswer: string;
  explanation: string;
  isCorrect: boolean;
};

export type QuizScore = {
  score: number;
  totalQuestions: number;
  percentage: number;
  completed: boolean;
  needsReview: boolean;
  answers: ScoredAnswer[];
};

export function normalizeAnswer(value: string): string {
  return value.trim().toLocaleLowerCase("vi-VN").replace(/\s+/g, " ");
}

export function isAnswerCorrect(question: QuizQuestion, selectedAnswer: string): boolean {
  if (question.type === "fill_blank") {
    return normalizeAnswer(selectedAnswer) === normalizeAnswer(question.correctAnswer);
  }

  return selectedAnswer === question.correctAnswer;
}

export function scoreQuiz(questions: QuizQuestion[], answers: AnswerInput[]): QuizScore {
  const answersByQuestion = new Map(answers.map((answer) => [answer.questionId, answer.selectedAnswer]));

  const scoredAnswers = questions.map((question) => {
    const selectedAnswer = answersByQuestion.get(question.id) ?? "";

    return {
      questionId: question.id,
      selectedAnswer,
      correctAnswer: question.correctAnswer,
      explanation: question.explanation,
      isCorrect: isAnswerCorrect(question, selectedAnswer),
    };
  });

  const score = scoredAnswers.filter((answer) => answer.isCorrect).length;
  const totalQuestions = questions.length;
  const percentage = totalQuestions === 0 ? 0 : Math.round((score / totalQuestions) * 100);

  return {
    score,
    totalQuestions,
    percentage,
    completed: percentage >= 70,
    needsReview: percentage < 70,
    answers: scoredAnswers,
  };
}

export function calculateRewards(score: QuizScore): { xpEarned: number; coinsEarned: number } {
  const completionXp = 20;
  const perCorrectXp = score.score * 5;
  const highScoreXp = score.percentage >= 80 ? 15 : 0;
  const completionCoins = 10;
  const highScoreCoins = score.percentage >= 80 ? 5 : 0;

  return {
    xpEarned: completionXp + perCorrectXp + highScoreXp,
    coinsEarned: completionCoins + highScoreCoins,
  };
}

export function getLevel(xp: number): { level: number; currentLevelXp: number; nextLevelXp: number; percent: number } {
  const level = Math.floor(xp / 100) + 1;
  const currentLevelXp = xp % 100;
  const nextLevelXp = 100;

  return {
    level,
    currentLevelXp,
    nextLevelXp,
    percent: currentLevelXp,
  };
}

export type LessonStatus = "not_started" | "in_progress" | "completed" | "needs_review";

export function getLessonStatus(latestPercentage?: number | null): LessonStatus {
  if (latestPercentage === null || latestPercentage === undefined) {
    return "not_started";
  }

  if (latestPercentage >= 70) {
    return "completed";
  }

  return "needs_review";
}
