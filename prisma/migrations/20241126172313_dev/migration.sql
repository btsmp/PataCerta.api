/*
  Warnings:

  - You are about to drop the column `profilePicUrl` on the `Pet` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Pet" DROP COLUMN "profilePicUrl",
ADD COLUMN     "images" TEXT[];
