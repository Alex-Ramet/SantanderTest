import { ICandidate } from './ICandidate.interface';
import { CandidateSeniority } from './ICandidateSeniority.enum';

export interface ICandidateDetail extends ICandidate {
  seniority: CandidateSeniority;
  years: number;
  availability: boolean;
}
