-- CreateTable
CREATE TABLE "public"."ChatGroup" (
    "id" TEXT NOT NULL,
    "batchId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ChatGroup_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."ChatMessage" (
    "id" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "chatGroupId" TEXT NOT NULL,
    "senderId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ChatMessage_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "ChatGroup_batchId_key" ON "public"."ChatGroup"("batchId");

-- CreateIndex
CREATE INDEX "ChatGroup_id_idx" ON "public"."ChatGroup"("id");

-- CreateIndex
CREATE INDEX "ChatMessage_chatGroupId_createdAt_idx" ON "public"."ChatMessage"("chatGroupId", "createdAt");

-- CreateIndex
CREATE INDEX "ChatMessage_senderId_idx" ON "public"."ChatMessage"("senderId");

-- AddForeignKey
ALTER TABLE "public"."ChatGroup" ADD CONSTRAINT "ChatGroup_batchId_fkey" FOREIGN KEY ("batchId") REFERENCES "public"."Batch"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."ChatMessage" ADD CONSTRAINT "ChatMessage_chatGroupId_fkey" FOREIGN KEY ("chatGroupId") REFERENCES "public"."ChatGroup"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."ChatMessage" ADD CONSTRAINT "ChatMessage_senderId_fkey" FOREIGN KEY ("senderId") REFERENCES "public"."User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
