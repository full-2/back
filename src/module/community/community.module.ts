import { Module } from '@nestjs/common';
import { CommunityController } from 'src/controller/community/community.controller';
import { CommunityService } from 'src/service/community/community.service';
import { PrismaService } from 'src/service/prisma/prisma.service';

@Module({
  controllers: [CommunityController],
  providers: [CommunityService, PrismaService],
})
export class CommunityModule {}