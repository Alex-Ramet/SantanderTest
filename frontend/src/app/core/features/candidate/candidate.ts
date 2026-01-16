import { AfterViewInit, Component, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
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
import { CandidateDetailsComponent } from './components/candidate-details/candidate-details';
import { ToastrService } from 'ngx-toastr';
import { MatSort, MatSortModule } from '@angular/material/sort';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
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
    CandidateDetailsComponent,
    MatSortModule,
    MatFormFieldModule,
    MatInputModule,
    MatPaginatorModule,
  ],
  templateUrl: './candidate.html',
  styleUrls: ['./candidate.css'],
})
export class Candidate implements OnInit, AfterViewInit   {
  data_source = new MatTableDataSource<ICandidateDetail>([]);

  filter: FormGroup = {} as FormGroup;

  expanded_row: ICandidateDetail | null = null;

  show_dialog: boolean = false;

  displayed_columns = ['name', 'surname', 'seniority', 'years', 'availability', 'actions'];
  filter_columns = [
    'name_filter',
    'surname_filter',
    'seniority_filter',
    'years_filter',
    'availability_filter',
    'actions_filter',
  ];

  @ViewChild(MatSort) sort!: MatSort;
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatTable) table!: MatTable<ICandidateDetail>

  constructor(
    private candidateService: CandidateService,
    private dialog: MatDialog,
    private fb: FormBuilder,
    private readonly toastr: ToastrService
  ) {}

  ngOnInit() {
    this.filter = this.fb.group({
      name: '',
      surname: '',
      seniority: '',
      years: '',
      availability: '',
    });
    this.filter.valueChanges.subscribe((values) => {
      this.data_source.filter = JSON.stringify(values);
    });
    this.loadData();
  }

  ngAfterViewInit() {
    this.data_source.paginator = this.paginator;
    this.data_source.sort = this.sort;
  }


  loadData() {
    this.candidateService.getAll().subscribe({
      next: (data) => {
        this.data_source.data = data;
        this.data_source.filterPredicate = (data: ICandidateDetail, filter_str: string) =>
          this.applyFilters(data, filter_str);
      },
      error: (_) => this.toastr.error('Cannot load the candidates', 'Error'),
    });
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
      !filter_value.availability ||
      (filter_value.availability === 'true' && candidate.availability) ||
      (filter_value.availability === 'false' && !candidate.availability);

    return nameMatch && surnameMatch && seniorityMatch && yearsMatch && availabilityMatch;
  }

  clearFilters() {
    this.filter.reset({
      name: '',
      surname: '',
      seniority: '',
      years: '',
      availability: '',
    });
  }

  openDialog() {
    this.show_dialog = true;
  }

  closeDialog() {
    this.show_dialog = false;
  }

  toggleDetails(candidate: ICandidateDetail | undefined) {
    if (candidate) {
      this.expanded_row = this.expanded_row === candidate ? null : candidate;
    }
    this.table.renderRows()
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
    const data = this.data_source.data.filter(c => c.id !== id);
    this.data_source.data = data;
    this.expanded_row = null; 
    this.table.renderRows();
  }

  onCancelDetails() {
    this.expanded_row = null;
    this.table.renderRows();
  }
}
