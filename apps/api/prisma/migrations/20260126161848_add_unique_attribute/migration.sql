/*
  Warnings:

  - A unique constraint covering the columns `[semesterNumber]` on the table `Semester` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "Semester_semesterNumber_key" ON "public"."Semester"("semesterNumber");
