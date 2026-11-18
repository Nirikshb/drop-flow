import { IsEmail, IsIn, IsOptional, IsString, Length, Matches } from 'class-validator';

export class CreateOrganizationDto {
  @IsString()
  @Length(2, 80)
  name!: string;

  @IsOptional()
  @IsString()
  @Matches(/^[a-z0-9-]{2,48}$/, { message: 'slug may only contain lowercase letters, numbers and hyphens' })
  slug?: string;
}

export class UpdateOrganizationDto {
  @IsString()
  @Length(2, 80)
  name!: string;
}

export class AddMemberDto {
  @IsEmail()
  email!: string;

  @IsIn(['admin', 'member'])
  role!: 'admin' | 'member';
}

export class UpdateMemberDto {
  @IsIn(['admin', 'member'])
  role!: 'admin' | 'member';
}
