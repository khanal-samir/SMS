-- CreateEnum
CREATE TYPE "public"."ResourceType" AS ENUM ('DOCUMENT', 'IMAGE', 'LINK');

-- CreateTable
CREATE TABLE "public"."Resource" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT,
    "resourceType" "public"."ResourceType" NOT NULL,
    "fileUrl" TEXT,
    "fileName" TEXT,
    "fileSize" INTEGER,
    "mimeType" TEXT,
    "externalLink" TEXT,
    "isUploaded" BOOLEAN NOT NULL DEFAULT false,
    "isPublished" BOOLEAN NOT NULL DEFAULT false,
    "publishedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "subjectTeacherId" TEXT NOT NULL,

    CONSTRAINT "Resource_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "Resource_subjectTeacherId_idx" ON "public"."Resource"("subjectTeacherId");

-- CreateIndex
CREATE INDEX "Resource_isPublished_idx" ON "public"."Resource"("isPublished");

-- AddForeignKey
ALTER TABLE "public"."Resource" ADD CONSTRAINT "Resource_subjectTeacherId_fkey" FOREIGN KEY ("subjectTeacherId") REFERENCES "public"."SubjectTeacher"("id") ON DELETE CASCADE ON UPDATE CASCADE;
