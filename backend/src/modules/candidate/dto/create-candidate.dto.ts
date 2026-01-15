import { IsNotEmpty, IsPositive, IsEnum } from 'class-validator';
import { CandidateSeniority } from './candidate-seniority.enum';

export class CreateCandidateDto {
  @IsNotEmpty()
  name: string;

  @IsNotEmpty()
  surname: string;
}
