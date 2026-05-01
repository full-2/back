import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { ReportReason } from '@prisma/client';

@Injectable()
export class CommunityService {
  constructor(private readonly prisma: PrismaService) {}
  private viewCache = new Map<string, number>();
  private async validateDuplicateReport(where: any) {
    const exists = await this.prisma.report.findFirst({ where });

    if (exists) {
      throw new BadRequestException('이미 신고한 대상입니다.');
    }
  }

  // 1. 커뮤니티 목록 조회
  async getCommunityPosts(query: any, memberId: number) {
    const page = Number(query.page) || 1;
    const pageSize = Number(query.pageSize) || 6;
    const skip = (page - 1) * pageSize;

    // 사용자가 설정한 지역 조회 (가장 최신)
    const memberLocation = await this.prisma.memberLocation.findFirst({
      where: { memberId },
      orderBy: { createdAt: 'desc' },
    });
    if (!memberLocation) {
      return {
        data: [],
        meta: {
          page,
          pageSize,
          totalCount: 0,
          hasMore: false,
        },
      };
    }
    const where: any = {
      deletedAt: null,
      memberLocationId: memberLocation.id,
    };

    // 검색
    if (query.keyword) {
      where.OR = [
        { title: { contains: query.keyword } },
        { content: { contains: query.keyword } },
      ];
    }

    // 정렬
    let orderBy: any = { createdAt: 'desc' };

    switch (query.sort) {
      case '조회수순':
        orderBy = { readCount: 'desc' };
        break;
      case '스크랩순':
        orderBy = { bookmarkCount: 'desc' };
        break;
      case '좋아요순':
        orderBy = { likeCount: 'desc' };
        break;
      case '댓글순':
        orderBy = { commentCount: 'desc' };
        break;
      case '최신순':
      default:
        orderBy = { createdAt: 'desc' };
    }

    const [posts, totalCount] = await Promise.all([
      this.prisma.communityPost.findMany({
        where,
        orderBy,
        skip,
        take: pageSize,
        select: {
          id: true,
          title: true,
          content: true,
          createdAt: true,
          readCount: true,
          likeCount: true,
          bookmarkCount: true,
          commentCount: true,
          thumbnailUrl: true,

          member: {
            select: {
              memberNickname: true,
              memberProfile: true,
            },
          },

          memberLocation: {
            select: {
              MemberLocationSi: true,
              MemberLocationGu: true,
              MemberLocationDong: true,
            },
          },
        },
      }),
      this.prisma.communityPost.count({ where }),
    ]);

    // 프론트에 맞게 가공
    const transformedPosts = posts.map((post) => ({
      id: post.id,
      title: post.title,
      content: post.content,
      createdAt: post.createdAt,

      readCount: post.readCount ?? 0,
      likeCount: post.likeCount ?? 0,
      bookmarkCount: post.bookmarkCount ?? 0,
      commentCount: post.commentCount ?? 0,

      author: {
        nickname: post.member?.memberNickname ?? '',
        profileImage: post.member?.memberProfile ?? null,
      },

      region: [
        post.memberLocation?.MemberLocationSi,
        post.memberLocation?.MemberLocationGu,
        post.memberLocation?.MemberLocationDong,
      ]
        .filter(Boolean)
        .join(' '),

      imageSrc: post.thumbnailUrl,
    }));

    return {
      data: transformedPosts,
      meta: {
        page,
        pageSize,
        totalCount,
        hasMore: skip + posts.length < totalCount,
      },
    };
  }

  // 2. 커뮤니티 상세 조회
  async getCommunityPostDetail(postId: number, memberId?: number, ip?: string) {
    // 조회수 계속 증가 제한 (Map)
    const key = `${postId}_${ip || 'unknown'}`;
    const now = Date.now();
    const VIEW_LIMIT_TIME = 1000 * 60 * 10;

    const lastViewed = this.viewCache.get(key);
    const shouldIncrease = !lastViewed || now - lastViewed > VIEW_LIMIT_TIME;

    let post;

    if (shouldIncrease) {
      this.viewCache.set(key, now);

      post = await this.prisma.communityPost.update({
        where: { id: postId },
        data: {
          readCount: { increment: 1 },
        },
        include: {
          member: {
            select: {
              id: true,
              memberNickname: true,
              memberProfile: true,
            },
          },
          memberLocation: {
            select: {
              MemberLocationSi: true,
              MemberLocationGu: true,
              MemberLocationDong: true,
            },
          },
          images: true,

          likes: memberId
            ? { where: { memberId }, select: { id: true } }
            : false,

          bookmarks: memberId
            ? { where: { memberId }, select: { id: true } }
            : false,
        },
      });
    } else {
      post = await this.prisma.communityPost.findUnique({
        where: { id: postId },
        include: {
          member: {
            select: {
              id: true,
              memberNickname: true,
              memberProfile: true,
            },
          },
          memberLocation: {
            select: {
              MemberLocationSi: true,
              MemberLocationGu: true,
              MemberLocationDong: true,
            },
          },
          images: true,

          likes: memberId
            ? { where: { memberId }, select: { id: true } }
            : false,

          bookmarks: memberId
            ? { where: { memberId }, select: { id: true } }
            : false,
        },
      });
    }

    if (!post || post.deletedAt) {
      throw new NotFoundException('게시글이 존재하지 않습니다.');
    }

    return {
      id: post.id,
      title: post.title,
      contentHtml: post.content.replace(/\n/g, '<br/>'),
      createdAt: post.createdAt,

      readCount: post.readCount ?? 0,
      likeCount: post.likeCount ?? 0,
      bookmarkCount: post.bookmarkCount ?? 0,
      commentCount: post.commentCount ?? 0,

      isLiked: memberId ? (post.likes?.length ?? 0) > 0 : false,
      isBookmarked: memberId ? (post.bookmarks?.length ?? 0) > 0 : false,

      author: {
        id: post.member.id,
        nickname: post.member.memberNickname,
        profileImage: post.member.memberProfile,
      },

      region: [
        post.memberLocation?.MemberLocationSi,
        post.memberLocation?.MemberLocationGu,
        post.memberLocation?.MemberLocationDong,
      ]
        .filter(Boolean)
        .join(' '),

      images: post.images.map((img) => img.fileName),
    };
  }

