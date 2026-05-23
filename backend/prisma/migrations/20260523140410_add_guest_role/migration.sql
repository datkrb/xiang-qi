/*
  Warnings:

  - A unique constraint covering the columns `[guestToken]` on the table `User` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterEnum
ALTER TYPE "Role" ADD VALUE 'GUEST';

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "guestExpiresAt" TIMESTAMP(3),
ADD COLUMN     "guestToken" TEXT,
ALTER COLUMN "email" DROP NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "User_guestToken_key" ON "User"("guestToken");
