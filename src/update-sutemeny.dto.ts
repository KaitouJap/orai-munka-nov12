import { IsBoolean, IsInt, IsNotEmpty, IsString, Min } from "class-validator";

export class UpdateSutemenyDto {
  @IsString()
  @IsNotEmpty()
  nev?: string;
  @IsBoolean()
  laktozMentes?: boolean;
  @IsInt()
  @Min(0)
  db?: number;
}
