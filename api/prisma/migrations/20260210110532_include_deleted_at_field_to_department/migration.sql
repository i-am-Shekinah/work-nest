/*
  Warnings:

  - A unique constraint covering the columns `[name,deletedAt]` on the table `departments` will be added. If there are existing duplicate values, this will fail.

*/
-- DropIndex
DROP INDEX "departments_name_isDeleted_key";

-- AlterTable
ALTER TABLE "departments" ADD COLUMN     "deletedAt" TIMESTAMP(3);

-- CreateIndex
CREATE UNIQUE INDEX "departments_name_deletedAt_key" ON "departments"("name", "deletedAt");
