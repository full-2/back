import { ApiProperty } from '@nestjs/swagger';

// 지역 저장 요청 DTO (최근 본 지역 / 즐겨찾기 둘 다 동일한 구조)
export class LocationCreateDTO {
  @ApiProperty({ example: '서울특별시 강남구 테헤란로 11길 50' })
  address: string;

  @ApiProperty({ example: 37.4979, description: '위도' })
  latitude: number;

  @ApiProperty({ example: 127.0276, description: '경도' })
  longitude: number;
}

// 즐겨찾기 지역에 시/구/동을 따로 저장하고 싶을 때 사용
export class FavoriteLocationCreateDTO extends LocationCreateDTO {
  @ApiProperty({ example: '서울특별시', required: false })
  si?: string;

  @ApiProperty({ example: '강남구', required: false })
  gu?: string;

  @ApiProperty({ example: '역삼동', required: false })
  dong?: string;
}
