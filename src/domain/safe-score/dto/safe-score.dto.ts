import { ApiProperty } from '@nestjs/swagger';

// 안전점수 계산 요청 DTO
export class SafeScoreRequestDTO {
  @ApiProperty({ example: '서울특별시 강남구 테헤란로 11길 50' })
  address: string;

  @ApiProperty({ example: 37.4979 })
  latitude: number;

  @ApiProperty({ example: 127.0276 })
  longitude: number;
}

// 안전점수 응답 DTO (Phase 2 더미 + Phase 3 실제 모두 동일 구조)
export class SafeScoreResponseDTO {
  @ApiProperty({ example: 80, description: '종합 점수 (0~100)' })
  score: number;

  @ApiProperty({ example: '비교적 안전한 지역입니다.' })
  safetyMessage: string;

  @ApiProperty({ example: 25, description: '상위 백분위 (낮을수록 안전)' })
  rankingPercentile: number;

  @ApiProperty({ example: 85 }) cctvScore: number;
  @ApiProperty({ example: 70 }) policeScore: number;
  @ApiProperty({ example: 75 }) streetlightScore: number;
  @ApiProperty({ example: 90 }) crimeProneScore: number;

  @ApiProperty({ example: 12 }) cctvCount: number;
  @ApiProperty({ example: 3 }) policeCount: number;
  @ApiProperty({ example: 30 }) streetlightCount: number;
  @ApiProperty({ example: 1 }) crimeProneCount: number;

  @ApiProperty({ example: '서울특별시 강남구 테헤란로 11길 50' })
  address: string;
}
