import { ChangeDetectorRef, Component, ViewChild } from '@angular/core';
import { CandidateForm } from './components/candidate-form/candidate-form';
import { ICandidate } from './models/ICandidate.interface';
import { ICandidateDetail } from './models/ICandidateDetail.interface';
import { CandidateSeniority } from './models/ICandidateSeniority.enum';
import { MatInputModule } from '@angular/material/input';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatSort, MatSortModule } from '@angular/material/sort';
import { CommonModule } from '@angular/common';
import { CandidateService } from '../../services/canidate.service';
import { TableFilter } from './components/table-filter/table-filter';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatSelectModule } from '@angular/material/select';
import { MatCheckboxModule } from '@angular/material/checkbox';

@Component({
  selector: 'app-candidate',
  imports: [
    CommonModule,
    MatTableModule,
    MatButtonModule,
    MatDialogModule,
    MatIconModule,
    MatSortModule,
    TableFilter,
    MatCheckboxModule,
    MatSelectModule,
    MatFormFieldModule,
    MatInputModule,
  ],
  templateUrl: './candidate.html',
  styleUrls: ['./candidate.css'],
})
export class Candidate {
  displayed_columns = ['name', 'surname', 'years', 'seniority', 'availability', 'details'];
  data_source: ICandidateDetail[] = [];

  filters = {
    name: '',
    surname: '',
    seniority: '',
    years: null as number | null,
    availability: null as boolean | null,
  };

  constructor(
    private candidateService: CandidateService,
    private dialog: MatDialog,
    private cd: ChangeDetectorRef
  ) {}

  ngOnInit() {
    this.loadData();
  }

  loadData() {
    this.candidateService.getAll().subscribe({
      next: (data) => {
        this.data_source = data;
        this.cd.detectChanges();
      },
      error: (err) => console.error('Error loading persons', err),
    });
  }

  applyFilters() {
    this.data_source = this.data_source.filter((candidate) => {
      return (
        (!this.filters.name ||
          candidate.name.toLowerCase().includes(this.filters.name.toLowerCase())) &&
        (!this.filters.surname ||
          candidate.surname.toLowerCase().includes(this.filters.surname.toLowerCase())) &&
        (!this.filters.seniority || candidate.seniority === this.filters.seniority) &&
        (!this.filters.years || candidate.years === this.filters.years) &&
        (this.filters.availability === null || candidate.availability === this.filters.availability)
      );
    });
  }

  openUploadDialog() {}

  openDetails(candidate: ICandidateDetail) {
    console.log(candidate);
  }
}
