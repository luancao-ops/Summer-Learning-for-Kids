ALTER TABLE "ChoreTemplate" ADD COLUMN "active" BOOLEAN NOT NULL DEFAULT true;

PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;

CREATE TABLE "new_ChoreAssignment" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "choreId" TEXT NOT NULL,
    "studentId" TEXT NOT NULL,
    "assignedDate" TEXT NOT NULL,
    "dueDate" TEXT NOT NULL,
    "dueSession" TEXT NOT NULL DEFAULT 'evening',
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "ChoreAssignment_choreId_fkey" FOREIGN KEY ("choreId") REFERENCES "ChoreTemplate" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "ChoreAssignment_studentId_fkey" FOREIGN KEY ("studentId") REFERENCES "Student" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

INSERT INTO "new_ChoreAssignment" ("id", "choreId", "studentId", "assignedDate", "dueDate", "dueSession", "createdAt")
SELECT "id", "choreId", "studentId", "assignedDate", "assignedDate", 'evening', "createdAt"
FROM "ChoreAssignment";

DROP TABLE "ChoreAssignment";
ALTER TABLE "new_ChoreAssignment" RENAME TO "ChoreAssignment";

CREATE UNIQUE INDEX "ChoreAssignment_choreId_studentId_dueDate_dueSession_key" ON "ChoreAssignment"("choreId", "studentId", "dueDate", "dueSession");
CREATE INDEX "ChoreAssignment_studentId_assignedDate_idx" ON "ChoreAssignment"("studentId", "assignedDate");
CREATE INDEX "ChoreAssignment_studentId_dueDate_idx" ON "ChoreAssignment"("studentId", "dueDate");

PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;

UPDATE "ChoreTemplate"
SET "active" = false
WHERE "name" = 'Cho thú cưng ăn';

INSERT INTO "ChoreTemplate" ("id", "name", "icon", "description", "active")
SELECT lower(hex(randomblob(16))), 'Phụ mẹ giao hàng', '🛵', 'Đi cùng mẹ giao đồ hoặc hỗ trợ mang đồ đến đúng nơi cần gửi.', true
WHERE NOT EXISTS (
  SELECT 1 FROM "ChoreTemplate" WHERE "name" = 'Phụ mẹ giao hàng'
);

INSERT INTO "ChoreTemplate" ("id", "name", "icon", "description", "active")
SELECT lower(hex(randomblob(16))), 'Phơi đồ', '🧺', 'Mang quần áo ra phơi gọn gàng và kiểm tra đồ đã được treo chắc chắn.', true
WHERE NOT EXISTS (
  SELECT 1 FROM "ChoreTemplate" WHERE "name" = 'Phơi đồ'
);

INSERT INTO "ChoreTemplate" ("id", "name", "icon", "description", "active")
SELECT lower(hex(randomblob(16))), 'Dọn vệ sinh toilet', '🚽', 'Cọ rửa và lau sạch khu vực toilet theo hướng dẫn của ba mẹ.', true
WHERE NOT EXISTS (
  SELECT 1 FROM "ChoreTemplate" WHERE "name" = 'Dọn vệ sinh toilet'
);