  // 3. 게시글 좋아요
  async toggleLike(postId: number, memberId: number) {
    const existing = await this.prisma.communityPostLike.findUnique({
      where: {
        communityPostId_memberId: {
          communityPostId: postId,
          memberId,
        },
      },
    });

    // 이미 좋아요 누른 경우 → 좋아요 취소
    if (existing) {
      await this.prisma.$transaction([
        this.prisma.communityPostLike.delete({
          where: {
            communityPostId_memberId: {
              communityPostId: postId,
              memberId,
            },
          },
        }),
        this.prisma.communityPost.update({
          where: { id: postId },
          data: {
            likeCount: { decrement: 1 },
          },
        }),
      ]);

      return { isLiked: false };
    }

    // 좋아요 추가
    await this.prisma.$transaction([
      this.prisma.communityPostLike.create({
        data: {
          communityPostId: postId,
          memberId,
        },
      }),
      this.prisma.communityPost.update({
        where: { id: postId },
        data: {
          likeCount: { increment: 1 },
        },
      }),
    ]);

    return { isLiked: true };
  }

  // 4. 게시글 북마크
  async toggleBookmark(postId: number, memberId: number) {
    const existing = await this.prisma.communityPostBookmark.findUnique({
      where: {
        communityPostId_memberId: {
          communityPostId: postId,
          memberId,
        },
      },
    });

    // 이미 북마크 누른 경우 → 북마크 취소
    if (existing) {
      await this.prisma.$transaction([
        this.prisma.communityPostBookmark.delete({
          where: {
            communityPostId_memberId: {
              communityPostId: postId,
              memberId,
            },
          },
        }),
        this.prisma.communityPost.update({
          where: { id: postId },
          data: {
            bookmarkCount: { decrement: 1 },
          },
        }),
      ]);

      return { isBookmarked: false };
    }

    // 북마크 추가
    await this.prisma.$transaction([
      this.prisma.communityPostBookmark.create({
        data: {
          communityPostId: postId,
          memberId,
        },
      }),
      this.prisma.communityPost.update({
        where: { id: postId },
        data: {
          bookmarkCount: { increment: 1 },
        },
      }),
    ]);

    return { isBookmarked: true };
  }

  // 5. 댓글 작성
  async createComment(postId: number, memberId: number, content: string) {
    const comment = await this.prisma.communityComment.create({
      data: {
        communityPostId: postId,
        memberId,
        content,
        likeCount: 0,
      },
      include: {
        member: {
          select: {
            id: true,
            memberNickname: true,
            memberProfile: true,
          },
        },
      },
    });

    // 댓글 count 증가
    await this.prisma.communityPost.update({
      where: { id: postId },
      data: { commentCount: { increment: 1 } },
    });

    return {
      id: comment.id,
      content: comment.content,
      createdAt: comment.createdAt,

      author: {
        id: comment.member.id,
        nickname: comment.member.memberNickname,
        profileImage: comment.member.memberProfile,
      },
    };
  }

  // 6. 댓글 조회
  async getComments(postId: number, memberId?: number) {
    const where = {
      communityPostId: postId,
      deletedAt: null,
    };

    const comments = await this.prisma.communityComment.findMany({
      where,
      orderBy: {
        createdAt: 'asc',
      },
      include: {
        member: {
          select: {
            id: true,
            memberNickname: true,
            memberProfile: true,
          },
        },
        likes: memberId
          ? { where: { memberId }, select: { id: true } }
          : undefined,
        replies: {
          where: {
            deletedAt: null,
          },
          orderBy: {
            createdAt: 'asc',
          },
          include: {
            member: {
              select: {
                id: true,
                memberNickname: true,
                memberProfile: true,
              },
            },
            likes: memberId
              ? { where: { memberId }, select: { id: true } }
              : undefined,
          },
        },
      },
    });

    return comments.map((comment) => ({
      id: comment.id,
      content: comment.content,
      createdAt: comment.createdAt,
      likeCount: comment.likeCount ?? 0,

      author: {
        id: comment.member.id,
        nickname: comment.member.memberNickname,
        profileImage: comment.member.memberProfile,
      },

      isLiked: comment.likes?.length > 0,

      replies: comment.replies.map((reply) => ({
        id: reply.id,
        content: reply.content,
        createdAt: reply.createdAt,
        likeCount: reply.likeCount ?? 0,

        author: {
          id: reply.member.id,
          nickname: reply.member.memberNickname,
          profileImage: reply.member.memberProfile,
        },

        isLiked: (reply.likes?.length ?? 0) > 0,
      })),
    }));
  }

