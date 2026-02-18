-- DropForeignKey
ALTER TABLE "public"."Assignment" DROP CONSTRAINT "Assignment_subjectTeacherId_fkey";

-- AddForeignKey
ALTER TABLE "public"."Assignment" ADD CONSTRAINT "Assignment_subjectTeacherId_fkey" FOREIGN KEY ("subjectTeacherId") REFERENCES "public"."SubjectTeacher"("id") ON DELETE CASCADE ON UPDATE CASCADE;
