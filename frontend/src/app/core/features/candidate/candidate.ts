import { AfterViewInit, Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { ICandidateDetail } from './models/ICandidateDetail.interface';
import { MatInputModule } from '@angular/material/input';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatTable, MatTableDataSource, MatTableModule } from '@angular/material/table';
import { CommonModule } from '@angular/common';
import { CandidateService } from '../../services/canidate.service';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatSelectModule } from '@angular/material/select';
import { MatCardModule } from '@angular/material/card';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatChipsModule } from '@angular/material/chips';
import { CandidateDetails } from './components/candidate-details/candidate-details';
import { ToastrService } from 'ngx-toastr';
import { MatSort, MatSortModule } from '@angular/material/sort';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { CandidateForm } from './components/candidate-form/candidate-form';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { Subject } from 'rxjs';

@Component({
  selector: 'app-candidate',
  standalone: true,
  imports: [
    CommonModule,
    MatTableModule,
    MatButtonModule,
    ReactiveFormsModule,
    FormsModule,
    MatDialogModule,
    MatTable,
    MatCardModule,
    MatIconModule,
    MatSelectModule,
    MatFormFieldModule,
    MatInputModule,
    MatChipsModule,
    CandidateDetails,
    MatSortModule,
    MatFormFieldModule,
    MatInputModule,
    MatCheckboxModule,
    MatPaginatorModule,
  ],
  templateUrl: './candidate.html',
  styleUrls: ['./candidate.css'],
})
export class Candidate implements OnInit, AfterViewInit, OnDestroy {
  data_source = new MatTableDataSource<ICandidateDetail>([]);

  filter: FormGroup = {} as FormGroup;

  expanded_row: ICandidateDetail | null = null;

  displayed_columns: string[] = [
    'name',
    'surname',
    'seniority',
    'years',
    'availability',
    'actions',
  ];

  filter_columns: string[] = [
    'name_filter',
    'surname_filter',
    'seniority_filter',
    'years_filter',
    'availability_filter',
    'actions_filter',
  ];

  seniorities: Array<{ label: string; value: string }> = [
    { label: 'All', value: '' },
    { label: 'Junior', value: 'junior' },
    { label: 'Senior', value: 'senior' },
  ];

  @ViewChild(MatSort) sort!: MatSort;
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatTable) table!: MatTable<ICandidateDetail>;

  constructor(
    private candidateService: CandidateService,
    private dialog: MatDialog,
    private fb: FormBuilder,
    private readonly toastr: ToastrService
  ) {}
  private destroy$ = new Subject<void>();

  ngOnInit() {
    this.filter = this.fb.group({
      name: '',
      surname: '',
      seniority: null,
      years: null,
      availability: null,
    });
    this.filter.valueChanges.subscribe((values) => {
      this.data_source.filter = JSON.stringify(values);
    });
    this.loadData();
  }

  ngAfterViewInit() {
    setTimeout(() => {
    this.data_source.paginator = this.paginator;
    this.data_source.sort = this.sort;
  }, 100);
  }

   ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }


  loadData() {
    this.candidateService.getAll().subscribe({
      next: (data) => {
      console.log('📡 Datos recibidos del backend:', data);
      console.log('📊 Cantidad de registros:', data.length);
        this.data_source.data = data;
        this.data_source.filterPredicate = (data: ICandidateDetail, filter_str: string) =>
          this.applyFilters(data, filter_str);
      },
      error: (_) => this.toastr.error('Cannot load the candidates', 'Error'),
    });
  }

  changeAvailability(event: MouseEvent) {
    event.preventDefault();
    const control = this.filter.get('availability');
    const current_value = control?.value;

    let next: boolean | null;
    if (current_value === null) {
      next = true;
    } else if (current_value === true) {
      next = false;
    } else {
      next = null;
    }

    control?.setValue(next);
  }

  applyFilters(candidate: ICandidateDetail, filter_str: string): boolean {
    const filter_value = JSON.parse(filter_str);

    const nameMatch =
      !filter_value.name || candidate.name.toLowerCase().includes(filter_value.name.toLowerCase());

    const surnameMatch =
      !filter_value.surname ||
      candidate.surname.toLowerCase().includes(filter_value.surname.toLowerCase());

    const seniorityMatch =
      !filter_value.seniority || candidate.seniority === filter_value.seniority;

    const yearsMatch =
      !filter_value.years || candidate.years.toString().includes(filter_value.years.toString());

    const availabilityMatch =
      filter_value.availability === null || filter_value.availability === candidate.availability;

    return nameMatch && surnameMatch && seniorityMatch && yearsMatch && availabilityMatch;
  }

  clearFilters() {
    this.filter.reset();
  }

  openDialog() {
    const dialogRef = this.dialog.open(CandidateForm, {
      width: '800px',
      disableClose: true,
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.data_source.data = [result, ...this.data_source.data];
        this.table.renderRows();
      }
    });
  }

  toggleDetails(candidate: ICandidateDetail | undefined) {
    if (candidate) {
      this.expanded_row = this.expanded_row === candidate ? null : candidate;
    }
    this.table.renderRows();
  }
  isExpansionDetailRow = (index: number, row: ICandidateDetail) => {
    return this.expanded_row == null ? false : this.expanded_row?.id === row.id;
  };

  onSaveDetails(updated_candidate: ICandidateDetail) {
    const data = this.data_source.data;
    const index = data.findIndex((c) => c.id === updated_candidate.id);
    if (index !== -1) {
      data[index] = updated_candidate;
      this.data_source.data = [...data];
    }
    this.expanded_row = null;
    this.table.renderRows();
  }

  onDeleteCandidate(id: number) {
    const data = this.data_source.data.filter((c) => c.id !== id);
    this.data_source.data = data;
    this.expanded_row = null;
    this.table.renderRows();
  }

  onCancelDetails() {
    this.expanded_row = null;
    this.table.renderRows();
  }
}