  // 7. 댓글 좋아요
  async toggleCommentLike(commentId: number, memberId: number) {
    const existing = await this.prisma.communityCommentLike.findUnique({
      where: {
        communityCommentId_memberId: {
          communityCommentId: commentId,
          memberId,
        },
      },
    });

    // 이미 좋아요 누른 경우 → 좋아요 취소
    if (existing) {
      await this.prisma.$transaction([
        this.prisma.communityCommentLike.delete({
          where: {
            communityCommentId_memberId: {
              communityCommentId: commentId,
              memberId,
            },
          },
        }),
        this.prisma.communityComment.update({
          where: { id: commentId },
          data: {
            likeCount: { decrement: 1 },
          },
        }),
      ]);

      return { isLiked: false };
    }

    // 좋아요 추가
    await this.prisma.$transaction([
      this.prisma.communityCommentLike.create({
        data: {
          communityCommentId: commentId,
          memberId,
        },
      }),
      this.prisma.communityComment.update({
        where: { id: commentId },
        data: {
          likeCount: { increment: 1 },
        },
      }),
    ]);

    return { isLiked: true };
  }

  // 8. 답글 작성
  async createReply(commentId: number, memberId: number, content: string) {
    const reply = await this.prisma.communityCommentReply.create({
      data: {
        communityCommentId: commentId,
        memberId,
        content,
        likeCount: 0,
      },
      include: {
        member: {
          select: {
            id: true,
            memberNickname: true,
            memberProfile: true,
          },
        },
      },
    });

    // 댓글의 replyCount 증가
    await this.prisma.communityComment.update({
      where: { id: commentId },
      data: {
        replyCount: { increment: 1 },
      },
    });

    return {
      id: reply.id,
      content: reply.content,
      createdAt: reply.createdAt,

      author: {
        id: reply.member.id,
        nickname: reply.member.memberNickname,
        profileImage: reply.member.memberProfile,
      },
    };
  }

  // 9. 답글 좋아요
  async toggleReplyLike(replyId: number, memberId: number) {
    const existing = await this.prisma.communityCommentReplyLike.findUnique({
      where: {
        communityCommentReplyId_memberId: {
          communityCommentReplyId: replyId,
          memberId,
        },
      },
    });

    // 이미 좋아요 누른 경우 → 좋아요 취소
    if (existing) {
      const [, updatedReply] = await this.prisma.$transaction([
        this.prisma.communityCommentReplyLike.delete({
          where: {
            communityCommentReplyId_memberId: {
              communityCommentReplyId: replyId,
              memberId,
            },
          },
        }),
        this.prisma.communityCommentReply.update({
          where: { id: replyId },
          data: {
            likeCount: { decrement: 1 },
          },
        }),
      ]);

      return {
        isLiked: false,
        likeCount: updatedReply.likeCount,
      };
    }

    // 좋아요 추가
    const [, updatedReply] = await this.prisma.$transaction([
      this.prisma.communityCommentReplyLike.create({
        data: {
          communityCommentReplyId: replyId,
          memberId,
        },
      }),
      this.prisma.communityCommentReply.update({
        where: { id: replyId },
        data: {
          likeCount: { increment: 1 },
        },
      }),
    ]);

    return {
      isLiked: true,
      likeCount: updatedReply.likeCount,
    };
  }

  // 10. 게시글 신고
  async reportPost(postId: number, memberId: number, reason: ReportReason) {
    await this.validateDuplicateReport({
      reporterMemberId: memberId,
      communityPostId: postId,
    });

    return this.prisma.report.create({
      data: {
        reporterMemberId: memberId,
        communityPostId: postId,
        reason,
      },
    });
  }

  // 11. 댓글 신고
  async reportComment(
    commentId: number,
    memberId: number,
    reason: ReportReason,
  ) {
    await this.validateDuplicateReport({
      reporterMemberId: memberId,
      communityCommentId: commentId,
    });

    return this.prisma.report.create({
      data: {
        reporterMemberId: memberId,
        communityCommentId: commentId,
        reason,
      },
    });
  }

  // 12. 답글 신고
  async reportReply(replyId: number, memberId: number, reason: ReportReason) {
    await this.validateDuplicateReport({
      reporterMemberId: memberId,
      communityCommentReplyId: replyId,
    });

    return this.prisma.report.create({
      data: {
        reporterMemberId: memberId,
        communityCommentReplyId: replyId,
        reason,
      },
    });
  }
}
