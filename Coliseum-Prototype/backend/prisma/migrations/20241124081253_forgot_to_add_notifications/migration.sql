-- CreateEnum
CREATE TYPE "NotifType" AS ENUM ('FRIEND', 'MATCH', 'APPROVE', 'MESSAGE');

-- AlterTable
ALTER TABLE "Chat" ADD COLUMN     "matchId" INTEGER;

-- CreateTable
CREATE TABLE "Notification" (
    "id" SERIAL NOT NULL,
    "receivinguserId" UUID NOT NULL,
    "type" "NotifType" NOT NULL,
    "message" TEXT NOT NULL,
    "contentId" INTEGER NOT NULL,

    CONSTRAINT "Notification_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Chat" ADD CONSTRAINT "Chat_matchId_fkey" FOREIGN KEY ("matchId") REFERENCES "Match"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Notification" ADD CONSTRAINT "Notification_receivinguserId_fkey" FOREIGN KEY ("receivinguserId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
