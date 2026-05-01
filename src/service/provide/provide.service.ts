import { Injectable, NotFoundException } from '@nestjs/common';
import { GetProvidePostsDto } from '../../common/dto/provide/get-provide-posts.dto';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class ProvideService {
  constructor(private readonly prisma: PrismaService) {}
  private viewCache = new Map<string, number>();

  // 1. 목록 조회
  async getProvidePosts(query: GetProvidePostsDto) {
    const page = Number(query.page) || 1;
    const pageSize = Number(query.pageSize) || 16;
    const skip = (page - 1) * pageSize;

    const categoryMap = {
      LIFE_INFO: '생활정보',
      GOVERNMENT_SUPPORT: '정부 지원 사업',
      HOUSING_CONTRACT: '주거·계약',
      SAFETY: '안전·치안',
      OTHER: '기타',
    };

    const where: any = {
      deletedAt: null,
    };

    if (query.region) {
      where.region = {
        contains: query.region,
      };
    }

    const DEFAULT_THUMBNAIL = '/assets/images/provide-default.png';

    // category 필터
    if (query.category) {
      where.category = {
        in: query.category.split(','),
      };
    }

    // 검색
    if (query.keyword) {
      where.OR = [
        { title: { contains: query.keyword } },
        { content: { contains: query.keyword } },
      ];
    }

    // 정렬
    let orderBy: any = { createdAt: 'desc' };

    if (query.sort === 'like') {
      orderBy = { likeCount: 'desc' };
    } else if (query.sort === 'bookmark') {
      orderBy = { bookmarkCount: 'desc' };
    }

    const [posts, totalCount] = await Promise.all([
      this.prisma.providePost.findMany({
        where,
        orderBy,
        skip,
        take: pageSize,
        select: {
          id: true,
          category: true,
          title: true,
          createdAt: true,

          images: {
            where: {
              isThumbnail: true,
            },
            select: {
              fileName: true,
            },
            take: 1,
          },
        },
      }),
      this.prisma.providePost.count({ where }),
    ]);

    const transformedPosts = posts.map((post) => {
      const thumbnail = post.images?.[0]?.fileName;

      return {
        id: post.id,
        title: post.title,
        category: categoryMap[post.category],
        createdAt: post.createdAt,

        thumbnailUrl: thumbnail ? `/uploads/${thumbnail}` : DEFAULT_THUMBNAIL,
      };
    });

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

  // 2. 상세 조회
  async getProvidePostDetail(postId: number, memberId?: number, ip?: string) {
    const categoryMap = {
      LIFE_INFO: '생활정보',
      GOVERNMENT_SUPPORT: '정부 지원 사업',
      HOUSING_CONTRACT: '주거·계약',
      SAFETY: '안전·치안',
      OTHER: '기타',
    };

    // 조회수 계속 증가 제한 (Map)
    const key = `${postId}_${ip}`;
    const now = Date.now();
    const VIEW_LIMIT_TIME = 1000 * 60 * 10; // 10분

    const lastViewed = this.viewCache.get(key);
    const shouldIncrease = !lastViewed || now - lastViewed > VIEW_LIMIT_TIME;

    let post;

    if (shouldIncrease) {
      // 캐시 저장
      this.viewCache.set(key, now);

      // 조회수 증가 + 데이터 조회
      post = await this.prisma.providePost.update({
        where: { id: postId },
        data: {
          readCount: { increment: 1 },
        },
        include: {
          member: {
            select: {
              id: true,
              memberNickname: true,
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
      // 조회수 증가 없이 조회만
      post = await this.prisma.providePost.findUnique({
        where: { id: postId },
        include: {
          member: {
            select: {
              id: true,
              memberNickname: true,
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
      category: categoryMap[post.category],
      createdAt: post.createdAt ?? new Date(),

      readCount: post.readCount ?? 0,

      likeCount: post.likeCount ?? 0,
      bookmarkCount: post.bookmarkCount ?? 0,

      images: post.images
        .map((img) => img.fileName)
        .filter((url): url is string => !!url),

      isLiked: memberId ? (post.likes?.length ?? 0) > 0 : false,
      isBookmarked: memberId ? (post.bookmarks?.length ?? 0) > 0 : false,

      author: {
        id: post.member.id,
        nickname: post.member.memberNickname,
      },
    };
  }

  // 3. 좋아요
  async toggleLike(postId: number, memberId: number) {
    const existing = await this.prisma.providePostLike.findUnique({
      where: {
        providePostId_memberId: {
          providePostId: postId,
          memberId,
        },
      },
    });

    // 이미 좋아요 누른 경우 → 좋아요 취소
    if (existing) {
      await this.prisma.$transaction([
        this.prisma.providePostLike.delete({
          where: {
            providePostId_memberId: {
              providePostId: postId,
              memberId,
            },
          },
        }),
        this.prisma.providePost.update({
          where: { id: postId },
          data: {
            likeCount: { decrement: 1 },
          },
        }),
      ]);

      return {
        isLiked: false,
      };
    }

    // 좋아요 추가
    await this.prisma.$transaction([
      this.prisma.providePostLike.create({
        data: {
          providePostId: postId,
          memberId,
        },
      }),
      this.prisma.providePost.update({
        where: { id: postId },
        data: {
          likeCount: { increment: 1 },
        },
      }),
    ]);

    return {
      isLiked: true,
    };
  }

  // 4. 북마크
  async toggleBookmark(postId: number, memberId: number) {
    const existing = await this.prisma.providePostBookmark.findUnique({
      where: {
        providePostId_memberId: {
          providePostId: postId,
          memberId,
        },
      },
    });

    // 이미 북마크 있는 경우 → 북마크 취소
    if (existing) {
      await this.prisma.$transaction([
        this.prisma.providePostBookmark.delete({
          where: {
            providePostId_memberId: {
              providePostId: postId,
              memberId,
            },
          },
        }),
        this.prisma.providePost.update({
          where: { id: postId },
          data: {
            bookmarkCount: { decrement: 1 },
          },
        }),
      ]);

      return {
        isBookmarked: false,
      };
    }

    // 북마크 추가
    await this.prisma.$transaction([
      this.prisma.providePostBookmark.create({
        data: {
          providePostId: postId,
          memberId,
        },
      }),
      this.prisma.providePost.update({
        where: { id: postId },
        data: {
          bookmarkCount: { increment: 1 },
        },
      }),
    ]);

    return {
      isBookmarked: true,
    };
  }
}
