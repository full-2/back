import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/service/prisma/prisma.service';

// DB에 저장할 안전점수 데이터 (응답 DTO와 거의 같지만 memberId 포함)
export type SafeScoreSaveInput = {
  memberId: number;
  address: string;
  score: number;
  safetyMessage: string;
  rankingPercentile: number;
  cctvScore: number;
  policeScore: number;
  streetlightScore: number;
  crimeProneScore: number;
  cctvCount: number;
  policeCount: number;
  streetlightCount: number;
  crimeProneCount: number;
};

@Injectable()
export class SafeScoreRepository {
  constructor(private readonly prisma: PrismaService) {}

  // 안전점수 저장
  async create(data: SafeScoreSaveInput) {
    return this.prisma.safeScore.create({
      data: {
        memberId: data.memberId,
        address: data.address,
        score: data.score,
        safetyMessage: data.safetyMessage,
        rankingPercentile: data.rankingPercentile,
        cctvScore: data.cctvScore,
        policeScore: data.policeScore,
        streetlightScore: data.streetlightScore,
        crimeProneScore: data.crimeProneScore,
        cctvCount: data.cctvCount,
        policeCount: data.policeCount,
        streetlightCount: data.streetlightCount,
        crimeProneCount: data.crimeProneCount,
      },
    });
  }

  // 내가 최근에 조회한 안전점수 (최신순)
  async findRecentByMember(memberId: number, take = 10) {
    return this.prisma.safeScore.findMany({
      where: { memberId },
      orderBy: { createdAt: 'desc' },
      take,
    });
  }

  // 같은 주소를 다시 조회했을 때 새로 만들지 않고 갱신하고 싶으면 사용
  async upsertLatestByAddress(data: SafeScoreSaveInput) {
    const existing = await this.prisma.safeScore.findFirst({
      where: { memberId: data.memberId, address: data.address },
      orderBy: { createdAt: 'desc' },
    });
    if (existing) {
      return this.prisma.safeScore.update({
        where: { id: existing.id },
        data: {
          score: data.score,
          safetyMessage: data.safetyMessage,
          rankingPercentile: data.rankingPercentile,
          cctvScore: data.cctvScore,
          policeScore: data.policeScore,
          streetlightScore: data.streetlightScore,
          crimeProneScore: data.crimeProneScore,
          cctvCount: data.cctvCount,
          policeCount: data.policeCount,
          streetlightCount: data.streetlightCount,
          crimeProneCount: data.crimeProneCount,
        },
      });
    }
    return this.create(data);
  }
}
