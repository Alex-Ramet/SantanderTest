import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatCheckboxModule } from '@angular/material/checkbox';
@Component({
  selector: 'app-table-filter',
  imports: [
    CommonModule,
    FormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatCheckboxModule,
  ],
  templateUrl: './table-filter.html',
  styleUrl: './table-filter.css',
})
export class TableFilter {
  @Input() filters: any;
  @Output() filterChange = new EventEmitter<void>();

  seniorities = ['junior', 'senior'];
}
