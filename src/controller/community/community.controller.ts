import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Query,
  Req,
  UnauthorizedException,
} from '@nestjs/common';
import { ApiBody } from '@nestjs/swagger';
import { CommunityService } from 'src/service/community/community.service';
import { CreateCommentDto } from 'src/common/dto/community/create-comment.dto';
import { CreateReplyDto } from 'src/common/dto/community/create-reply.dto';
import { ReportDto } from 'src/common/dto/community/report.dto';

@Controller('community')
export class CommunityController {
  constructor(private readonly communityService: CommunityService) {}

  // 로그인 체크 (비로그인 시 커뮤니티 비활성화)
  private getMemberId(req): number {
    // 테스트용 (로그인 없이 테스트)
    const memberId = 1;
    return memberId;
    // 실제 배포용 (로그인 적용 후 사용)
    /*
    if (!req.user) {
      throw new UnauthorizedException('로그인이 필요합니다.');
    }
    return req.user.id;
    */
  }

  // 1. 목록 조회
@Get('/posts')
getCommunityPosts(@Query() query, @Req() req) {
  const memberId = this.getMemberId(req);

  return this.communityService.getCommunityPosts(query, memberId);
}

  // 2. 상세 조회
  @Get(':id')
  getDetail(@Param('id') id: string, @Req() req) {
    const memberId = this.getMemberId(req);
    const ip = req.ip;

    return this.communityService.getCommunityPostDetail(
      Number(id),
      memberId,
      ip,
    );
  }

  // 3. 게시글 좋아요
  @Post(':id/like')
  toggleLike(@Param('id') id: string, @Req() req) {
    const memberId = this.getMemberId(req);

    return this.communityService.toggleLike(Number(id), memberId);
  }

  // 4. 게시글 북마크
  @Post(':id/bookmark')
  toggleBookmark(@Param('id') id: string, @Req() req) {
    const memberId = this.getMemberId(req);

    return this.communityService.toggleBookmark(Number(id), memberId);
  }

  // 5. 댓글 작성
  @Post(':id/comments')
  createComment(
    @Param('id') id: string,
    @Body() body: CreateCommentDto,
    @Req() req,
  ) {
    const memberId = this.getMemberId(req);

    return this.communityService.createComment(
      Number(id),
      memberId,
      body.content,
    );
  }

  // 6. 댓글 조회
  @Get(':id/comments')
  getComments(@Param('id') id: string, @Req() req) {
    const memberId = this.getMemberId(req);
    return this.communityService.getComments(Number(id), memberId);
  }

  // 7. 댓글 좋아요
  @Post('comments/:commentId/like')
  toggleCommentLike(@Param('commentId') commentId: string, @Req() req) {
    const memberId = this.getMemberId(req);

    return this.communityService.toggleCommentLike(Number(commentId), memberId);
  }

  // 8. 답글 작성
  @Post('comments/:commentId/replies')
  createReply(
    @Param('commentId') commentId: string,
    @Body() body: CreateReplyDto,
    @Req() req,
  ) {
    const memberId = this.getMemberId(req);

    return this.communityService.createReply(
      Number(commentId),
      memberId,
      body.content,
    );
  }

  // 9. 답글 좋아요
  @Post('replies/:replyId/like')
  toggleReplyLike(@Param('replyId') replyId: string, @Req() req) {
    const memberId = this.getMemberId(req);

    return this.communityService.toggleReplyLike(Number(replyId), memberId);
  }

  // 10. 게시글 신고
  @Post(':id/report')
  @ApiBody({ type: ReportDto })
  reportPost(@Param('id') id: string, @Body() body: ReportDto, @Req() req) {
    const memberId = this.getMemberId(req);

    return this.communityService.reportPost(Number(id), memberId, body.reason);
  }

  // 11. 댓글 신고
  @Post('comments/:commentId/report')
  @ApiBody({ type: ReportDto })
  reportComment(
    @Param('commentId') commentId: string,
    @Body() body: ReportDto,
    @Req() req,
  ) {
    const memberId = this.getMemberId(req);

    return this.communityService.reportComment(
      Number(commentId),
      memberId,
      body.reason,
    );
  }

  // 12. 답글 신고
  @Post('replies/:replyId/report')
  @ApiBody({ type: ReportDto })
  reportReply(
    @Param('replyId') replyId: string,
    @Body() body: ReportDto,
    @Req() req,
  ) {
    const memberId = this.getMemberId(req);

    return this.communityService.reportReply(
      Number(replyId),
      memberId,
      body.reason,
    );
  }
}
