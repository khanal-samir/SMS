-- DropForeignKey
ALTER TABLE "public"."StudentSemester" DROP CONSTRAINT "StudentSemester_semesterId_fkey";

-- DropForeignKey
ALTER TABLE "public"."StudentSemester" DROP CONSTRAINT "StudentSemester_studentId_fkey";

-- DropForeignKey
ALTER TABLE "public"."Subject" DROP CONSTRAINT "Subject_semesterId_fkey";

-- DropForeignKey
ALTER TABLE "public"."SubjectTeacher" DROP CONSTRAINT "SubjectTeacher_subjectId_fkey";

-- DropForeignKey
ALTER TABLE "public"."SubjectTeacher" DROP CONSTRAINT "SubjectTeacher_teacherId_fkey";

-- AddForeignKey
ALTER TABLE "public"."StudentSemester" ADD CONSTRAINT "StudentSemester_studentId_fkey" FOREIGN KEY ("studentId") REFERENCES "public"."User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."StudentSemester" ADD CONSTRAINT "StudentSemester_semesterId_fkey" FOREIGN KEY ("semesterId") REFERENCES "public"."Semester"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Subject" ADD CONSTRAINT "Subject_semesterId_fkey" FOREIGN KEY ("semesterId") REFERENCES "public"."Semester"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."SubjectTeacher" ADD CONSTRAINT "SubjectTeacher_subjectId_fkey" FOREIGN KEY ("subjectId") REFERENCES "public"."Subject"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."SubjectTeacher" ADD CONSTRAINT "SubjectTeacher_teacherId_fkey" FOREIGN KEY ("teacherId") REFERENCES "public"."User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
