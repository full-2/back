import { AuthProvider, MemberRole } from '@prisma/client';

/** API 응답용 — Prisma `Member` + 소셜(비밀번호 제외)과 일치 */
export type MemberResponse = {
  id: number;
  memberEmail: string;
  memberName: string;
  memberRole: MemberRole;
  memberNickname: string | null;
  memberProfile: string | null;
  memberIntro: string | null;
  memberInactive: boolean | null;
  inactiveReason: string | null;
  memberCreateAt: Date;
  socials: {
    id: number;
    memberProvider: AuthProvider;
    memberProviderId: string | null;
  }[];
};
