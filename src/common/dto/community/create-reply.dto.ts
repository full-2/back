import { IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateReplyDto {
  @ApiProperty({
    example: '답글 내용입니다',
    description: '답글 내용',
  })
  @IsString()
  content!: string;
}