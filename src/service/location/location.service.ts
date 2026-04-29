import { ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import {
  FavoriteLocationCreateDTO,
  LocationCreateDTO,
} from 'src/domain/location/dto/location.dto';
import { LocationRepository } from 'src/repository/location/location.repository';

@Injectable()
export class LocationService {
  constructor(private readonly locationRepository: LocationRepository) {}

  // 최근 본 지역 추가 (이미 있으면 viewedAt 갱신)
  async addRecent(memberId: number, dto: LocationCreateDTO) {
    return this.locationRepository.upsertRecent(memberId, dto);
  }

  // 내 최근 본 지역 목록
  async getRecent(memberId: number) {
    return this.locationRepository.findRecentByMember(memberId);
  }

  // 즐겨찾기 지역 추가
  async addFavorite(memberId: number, dto: FavoriteLocationCreateDTO) {
    return this.locationRepository.createFavorite(memberId, dto);
  }

  // 내 즐겨찾기 지역 목록
  async getFavorites(memberId: number) {
    return this.locationRepository.findFavoritesByMember(memberId);
  }

  // 즐겨찾기 삭제 (본인 소유인지 검증)
  async removeFavorite(memberId: number, id: number) {
    const favorite = await this.locationRepository.findFavoriteById(id);
    if (!favorite) throw new NotFoundException('해당 지역을 찾을 수 없습니다.');
    if (favorite.memberId !== memberId) {
      throw new ForbiddenException('본인의 지역만 삭제할 수 있습니다.');
    }
    await this.locationRepository.deleteFavorite(id);
  }
}
