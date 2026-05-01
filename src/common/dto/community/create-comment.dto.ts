import { IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateCommentDto {
  @ApiProperty({
    example: '댓글 내용입니다',
    description: '댓글 내용',
  })
  @IsString()
  content!: string;
}