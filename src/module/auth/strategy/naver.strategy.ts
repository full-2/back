import { Injectable } from "@nestjs/common";
import { PassportStrategy } from "@nestjs/passport";
import { Strategy } from "passport-naver-v2";


@Injectable()
export class NaverStrategy extends PassportStrategy(Strategy, "naver"){
  async validate(accessToken:string, refreshToken:string,profile:any,done:any){
  }
}