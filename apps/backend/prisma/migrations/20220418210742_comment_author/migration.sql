/*
  Warnings:

  - You are about to drop the column `autorId` on the `CommentLike` table. All the data in the column will be lost.
  - Added the required column `authorId` to the `CommentLike` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "CommentLike" DROP CONSTRAINT "CommentLike_autorId_fkey";

-- AlterTable
ALTER TABLE "CommentLike" DROP COLUMN "autorId",
ADD COLUMN     "authorId" TEXT NOT NULL;

-- AddForeignKey
ALTER TABLE "CommentLike" ADD CONSTRAINT "CommentLike_authorId_fkey" FOREIGN KEY ("authorId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
