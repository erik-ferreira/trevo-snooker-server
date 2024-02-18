/*
  Warnings:

  - Added the required column `winner_player_id` to the `matches` table without a default value. This is not possible if the table is not empty.

*/
-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_matches" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "is_capote" BOOLEAN NOT NULL,
    "is_suicide" BOOLEAN NOT NULL,
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "winner_player_id" TEXT NOT NULL
);
INSERT INTO "new_matches" ("created_at", "id", "is_capote", "is_suicide") SELECT "created_at", "id", "is_capote", "is_suicide" FROM "matches";
DROP TABLE "matches";
ALTER TABLE "new_matches" RENAME TO "matches";
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;
