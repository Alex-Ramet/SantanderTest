import { IsNotEmpty, IsPositive, IsEnum } from 'class-validator';
import { CandidateSeniority } from './candidate-seniority.enum';

export class ExcelCreateCandidateDto {
  @IsNotEmpty()
  @IsPositive()
  years: number;

  @IsNotEmpty()
  @IsEnum(CandidateSeniority)
  seniority: CandidateSeniority;

  @IsNotEmpty()
  availability: boolean;
}
