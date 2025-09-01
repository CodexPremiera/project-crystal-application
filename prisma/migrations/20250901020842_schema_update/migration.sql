-- DropForeignKey
ALTER TABLE "public"."Comment" DROP CONSTRAINT "Comment_commentId_fkey";

-- AlterTable
ALTER TABLE "public"."User" ADD COLUMN     "firstView" BOOLEAN NOT NULL DEFAULT false;

-- AddForeignKey
ALTER TABLE "public"."Comment" ADD CONSTRAINT "Comment_commentId_fkey" FOREIGN KEY ("commentId") REFERENCES "public"."Comment"("id") ON DELETE SET NULL ON UPDATE CASCADE;
