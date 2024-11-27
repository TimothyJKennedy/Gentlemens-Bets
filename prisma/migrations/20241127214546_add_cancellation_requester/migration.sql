/*
  Warnings:

  - The `status` column on the `Bet` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - Made the column `opponentId` on table `Bet` required. This step will fail if there are existing NULL values in that column.

*/
-- CreateEnum
CREATE TYPE "BetStatus" AS ENUM ('PENDING', 'ACTIVE', 'CANCELLATION_REQUESTED', 'CANCELLED', 'COMPLETED', 'REJECTED');

-- DropForeignKey
ALTER TABLE "Bet" DROP CONSTRAINT "Bet_opponentId_fkey";

-- DropIndex
DROP INDEX "Bet_creatorId_idx";

-- DropIndex
DROP INDEX "Bet_opponentId_idx";

-- AlterTable
ALTER TABLE "Bet" ADD COLUMN     "cancellationRequesterId" TEXT,
ALTER COLUMN "opponentId" SET NOT NULL,
DROP COLUMN "status",
ADD COLUMN     "status" "BetStatus" NOT NULL DEFAULT 'PENDING';

-- AddForeignKey
ALTER TABLE "Bet" ADD CONSTRAINT "Bet_opponentId_fkey" FOREIGN KEY ("opponentId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
