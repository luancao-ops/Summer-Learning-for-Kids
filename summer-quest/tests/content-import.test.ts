import { describe, expect, it } from "vitest";
import { normalizeLesson, validateManifest, type LessonImportManifest } from "../lib/content-import";

function buildQuestions(count: number) {
  return Array.from({ length: count }, (_, index) => ({
    type: "multiple_choice" as const,
    text: `Question ${index + 1}`,
    options: ["A", "B", "C", "D"],
    correctIndex: 0,
    explanation: `Explanation ${index + 1}`,
  }));
}

describe("content import validation", () => {
  it("requires at least 20 questions per lesson by default", () => {
    const manifest: LessonImportManifest = {
      version: 1,
      batchId: "test-batch",
      lessons: [
        {
          id: "girl-expansion-math-001",
          studentTarget: "girl",
          grade: 4,
          phase: "review",
          subjectId: "math",
          title: "Decimals review",
          learningObjective: "Review decimal basics.",
          shortExplanation: "Practice decimals in simple contexts.",
          content: "Lesson content",
          storyContext: "Story context",
          checks: buildQuestions(19),
        },
      ],
    };

    const issues = validateManifest(manifest);
    expect(issues.some((issue) => issue.message.includes("at least 20 questions"))).toBe(true);
  });

  it("fills defaults for reward type and approval", () => {
    const manifest: LessonImportManifest = {
      version: 1,
      batchId: "test-batch",
      defaults: {
        approved: false,
        rewardType: "craft_material",
      },
      lessons: [
        {
          id: "girl-expansion-english-001",
          studentTarget: "girl",
          grade: 4,
          phase: "review",
          subjectId: "english",
          title: "Flyers vocabulary",
          learningObjective: "Practice Flyers vocabulary.",
          shortExplanation: "Short explanation",
          content: "Lesson content",
          storyContext: "Story context",
          checks: buildQuestions(20),
        },
      ],
    };

    const normalized = normalizeLesson(manifest, manifest.lessons[0]);
    expect(normalized.rewardType).toBe("craft_material");
    expect(normalized.approved).toBe(false);
  });

  it("requires exam level metadata for exam mocks", () => {
    const manifest: LessonImportManifest = {
      version: 1,
      batchId: "test-batch",
      lessons: [
        {
          id: "boy-expansion-movers-mock-01",
          studentTarget: "boy",
          grade: 3,
          phase: "prep",
          subjectId: "english",
          title: "Mover mock",
          learningObjective: "Take a full mock test.",
          shortExplanation: "Short explanation",
          content: "Lesson content",
          storyContext: "Story context",
          metadata: {
            contentTrack: "exam_mock",
          },
          checks: buildQuestions(20),
        },
      ],
    };

    const issues = validateManifest(manifest);
    expect(issues.some((issue) => issue.message.includes("examLevel"))).toBe(true);
  });
});
