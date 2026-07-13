import { IsNotEmpty, IsString, MaxLength, MinLength } from 'class-validator';

export class CreateNewsDto {
  @IsString()
  @IsNotEmpty()
  @MinLength(5)
  title: string;

  @IsString()
  @IsNotEmpty()
  tag: string;

  @IsString()
  @IsNotEmpty()
  @MaxLength(280)
  excerpt: string;

  @IsString()
  @IsNotEmpty()
  content: string;
}
