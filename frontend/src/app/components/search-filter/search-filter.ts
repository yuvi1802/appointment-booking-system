import { Component, EventEmitter, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AppointmentStatus } from '../../models/appointment.model';

export interface FilterChange {
  search: string;
  status: AppointmentStatus | '';
}

@Component({
  selector: 'app-search-filter',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './search-filter.html',
  styleUrls: ['./search-filter.css'],
})
export class SearchFilterComponent {
  @Output() filterChange = new EventEmitter<FilterChange>();

  searchText: string = '';
  selectedStatus: AppointmentStatus | '' = '';

  readonly statusOptions: AppointmentStatus[] = [
    'Pending',
    'Confirmed',
    'Completed',
    'Cancelled',
  ];

  private searchTimer: ReturnType<typeof setTimeout> | null = null;

  onSearchChange(): void {
    // Debounce search by 300ms
    if (this.searchTimer) {
      clearTimeout(this.searchTimer);
    }
    this.searchTimer = setTimeout(() => {
      this.emit();
    }, 300);
  }

  onStatusChange(): void {
    this.emit();
  }

  onClear(): void {
    if (this.searchTimer) {
      clearTimeout(this.searchTimer);
    }
    this.searchText = '';
    this.selectedStatus = '';
    this.emit();
  }

  get hasActiveFilters(): boolean {
    return this.searchText.trim().length > 0 || this.selectedStatus !== '';
  }

  private emit(): void {
    this.filterChange.emit({
      search: this.searchText,
      status: this.selectedStatus,
    });
  }
}
