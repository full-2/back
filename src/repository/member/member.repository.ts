import { Injectable } from '@nestjs/common';
import { MemberRole } from '@prisma/client';
import {
  MemberRegisterDTO,
  MemberUpdateDTO,
  OAuthLoginDTO,
} from 'src/domain/member/dto/member.dto';
import { MemberEntity } from 'src/domain/member/entity/member.entity';
import { PrismaService } from 'src/service/prisma/prisma.service';

@Injectable()
export class MemberRepository {
  //생성자 주입
  constructor(private readonly prisma: PrismaService) {}

  //회원 추가
  // front 단에서 받은 member정보들 >> MemberRegisterDTO에 담긴것
  async save(member: MemberRegisterDTO): Promise<MemberEntity> {
    const memberCreate = {
      memberEmail: member.memberEmail,
      memberName: member.memberName,
      memberRole: MemberRole.USER,
      memberNickname: null,
      memberProfile: null,
      memberIntro: null,
      memberInactive: false,
      inactiveReason: null,
      memberCreateAt: new Date(),
    };

    //소셜 Auth
    const memberSocialCreate = {
      memberProviderId: member.memberProviderId,
      memberProvider: member.memberProvider,
      memberPassword: member.memberPassword,
    };

    return await this.prisma.member.create({
      data: {
        ...memberCreate,
        socials: {
          create: memberSocialCreate,
        },
      },
      include: {
        socials: true,
      },
    });
  }

  //회원 전체 조회
  async findMemberAll(): Promise<MemberEntity[]> {
    return await this.prisma.member.findMany({
      where: {
        OR: [{ memberInactive: false }, { memberInactive: null }],
      },
      include: {
        socials: true,
      },
    });
  }

  //회원 단일 조회(ID)
  async findMemberById(id: number): Promise<MemberEntity | null> {
    return await this.prisma.member.findUnique({
      where: { id },
      include: {
        socials: true,
      },
    });
  }

  //회원 단일 조회(Email)
  async findMemberByMemberEmail(
    memberEmail: string,
  ): Promise<MemberEntity | null> {
    return await this.prisma.member.findFirst({
      where: { memberEmail },
      include: { socials: true },
    });
  }

  // 소셜 로그인으로 로그인했을 때 회원을 조회하는 방법!
  // 회원 단일 조회(Provider)
  async findByProvider(
    socialMember: OAuthLoginDTO,
  ): Promise<MemberEntity | null> {
    return await this.prisma.member.findFirst({
      where: {
        socials: {
          some: {
            memberProviderId: socialMember.memberProviderId,
            memberProvider: socialMember.memberProvider,
          },
        },
      },
      include: {
        socials: true,
      },
    });
  }

  // 회원 비밀번호 수정
  async updatePassword(id: number, memberPassword: string): Promise<void> {
    await this.prisma.authAccount.update({
      where: { id },
      data: { memberPassword },
    });
  }

  // 회원 정보 수정
  async updateProfile(
    id: number,
    member: MemberUpdateDTO,
  ): Promise<MemberEntity | null> {
    const { memberPassword, ...data } = member;

    await this.prisma.member.update({
      data,
      where: { id },
    });

    return await this.findMemberById(id);
  }

  // 회원 삭제
  async delete(id: number) {
    try {
      await this.prisma.member.update({
        where: { id },
        data: {
          memberInactive: true,
          inactiveReason: '회원 탈퇴',
        },
      });
      return true;
    } catch (err) {
      console.log('member repository delete failed');
      return false;
    }
  }

  // 활성 회원인지 조회 (로그인용)
  async findActiveMemberByEmail(
    memberEmail: string,
  ): Promise<MemberEntity | null> {
    return this.prisma.member.findFirst({
      where: {
        memberEmail,
        OR: [{ memberInactive: false }, { memberInactive: null }],
      },
      include: { socials: true },
    });
  }
  // 소셜 로그인으로 로그인했을 때 회원을 조회하는 방법!
  // 회원 단일 조회(Provider)
  async findActiveByProvider(
    socialMember: OAuthLoginDTO,
  ): Promise<MemberEntity | null> {
    return this.prisma.member.findFirst({
      where: {
        OR: [{ memberInactive: false }, { memberInactive: null }],
        socials: {
          some: {
            memberProviderId: socialMember.memberProviderId,
            memberProvider: socialMember.memberProvider,
          },
        },
      },
      include: { socials: true },
    });
  }
}
