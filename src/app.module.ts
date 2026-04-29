import { Module } from '@nestjs/common';
import { MemberModule } from './module/member/member.module';
import { CoreModule } from './module/core/core.module';
import { AuthModule } from './module/auth/auth.module';
import { LocationModule } from './module/location/location.module';
import { SafeScoreModule } from './module/safe-score/safe-score.module';

@Module({
  imports: [
    CoreModule,
    MemberModule,
    AuthModule,
    LocationModule,
    SafeScoreModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
