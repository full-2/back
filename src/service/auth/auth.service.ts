import { forwardRef, Inject, Injectable } from '@nestjs/common';
import bcrypt from "bcrypt"
import { JwtPayload } from 'src/type/auth.type';
import { TokenDTO } from 'src/domain/auth/dto/auth.dto';
import { JwtTokenService } from '../jwt/jwt.service';
import { RedisService } from '../redis/redis.service';
import { MemberService } from '../member/member.service';
import { MemberResponse } from 'src/domain/member/dto/member.response';
// 회원 검증과 관련된 서비스
@Injectable()
export class AuthService {
  constructor(
    private readonly jwtTokenService:JwtTokenService,
    private readonly redisService:RedisService,
    @Inject(forwardRef(()=> MemberService))
    private readonly memberService:MemberService
  ){;}

  // 비밀번호 해싱
  private readonly saltRounds = 10;

  // 암호화
  async hashPassword(password: string):Promise<string>{
    return bcrypt.hash(password, this.saltRounds)
  }

  // 비밀번호 검사(원본을 노출시키지 않고 해시된 애들끼리 비교)
  async comparePassword(password:string, hashPassword:string):Promise<boolean>{
    return bcrypt.compare(password, hashPassword)
  }

  // 로그인
  async login(payload: JwtPayload):Promise<TokenDTO>{
    const accessToken = await this.jwtTokenService.generateAccesstoken(payload)
    const refreshToken = await this.jwtTokenService.generateAccesstoken(payload)

    return {accessToken, refreshToken}
  }

  // 로그아웃
  async logout(refreshToken: string){
    let isLogout = false;
    try {
      const payload = await this.jwtTokenService.verifyAndExtractPayload(refreshToken);
      await this.redisService.deleteRefreshToken(payload);
      isLogout =true
    } catch (err) {
      isLogout=false
    }
    return isLogout
  }

  // me
  async me(accessToken: string):Promise<MemberResponse>{
    const payload = await this.jwtTokenService.verifyAndExtractPayload(accessToken)
    return await this.memberService.getMember(payload.id)
  }

  // refreshToken을 받으면 accesstoken 심어서 보내주겠다
  async refresh(refreshToken: string):Promise<TokenDTO>{
    const payload = await this.jwtTokenService.validateRefreshToken(refreshToken)
    const accessToken = await this.jwtTokenService.generateAccesstoken(payload)

    return {
      accessToken, refreshToken
    }
  }


}
