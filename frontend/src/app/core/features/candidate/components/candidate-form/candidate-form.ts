import { Component } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';

@Component({
  standalone: true,
  selector: 'app-candidate-form',
  imports: [ReactiveFormsModule],
  templateUrl: './candidate-form.html',
  styleUrl: './candidate-form.css',
})
export class CandidateForm {
  form: FormGroup = {} as FormGroup;

  constructor(private fb: FormBuilder) {}

  ngOnInit() {
    this.form = this.fb.group({
      name: ['', Validators.required],
      surname: ['', Validators.required],
    });
  }

  // downloadExcelTemplate() {
  //   const ws = XLSX.utils.json_to_sheet(template_data);
  //   const wb = XLSX.utils.book_new();
  //   XLSX.utils.book_append_sheet(wb, ws, 'Candidates');
  //   XLSX.writeFile(wb, 'candidate_template.xlsx');
  // }

  // onFileSelected(event: Event) {
  //   const input = event.target as HTMLInputElement;
  //   if (input.files && input.files.length > 0) {
  //     this.uploaded_file = input.files[0];
  //     this.readExcelFile(this.uploaded_file);
  //   }
  // }

  // readExcelFile(file: File) {
  //   const reader = new FileReader();
  //   reader.onload = (e: ProgressEvent<FileReader>) => {
  //     const data = e.target?.result;
  //     const workbook = XLSX.read(data, { type: 'binary' });
  //     const sheet_name = workbook.SheetNames[0];
  //     const worksheet = workbook.Sheets[sheet_name];
  //     const json_data = XLSX.utils.sheet_to_json(worksheet) as any[];

  //     this.uploaded_candidates = json_data
  //       .map((row) => ({
  //         name: String(row.name || '').trim(),
  //         surname: String(row.surname || '').trim(),
  //       }))
  //       .filter((candidate) => candidate.name && candidate.surname);
  //   };
  //   reader.readAsBinaryString(file);
  // }

  // submit() {
  //   const candidate = this.form.value;
  //   console.log('Candidate submitted:', candidate);
  // }

  // saveCandidates() {
  //   if (this.new_candidate_form.valid) {
  //     const candidate: ICandidate = this.new_candidate_form.value;
  //     this.candidateService.create(candidate).subscribe({
  //       next: (data) => {
  //         this.loadData();
  //         this.closeDialog();
  //       },
  //       error: (err) => {
  //         console.error('Error creating candidate', err);
  //       },
  //     });
  //   } else if (this.uploaded_candidates.length > 0) {
  //     let completed = 0;
  //     const total = this.uploaded_candidates.length;

  //     this.uploaded_candidates.forEach((candidate) => {
  //       this.candidateService.create(candidate).subscribe({
  //         next: (data) => {
  //           completed++;
  //           if (completed === total) {
  //             this.loadData();
  //             this.closeDialog();
  //           }
  //         },
  //         error: (err) => {
  //           console.error('Error creating candidate', err);
  //           completed++;
  //           if (completed === total) {
  //             this.loadData();
  //             this.closeDialog();
  //           }
  //         },
  //       });
  //     });
  //   }
  // }
}
