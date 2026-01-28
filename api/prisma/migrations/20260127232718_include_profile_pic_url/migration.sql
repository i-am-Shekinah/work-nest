-- AlterTable
ALTER TABLE "User" ADD COLUMN     "profilePictureUrl" TEXT,
ALTER COLUMN "hashedPassword" DROP NOT NULL;
