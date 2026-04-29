import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

// 좌표 한 점
export interface GeoPoint {
  latitude: number;
  longitude: number;
}

// 시설 개수 결과
export interface FacilityCounts {
  cctvCount: number;
  policeCount: number;
  streetlightCount: number;
  crimeProneCount: number;
}

@Injectable()
export class PublicDataService {
  private readonly logger = new Logger(PublicDataService.name);

  // 출처별 API 키 (환경변수에서 로드)
  private readonly publicDataKey: string; // CCTV (공공데이터포털)
  private readonly safemapKey: string; // 생활안전정보 (생활안전지도)
  private readonly dspfKey: string; // 경찰/가로등 (재난안전공유플랫폼)

  // 검색 반경 (단위: m)
  private readonly RADIUS_METERS = 500;

  constructor(private readonly configService: ConfigService) {
    this.publicDataKey =
      this.configService.get<string>('PUBLIC_DATA_KEY') ?? '';
    this.safemapKey = this.configService.get<string>('SAFEMAP_API_KEY') ?? '';
    this.dspfKey = this.configService.get<string>('DSPF_API_KEY') ?? '';
  }

  // ==========================================================
  // 공통 유틸
  // ==========================================================

  // 두 좌표 사이 거리(m) - Haversine 공식
  private haversine(a: GeoPoint, b: GeoPoint): number {
    const R = 6371000;
    const toRad = (deg: number) => (deg * Math.PI) / 180;
    const dLat = toRad(b.latitude - a.latitude);
    const dLng = toRad(b.longitude - a.longitude);
    const lat1 = toRad(a.latitude);
    const lat2 = toRad(b.latitude);
    const h =
      Math.sin(dLat / 2) ** 2 +
      Math.cos(lat1) * Math.cos(lat2) * Math.sin(dLng / 2) ** 2;
    return 2 * R * Math.asin(Math.sqrt(h));
  }

  // items 배열에서 반경 내 항목들의 좌표 배열만 추출
  private filterWithinRadius(
    items: any[],
    center: GeoPoint,
    latField: string,
    lngField: string,
  ): GeoPoint[] {
    const result: GeoPoint[] = [];
    for (const item of items) {
      const lat = parseFloat(item?.[latField]);
      const lng = parseFloat(item?.[lngField]);
      if (Number.isNaN(lat) || Number.isNaN(lng)) continue;
      const distance = this.haversine(center, {
        latitude: lat,
        longitude: lng,
      });
      if (distance <= this.RADIUS_METERS) {
        result.push({ latitude: lat, longitude: lng });
      }
    }
    return result;
  }

  // fetch 호출 + 에러는 빈 배열로 감싸기
  private async safeFetchJson(url: string): Promise<any | null> {
    try {
      const res = await fetch(url);
      if (!res.ok) {
        this.logger.warn(`API 응답 실패 (${res.status}): ${url}`);
        return null;
      }
      return await res.json();
    } catch (err) {
      this.logger.warn(`API 호출 실패: ${(err as Error).message}`);
      return null;
    }
  }

  // ==========================================================
  // 1) CCTV - 공공데이터포털 (전국CCTV표준데이터)
  //    - 키: PUBLIC_DATA_KEY
  //    - 데이터셋이 표준데이터셋(JSON+CSV)으로 제공되는 경우 odcloud API 사용 가능
  //    - 마이페이지 > 신청한 API 상세 화면에서 정확한 URL 확인 필요
  //
  //    예) https://api.odcloud.kr/api/15013094/v1/uddi:xxxxxxxx?
  //         page=1&perPage=1000&serviceKey=...
  //
  //    응답 구조 예: { data: [ { 위도, 경도, ... } ], currentCount, ... }
  //    좌표 필드명은 데이터셋마다 다름 (위도/경도, lat/lon, WGS84위도/WGS84경도)
  // ==========================================================
  // CCTV 좌표 목록 (반경 내). 실제 API + 폴백.
  async listCctvPoints(center: GeoPoint): Promise<GeoPoint[]> {
    if (!this.publicDataKey) {
      return this.generateDummyPoints(center, 12);
    }

    // TODO: 마이페이지에서 발급받은 정확한 URL로 교체!
    const url =
      `https://api.odcloud.kr/api/15013094/v1/uddi:35e1bbcf-91fd-43e2-9059-657a76f48b3b` +
      `?page=1&perPage=1000` +
      `&serviceKey=${encodeURIComponent(this.publicDataKey)}`;

    const data = await this.safeFetchJson(url);
    if (!data) return this.generateDummyPoints(center, 12);

    const items: any[] = data?.data || data?.response?.body?.items || [];
    const latField = items[0]?.['위도'] !== undefined ? '위도' : 'WGS84위도';
    const lngField = items[0]?.['경도'] !== undefined ? '경도' : 'WGS84경도';

    const points = this.filterWithinRadius(items, center, latField, lngField);
    return points.length > 0 ? points : this.generateDummyPoints(center, 12);
  }

  private async countCctv(center: GeoPoint): Promise<number> {
    const points = await this.listCctvPoints(center);
    return points.length;
  }

