import { readFile, readdir } from "fs/promises";
import path from "path";
import { PrismaClient } from "@prisma/client";
import {
  normalizeLesson,
  toQuestionRecordData,
  validateManifest,
  type LessonImportManifest,
  type SubjectId,
  type StudentTarget,
} from "@/lib/content-import";

const prisma = new PrismaClient();

type OrderKey = `${StudentTarget}:${SubjectId}`;

function resolveOrderKey(studentTarget: StudentTarget, subjectId: SubjectId): OrderKey {
  return `${studentTarget}:${subjectId}`;
}

async function readManifest(filePath: string): Promise<LessonImportManifest> {
  const raw = await readFile(filePath, "utf8");
  return JSON.parse(raw) as LessonImportManifest;
}

async function resolveInputFiles(args: string[]): Promise<string[]> {
  if (args.length > 0) {
    return args.map((entry) => path.resolve(process.cwd(), entry));
  }

  const defaultDir = path.resolve(process.cwd(), "content", "manifests");
  const entries = await readdir(defaultDir, { withFileTypes: true });
  return entries
    .filter((entry) => entry.isFile() && entry.name.endsWith(".json"))
    .map((entry) => path.join(defaultDir, entry.name))
    .sort();
}

async function buildOrderMap(): Promise<Map<OrderKey, number>> {
  const lessons = await prisma.lesson.findMany({
    select: {
      studentTarget: true,
      subjectId: true,
      orderIndex: true,
    },
  });

  const orderMap = new Map<OrderKey, number>();
  for (const lesson of lessons) {
    const key = resolveOrderKey(lesson.studentTarget as StudentTarget, lesson.subjectId as SubjectId);
    orderMap.set(key, Math.max(orderMap.get(key) ?? 0, lesson.orderIndex));
  }

  return orderMap;
}

async function importManifest(filePath: string, orderMap: Map<OrderKey, number>) {
  const manifest = await readManifest(filePath);
  const issues = validateManifest(manifest);

  if (issues.length > 0) {
    throw new Error(
      `Manifest validation failed for ${path.basename(filePath)}:\n${issues
        .map((issue) => `- ${issue.lessonId ? `[${issue.lessonId}] ` : ""}${issue.message}`)
        .join("\n")}`,
    );
  }

  const existingIds = new Set(
    (
      await prisma.lesson.findMany({
        where: {
          id: {
            in: manifest.lessons.map((lesson) => lesson.id),
          },
        },
        select: { id: true },
      })
    ).map((lesson) => lesson.id),
  );

  let createdCount = 0;
  let skippedCount = 0;

  for (const lesson of manifest.lessons) {
    const normalized = normalizeLesson(manifest, lesson);
    if (existingIds.has(normalized.id)) {
      skippedCount += 1;
      console.log(`skip ${normalized.id} (already exists)`);
      continue;
    }

    const orderKey = resolveOrderKey(normalized.studentTarget, normalized.subjectId);
    const nextOrderIndex = normalized.orderIndex ?? (orderMap.get(orderKey) ?? 0) + 1;
    orderMap.set(orderKey, nextOrderIndex);

    const coins = manifest.defaults?.coins ?? 10;
    const bonusCoins = manifest.defaults?.bonusCoins ?? 5;

    await prisma.$transaction(async (tx) => {
      await tx.lesson.create({
        data: {
          id: normalized.id,
          subjectId: normalized.subjectId,
          studentTarget: normalized.studentTarget,
          grade: normalized.grade,
          phase: normalized.phase,
          orderIndex: nextOrderIndex,
          title: normalized.title,
          learningObjective: normalized.learningObjective,
          shortExplanation: normalized.shortExplanation,
          content: normalized.content,
          storyContext: normalized.storyContext,
          approved: normalized.approved,
          rewardConfig: JSON.stringify({
            type: normalized.rewardType,
            coins,
            bonusCoins,
            contentMeta: normalized.metadata ?? null,
          }),
          questions: {
            createMany: {
              data: normalized.checks.map((check, index) => {
                const question = toQuestionRecordData(check, normalized.id, index);
                return {
                  id: question.id,
                  orderIndex: question.orderIndex,
                  type: question.type,
                  text: question.text,
                  options: question.options,
                  correctAnswer: question.correctAnswer,
                  explanation: question.explanation,
                  hint: question.hint,
                };
              }),
            },
          },
        },
      });
    });

    createdCount += 1;
    console.log(`create ${normalized.id} (orderIndex ${nextOrderIndex})`);
  }

  console.log(
    `batch ${manifest.batchId}: created ${createdCount} lesson(s), skipped ${skippedCount} existing lesson(s) from ${path.basename(filePath)}`,
  );
}

async function main() {
  const files = await resolveInputFiles(process.argv.slice(2));
  if (files.length === 0) {
    console.log("No manifest files found.");
    return;
  }

  const orderMap = await buildOrderMap();
  for (const filePath of files) {
    await importManifest(filePath, orderMap);
  }
}

main()
  .catch((error: unknown) => {
    console.error(error instanceof Error ? error.message : error);
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
