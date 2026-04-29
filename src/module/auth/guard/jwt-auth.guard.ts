import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtTokenService } from 'src/service/jwt/jwt.service';
import type { AuthRequest } from 'src/type/auth.type';

// 쿠키의 accessToken을 검증해서 로그인된 회원만 통과시키는 Guard
// 검증 성공 시 req.user에 JwtPayload({ id, email, ... })를 심어준다.
@Injectable()
export class JwtAuthGuard implements CanActivate {
  constructor(private readonly jwtTokenService: JwtTokenService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest<AuthRequest>();
    const accessToken = request.cookies?.['accessToken'];

    if (!accessToken) {
      throw new UnauthorizedException('로그인이 필요합니다.');
    }

    const payload =
      await this.jwtTokenService.verifyAndExtractPayload(accessToken);
    request.user = payload;
    return true;
  }
}
