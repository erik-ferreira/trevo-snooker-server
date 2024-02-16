-- CreateTable
CREATE TABLE "players" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- CreateTable
CREATE TABLE "matches" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "is_capote" BOOLEAN NOT NULL,
    "is_suicide" BOOLEAN NOT NULL,
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- CreateTable
CREATE TABLE "PlayersOnMatches" (
    "match_id" TEXT NOT NULL,
    "player_id" TEXT NOT NULL,

    PRIMARY KEY ("match_id", "player_id"),
    CONSTRAINT "PlayersOnMatches_match_id_fkey" FOREIGN KEY ("match_id") REFERENCES "matches" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "PlayersOnMatches_player_id_fkey" FOREIGN KEY ("player_id") REFERENCES "players" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateIndex
CREATE INDEX "PlayersOnMatches_match_id_idx" ON "PlayersOnMatches"("match_id");

-- CreateIndex
CREATE INDEX "PlayersOnMatches_player_id_idx" ON "PlayersOnMatches"("player_id");
