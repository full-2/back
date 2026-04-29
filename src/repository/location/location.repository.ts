import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import {
  FavoriteLocationCreateDTO,
  LocationCreateDTO,
} from 'src/domain/location/dto/location.dto';
import { PrismaService } from 'src/service/prisma/prisma.service';

@Injectable()
export class LocationRepository {
  constructor(private readonly prisma: PrismaService) {}

  // ========================
  // 최근 본 지역 (MemberRecentRegion)
  // ========================

  // 최근 본 지역 추가
  async createRecent(memberId: number, dto: LocationCreateDTO) {
    return this.prisma.memberRecentRegion.create({
      data: {
        memberId,
        address: dto.address,
        latitude: new Prisma.Decimal(dto.latitude),
        longitude: new Prisma.Decimal(dto.longitude),
      },
    });
  }

  // 같은 회원이 같은 주소를 또 보면 새로 만들지 말고 viewedAt만 갱신하도록 처리
  async upsertRecent(memberId: number, dto: LocationCreateDTO) {
    const existing = await this.prisma.memberRecentRegion.findFirst({
      where: { memberId, address: dto.address },
    });

    if (existing) {
      return this.prisma.memberRecentRegion.update({
        where: { id: existing.id },
        data: {
          viewedAt: new Date(),
          latitude: new Prisma.Decimal(dto.latitude),
          longitude: new Prisma.Decimal(dto.longitude),
        },
      });
    }
    return this.createRecent(memberId, dto);
  }

  // 내 최근 본 지역 (최신순, 기본 5개)
  async findRecentByMember(memberId: number, take = 5) {
    return this.prisma.memberRecentRegion.findMany({
      where: { memberId },
      orderBy: { viewedAt: 'desc' },
      take,
    });
  }

  // ========================
  // 즐겨찾기 지역 (MemberLocation)
  // ========================

  // 즐겨찾기 지역 추가
  async createFavorite(memberId: number, dto: FavoriteLocationCreateDTO) {
    return this.prisma.memberLocation.create({
      data: {
        memberId,
        MemberLocationSi: dto.si ?? null,
        MemberLocationGu: dto.gu ?? null,
        MemberLocationDong: dto.dong ?? null,
        MemberLocationLatitude: new Prisma.Decimal(dto.latitude),
        MemberLocationLongitude: new Prisma.Decimal(dto.longitude),
      },
    });
  }

  // 내 즐겨찾기 지역 목록
  async findFavoritesByMember(memberId: number) {
    return this.prisma.memberLocation.findMany({
      where: { memberId },
      orderBy: { createdAt: 'desc' },
    });
  }

  // 즐겨찾기 단건 조회 (소유자 검증용)
  async findFavoriteById(id: number) {
    return this.prisma.memberLocation.findUnique({ where: { id } });
  }

  // 즐겨찾기 삭제
  async deleteFavorite(id: number) {
    return this.prisma.memberLocation.delete({ where: { id } });
  }
}
