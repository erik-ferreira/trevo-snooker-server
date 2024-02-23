/*
  Warnings:

  - You are about to drop the column `created_at` on the `players` table. All the data in the column will be lost.
  - You are about to drop the column `slug_avatar` on the `players` table. All the data in the column will be lost.
  - You are about to drop the column `created_at` on the `matches` table. All the data in the column will be lost.
  - You are about to drop the column `is_capote` on the `matches` table. All the data in the column will be lost.
  - You are about to drop the column `is_suicide` on the `matches` table. All the data in the column will be lost.
  - You are about to drop the column `winner_player_id` on the `matches` table. All the data in the column will be lost.
  - The primary key for the `PlayersOnMatches` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `match_id` on the `PlayersOnMatches` table. All the data in the column will be lost.
  - You are about to drop the column `player_id` on the `PlayersOnMatches` table. All the data in the column will be lost.
  - Added the required column `slugAvatar` to the `players` table without a default value. This is not possible if the table is not empty.
  - Added the required column `isCapote` to the `matches` table without a default value. This is not possible if the table is not empty.
  - Added the required column `isSuicide` to the `matches` table without a default value. This is not possible if the table is not empty.
  - Added the required column `winnerPlayerId` to the `matches` table without a default value. This is not possible if the table is not empty.
  - Added the required column `matchId` to the `PlayersOnMatches` table without a default value. This is not possible if the table is not empty.
  - Added the required column `playerId` to the `PlayersOnMatches` table without a default value. This is not possible if the table is not empty.

*/
-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_players" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "slugAvatar" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);
INSERT INTO "new_players" ("id", "name") SELECT "id", "name" FROM "players";
DROP TABLE "players";
ALTER TABLE "new_players" RENAME TO "players";
CREATE TABLE "new_matches" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "isCapote" BOOLEAN NOT NULL,
    "isSuicide" BOOLEAN NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "winnerPlayerId" TEXT NOT NULL
);
INSERT INTO "new_matches" ("id") SELECT "id" FROM "matches";
DROP TABLE "matches";
ALTER TABLE "new_matches" RENAME TO "matches";
CREATE TABLE "new_PlayersOnMatches" (
    "matchId" TEXT NOT NULL,
    "playerId" TEXT NOT NULL,

    PRIMARY KEY ("matchId", "playerId"),
    CONSTRAINT "PlayersOnMatches_matchId_fkey" FOREIGN KEY ("matchId") REFERENCES "matches" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "PlayersOnMatches_playerId_fkey" FOREIGN KEY ("playerId") REFERENCES "players" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
DROP TABLE "PlayersOnMatches";
ALTER TABLE "new_PlayersOnMatches" RENAME TO "PlayersOnMatches";
CREATE INDEX "PlayersOnMatches_matchId_idx" ON "PlayersOnMatches"("matchId");
CREATE INDEX "PlayersOnMatches_playerId_idx" ON "PlayersOnMatches"("playerId");
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;
