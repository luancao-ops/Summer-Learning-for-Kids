import type { QuestionType } from "@/lib/quiz";

export type ContentTrack = "core" | "exam_mock";
export type ExamLevel = "movers" | "flyers";
export type StudentTarget = "girl" | "boy";
export type LessonPhase = "review" | "prep";
export type SubjectId = "math" | "vietnamese" | "english" | "science_life_skills";

export type MultipleChoiceCheck = {
  type: "multiple_choice";
  text: string;
  options: string[];
  correctIndex: number;
  explanation: string;
  hint?: string;
};

export type TrueFalseCheck = {
  type: "true_false";
  text: string;
  correct: boolean;
  explanation: string;
  hint?: string;
};

export type FillBlankCheck = {
  type: "fill_blank";
  text: string;
  answer: string;
  explanation: string;
  hint?: string;
};

export type LessonCheck = MultipleChoiceCheck | TrueFalseCheck | FillBlankCheck;

export type LessonMetadata = {
  contentTrack?: ContentTrack;
  examLevel?: ExamLevel;
  examMockNumber?: number;
  estimatedDurationMinutes?: number;
  skillsCovered?: string[];
};

export type LessonManifest = {
  id: string;
  studentTarget: StudentTarget;
  grade: number;
  phase: LessonPhase;
  subjectId: SubjectId;
  orderIndex?: number;
  title: string;
  learningObjective: string;
  shortExplanation: string;
  content: string;
  storyContext: string;
  rewardType?: string;
  approved?: boolean;
  metadata?: LessonMetadata;
  checks: LessonCheck[];
};

export type ImportDefaults = {
  approved?: boolean;
  rewardType?: string;
  coins?: number;
  bonusCoins?: number;
  minimumQuestions?: number;
};

export type LessonImportManifest = {
  version: 1;
  batchId: string;
  description?: string;
  defaults?: ImportDefaults;
  lessons: LessonManifest[];
};

export type NormalizedLessonManifest = Omit<LessonManifest, "rewardType" | "approved"> & {
  rewardType: string;
  approved: boolean;
};

export type ValidationIssue = {
  lessonId?: string;
  message: string;
};

const DEFAULT_MINIMUM_QUESTIONS = 20;

function isQuestionType(value: string): value is QuestionType {
  return value === "multiple_choice" || value === "true_false" || value === "fill_blank";
}

export function getMinimumQuestions(manifest: LessonImportManifest): number {
  return manifest.defaults?.minimumQuestions ?? DEFAULT_MINIMUM_QUESTIONS;
}

export function normalizeLesson(manifest: LessonImportManifest, lesson: LessonManifest): NormalizedLessonManifest {
  return {
    ...lesson,
    rewardType: lesson.rewardType ?? manifest.defaults?.rewardType ?? "content_pack",
    approved: lesson.approved ?? manifest.defaults?.approved ?? false,
  };
}

export function validateManifest(manifest: LessonImportManifest): ValidationIssue[] {
  const issues: ValidationIssue[] = [];
  const minimumQuestions = getMinimumQuestions(manifest);
  const lessonIds = new Set<string>();

  if (manifest.version !== 1) {
    issues.push({ message: `Unsupported manifest version: ${manifest.version}` });
  }

  if (!manifest.batchId.trim()) {
    issues.push({ message: "batchId must not be empty." });
  }

  for (const lesson of manifest.lessons) {
    const normalized = normalizeLesson(manifest, lesson);

    if (lessonIds.has(normalized.id)) {
      issues.push({ lessonId: normalized.id, message: "Duplicate lesson id in manifest." });
    } else {
      lessonIds.add(normalized.id);
    }

    if (!normalized.title.trim()) {
      issues.push({ lessonId: normalized.id, message: "Lesson title must not be empty." });
    }

    if (!normalized.learningObjective.trim()) {
      issues.push({ lessonId: normalized.id, message: "Lesson learningObjective must not be empty." });
    }

    if (!normalized.shortExplanation.trim()) {
      issues.push({ lessonId: normalized.id, message: "Lesson shortExplanation must not be empty." });
    }

    if (!normalized.content.trim()) {
      issues.push({ lessonId: normalized.id, message: "Lesson content must not be empty." });
    }

    if (!normalized.storyContext.trim()) {
      issues.push({ lessonId: normalized.id, message: "Lesson storyContext must not be empty." });
    }

    if (normalized.checks.length < minimumQuestions) {
      issues.push({
        lessonId: normalized.id,
        message: `Lesson must contain at least ${minimumQuestions} questions. Found ${normalized.checks.length}.`,
      });
    }

    if (normalized.metadata?.contentTrack === "exam_mock" && !normalized.metadata.examLevel) {
      issues.push({
        lessonId: normalized.id,
        message: "Exam mock lessons must define metadata.examLevel.",
      });
    }

    if (normalized.metadata?.examMockNumber !== undefined && normalized.metadata.examMockNumber < 1) {
      issues.push({
        lessonId: normalized.id,
        message: "metadata.examMockNumber must be at least 1.",
      });
    }

    normalized.checks.forEach((check, index) => {
      const questionLabel = `${normalized.id}#${index + 1}`;
      if (!isQuestionType(check.type)) {
        issues.push({ lessonId: normalized.id, message: `Question ${questionLabel} has invalid type.` });
        return;
      }

      if (!check.text.trim()) {
        issues.push({ lessonId: normalized.id, message: `Question ${questionLabel} text must not be empty.` });
      }

      if (!check.explanation.trim()) {
        issues.push({ lessonId: normalized.id, message: `Question ${questionLabel} explanation must not be empty.` });
      }

      if (check.type === "multiple_choice") {
        if (check.options.length !== 4) {
          issues.push({
            lessonId: normalized.id,
            message: `Question ${questionLabel} must have exactly 4 options.`,
          });
        }

        if (check.correctIndex < 0 || check.correctIndex >= check.options.length) {
          issues.push({
            lessonId: normalized.id,
            message: `Question ${questionLabel} has invalid correctIndex.`,
          });
        }
      }

      if (check.type === "fill_blank" && !check.answer.trim()) {
        issues.push({
          lessonId: normalized.id,
          message: `Question ${questionLabel} answer must not be empty.`,
        });
      }
    });
  }

  return issues;
}

export function toQuestionRecordData(check: LessonCheck, lessonId: string, index: number) {
  if (check.type === "multiple_choice") {
    const optionIds = ["A", "B", "C", "D"];
    return {
      id: `${lessonId}-q${index + 1}`,
      lessonId,
      orderIndex: index + 1,
      type: check.type,
      text: check.text,
      options: JSON.stringify(check.options.map((text, optionIndex) => ({ id: optionIds[optionIndex], text }))),
      correctAnswer: optionIds[check.correctIndex],
      explanation: check.explanation,
      hint: check.hint,
    };
  }

  if (check.type === "true_false") {
    return {
      id: `${lessonId}-q${index + 1}`,
      lessonId,
      orderIndex: index + 1,
      type: check.type,
      text: check.text,
      options: JSON.stringify([
        { id: "true", text: "Đúng" },
        { id: "false", text: "Chưa đúng" },
      ]),
      correctAnswer: check.correct ? "true" : "false",
      explanation: check.explanation,
      hint: check.hint,
    };
  }

  return {
    id: `${lessonId}-q${index + 1}`,
    lessonId,
    orderIndex: index + 1,
    type: check.type,
    text: check.text,
    options: JSON.stringify([]),
    correctAnswer: check.answer,
    explanation: check.explanation,
    hint: check.hint,
  };
}
