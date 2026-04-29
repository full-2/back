// Guard : 컨트롤러가 호출되면 Local  전략을 실행시키기 위한 역할

import { Injectable, UnauthorizedException } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

@Injectable()
export class LocalAuthGuard extends AuthGuard('local') {
  // validate()에서 던진 예외(MemberException 등)를 그대로 전달하기 위해 오버라이드
  handleRequest<TUser = any>(err: any, user: any, info: any): TUser {
    if (err) throw err;
    if (!user)
      throw new UnauthorizedException('이메일 또는 비밀번호가 일치하지 않습니다.');
    return user as TUser;
  }
}
