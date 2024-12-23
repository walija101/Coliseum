/*
  Warnings:

  - You are about to drop the column `receivinguserId` on the `Notification` table. All the data in the column will be lost.
  - You are about to drop the column `about` on the `Profile` table. All the data in the column will be lost.
  - Added the required column `receivingUserId` to the `Notification` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "Sexuality" AS ENUM ('Male', 'Female', 'Other');

-- DropForeignKey
ALTER TABLE "Notification" DROP CONSTRAINT "Notification_receivinguserId_fkey";

-- AlterTable
ALTER TABLE "Notification" DROP COLUMN "receivinguserId",
ADD COLUMN     "receivingUserId" UUID NOT NULL;

-- AlterTable
ALTER TABLE "Profile" DROP COLUMN "about",
ADD COLUMN     "hobbies" TEXT[],
ADD COLUMN     "sexuality" "Gender"[];

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "bannedUntil" TIMESTAMP(3),
ADD COLUMN     "profileId" INTEGER;

-- CreateTable
CREATE TABLE "BanRequest" (
    "id" SERIAL NOT NULL,
    "userId" UUID,
    "reason" TEXT NOT NULL,
    "proposedTime" TIMESTAMP(3),
    "messageId" INTEGER NOT NULL,

    CONSTRAINT "BanRequest_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Warning" (
    "id" SERIAL NOT NULL,
    "userId" UUID NOT NULL,
    "reason" TEXT NOT NULL,
    "messageId" INTEGER NOT NULL,

    CONSTRAINT "Warning_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "_seenUser" (
    "A" UUID NOT NULL,
    "B" UUID NOT NULL
);

-- CreateTable
CREATE TABLE "_blocked" (
    "A" UUID NOT NULL,
    "B" UUID NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "BanRequest_userId_key" ON "BanRequest"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "BanRequest_messageId_key" ON "BanRequest"("messageId");

-- CreateIndex
CREATE UNIQUE INDEX "Warning_messageId_key" ON "Warning"("messageId");

-- CreateIndex
CREATE UNIQUE INDEX "_seenUser_AB_unique" ON "_seenUser"("A", "B");

-- CreateIndex
CREATE INDEX "_seenUser_B_index" ON "_seenUser"("B");

-- CreateIndex
CREATE UNIQUE INDEX "_blocked_AB_unique" ON "_blocked"("A", "B");

-- CreateIndex
CREATE INDEX "_blocked_B_index" ON "_blocked"("B");

-- AddForeignKey
ALTER TABLE "Profile" ADD CONSTRAINT "Profile_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Notification" ADD CONSTRAINT "Notification_receivingUserId_fkey" FOREIGN KEY ("receivingUserId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "BanRequest" ADD CONSTRAINT "BanRequest_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "BanRequest" ADD CONSTRAINT "BanRequest_messageId_fkey" FOREIGN KEY ("messageId") REFERENCES "Message"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Warning" ADD CONSTRAINT "Warning_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Warning" ADD CONSTRAINT "Warning_messageId_fkey" FOREIGN KEY ("messageId") REFERENCES "Message"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_seenUser" ADD CONSTRAINT "_seenUser_A_fkey" FOREIGN KEY ("A") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_seenUser" ADD CONSTRAINT "_seenUser_B_fkey" FOREIGN KEY ("B") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_blocked" ADD CONSTRAINT "_blocked_A_fkey" FOREIGN KEY ("A") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_blocked" ADD CONSTRAINT "_blocked_B_fkey" FOREIGN KEY ("B") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
