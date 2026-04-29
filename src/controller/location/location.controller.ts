import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  Param,
  ParseIntPipe,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import { ApiOperation } from '@nestjs/swagger';
import { ApiResponse } from 'src/common/dto/api-response.dto';
import {
  FavoriteLocationCreateDTO,
  LocationCreateDTO,
} from 'src/domain/location/dto/location.dto';
import { JwtAuthGuard } from 'src/module/auth/guard/jwt-auth.guard';
import { LocationService } from 'src/service/location/location.service';
import type { AuthRequest } from 'src/type/auth.type';

@Controller('location')
@UseGuards(JwtAuthGuard)
export class LocationController {
  constructor(private readonly locationService: LocationService) {}

  // 최근 본 지역 추가
  @ApiOperation({ summary: '최근 본 지역 추가' })
  @Post('recent')
  @HttpCode(201)
  async addRecent(
    @Req() req: AuthRequest,
    @Body() dto: LocationCreateDTO,
  ) {
    const memberId = req.user.id;
    const region = await this.locationService.addRecent(memberId, dto);
    return new ApiResponse('최근 본 지역에 추가되었습니다.', region);
  }

  // 최근 본 지역 목록 조회
  @ApiOperation({ summary: '내 최근 본 지역 목록 (최신 5개)' })
  @Get('recent')
  async getRecent(@Req() req: AuthRequest) {
    const memberId = req.user.id;
    const list = await this.locationService.getRecent(memberId);
    return new ApiResponse('최근 본 지역 목록 조회 성공', list);
  }

  // 즐겨찾기 지역 추가
  @ApiOperation({ summary: '즐겨찾기 지역 추가' })
  @Post('favorite')
  @HttpCode(201)
  async addFavorite(
    @Req() req: AuthRequest,
    @Body() dto: FavoriteLocationCreateDTO,
  ) {
    const memberId = req.user.id;
    const favorite = await this.locationService.addFavorite(memberId, dto);
    return new ApiResponse('즐겨찾기 지역에 추가되었습니다.', favorite);
  }

  // 즐겨찾기 지역 목록 조회
  @ApiOperation({ summary: '내 즐겨찾기 지역 목록' })
  @Get('favorite')
  async getFavorites(@Req() req: AuthRequest) {
    const memberId = req.user.id;
    const list = await this.locationService.getFavorites(memberId);
    return new ApiResponse('즐겨찾기 지역 목록 조회 성공', list);
  }

  // 즐겨찾기 삭제
  @ApiOperation({ summary: '즐겨찾기 지역 삭제' })
  @Delete('favorite/:id')
  @HttpCode(200)
  async removeFavorite(
    @Req() req: AuthRequest,
    @Param('id', ParseIntPipe) id: number,
  ) {
    const memberId = req.user.id;
    await this.locationService.removeFavorite(memberId, id);
    return new ApiResponse('즐겨찾기 지역이 삭제되었습니다.');
  }
}
