/*
  Warnings:

  - Added the required column `bday` to the `User` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "BlockRequestType" AS ENUM ('UNBLOCK', 'BLOCK');

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "bday" TIMESTAMP(3) NOT NULL;

-- CreateTable
CREATE TABLE "BlockRequest" (
    "id" SERIAL NOT NULL,
    "creatorId" UUID,
    "toBlockId" UUID,
    "type" "BlockRequestType" NOT NULL,

    CONSTRAINT "BlockRequest_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "BlockApproval" (
    "id" SERIAL NOT NULL,
    "approverId" UUID NOT NULL,
    "blockRequestId" INTEGER NOT NULL,

    CONSTRAINT "BlockApproval_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "BlockRequest" ADD CONSTRAINT "BlockRequest_creatorId_fkey" FOREIGN KEY ("creatorId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "BlockRequest" ADD CONSTRAINT "BlockRequest_toBlockId_fkey" FOREIGN KEY ("toBlockId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "BlockApproval" ADD CONSTRAINT "BlockApproval_approverId_fkey" FOREIGN KEY ("approverId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "BlockApproval" ADD CONSTRAINT "BlockApproval_blockRequestId_fkey" FOREIGN KEY ("blockRequestId") REFERENCES "BlockRequest"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
