import { Injectable } from "@nestjs/common";
import { PassportStrategy } from "@nestjs/passport";
import { Strategy, VerifyCallback } from "passport-google-oauth20";


@Injectable()
export class GoogleStrategy extends PassportStrategy(Strategy, "google"){
  async validate(accessToken:string, refreshToken:string,profile:any,done:VerifyCallback){
  }
}