  // 좌표 주변에 더미 포인트 N개 생성 (반경 안에서 균등하게)
  private generateDummyPoints(center: GeoPoint, count: number): GeoPoint[] {
    const points: GeoPoint[] = [];
    // 1m 당 위도 변화량 (대략): 1 / 111000
    // 경도는 위도에 따라 다름: 1 / (111000 * cos(lat))
    const latPerMeter = 1 / 111000;
    const lngPerMeter = 1 / (111000 * Math.cos((center.latitude * Math.PI) / 180));

    for (let i = 0; i < count; i++) {
      const angle = (i * 137) % 360; // 황금각으로 펼침
      const distance = 100 + ((i * 43) % (this.RADIUS_METERS - 50));
      const dx = Math.cos((angle * Math.PI) / 180) * distance;
      const dy = Math.sin((angle * Math.PI) / 180) * distance;
      points.push({
        latitude: center.latitude + dy * latPerMeter,
        longitude: center.longitude + dx * lngPerMeter,
      });
    }
    return points;
  }

  // ==========================================================
  // 2) 경찰시설 - 재난안전공유플랫폼 (행정안전부_공통POI_경찰)
  //    - 키: DSPF_API_KEY (발급 대기 중이면 0 반환)
  //    - URL 형식 예: https://www.safetydata.go.kr/openapi/[서비스명]
  //                    ?serviceKey=...&dataType=JSON&...
  // ==========================================================
  private async countPolice(center: GeoPoint): Promise<number> {
    if (!this.dspfKey) return 0;

    // TODO: 발급 후 실제 service URL로 교체!
    const url =
      `https://www.safetydata.go.kr/V2/api/DSSP-IF-XXXX` +
      `?serviceKey=${encodeURIComponent(this.dspfKey)}` +
      `&numOfRows=1000&pageNo=1&returnType=json`;

    const data = await this.safeFetchJson(url);
    if (!data) return 0;

    const items: any[] =
      data?.body || data?.response?.body?.items?.item || data?.items || [];

    return this.filterWithinRadius(items, center, 'lat', 'lon').length;
  }

  // ==========================================================
  // 3) 가로등 - 재난안전공유플랫폼 (행정안전부_공통POI_가로등)
  // ==========================================================
  async listStreetlightPoints(center: GeoPoint): Promise<GeoPoint[]> {
    if (!this.dspfKey) {
      return this.generateDummyPoints(center, 30);
    }

    // TODO: 발급 후 실제 service URL로 교체!
    const url =
      `https://www.safetydata.go.kr/V2/api/DSSP-IF-YYYY` +
      `?serviceKey=${encodeURIComponent(this.dspfKey)}` +
      `&numOfRows=1000&pageNo=1&returnType=json`;

    const data = await this.safeFetchJson(url);
    if (!data) return this.generateDummyPoints(center, 30);

    const items: any[] =
      data?.body || data?.response?.body?.items?.item || data?.items || [];

    const points = this.filterWithinRadius(items, center, 'lat', 'lon');
    return points.length > 0 ? points : this.generateDummyPoints(center, 30);
  }

  private async countStreetlight(center: GeoPoint): Promise<number> {
    const points = await this.listStreetlightPoints(center);
    return points.length;
  }

  // ==========================================================
  // 4) 범죄주의구간 - 생활안전지도 (safemap.go.kr) 오픈API
  //    - 키: SAFEMAP_API_KEY
  //    - URL 형식 예: https://www.safemap.go.kr/openApi/api/[서비스명]
  //                    ?authKey=...&dataType=json
  //
  //    이 영역은 데이터셋 종류가 많아서(범죄주의구간/안전구역/여성안심구역 등)
  //    신청한 데이터셋의 endpoint 그대로 넣으면 됩니다.
  // ==========================================================
  private async countCrimeProne(center: GeoPoint): Promise<number> {
    if (!this.safemapKey) return 0;

    // TODO: 신청한 생활안전지도 OpenAPI URL로 교체!
    const url =
      `https://www.safemap.go.kr/openApi/api/getCriminalCase.do` +
      `?authKey=${encodeURIComponent(this.safemapKey)}` +
      `&dataType=json&numOfRows=1000&pageNo=1`;

    const data = await this.safeFetchJson(url);
    if (!data) return 0;

    const items: any[] =
      data?.response?.body?.items?.item || data?.body || data?.items || [];

    // 생활안전지도는 보통 컬럼명이 'lat', 'lon' 또는 'WGS84_LAT', 'WGS84_LON'
    const latField =
      items[0]?.['lat'] !== undefined ? 'lat' : 'WGS84_LAT';
    const lngField =
      items[0]?.['lon'] !== undefined ? 'lon' : 'WGS84_LON';

    return this.filterWithinRadius(items, center, latField, lngField).length;
  }

  // ==========================================================
  // 한 좌표에 대해 4개 항목을 동시에 조회
  // 각 호출이 0을 반환하면(키 없음/실패) SafeScoreService에서 더미로 폴백.
  // ==========================================================
  async countNearbyFacilities(center: GeoPoint): Promise<FacilityCounts> {
    const [cctvCount, policeCount, streetlightCount, crimeProneCount] =
      await Promise.all([
        this.countCctv(center),
        this.countPolice(center),
        this.countStreetlight(center),
        this.countCrimeProne(center),
      ]);

    this.logger.log(
      `[안전점수 시설 카운트] CCTV=${cctvCount}, 경찰=${policeCount}, ` +
        `가로등=${streetlightCount}, 범죄주의=${crimeProneCount}`,
    );

    return { cctvCount, policeCount, streetlightCount, crimeProneCount };
  }
}
