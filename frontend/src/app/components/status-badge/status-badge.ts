import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AppointmentStatus } from '../../models/appointment.model';

@Component({
  selector: 'app-status-badge',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './status-badge.html',
  styleUrls: ['./status-badge.css'],
})
export class StatusBadgeComponent {
  @Input() status!: AppointmentStatus;

  get statusClass(): string {
    const map: Record<AppointmentStatus, string> = {
      Pending: 'badge-pending',
      Confirmed: 'badge-confirmed',
      Completed: 'badge-completed',
      Cancelled: 'badge-cancelled',
    };
    return map[this.status] || 'badge-pending';
  }
}
