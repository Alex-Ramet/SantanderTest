import { IsNotEmpty, IsPositive, IsEnum } from 'class-validator';
import { CandidateSeniority } from './candidate-seniority.enum';

export class UpdateCandidateDto {
  @IsNotEmpty()
  name: string;

  @IsNotEmpty()
  surname: string;

  @IsNotEmpty()
  @IsEnum(CandidateSeniority)
  seniority: CandidateSeniority;

  @IsNotEmpty()
  @IsPositive()
  years: number;

  @IsNotEmpty()
  availability: boolean;
}
