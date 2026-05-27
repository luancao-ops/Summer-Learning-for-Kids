-- CreateTable
CREATE TABLE "ChoreTemplate" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "icon" TEXT NOT NULL DEFAULT '🧹',
    "description" TEXT NOT NULL DEFAULT ''
);

-- CreateTable
CREATE TABLE "ChoreAssignment" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "choreId" TEXT NOT NULL,
    "studentId" TEXT NOT NULL,
    "assignedDate" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "ChoreAssignment_choreId_fkey" FOREIGN KEY ("choreId") REFERENCES "ChoreTemplate" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "ChoreAssignment_studentId_fkey" FOREIGN KEY ("studentId") REFERENCES "Student" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "ChoreCompletion" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "assignmentId" TEXT NOT NULL,
    "level" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "completedAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "ChoreCompletion_assignmentId_fkey" FOREIGN KEY ("assignmentId") REFERENCES "ChoreAssignment" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "ReadingEntry" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "studentId" TEXT NOT NULL,
    "readDate" TEXT NOT NULL,
    "bookTitle" TEXT NOT NULL,
    "pagesRead" INTEGER NOT NULL DEFAULT 0,
    "summary" TEXT NOT NULL,
    "feelings" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "ReadingEntry_studentId_fkey" FOREIGN KEY ("studentId") REFERENCES "Student" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Student" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "displayName" TEXT NOT NULL,
    "currentGrade" INTEGER NOT NULL,
    "nextGrade" INTEGER NOT NULL,
    "themeId" TEXT NOT NULL,
    "rewardStyle" TEXT NOT NULL,
    "feedbackStyle" TEXT NOT NULL,
    "xp" INTEGER NOT NULL DEFAULT 0,
    "coins" INTEGER NOT NULL DEFAULT 0,
    "streak" INTEGER NOT NULL DEFAULT 0,
    "readingStreak" INTEGER NOT NULL DEFAULT 0,
    "lastActiveDate" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "Student_themeId_fkey" FOREIGN KEY ("themeId") REFERENCES "ThemeConfig" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_Student" ("coins", "createdAt", "currentGrade", "displayName", "feedbackStyle", "id", "lastActiveDate", "nextGrade", "rewardStyle", "streak", "themeId", "xp") SELECT "coins", "createdAt", "currentGrade", "displayName", "feedbackStyle", "id", "lastActiveDate", "nextGrade", "rewardStyle", "streak", "themeId", "xp" FROM "Student";
DROP TABLE "Student";
ALTER TABLE "new_Student" RENAME TO "Student";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;

-- CreateIndex
CREATE INDEX "ChoreAssignment_studentId_assignedDate_idx" ON "ChoreAssignment"("studentId", "assignedDate");

-- CreateIndex
CREATE UNIQUE INDEX "ChoreAssignment_choreId_studentId_assignedDate_key" ON "ChoreAssignment"("choreId", "studentId", "assignedDate");

-- CreateIndex
CREATE UNIQUE INDEX "ChoreCompletion_assignmentId_key" ON "ChoreCompletion"("assignmentId");

-- CreateIndex
CREATE INDEX "ReadingEntry_studentId_readDate_idx" ON "ReadingEntry"("studentId", "readDate");

-- CreateIndex
CREATE UNIQUE INDEX "ReadingEntry_studentId_readDate_key" ON "ReadingEntry"("studentId", "readDate");
