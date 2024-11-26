/*
  Warnings:

  - You are about to drop the column `status` on the `Pet` table. All the data in the column will be lost.
  - You are about to drop the column `isOng` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `isValidated` on the `User` table. All the data in the column will be lost.
  - You are about to drop the `AdoptionRequest` table. If the table is not empty, all the data it contains will be lost.

*/
-- CreateEnum
CREATE TYPE "UserRole" AS ENUM ('ADMIN', 'USER', 'ONG');

-- DropForeignKey
ALTER TABLE "AdoptionRequest" DROP CONSTRAINT "AdoptionRequest_adopterId_fkey";

-- DropForeignKey
ALTER TABLE "AdoptionRequest" DROP CONSTRAINT "AdoptionRequest_petId_fkey";

-- DropForeignKey
ALTER TABLE "Pet" DROP CONSTRAINT "Pet_onwerId_fkey";

-- AlterTable
ALTER TABLE "Pet" DROP COLUMN "status",
ADD COLUMN     "isAdopted" BOOLEAN NOT NULL DEFAULT false,
ALTER COLUMN "onwerId" DROP NOT NULL;

-- AlterTable
ALTER TABLE "User" DROP COLUMN "isOng",
DROP COLUMN "isValidated",
ADD COLUMN     "aboutMe" TEXT,
ADD COLUMN     "age" INTEGER,
ADD COLUMN     "city" TEXT,
ADD COLUMN     "profilePicUrl" TEXT,
ADD COLUMN     "role" "UserRole" NOT NULL DEFAULT 'USER',
ADD COLUMN     "uf" TEXT;

-- DropTable
DROP TABLE "AdoptionRequest";

-- CreateTable
CREATE TABLE "Interest" (
    "id" TEXT NOT NULL,
    "adopterId" TEXT NOT NULL,
    "petId" TEXT NOT NULL,
    "cretaedAt" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP NOT NULL,

    CONSTRAINT "Interest_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Interest_id_key" ON "Interest"("id");

-- AddForeignKey
ALTER TABLE "Pet" ADD CONSTRAINT "Pet_onwerId_fkey" FOREIGN KEY ("onwerId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Interest" ADD CONSTRAINT "Interest_adopterId_fkey" FOREIGN KEY ("adopterId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Interest" ADD CONSTRAINT "Interest_petId_fkey" FOREIGN KEY ("petId") REFERENCES "Pet"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
