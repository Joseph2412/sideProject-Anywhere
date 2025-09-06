/*
  Warnings:

  - You are about to drop the column `costumerId` on the `Booking` table. All the data in the column will be lost.
  - You are about to drop the column `reviewOverall` on the `Booking` table. All the data in the column will be lost.
  - Added the required column `status` to the `Booking` table without a default value. This is not possible if the table is not empty.
  - Added the required column `userId` to the `Booking` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "public"."Booking" DROP COLUMN "costumerId",
DROP COLUMN "reviewOverall",
ADD COLUMN     "people" INTEGER NOT NULL DEFAULT 1,
ADD COLUMN     "status" TEXT NOT NULL,
ADD COLUMN     "userId" INTEGER NOT NULL;
