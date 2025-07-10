/*
  Warnings:

  - Changed the type of `payment_status` on the `Payment` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- CreateEnum
CREATE TYPE "PaymentStatus" AS ENUM ('pending', 'failed', 'success');

-- AlterTable
ALTER TABLE "Payment" DROP COLUMN "payment_status",
ADD COLUMN     "payment_status" "PaymentStatus" NOT NULL;
