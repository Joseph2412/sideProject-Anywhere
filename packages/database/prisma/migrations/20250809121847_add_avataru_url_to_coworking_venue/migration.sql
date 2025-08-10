-- AlterTable
ALTER TABLE "public"."CoworkingVenue" ADD COLUMN     "avatarURL" TEXT,
ALTER COLUMN "description" DROP NOT NULL;
