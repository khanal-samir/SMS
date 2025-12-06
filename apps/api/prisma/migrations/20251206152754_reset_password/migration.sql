-- AlterTable
ALTER TABLE "public"."User" ADD COLUMN     "passwordResetOtp" TEXT,
ADD COLUMN     "passwordResetOtpExpiry" TIMESTAMP(3);
