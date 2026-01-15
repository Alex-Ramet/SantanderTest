import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';
import { CandidateSeniority } from '../dto/candidate-seniority.enum';

@Entity('candidate')
export class Candidate {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ length: 100 })
  name: string;

  @Column({ length: 200 })
  surname: string;

  @Column({ enum: CandidateSeniority, type: 'enum' })
  seniority: CandidateSeniority;

  @Column()
  years: number;

  @Column()
  availability: boolean;
}
