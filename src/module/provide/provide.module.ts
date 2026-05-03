import { Module } from '@nestjs/common';
import { ProvideController } from '../../controller/provide/povide.controller'
import { ProvideService } from '../../service/provide/provide.service';

@Module({
  controllers: [ProvideController],
  providers: [ProvideService],
})
export class ProvideModule {}