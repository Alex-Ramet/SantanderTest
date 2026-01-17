import { Test, TestingModule } from '@nestjs/testing';
import { CandidateController } from './candidate.controller';
import { CandidateService } from './candidate.service';
import { CreateCandidateDto } from './dto/create-candidate.dto';
import { UpdateCandidateDto } from './dto/update-candidate.dto';
import { ExcelCreateCandidateDto } from './dto/excel-create-canidate.dto';
import { Candidate } from './entity/candidate.entity';
import { CandidateSeniority } from './dto/candidate-seniority.enum';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

const mock_candidate: Candidate = {
  id: 1,
  name: 'John',
  surname: 'Doe',
  years: 6,
  seniority: CandidateSeniority.Junior,
  availability: true,
};

const mock_candidate_service = {
  findAll: jest.fn(),
  findOne: jest.fn(),
  create: jest.fn(),
  update: jest.fn(),
  remove: jest.fn(),
};

const mock_repository = {
  create: jest.fn(),
  save: jest.fn(),
  find: jest.fn(),
  findOneBy: jest.fn(),
  merge: jest.fn(),
  remove: jest.fn(),
};

function createMockExcelRow(values: (number | string | CandidateSeniority)[]) {
  return {
    getCell: jest.fn((index: number) => {
      const value = values[index - 1];
      if (value === 'yes') return { value: true };
      if (value === 'no') return { value: false };
      return { value };
    }),
  };
}

describe('Candidate Module Tests', () => {
  describe('Unit Tests: CandidateController', () => {
    let controller: CandidateController;
    let service: CandidateService;

    beforeEach(async () => {
      const module: TestingModule = await Test.createTestingModule({
        controllers: [CandidateController],
        providers: [
          {
            provide: CandidateService,
            useValue: mock_candidate_service,
          },
        ],
      }).compile();

      controller = module.get<CandidateController>(CandidateController);
      service = module.get<CandidateService>(CandidateService);
    });

    it('should be defined', () => {
      expect(controller).toBeDefined();
    });

    describe('findAll', () => {
      it('should return an array of candidates', async () => {
        const result = [mock_candidate];
        mock_candidate_service.findAll.mockResolvedValue(result);

        expect(await controller.findAll()).toBe(result);
        expect(service.findAll).toHaveBeenCalled();
      });
    });

    describe('findOne', () => {
      it('should return a single candidate', async () => {
        mock_candidate_service.findOne.mockResolvedValue(mock_candidate);

        expect(await controller.findOne(1)).toBe(mock_candidate);
        expect(service.findOne).toHaveBeenCalledWith(1);
      });
    });

    describe('create', () => {
      it('should create a candidate with name, surname and excel data', async () => {
        const create_dto: CreateCandidateDto = {
          name: 'John',
          surname: 'Doe',
        };

        const mock_request: any = {
          candidate_row: createMockExcelRow([
            6,
            CandidateSeniority.Junior,
            'YES',
          ]),
        };

        const expected_excel_dto: ExcelCreateCandidateDto = {
          years: 6,
          seniority: CandidateSeniority.Junior,
          availability: true,
        };

        mock_candidate_service.create.mockResolvedValue(mock_candidate);

        const result = await controller.create(create_dto, mock_request);

        expect(result).toBe(mock_candidate);
        expect(service.create).toHaveBeenCalledWith(
          create_dto,
          expected_excel_dto,
        );
      });
    });

    describe('update', () => {
      it('should update a candidate', async () => {
        const { name, ...mc } = mock_candidate;
        const update_dto: UpdateCandidateDto = { ...mc, name: 'Alex' };
        mock_candidate_service.update.mockResolvedValue({
          ...mock_candidate,
          ...update_dto,
        });

        const result = await controller.update(1, update_dto);
        expect(result.name).toBe('Alex');
        expect(service.update).toHaveBeenCalledWith(1, update_dto);
      });
    });

    describe('remove', () => {
      it('should remove a candidate', async () => {
        mock_candidate_service.remove.mockResolvedValue(mock_candidate);

        const result = await controller.remove(1);
        expect(result).toBe(mock_candidate);
        expect(service.remove).toHaveBeenCalledWith(1);
      });
    });
  });

  describe('Integration Tests: Controller + Service', () => {
    let controller: CandidateController;
    let service: CandidateService;
    let repository: Repository<Candidate>;

    beforeEach(async () => {
      const module: TestingModule = await Test.createTestingModule({
        controllers: [CandidateController],
        providers: [
          CandidateService,
          {
            provide: getRepositoryToken(Candidate),
            useValue: mock_repository,
          },
        ],
      }).compile();

      controller = module.get<CandidateController>(CandidateController);
      service = module.get<CandidateService>(CandidateService);
      repository = module.get<Repository<Candidate>>(
        getRepositoryToken(Candidate),
      );
    });

    it('should be defined', () => {
      expect(controller).toBeDefined();
      expect(service).toBeDefined();
    });

    describe('create (Integration)', () => {
      it('should properly process request and save to repository', async () => {
        const create_dto: CreateCandidateDto = {
          name: 'Integration',
          surname: 'User',
        };

        const mock_request: any = {
          candidate_row: createMockExcelRow([
            3,
            CandidateSeniority.Junior,
            'no',
          ]),
        };

        mock_repository.create.mockImplementation((dto) => dto);
        mock_repository.save.mockImplementation((candidate) =>
          Promise.resolve({ id: 2, ...candidate }),
        );

        const result = await controller.create(create_dto, mock_request);

        expect(result).toHaveProperty('id', 2);
        expect(result).toHaveProperty('years', 3);
        expect(result).toHaveProperty('seniority', CandidateSeniority.Junior);
        expect(result).toHaveProperty('availability', false);
        expect(mock_repository.create).toHaveBeenCalled();
        expect(mock_repository.save).toHaveBeenCalled();
      });
    });

    describe('findAll (Integration)', () => {
      it('should return all candidates from repository', async () => {
        const candidates = [mock_candidate];
        mock_repository.find.mockResolvedValue(candidates);

        const result = await controller.findAll();
        expect(result).toEqual(candidates);
        expect(mock_repository.find).toHaveBeenCalled();
      });
    });
  });
});
