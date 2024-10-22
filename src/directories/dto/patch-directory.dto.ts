import {
  IsOptional,
  IsString,
  IsArray,
  ArrayNotEmpty,
  IsEmail,
} from 'class-validator';

export class PatchDirectoryDto {
  @IsOptional()
  @IsString()
  name?: string;

  @IsOptional()
  @IsArray()
  @ArrayNotEmpty()
  @IsString({ each: true })
  @IsEmail({}, { each: true })
  emails?: string[];
}
