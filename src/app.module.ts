import { Module } from '@nestjs/common';
import { MemberModule } from './module/member/member.module';
import { CoreModule } from './module/core/core.module';
import { AuthModule } from './module/auth/auth.module';
import { LocationModule } from './module/location/location.module';
import { SafeScoreModule } from './module/safe-score/safe-score.module';
import { ProvideModule } from './module/provide/provide.module';
import { ConfigModule } from '@nestjs/config';
import { CommunityModule } from './module/community/community.module';

@Module({
  imports: [
    ConfigModule.forRoot(),
    CoreModule,
    MemberModule,
    AuthModule,
    LocationModule,
    SafeScoreModule,
    ProvideModule,
    CommunityModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
