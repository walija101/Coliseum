/*
  Warnings:

  - You are about to drop the `_UserChats` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "_UserChats" DROP CONSTRAINT "_UserChats_A_fkey";

-- DropForeignKey
ALTER TABLE "_UserChats" DROP CONSTRAINT "_UserChats_B_fkey";

-- DropTable
DROP TABLE "_UserChats";

-- CreateTable
CREATE TABLE "_ReadChats" (
    "A" INTEGER NOT NULL,
    "B" UUID NOT NULL
);

-- CreateTable
CREATE TABLE "_WriteChats" (
    "A" INTEGER NOT NULL,
    "B" UUID NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "_ReadChats_AB_unique" ON "_ReadChats"("A", "B");

-- CreateIndex
CREATE INDEX "_ReadChats_B_index" ON "_ReadChats"("B");

-- CreateIndex
CREATE UNIQUE INDEX "_WriteChats_AB_unique" ON "_WriteChats"("A", "B");

-- CreateIndex
CREATE INDEX "_WriteChats_B_index" ON "_WriteChats"("B");

-- AddForeignKey
ALTER TABLE "_ReadChats" ADD CONSTRAINT "_ReadChats_A_fkey" FOREIGN KEY ("A") REFERENCES "Chat"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_ReadChats" ADD CONSTRAINT "_ReadChats_B_fkey" FOREIGN KEY ("B") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_WriteChats" ADD CONSTRAINT "_WriteChats_A_fkey" FOREIGN KEY ("A") REFERENCES "Chat"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_WriteChats" ADD CONSTRAINT "_WriteChats_B_fkey" FOREIGN KEY ("B") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
