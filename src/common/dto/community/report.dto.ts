import { IsEnum } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export enum ReportReason {
  ABUSE = 'ABUSE',
  SPAM = 'SPAM',
  ADVERTISEMENT = 'ADVERTISEMENT',
  SEXUAL = 'SEXUAL',
  HATE = 'HATE',
  MISINFORMATION = 'MISINFORMATION',
  ILLEGAL_CONTENT = 'ILLEGAL_CONTENT',
}

export class ReportDto {
  @ApiProperty({
    example: 'ABUSE',
    description: '신고 사유 (enum)',
    enum: ReportReason,
  })
  @IsEnum(ReportReason)
  reason!: ReportReason;
}