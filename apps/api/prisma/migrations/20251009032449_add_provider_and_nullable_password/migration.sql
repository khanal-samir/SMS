-- CreateEnum
CREATE TYPE "public"."Provider" AS ENUM ('LOCAL', 'GOOGLE');

-- AlterTable
ALTER TABLE "public"."User" ADD COLUMN     "provider" "public"."Provider" NOT NULL DEFAULT 'LOCAL',
ALTER COLUMN "password" DROP NOT NULL;

-- CreateIndex
CREATE INDEX "User_email_idx" ON "public"."User"("email");
