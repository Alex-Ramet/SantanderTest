import { Component, Input, Output, EventEmitter, OnInit, ViewChild, TemplateRef, inject } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { ICandidateDetail } from '../../models/ICandidateDetail.interface';
import { CandidateSeniority } from '../../models/ICandidateSeniority.enum';
import { CandidateService } from '../../../../services/canidate.service';
import { ToastrService } from 'ngx-toastr';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';

@Component({
  selector: 'app-candidate-details',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatInputModule,
    MatFormFieldModule,
    MatSelectModule,
    MatButtonModule,
    MatCheckboxModule,
    FormsModule,
    MatDialogModule,
  ],
  templateUrl: './candidate-details.html',
  styleUrls: ['./candidate-details.css'],
})
export class CandidateDetailsComponent implements OnInit {
  @Input() candidate: ICandidateDetail | null = {} as ICandidateDetail;
  @Output() save = new EventEmitter<ICandidateDetail>();
  @Output() cancel = new EventEmitter<void>();
  @Output() delete = new EventEmitter<number>();

  @ViewChild('deleteDialog') delete_dialog!: TemplateRef<any>;

  form: FormGroup = {} as FormGroup;
  seniorityOptions = [
    { value: CandidateSeniority.Junior, label: 'Junior' },
    { value: CandidateSeniority.Senior, label: 'Senior' },
  ];

  constructor(
    private fb: FormBuilder,
    private candidateService: CandidateService,
    private toastr: ToastrService,
    private dialog: MatDialog
  ) {}

  ngOnInit() {
    this.form = this.fb.group({
      name: [this.candidate?.name, [Validators.required]],
      surname: [this.candidate?.surname, [Validators.required]],
      seniority: [this.candidate?.seniority, [Validators.required]],
      years: [this.candidate?.years, [Validators.required]],
      availability: [this.candidate?.availability],
    });
  }

  onSubmit() {
    if (this.candidate == null) {
      this.toastr.success('The Candidate is not selected', 'Error');
      return;
    }
    const updatedCandidate: ICandidateDetail = this.form.value;
    this.candidateService.update(this.candidate.id!, updatedCandidate).subscribe({
      next: (data) => {
        this.toastr.success('Candidate information updated successfully', 'Success');
        this.save.emit(data);
      },
      error: (err) => {
        this.toastr.error(err, 'Error');
      },
    });
  }

  onDelete() {
    this.dialog.open(this.delete_dialog);
  }

  confirmDelete() {
    this.candidateService.delete(this.candidate!.id!).subscribe({
        next: () => {
          this.toastr.success('Candidate deleted successfully', 'Success');
          this.delete.emit(this.candidate!.id);
          this.dialog.closeAll();
        },
        error: (err) => {
            this.toastr.error('Error deleting candidate', 'Error');
            this.dialog.closeAll();
        }
      });
  }

  onCancel() {
    this.cancel.emit();
  }

  getErrorMessage(fieldName: string): string {
    const control = this.form.get(fieldName);
    if (control?.hasError('required')) {
      return `${fieldName.charAt(0).toUpperCase() + fieldName.slice(1)} is required`;
    }
    return '';
  }
}
