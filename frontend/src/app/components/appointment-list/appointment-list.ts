import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { Appointment } from '../../models/appointment.model';
import { StatusBadgeComponent } from '../status-badge/status-badge';

@Component({
  selector: 'app-appointment-list',
  standalone: true,
  imports: [CommonModule, DatePipe, StatusBadgeComponent],
  templateUrl: './appointment-list.html',
  styleUrls: ['./appointment-list.css'],
})
export class AppointmentListComponent {
  @Input() appointments: Appointment[] = [];
  @Input() hasActiveFilters: boolean = false;
  @Input() deletingId: number | null = null;
  @Output() edit = new EventEmitter<Appointment>();
  @Output() delete = new EventEmitter<number>();

  onEdit(appointment: Appointment): void {
    this.edit.emit(appointment);
  }

  onDelete(id: number | undefined): void {
    if (id !== undefined) {
      this.delete.emit(id);
    }
  }

  trackById(index: number, appointment: Appointment): number {
    return appointment.id ?? index;
  }
}
