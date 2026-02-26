import { Injectable } from "@nestjs/common";
import { PassportStrategy } from "@nestjs/passport";
import { Strategy } from "passport-kakao";


@Injectable()
export class KakapStrategy extends PassportStrategy(Strategy, "kakao"){
  async validate(accessToken:string, refreshToken:string,profile:any,done:any){
  }
}