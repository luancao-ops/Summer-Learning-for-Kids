-- CreateTable
CREATE TABLE "QuestionReport" (
    "id"         TEXT NOT NULL PRIMARY KEY,
    "questionId" TEXT NOT NULL,
    "lessonId"   TEXT NOT NULL,
    "studentId"  TEXT,
    "reportedBy" TEXT NOT NULL,
    "reason"     TEXT NOT NULL,
    "note"       TEXT NOT NULL DEFAULT '',
    "resolved"   BOOLEAN NOT NULL DEFAULT false,
    "createdAt"  DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "QuestionReport_questionId_fkey" FOREIGN KEY ("questionId") REFERENCES "Question" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "QuestionReport_lessonId_fkey"   FOREIGN KEY ("lessonId")   REFERENCES "Lesson"   ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "QuestionReport_studentId_fkey"  FOREIGN KEY ("studentId")  REFERENCES "Student"  ("id") ON DELETE SET NULL ON UPDATE CASCADE
);

-- CreateIndex
CREATE INDEX "QuestionReport_resolved_createdAt_idx" ON "QuestionReport"("resolved", "createdAt");

-- CreateIndex
CREATE INDEX "QuestionReport_questionId_idx" ON "QuestionReport"("questionId");
