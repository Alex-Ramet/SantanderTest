import {
  BadRequestException,
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import * as ExcelJS from 'exceljs';
import { CandidateSeniority } from 'src/modules/candidate/dto/candidate-seniority.enum';

@Injectable()
export class ExcelValidationInterceptor implements NestInterceptor {
  canidateExcelValidator(candidate_excel: ExcelJS.Row) {
    const year = candidate_excel.getCell(1).value;
    if (!year || isNaN(Number(year)) || Number(year) <= 0)
      throw new BadRequestException('Years value must be a positive number');

    const seniority = candidate_excel.getCell(2).value;
    if (
      !seniority ||
      !Object.values(CandidateSeniority).includes(
        String(seniority).toLowerCase() as CandidateSeniority,
      )
    )
      throw new BadRequestException('Seniority value must be Senior or Junior');

    const availability = candidate_excel.getCell(3).value;
    if (
      !availability ||
      !['yes', 'no'].includes(String(availability).toLowerCase())
    )
      throw new BadRequestException(
        'Availability value must be either yes or no',
      );
  }

  async intercept(
    context: ExecutionContext,
    next: CallHandler,
  ): Promise<Observable<any>> {
    const request = context.switchToHttp().getRequest();
    const file: Express.Multer.File = request.file;

    if (!file) {
      throw new BadRequestException('Excel file is required');
    }

    const allowed_mimetypes = [
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      'application/vnd.ms-excel',
    ];

    if (!allowed_mimetypes.includes(file.mimetype)) {
      throw new BadRequestException('Invalid Excel file type');
    }

    const workbook = new ExcelJS.Workbook();
    const uint8Array = new Uint8Array(file.buffer);
    await workbook.xlsx.load(uint8Array as any);

    const worksheet = workbook.worksheets[0];
    if (!worksheet) {
      throw new BadRequestException('Excel must contain one sheet');
    }

    // Only take the first row with data (excluding header (1st row))
    const candidate_row = worksheet.getRow(2);

    this.canidateExcelValidator(candidate_row);

    request.candidate_row = candidate_row;
    return next.handle();
  }
}
