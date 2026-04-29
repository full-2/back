import { Module } from '@nestjs/common';
import { LocationController } from 'src/controller/location/location.controller';
import { LocationRepository } from 'src/repository/location/location.repository';
import { LocationService } from 'src/service/location/location.service';
import { JwtAuthGuard } from '../auth/guard/jwt-auth.guard';

@Module({
  controllers: [LocationController],
  providers: [LocationService, LocationRepository, JwtAuthGuard],
  exports: [LocationService, LocationRepository],
})
export class LocationModule {}
