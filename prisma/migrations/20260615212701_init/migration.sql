/*
  Warnings:

  - You are about to drop the column `Description` on the `Game` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Game" DROP COLUMN "Description";

-- CreateTable
CREATE TABLE "GameTranslation" (
    "id" SERIAL NOT NULL,
    "language" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "gameId" INTEGER NOT NULL,

    CONSTRAINT "GameTranslation_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "GameTranslation_gameId_language_key" ON "GameTranslation"("gameId", "language");

-- AddForeignKey
ALTER TABLE "GameTranslation" ADD CONSTRAINT "GameTranslation_gameId_fkey" FOREIGN KEY ("gameId") REFERENCES "Game"("id") ON DELETE CASCADE ON UPDATE CASCADE;
