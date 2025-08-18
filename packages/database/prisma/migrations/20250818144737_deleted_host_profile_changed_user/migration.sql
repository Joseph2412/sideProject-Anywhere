/*
  Warnings:

  - You are about to drop the column `avatarURL` on the `CoworkingVenue` table. All the data in the column will be lost.
  - You are about to drop the column `hostProfileId` on the `CoworkingVenue` table. All the data in the column will be lost.
  - You are about to drop the column `name` on the `User` table. All the data in the column will be lost.
  - You are about to drop the `HostProfile` table. If the table is not empty, all the data it contains will be lost.
  - A unique constraint covering the columns `[userProfileId]` on the table `CoworkingVenue` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `userProfileId` to the `CoworkingVenue` table without a default value. This is not possible if the table is not empty.
  - Added the required column `firstName` to the `User` table without a default value. This is not possible if the table is not empty.
  - Added the required column `lastName` to the `User` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updatedAt` to the `User` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "public"."CoworkingVenue" DROP CONSTRAINT "CoworkingVenue_hostProfileId_fkey";

-- DropForeignKey
ALTER TABLE "public"."HostProfile" DROP CONSTRAINT "HostProfile_userId_fkey";

-- DropIndex
DROP INDEX "public"."CoworkingVenue_hostProfileId_key";

-- DropIndex
DROP INDEX "public"."User_role_idx";

-- AlterTable
ALTER TABLE "public"."CoworkingVenue" DROP COLUMN "avatarURL",
DROP COLUMN "hostProfileId",
ADD COLUMN     "logoURL" TEXT,
ADD COLUMN     "userProfileId" INTEGER NOT NULL;

-- AlterTable
ALTER TABLE "public"."User" DROP COLUMN "name",
ADD COLUMN     "avatarUrl" TEXT,
ADD COLUMN     "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "firstName" TEXT NOT NULL,
ADD COLUMN     "lastName" TEXT NOT NULL,
ADD COLUMN     "preferences" JSONB,
ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL;

-- DropTable
DROP TABLE "public"."HostProfile";

-- CreateIndex
CREATE UNIQUE INDEX "CoworkingVenue_userProfileId_key" ON "public"."CoworkingVenue"("userProfileId");

-- CreateIndex
CREATE INDEX "User_createdAt_idx" ON "public"."User"("createdAt");

-- AddForeignKey
ALTER TABLE "public"."CoworkingVenue" ADD CONSTRAINT "CoworkingVenue_userProfileId_fkey" FOREIGN KEY ("userProfileId") REFERENCES "public"."User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
