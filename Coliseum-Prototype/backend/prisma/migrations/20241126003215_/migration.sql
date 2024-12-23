-- CreateEnum
CREATE TYPE "ChatType" AS ENUM ('MAIN', 'SIDE1', 'SIDE2');

-- AlterTable
ALTER TABLE "Chat" ADD COLUMN     "type" "ChatType" NOT NULL DEFAULT 'MAIN';
