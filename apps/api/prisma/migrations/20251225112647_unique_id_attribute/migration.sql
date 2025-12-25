-- AlterTable
ALTER TABLE "public"."User" ADD CONSTRAINT "User_pkey" PRIMARY KEY ("id");

-- DropIndex
DROP INDEX "public"."User_id_key";
