import { describe, expect, it } from "vitest";
import { calculateRewards, scoreQuiz, type QuizQuestion } from "../lib/quiz";

const questions: QuizQuestion[] = [
  {
    id: "q1",
    type: "multiple_choice",
    text: "2 + 2 = ?",
    options: [
      { id: "A", text: "3" },
      { id: "B", text: "4" },
      { id: "C", text: "5" },
      { id: "D", text: "6" },
    ],
    correctAnswer: "B",
    explanation: "2 + 2 = 4.",
  },
  {
    id: "q2",
    type: "true_false",
    text: "5 x 3 = 15.",
    options: [
      { id: "true", text: "Đúng" },
      { id: "false", text: "Chưa đúng" },
    ],
    correctAnswer: "true",
    explanation: "5 nhóm 3 là 15.",
  },
  {
    id: "q3",
    type: "fill_blank",
    text: "Điền: red = ___",
    options: [],
    correctAnswer: "đỏ",
    explanation: "Red là màu đỏ.",
  },
];

describe("quiz scoring", () => {
  it("scores mixed question types and marks completion at 70 percent", () => {
    const result = scoreQuiz(questions, [
      { questionId: "q1", selectedAnswer: "B" },
      { questionId: "q2", selectedAnswer: "true" },
      { questionId: "q3", selectedAnswer: "xanh" },
    ]);

    expect(result.score).toBe(2);
    expect(result.totalQuestions).toBe(3);
    expect(result.percentage).toBe(67);
    expect(result.completed).toBe(false);
    expect(result.needsReview).toBe(true);
  });

  it("normalizes fill blank answers", () => {
    const result = scoreQuiz([questions[2]], [{ questionId: "q3", selectedAnswer: "  ĐỎ  " }]);

    expect(result.score).toBe(1);
    expect(result.percentage).toBe(100);
    expect(result.completed).toBe(true);
  });

  it("awards completion and high-score bonuses", () => {
    const result = scoreQuiz(questions, [
      { questionId: "q1", selectedAnswer: "B" },
      { questionId: "q2", selectedAnswer: "true" },
      { questionId: "q3", selectedAnswer: "đỏ" },
    ]);

    expect(calculateRewards(result)).toEqual({ xpEarned: 50, coinsEarned: 15 });
  });
});
