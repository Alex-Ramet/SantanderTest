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

  form: FormGroup = {} as FormGroup

  constructor(
    private fb: FormBuilder,
  ) {}
  
  ngOnInit() {
    this.form = this.fb.group({
      name: ['', Validators.required],
      surname: ['', Validators.required],
    })
  }

  submit() {
    const candidate = this.form.value
    console.log('Candidate submitted:', candidate);
  }

}
