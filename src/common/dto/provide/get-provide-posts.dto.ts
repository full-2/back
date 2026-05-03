import { IsOptional, IsString, IsNumberString } from 'class-validator';

export class GetProvidePostsDto {
  @IsOptional()
  @IsNumberString()
  page?: string;

  @IsOptional()
  @IsNumberString()
  pageSize?: string;

  @IsOptional()
  @IsString()
  region?: string;

  @IsOptional()
  @IsString()
  category?: string; // LIFE_INFO,GOVERNMENT_SUPPORT

  @IsOptional()
  @IsString()
  sort?: string; // latest | like | bookmark

  @IsOptional()
  @IsString()
  keyword?: string;
}