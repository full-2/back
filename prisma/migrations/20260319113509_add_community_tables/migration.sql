/*
  Warnings:

  - The primary key for the `tbl_auth_account` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `id` on the `tbl_auth_account` table. All the data in the column will be lost.
  - Added the required column `auth_account_id` to the `tbl_auth_account` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `tbl_auth_account` DROP PRIMARY KEY,
    DROP COLUMN `id`,
    ADD COLUMN `auth_account_id` INTEGER NOT NULL AUTO_INCREMENT,
    ADD PRIMARY KEY (`auth_account_id`);

-- CreateTable
CREATE TABLE `tbl_member_location` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `memberId` INTEGER NOT NULL,
    `MemberLocationSi` VARCHAR(191) NULL,
    `MemberLocationGu` VARCHAR(191) NULL,
    `MemberLocationDong` VARCHAR(191) NULL,
    `MemberLocationLatitude` DECIMAL(65, 30) NULL,
    `MemberLocationLongitude` DECIMAL(65, 30) NULL,
    `createdAt` DATETIME(3) NULL DEFAULT CURRENT_TIMESTAMP(3),

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `tbl_safe_score` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `memberId` INTEGER NOT NULL,
    `address` VARCHAR(191) NULL,
    `score` INTEGER NOT NULL,
    `safetyMessage` VARCHAR(191) NULL,
    `rankingPercentile` INTEGER NULL,
    `cctvScore` INTEGER NULL,
    `policeScore` INTEGER NULL,
    `streetlightScore` INTEGER NULL,
    `crimeProneScore` INTEGER NULL,
    `cctvCount` INTEGER NULL,
    `policeCount` INTEGER NULL,
    `streetlightCount` INTEGER NULL,
    `crimeProneCount` INTEGER NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `tbl_member_recent_region` (
    `member_recent_region_id` INTEGER NOT NULL AUTO_INCREMENT,
    `memberId` INTEGER NOT NULL,
    `address` VARCHAR(191) NOT NULL,
    `latitude` DECIMAL(65, 30) NULL,
    `longitude` DECIMAL(65, 30) NULL,
    `viewedAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    PRIMARY KEY (`member_recent_region_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `tbl_provide_post` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `memberId` INTEGER NOT NULL,
    `region` VARCHAR(191) NOT NULL,
    `category` ENUM('LIFE_INFO', 'GOVERNMENT_SUPPORT', 'HOUSING_CONTRACT', 'SAFETY', 'OTHER') NOT NULL DEFAULT 'LIFE_INFO',
    `title` VARCHAR(191) NOT NULL,
    `content` VARCHAR(191) NOT NULL,
    `thumbnailUrl` VARCHAR(191) NULL,
    `tags` VARCHAR(191) NULL,
    `likeCount` INTEGER NULL,
    `bookmarkCount` INTEGER NULL,
    `createdAt` DATETIME(3) NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NULL,
    `provide_post_deleted_at` DATETIME(3) NULL,

    INDEX `tbl_provide_post_memberId_idx`(`memberId`),
    INDEX `tbl_provide_post_provide_post_deleted_at_idx`(`provide_post_deleted_at`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `tbl_provide_post_images` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `providePostId` INTEGER NOT NULL,
    `originalName` VARCHAR(191) NOT NULL,
    `fileName` VARCHAR(191) NULL,
    `isThumbnail` BOOLEAN NULL,

    INDEX `tbl_provide_post_images_providePostId_idx`(`providePostId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `tbl_provide_post_like` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `providePostId` INTEGER NOT NULL,
    `memberId` INTEGER NOT NULL,
    `createdAt` DATETIME(3) NULL DEFAULT CURRENT_TIMESTAMP(3),

    INDEX `tbl_provide_post_like_memberId_idx`(`memberId`),
    UNIQUE INDEX `tbl_provide_post_like_providePostId_memberId_key`(`providePostId`, `memberId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `tbl_provide_post_bookmark` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `providePostId` INTEGER NOT NULL,
    `memberId` INTEGER NOT NULL,
    `createdAt` DATETIME(3) NULL DEFAULT CURRENT_TIMESTAMP(3),

    INDEX `tbl_provide_post_bookmark_memberId_idx`(`memberId`),
    UNIQUE INDEX `tbl_provide_post_bookmark_providePostId_memberId_key`(`providePostId`, `memberId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `tbl_community_post` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `memberId` INTEGER NOT NULL,
    `memberLocationId` INTEGER NOT NULL,
    `title` VARCHAR(191) NOT NULL,
    `content` VARCHAR(191) NOT NULL,
    `category` ENUM('GENERAL', 'QUESTION', 'TIP', 'SHARE', 'OTHER') NOT NULL DEFAULT 'GENERAL',
    `thumbnailUrl` VARCHAR(191) NULL,
    `readCount` INTEGER NULL,
    `likeCount` INTEGER NULL,
    `commentCount` INTEGER NULL,
    `bookmarkCount` INTEGER NULL,
    `createdAt` DATETIME(3) NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NULL,
    `deletedAt` DATETIME(3) NULL,

    INDEX `tbl_community_post_memberId_idx`(`memberId`),
    INDEX `tbl_community_post_memberLocationId_idx`(`memberLocationId`),
    INDEX `tbl_community_post_deletedAt_idx`(`deletedAt`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `tbl_community_post_images` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `communityPostId` INTEGER NOT NULL,
    `originalName` VARCHAR(191) NOT NULL,
    `fileName` VARCHAR(191) NULL,
    `isThumbnail` BOOLEAN NULL,

    INDEX `tbl_community_post_images_communityPostId_idx`(`communityPostId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `tbl_community_post_like` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `communityPostId` INTEGER NOT NULL,
    `memberId` INTEGER NOT NULL,
    `createdAt` DATETIME(3) NULL DEFAULT CURRENT_TIMESTAMP(3),

    INDEX `tbl_community_post_like_memberId_idx`(`memberId`),
    UNIQUE INDEX `tbl_community_post_like_communityPostId_memberId_key`(`communityPostId`, `memberId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `tbl_community_post_bookmark` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `communityPostId` INTEGER NOT NULL,
    `memberId` INTEGER NOT NULL,
    `createdAt` DATETIME(3) NULL DEFAULT CURRENT_TIMESTAMP(3),

    INDEX `tbl_community_post_bookmark_memberId_idx`(`memberId`),
    UNIQUE INDEX `tbl_community_post_bookmark_communityPostId_memberId_key`(`communityPostId`, `memberId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `tbl_community_comment` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `communityPostId` INTEGER NOT NULL,
    `memberId` INTEGER NOT NULL,
    `content` TEXT NOT NULL,
    `likeCount` INTEGER NULL,
    `replyCount` INTEGER NULL,
    `isDeleted` BOOLEAN NULL DEFAULT false,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NULL,
    `community_comment_deleted_at` DATETIME(3) NULL,

    INDEX `tbl_community_comment_communityPostId_idx`(`communityPostId`),
    INDEX `tbl_community_comment_memberId_idx`(`memberId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `tbl_community_comment_reply` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `communityCommentId` INTEGER NOT NULL,
    `memberId` INTEGER NOT NULL,
    `content` TEXT NOT NULL,
    `likeCount` INTEGER NULL,
    `isDeleted` BOOLEAN NULL DEFAULT false,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NULL,
    `deletedAt` DATETIME(3) NULL,

    INDEX `tbl_community_comment_reply_communityCommentId_idx`(`communityCommentId`),
    INDEX `tbl_community_comment_reply_memberId_idx`(`memberId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `tbl_community_comment_like` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `communityCommentId` INTEGER NOT NULL,
    `memberId` INTEGER NOT NULL,
    `createdAt` DATETIME(3) NULL DEFAULT CURRENT_TIMESTAMP(3),

    INDEX `tbl_community_comment_like_memberId_idx`(`memberId`),
    UNIQUE INDEX `tbl_community_comment_like_communityCommentId_memberId_key`(`communityCommentId`, `memberId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `tbl_community_comment_reply_like` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `communityCommentReplyId` INTEGER NOT NULL,
    `memberId` INTEGER NOT NULL,
    `createdAt` DATETIME(3) NULL DEFAULT CURRENT_TIMESTAMP(3),

    INDEX `tbl_community_comment_reply_like_memberId_idx`(`memberId`),
    UNIQUE INDEX `tbl_community_comment_reply_like_communityCommentReplyId_mem_key`(`communityCommentReplyId`, `memberId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `tbl_report` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `reporterMemberId` INTEGER NOT NULL,
    `communityPostId` INTEGER NULL,
    `communityCommentId` INTEGER NULL,
    `communityCommentReplyId` INTEGER NULL,
    `reason` VARCHAR(191) NOT NULL,
    `status` ENUM('PENDING', 'RESOLVED', 'REJECTED') NOT NULL DEFAULT 'PENDING',
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    INDEX `tbl_report_reporterMemberId_idx`(`reporterMemberId`),
    INDEX `tbl_report_communityPostId_idx`(`communityPostId`),
    INDEX `tbl_report_communityCommentId_idx`(`communityCommentId`),
    INDEX `tbl_report_communityCommentReplyId_idx`(`communityCommentReplyId`),
    INDEX `tbl_report_status_idx`(`status`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `tbl_member_location` ADD CONSTRAINT `tbl_member_location_memberId_fkey` FOREIGN KEY (`memberId`) REFERENCES `member`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `tbl_safe_score` ADD CONSTRAINT `tbl_safe_score_memberId_fkey` FOREIGN KEY (`memberId`) REFERENCES `member`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `tbl_member_recent_region` ADD CONSTRAINT `tbl_member_recent_region_memberId_fkey` FOREIGN KEY (`memberId`) REFERENCES `member`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `tbl_provide_post` ADD CONSTRAINT `tbl_provide_post_memberId_fkey` FOREIGN KEY (`memberId`) REFERENCES `member`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `tbl_provide_post_images` ADD CONSTRAINT `tbl_provide_post_images_providePostId_fkey` FOREIGN KEY (`providePostId`) REFERENCES `tbl_provide_post`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `tbl_provide_post_like` ADD CONSTRAINT `tbl_provide_post_like_providePostId_fkey` FOREIGN KEY (`providePostId`) REFERENCES `tbl_provide_post`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `tbl_provide_post_like` ADD CONSTRAINT `tbl_provide_post_like_memberId_fkey` FOREIGN KEY (`memberId`) REFERENCES `member`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `tbl_provide_post_bookmark` ADD CONSTRAINT `tbl_provide_post_bookmark_providePostId_fkey` FOREIGN KEY (`providePostId`) REFERENCES `tbl_provide_post`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `tbl_provide_post_bookmark` ADD CONSTRAINT `tbl_provide_post_bookmark_memberId_fkey` FOREIGN KEY (`memberId`) REFERENCES `member`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `tbl_community_post` ADD CONSTRAINT `tbl_community_post_memberId_fkey` FOREIGN KEY (`memberId`) REFERENCES `member`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `tbl_community_post` ADD CONSTRAINT `tbl_community_post_memberLocationId_fkey` FOREIGN KEY (`memberLocationId`) REFERENCES `tbl_member_location`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `tbl_community_post_images` ADD CONSTRAINT `tbl_community_post_images_communityPostId_fkey` FOREIGN KEY (`communityPostId`) REFERENCES `tbl_community_post`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `tbl_community_post_like` ADD CONSTRAINT `tbl_community_post_like_communityPostId_fkey` FOREIGN KEY (`communityPostId`) REFERENCES `tbl_community_post`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `tbl_community_post_like` ADD CONSTRAINT `tbl_community_post_like_memberId_fkey` FOREIGN KEY (`memberId`) REFERENCES `member`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `tbl_community_post_bookmark` ADD CONSTRAINT `tbl_community_post_bookmark_communityPostId_fkey` FOREIGN KEY (`communityPostId`) REFERENCES `tbl_community_post`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `tbl_community_post_bookmark` ADD CONSTRAINT `tbl_community_post_bookmark_memberId_fkey` FOREIGN KEY (`memberId`) REFERENCES `member`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `tbl_community_comment` ADD CONSTRAINT `tbl_community_comment_communityPostId_fkey` FOREIGN KEY (`communityPostId`) REFERENCES `tbl_community_post`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `tbl_community_comment` ADD CONSTRAINT `tbl_community_comment_memberId_fkey` FOREIGN KEY (`memberId`) REFERENCES `member`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `tbl_community_comment_reply` ADD CONSTRAINT `tbl_community_comment_reply_communityCommentId_fkey` FOREIGN KEY (`communityCommentId`) REFERENCES `tbl_community_comment`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `tbl_community_comment_reply` ADD CONSTRAINT `tbl_community_comment_reply_memberId_fkey` FOREIGN KEY (`memberId`) REFERENCES `member`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `tbl_community_comment_like` ADD CONSTRAINT `tbl_community_comment_like_communityCommentId_fkey` FOREIGN KEY (`communityCommentId`) REFERENCES `tbl_community_comment`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `tbl_community_comment_like` ADD CONSTRAINT `tbl_community_comment_like_memberId_fkey` FOREIGN KEY (`memberId`) REFERENCES `member`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `tbl_community_comment_reply_like` ADD CONSTRAINT `fk_cc_reply_like_reply` FOREIGN KEY (`communityCommentReplyId`) REFERENCES `tbl_community_comment_reply`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `tbl_community_comment_reply_like` ADD CONSTRAINT `fk_cc_reply_like_member` FOREIGN KEY (`memberId`) REFERENCES `member`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `tbl_report` ADD CONSTRAINT `tbl_report_reporterMemberId_fkey` FOREIGN KEY (`reporterMemberId`) REFERENCES `member`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `tbl_report` ADD CONSTRAINT `tbl_report_communityPostId_fkey` FOREIGN KEY (`communityPostId`) REFERENCES `tbl_community_post`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `tbl_report` ADD CONSTRAINT `tbl_report_communityCommentId_fkey` FOREIGN KEY (`communityCommentId`) REFERENCES `tbl_community_comment`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `tbl_report` ADD CONSTRAINT `tbl_report_communityCommentReplyId_fkey` FOREIGN KEY (`communityCommentReplyId`) REFERENCES `tbl_community_comment_reply`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;
