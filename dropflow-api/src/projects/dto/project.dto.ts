import {
  ArrayMaxSize, IsArray, IsIn, IsInt, IsOptional, IsString, Length, Matches, Max, Min,
} from 'class-validator';
import type { ProjectStatus } from '../project.entity.js';

export class CreateProjectDto {
  @IsString()
  @Length(2, 80)
  name!: string;

  @IsString()
  organizationId!: string;
}

export class UpdateProjectDto {
  @IsOptional()
  @IsString()
  @Length(2, 80)
  name?: string;

  @IsOptional()
  @IsIn(['active', 'disabled', 'suspended'])
  status?: ProjectStatus;

  @IsOptional()
  @IsInt()
  @Min(1024)
  @Max(5_368_709_120)
  maxFileSize?: number;

  @IsOptional()
  @IsArray()
  @ArrayMaxSize(100)
  @IsString({ each: true })
  allowedMimeTypes?: string[];

  @IsOptional()
  @IsArray()
  @ArrayMaxSize(20)
  @IsString({ each: true })
  @Matches(/^https?:\/\/[^/\s]+$/i, {
    each: true,
    message: 'Each allowedOrigin must be an http(s) origin without a path',
  })
  allowedOrigins?: string[];
}
