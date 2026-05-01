/*
  Warnings:

  - You are about to alter the column `reason` on the `tbl_report` table. The data in that column could be lost. The data in that column will be cast from `VarChar(191)` to `Enum(EnumId(4))`.
  - Made the column `likeCount` on table `tbl_community_comment` required. This step will fail if there are existing NULL values in that column.
  - Made the column `replyCount` on table `tbl_community_comment` required. This step will fail if there are existing NULL values in that column.
  - Made the column `likeCount` on table `tbl_community_comment_reply` required. This step will fail if there are existing NULL values in that column.
  - Made the column `readCount` on table `tbl_community_post` required. This step will fail if there are existing NULL values in that column.
  - Made the column `likeCount` on table `tbl_community_post` required. This step will fail if there are existing NULL values in that column.
  - Made the column `commentCount` on table `tbl_community_post` required. This step will fail if there are existing NULL values in that column.
  - Made the column `bookmarkCount` on table `tbl_community_post` required. This step will fail if there are existing NULL values in that column.
  - Made the column `likeCount` on table `tbl_provide_post` required. This step will fail if there are existing NULL values in that column.
  - Made the column `bookmarkCount` on table `tbl_provide_post` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE `tbl_community_comment` MODIFY `likeCount` INTEGER NOT NULL DEFAULT 0,
    MODIFY `replyCount` INTEGER NOT NULL DEFAULT 0;

-- AlterTable
ALTER TABLE `tbl_community_comment_reply` MODIFY `likeCount` INTEGER NOT NULL DEFAULT 0;

-- AlterTable
ALTER TABLE `tbl_community_post` MODIFY `readCount` INTEGER NOT NULL DEFAULT 0,
    MODIFY `likeCount` INTEGER NOT NULL DEFAULT 0,
    MODIFY `commentCount` INTEGER NOT NULL DEFAULT 0,
    MODIFY `bookmarkCount` INTEGER NOT NULL DEFAULT 0;

-- AlterTable
ALTER TABLE `tbl_provide_post` ADD COLUMN `readCount` INTEGER NOT NULL DEFAULT 0,
    MODIFY `likeCount` INTEGER NOT NULL DEFAULT 0,
    MODIFY `bookmarkCount` INTEGER NOT NULL DEFAULT 0;

-- AlterTable
ALTER TABLE `tbl_report` MODIFY `reason` ENUM('ABUSE', 'SPAM', 'ADVERTISEMENT', 'SEXUAL', 'HATE', 'MISINFORMATION', 'ILLEGAL_CONTENT') NOT NULL;
