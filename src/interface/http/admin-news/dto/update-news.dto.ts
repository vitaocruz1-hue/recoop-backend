import { IsOptional, IsString, MaxLength, MinLength } from 'class-validator';

export class UpdateNewsDto {
  @IsOptional()
  @IsString()
  @MinLength(5)
  title?: string;

  @IsOptional()
  @IsString()
  tag?: string;

  @IsOptional()
  @IsString()
  @MaxLength(280)
  excerpt?: string;

  @IsOptional()
  @IsString()
  content?: string;
}
