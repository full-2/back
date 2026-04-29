import { Module } from '@nestjs/common';
import { SafeScoreController } from 'src/controller/safe-score/safe-score.controller';
import { SafeScoreRepository } from 'src/repository/safe-score/safe-score.repository';
import { PublicDataService } from 'src/service/public-data/public-data.service';
import { SafeScoreService } from 'src/service/safe-score/safe-score.service';
import { JwtAuthGuard } from '../auth/guard/jwt-auth.guard';

@Module({
  controllers: [SafeScoreController],
  providers: [
    SafeScoreService,
    SafeScoreRepository,
    PublicDataService,
    JwtAuthGuard,
  ],
  exports: [SafeScoreService, PublicDataService],
})
export class SafeScoreModule {}
