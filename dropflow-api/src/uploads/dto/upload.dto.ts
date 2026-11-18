import { IsInt, IsOptional, IsString, Length, Max, Min } from 'class-validator';

export class InitUploadDto {
  @IsString()
  @Length(1, 255)
  originalFilename!: string;

  @IsInt()
  @Min(1)
  @Max(5_368_709_120)
  size!: number;

  @IsString()
  @Length(1, 127)
  mimeType!: string;

  @IsOptional()
  @IsString()
  checksum?: string;
}

export class CompleteUploadDto {
  @IsOptional()
  @IsString()
  checksum?: string;
}
