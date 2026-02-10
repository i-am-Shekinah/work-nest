/*
  Warnings:

  - A unique constraint covering the columns `[name,isDeleted]` on the table `departments` will be added. If there are existing duplicate values, this will fail.

*/
-- DropIndex
DROP INDEX "departments_name_key";

-- AlterTable
ALTER TABLE "departments" ADD COLUMN     "isDeleted" BOOLEAN NOT NULL DEFAULT false;

-- CreateIndex
CREATE UNIQUE INDEX "departments_name_isDeleted_key" ON "departments"("name", "isDeleted");
