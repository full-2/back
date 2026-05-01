import { Controller, Get, Param, Post, Query, Req } from '@nestjs/common';
import { ProvideService } from '../../service/provide/provide.service';
import { GetProvidePostsDto } from '../../common/dto/provide/get-provide-posts.dto';

@Controller('provide')
export class ProvideController {
  constructor(private readonly provideService: ProvideService) {}

  // 1. 목록 조회
  @Get('/posts')
  getProvidePosts(@Query() query: GetProvidePostsDto) {
    return this.provideService.getProvidePosts(query);
  }

  // 2. 상세 조회
  @Get(':id')
  getDetail(@Param('id') id: string, @Req() req) {
    const ip = req.ip;
    return this.provideService.getProvidePostDetail(Number(id), req.user?.id, ip);
  }

  // 3. 좋아요
  @Post(':id/like')
  toggleLike(@Param('id') id: string, @Req() req) {
    // 테스트용 (로그인 없이 테스트)
    const memberId = 1;
    return this.provideService.toggleLike(Number(id), memberId);
    // 배포용 (로그인 적용 후 사용)
    /*
    return this.provideService.toggleLike(
      Number(id),
      req.user.id,
    );
    */
  }

  // 4. 북마크
  @Post(':id/bookmark')
  toggleBookmark(@Param('id') id: string, @Req() req) {
    // 테스트용 (로그인 없이 테스트)
    const memberId = 1;
    return this.provideService.toggleBookmark(Number(id), memberId);
    // 배포용 (로그인 적용 후 사용)
    /*
    return this.provideService.toggleBookmark(
      Number(id),
      req.user.id,
    );
    */
  }
}
