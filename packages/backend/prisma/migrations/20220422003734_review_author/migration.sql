-- AlterTable
ALTER TABLE "Review" ADD COLUMN     "authorId" TEXT NOT NULL DEFAULT E'cl1mo5hxv0021wvvr0op0tn5a';

-- AddForeignKey
ALTER TABLE "Review" ADD CONSTRAINT "Review_authorId_fkey" FOREIGN KEY ("authorId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
