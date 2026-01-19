import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseInterceptors,
  Req,
  Header,
} from '@nestjs/common';
import { Request } from 'express';
import { CandidateService } from './candidate.service';
import { CreateCandidateDto } from './dto/create-candidate.dto';
import { UpdateCandidateDto } from './dto/update-candidate.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { ExcelValidationInterceptor } from 'src/common/interceptors/excel-validation.interceptor';
import { ExcelCreateCandidateDto } from './dto/excel-create-canidate.dto';
import { CandidateSeniority } from './dto/candidate-seniority.enum';
import * as ExcelJS from 'exceljs';

interface RequestWithExcel extends Request {
  candidate_row?: ExcelJS.Row;
}

@Controller('candidate')
export class CandidateController {
  constructor(private readonly candidateService: CandidateService) {}

  @Get()
  @Header('Cache-Control', 'no-store, no-cache, must-revalidate')
  @Header('Pragma', 'no-cache')
  @Header('Expires', '0')
  findAll() {
    return this.candidateService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: number) {
    return this.candidateService.findOne(id);
  }

  @Post()
  @UseInterceptors(FileInterceptor('file'), ExcelValidationInterceptor)
  create(
    @Body() create_candidate: CreateCandidateDto,
    @Req() req: RequestWithExcel,
  ) {
    const candidate_row = req.candidate_row;

    const excel_create_candidate: ExcelCreateCandidateDto = {
      years: Number(candidate_row!.getCell(1).value),
      seniority: candidate_row!.getCell(2).value as CandidateSeniority,
      availability:
        String(candidate_row!.getCell(3).value).toLowerCase() == 'yes'
          ? true
          : false,
    };

    return this.candidateService.create(
      create_candidate,
      excel_create_candidate,
    );
  }

  @Patch(':id')
  update(@Param('id') id: number, @Body() dto: UpdateCandidateDto) {
    return this.candidateService.update(id, dto);
  }

  @Delete(':id')
  remove(@Param('id') id: number) {
    return this.candidateService.remove(id);
  }
}
