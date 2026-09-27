/*
  Warnings:

  - You are about to drop the column `createdAt` on the `Todo` table. All the data in the column will be lost.
  - You are about to drop the column `isSuccssfull` on the `Todo` table. All the data in the column will be lost.
  - You are about to drop the column `taskTitle` on the `Todo` table. All the data in the column will be lost.
  - You are about to drop the column `userId` on the `Todo` table. All the data in the column will be lost.
  - You are about to drop the column `createdAt` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `isAdmin` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `recoveryAnswer` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `recoveryQuestion` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `userName` on the `User` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[user_name]` on the table `User` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `task_title` to the `Todo` table without a default value. This is not possible if the table is not empty.
  - Added the required column `user_id` to the `Todo` table without a default value. This is not possible if the table is not empty.
  - Added the required column `recovery_answer` to the `User` table without a default value. This is not possible if the table is not empty.
  - Added the required column `recovery_question` to the `User` table without a default value. This is not possible if the table is not empty.
  - Added the required column `user_name` to the `User` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "Todo" DROP CONSTRAINT "Todo_userId_fkey";

-- DropIndex
DROP INDEX "User_userName_key";

-- AlterTable
ALTER TABLE "Todo" DROP COLUMN "createdAt",
DROP COLUMN "isSuccssfull",
DROP COLUMN "taskTitle",
DROP COLUMN "userId",
ADD COLUMN     "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "is_succssfull" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "task_title" TEXT NOT NULL,
ADD COLUMN     "user_id" INTEGER NOT NULL;

-- AlterTable
ALTER TABLE "User" DROP COLUMN "createdAt",
DROP COLUMN "isAdmin",
DROP COLUMN "recoveryAnswer",
DROP COLUMN "recoveryQuestion",
DROP COLUMN "userName",
ADD COLUMN     "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "is_admin" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "recovery_answer" TEXT NOT NULL,
ADD COLUMN     "recovery_question" TEXT NOT NULL,
ADD COLUMN     "user_name" TEXT NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "User_user_name_key" ON "User"("user_name");

-- AddForeignKey
ALTER TABLE "Todo" ADD CONSTRAINT "Todo_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
