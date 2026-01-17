import { Component } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { CandidateService } from '../../../../services/canidate.service';
import { MatDialogModule, MatDialogRef } from '@angular/material/dialog';

import { ICandidate } from '../../models/ICandidate.interface';
import { ToastrService } from 'ngx-toastr';
import { CommonModule } from '@angular/common';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';

@Component({
  standalone: true,
  selector: 'app-candidate-form',
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatIconModule,
    FormsModule,
    MatButtonModule,
    MatFormFieldModule,
    MatDialogModule,
  ],
  templateUrl: './candidate-form.html',
  styleUrl: './candidate-form.css',
})
export class CandidateForm {
  form: FormGroup = {} as FormGroup;
  uploaded_file: File | null = null;

  constructor(
    private fb: FormBuilder,
    private candidateService: CandidateService,
    private toastr: ToastrService,
    private dialogRef: MatDialogRef<CandidateForm>
  ) {}

  ngOnInit() {
    this.form = this.fb.group({
      name: ['', Validators.required],
      surname: ['', Validators.required],
    });
  }

  onFileSelected(event: Event) {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      this.uploaded_file = input.files[0];
    }
  }

  onSaveCanidate() {
    if (!this.uploaded_file) {
      this.toastr.error('Its necessary to upload a file', 'Error');
    }
    const candidate: ICandidate = this.form.value;
    this.candidateService.create(candidate, this.uploaded_file!).subscribe({
      next: (data) => {
        this.dialogRef.close(data);
        this.toastr.success('Candidate added', 'Success');
      },
      error: (err) => {
        this.toastr.error(err.error.message, 'Error');
      },
    });
  }

  closeDialog() {
    this.dialogRef.close(undefined);
  }

  getErrorMessage(fieldName: string): string {
    const control = this.form.get(fieldName);
    if (control?.hasError('required')) {
      return `${fieldName} is required`;
    }
    return '';
  }
}
