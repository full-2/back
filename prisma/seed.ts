import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  // 테스트 유저
  const user1 = await prisma.member.create({
    data: {
      id: 1,
      memberEmail: 'user1@test.com',
      memberName: '유저1',
      memberNickname: '프로자취러',
    },
  });

  const user2 = await prisma.member.create({
    data: {
      memberEmail: 'user2@test.com',
      memberName: '유저2',
      memberNickname: '절약왕',
    },
  });

  const user3 = await prisma.member.create({
    data: {
      memberEmail: 'user3@test.com',
      memberName: '유저3',
      memberNickname: '생활고수',
    },
  });

  // 지역
  const location = await prisma.memberLocation.create({
    data: {
      memberId: user1.id,
      MemberLocationSi: '서울',
      MemberLocationGu: '강남구',
      MemberLocationDong: '역삼동',
    },
  });

  // 정보제공 게시글
  await prisma.providePost.createMany({
    data: [
      {
        memberId: 1,
        region: '서울 강남구 역삼동',
        category: 'LIFE_INFO',
        title: '2025 청년 자취정보 소식',
        content: '생활정보 게시글',
        readCount: 53,
        likeCount: 2,
        bookmarkCount: 2,
        thumbnailUrl: '/assets/images/provide-default.png',
      },
      {
        memberId: 1,
        region: '서울 강남구 역삼동',
        category: 'HOUSING_CONTRACT',
        title: '전입신고/확정일자 순서 정리(헷갈림 방지)',
        content: '주거·계약 게시글',
        readCount: 207,
        likeCount: 41,
        bookmarkCount: 30,
        thumbnailUrl: '/assets/images/provide-default.png',
      },
      {
        memberId: 1,
        region: '서울 강남구 역삼동',
        category: 'GOVERNMENT_SUPPORT',
        title: '청년 월세 지원: 신청 조건/서류/주의사항 한 번에',
        content: '정부 지원 사업 게시글',
        readCount: 103,
        likeCount: 33,
        bookmarkCount: 20,
        thumbnailUrl: '/assets/images/provide-default.png',
      },
      {
        memberId: 1,
        region: '서울 강남구 역삼동',
        category: 'SAFETY',
        title: '비상연락망 정리: 집주인/관리실/112/119 한 페이지로',
        content: '안전·치안 게시글',
        readCount: 79,
        likeCount: 16,
        bookmarkCount: 10,
        thumbnailUrl: '/assets/images/provide-default.png',
      },
      {
        memberId: 1,
        region: '서울 강남구 역삼동',
        category: 'LIFE_INFO',
        title: '자취 초보를 위한 생활비 절약 루틴 7가지',
        content: '생활정보 게시글',
        readCount: 62,
        likeCount: 14,
        bookmarkCount: 6,
        thumbnailUrl: '/assets/images/provide-default.png',
      },
      {
        memberId: 1,
        region: '서울 강남구 역삼동',
        category: 'OTHER',
        title: '자취생 추천 앱/사이트 모음(공과금·배달·중고거래)',
        content: '기타 게시글',
        readCount: 68,
        likeCount: 19,
        bookmarkCount: 8,
        thumbnailUrl: '/assets/images/provide-default.png',
      },
      {
        memberId: 1,
        region: '서울 강남구 역삼동',
        category: 'HOUSING_CONTRACT',
        title: '계약 전 체크리스트: 관리비·특약·하자 확인',
        content: '주거·계약 게시글',
        readCount: 49,
        likeCount: 12,
        bookmarkCount: 9,
        thumbnailUrl: '/assets/images/provide-default.png',
      },
      {
        memberId: 1,
        region: '서울 강남구 역삼동',
        category: 'GOVERNMENT_SUPPORT',
        title: '전세사기 예방 지원제도 모아보기',
        content: '정부 지원 사업 게시글',
        readCount: 55,
        likeCount: 18,
        bookmarkCount: 15,
        thumbnailUrl: '/assets/images/provide-default.png',
      },
      {
        memberId: 1,
        region: '서울 강남구 역삼동',
        category: 'GOVERNMENT_SUPPORT',
        title: '청년 정책 찾는 법: 내가 받을 수 있는 혜택 빠르게 검색',
        content: '정부 지원 사업 게시글',
        readCount: 33,
        likeCount: 7,
        bookmarkCount: 5,
        thumbnailUrl: '/assets/images/provide-default.png',
      },
      {
        memberId: 1,
        region: '서울 강남구 역삼동',
        category: 'SAFETY',
        title: '자취방 안전점검: 도어락·창문·소화기 체크',
        content: '안전·치안 게시글',
        readCount: 74,
        likeCount: 22,
        bookmarkCount: 13,
        thumbnailUrl: '/assets/images/provide-default.png',
      },
      {
        memberId: 1,
        region: '서울 강남구 역삼동',
        category: 'OTHER',
        title: '집들이 선물 리스트: 실용템 vs 감성템',
        content: '기타 게시글',
        readCount: 24,
        likeCount: 4,
        bookmarkCount: 3,
        thumbnailUrl: '/assets/images/provide-default.png',
      },
      {
        memberId: 1,
        region: '서울 강남구 역삼동',
        category: 'HOUSING_CONTRACT',
        title: '월세 vs 전세: 사회초년생에게 뭐가 더 유리할까?',
        content: '주거·계약 게시글',
        readCount: 80,
        likeCount: 21,
        bookmarkCount: 17,
        thumbnailUrl: '/assets/images/provide-default.png',
      },
      {
        memberId: 1,
        region: '서울 강남구 역삼동',
        category: 'SAFETY',
        title: '혼자 사는 집, 꼭 설치해야 할 보안 아이템',
        content: '안전·치안 게시글',
        readCount: 36,
        likeCount: 8,
        bookmarkCount: 6,
        thumbnailUrl: '/assets/images/provide-default.png',
      },
      {
        memberId: 1,
        region: '서울 강남구 역삼동',
        category: 'LIFE_INFO',
        title: '분리수거 헷갈릴 때 빠르게 보는 체크리스트',
        content: '생활정보 게시글',
        readCount: 39,
        likeCount: 9,
        bookmarkCount: 11,
        thumbnailUrl: '/assets/images/provide-default.png',
      },
      {
        memberId: 1,
        region: '서울 강남구 역삼동',
        category: 'OTHER',
        title: '자취연구소에서 정리한 개인 성향별 생활 루틴',
        content: '기타 게시글',
        readCount: 19,
        likeCount: 2,
        bookmarkCount: 1,
        thumbnailUrl: '/assets/images/provide-default.png',
      },
      {
        memberId: 1,
        region: '서울 강남구 역삼동',
        category: 'SAFETY',
        title: '택배 분실/오배송 대응 방법과 예방 팁',
        content: '안전·치안 게시글',
        readCount: 45,
        likeCount: 6,
        bookmarkCount: 4,
        thumbnailUrl: '/assets/images/provide-default.png',
      },
      {
        memberId: 1,
        region: '서울 강남구 역삼동',
        category: 'GOVERNMENT_SUPPORT',
        title: '2025 청년 교통비 지원 정리',
        content: '정부 지원 사업 게시글',
        readCount: 115,
        likeCount: 12,
        bookmarkCount: 9,
        thumbnailUrl: '/assets/images/provide-default.png',
      },
      {
        memberId: 1,
        region: '서울 강남구 역삼동',
        category: 'LIFE_INFO',
        title: '자취생 필수 앱 10선 (공과금·배달·중고거래)',
        content: '생활정보 게시글',
        readCount: 92,
        likeCount: 5,
        bookmarkCount: 3,
        thumbnailUrl: '/assets/images/provide-default.png',
      },
      {
        memberId: 1,
        region: '서울 강남구 역삼동',
        category: 'HOUSING_CONTRACT',
        title: '등기부등본에서 꼭 봐야 할 3가지 포인트',
        content: '주거·계약 게시글',
        readCount: 188,
        likeCount: 25,
        bookmarkCount: 19,
        thumbnailUrl: '/assets/images/provide-default.png',
      },
    ],
  });

  // 커뮤니티 게시글
  await prisma.communityPost.createMany({
    data: [
      {
        memberId: user1.id,
        memberLocationId: location.id,
        title: '역삼 친구 모여라 ❤️',
        content: `이사온지 얼마 안 된 3개월차 자취생입니다!
맛집이나 취미 생활 함께할 분들 구해요!
같이 볼링치고 치맥할 분 구해요.`,
        readCount: 12,
        commentCount: 4,
        likeCount: 2,
        bookmarkCount: 2,
        thumbnailUrl: '/assets/images/community-default.png',
      },
      {
        memberId: user2.id,
        memberLocationId: location.id,
        title: '자취하면서 돈 아끼는 방법 있을까요?',
        content: `식비가 너무 많이 나와요 😢
다들 장 어디서 보세요?`,
        readCount: 25,
        commentCount: 3,
        likeCount: 5,
        bookmarkCount: 4,
        thumbnailUrl: '/assets/images/community-default.png',
      },
      {
        memberId: user3.id,
        memberLocationId: location.id,
        title: '인천으로 이사하게 됐는데 쉽지 않네요 😂',
        content: `회사 때문에 이동합니다…
부평 쪽 자취 환경 어떤가요?`,
        readCount: 19,
        commentCount: 2,
        likeCount: 3,
        bookmarkCount: 1,
        thumbnailUrl: '/assets/images/community-default.png',
      },
      {
        memberId: user1.id,
        memberLocationId: location.id,
        title: '홈플러스 앞 분식집 추천합니다',
        content: `떡볶이 진짜 맛있어요 👍
혼밥하기도 좋습니다`,
        readCount: 44,
        commentCount: 4,
        likeCount: 9,
        bookmarkCount: 6,
        thumbnailUrl: '/assets/images/community-default.png',
      },
      {
        memberId: user2.id,
        memberLocationId: location.id,
        title: '오늘 아침 도로공사 때문에 지각ㅠㅠ',
        content: `출근길 막힘 심합니다
우회 추천합니다`,
        readCount: 31,
        commentCount: 2,
        likeCount: 4,
        bookmarkCount: 0,
        thumbnailUrl: '/assets/images/community-default.png',
      },
      {
        memberId: user3.id,
        memberLocationId: location.id,
        title: '우유팩 수거 자원봉사 모집 👍',
        content: `주말 오전 진행합니다
같이 참여하실 분 구해요`,
        readCount: 27,
        commentCount: 3,
        likeCount: 7,
        bookmarkCount: 3,
        thumbnailUrl: '/assets/images/community-default.png',
      },
      {
        memberId: user3.id,
        memberLocationId: location.id,
        title: '자취방 냄새 제거 팁 공유',
        content: `베이킹소다 + 환기 조합 추천합니다
진짜 효과 있어요`,
        readCount: 52,
        commentCount: 3,
        likeCount: 12,
        bookmarkCount: 10,
        thumbnailUrl: '/assets/images/community-default.png',
      },
      {
        memberId: user1.id,
        memberLocationId: location.id,
        title: '같이 운동하실 분 구해요',
        content: `저녁 러닝 메이트 구합니다
주 3회 목표`,
        readCount: 20,
        commentCount: 2,
        likeCount: 5,
        bookmarkCount: 1,
        thumbnailUrl: '/assets/images/community-default.png',
      },
    ],
  });
}

main()
  .catch((e) => {
    console.error(e);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
