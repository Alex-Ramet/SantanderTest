import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Candidate } from './entity/candidate.entity';
import { CreateCandidateDto } from './dto/create-candidate.dto';
import { UpdateCandidateDto } from './dto/update-candidate.dto';
import { ExcelCreateCandidateDto } from './dto/excel-create-canidate.dto';

@Injectable()
export class CandidateService {
  constructor(
    @InjectRepository(Candidate)
    private readonly candidateRepository: Repository<Candidate>,
  ) {}

  async create(
    create_candidate: CreateCandidateDto,
    excel_create_candidate: ExcelCreateCandidateDto,
  ): Promise<Candidate> {
    const candidate = this.candidateRepository.create({
      ...create_candidate,
      ...excel_create_candidate,
    });
    return this.candidateRepository.save(candidate);
  }

  findAll(): Promise<Candidate[]> {
    return this.candidateRepository.find({ order: { id: 'desc' } });
  }

  async findOne(id: number): Promise<Candidate> {
    const candidate = await this.candidateRepository.findOneBy({ id });
    if (!candidate) throw new NotFoundException('Candidate not found');
    return candidate;
  }

  async update(
    id: number,
    update_candidate: UpdateCandidateDto,
  ): Promise<Candidate> {
    const candidate = await this.findOne(id);

    const updated = this.candidateRepository.merge(candidate, update_candidate);
    return this.candidateRepository.save(updated);
  }

  async remove(id: number): Promise<Candidate> {
    const candidate = await this.findOne(id);
    return await this.candidateRepository.remove(candidate);
  }
}
