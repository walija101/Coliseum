-- CreateTable
CREATE TABLE "friendRequest" (
    "id" SERIAL NOT NULL,
    "sendingUserId" UUID,
    "receivingUserId" UUID,

    CONSTRAINT "friendRequest_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "friendRequest" ADD CONSTRAINT "friendRequest_sendingUserId_fkey" FOREIGN KEY ("sendingUserId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "friendRequest" ADD CONSTRAINT "friendRequest_receivingUserId_fkey" FOREIGN KEY ("receivingUserId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;
