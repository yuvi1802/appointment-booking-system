import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpErrorResponse } from '@angular/common/http';
import { AppointmentService } from './services/appointment.service';
import { Appointment, AppointmentStatus } from './models/appointment.model';
import { AppointmentFormComponent } from './components/appointment-form/appointment-form';
import { AppointmentListComponent } from './components/appointment-list/appointment-list';
import {
  SearchFilterComponent,
  FilterChange,
} from './components/search-filter/search-filter';

interface Toast {
  id: number;
  type: 'success' | 'error';
  message: string;
}

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    CommonModule,
    AppointmentFormComponent,
    AppointmentListComponent,
    SearchFilterComponent,
  ],
  templateUrl: './app.html',
  styleUrls: ['./app.css'],
})
export class App implements OnInit {
  private appointmentService = inject(AppointmentService);

  appointments: Appointment[] = [];
  editingAppointment: Appointment | null = null;

  // Filter state
  private currentSearch: string = '';
  private currentStatus: AppointmentStatus | '' = '';

  // Loading flags
  isSaving = false;
  deletingId: number | null = null;

  // Delete modal state
  deleteTarget: Appointment | null = null;

  // Toast state
  toasts: Toast[] = [];
  private toastId = 0;

  ngOnInit(): void {
    this.loadAppointments();
  }

  get hasActiveFilters(): boolean {
    return (
      this.currentSearch.trim().length > 0 || this.currentStatus !== ''
    );
  }

  // Load
  loadAppointments(): void {
    this.appointmentService
      .getAppointments(this.currentSearch, this.currentStatus)
      .subscribe({
        next: (data) => {
          this.appointments = data;
        },
        error: (err: HttpErrorResponse) => {
          this.handleError(err, 'Failed to load appointments');
        },
      });
  }

  // Save (create or update)
  handleSave(appointment: Appointment): void {
    this.isSaving = true;

    if (this.editingAppointment && appointment.id !== undefined) {
      this.appointmentService
        .updateAppointment(appointment.id, appointment)
        .subscribe({
          next: () => {
            this.isSaving = false;
            this.editingAppointment = null;
            this.showToast('success', 'Appointment updated');
            this.loadAppointments();
          },
          error: (err: HttpErrorResponse) => {
            this.isSaving = false;
            this.handleError(err, 'Failed to update appointment');
          },
        });
    } else {
      this.appointmentService.createAppointment(appointment).subscribe({
        next: () => {
          this.isSaving = false;
          this.showToast('success', 'Appointment created');
          this.loadAppointments();
        },
        error: (err: HttpErrorResponse) => {
          this.isSaving = false;
          this.handleError(err, 'Failed to create appointment');
        },
      });
    }
  }

  // Edit
  handleEdit(appointment: Appointment): void {
    this.editingAppointment = { ...appointment };
    this.scrollToForm();
  }

  // Delete (modal flow)
  handleDelete(id: number): void {
    const appointment = this.appointments.find((a) => a.id === id);
    if (appointment) {
      this.deleteTarget = appointment;
    }
  }

  confirmDelete(): void {
    if (!this.deleteTarget?.id) return;

    const id = this.deleteTarget.id;
    this.deletingId = id;

    this.appointmentService.deleteAppointment(id).subscribe({
      next: () => {
        this.deletingId = null;
        this.deleteTarget = null;
        if (this.editingAppointment?.id === id) {
          this.editingAppointment = null;
        }
        this.showToast('success', 'Appointment deleted');
        this.loadAppointments();
      },
      error: (err: HttpErrorResponse) => {
        this.deletingId = null;
        this.deleteTarget = null;
        this.handleError(err, 'Failed to delete appointment');
      },
    });
  }

  cancelDelete(): void {
    if (this.deletingId !== null) return; // Block close while in-flight
    this.deleteTarget = null;
  }

  handleCancelEdit(): void {
    this.editingAppointment = null;
  }

  // Filter
  handleFilterChange(filters: FilterChange): void {
    this.currentSearch = filters.search;
    this.currentStatus = filters.status;
    this.loadAppointments();
  }

  // Toast
  showToast(type: 'success' | 'error', message: string): void {
    const id = ++this.toastId;
    this.toasts.push({ id, type, message });
    setTimeout(() => this.dismissToast(id), 3500);
  }

  dismissToast(id: number): void {
    this.toasts = this.toasts.filter((t) => t.id !== id);
  }

  // Helpers
  private handleError(err: HttpErrorResponse, fallback: string): void {
    const message = err.error?.error || err.message || fallback;

    if (err.status === 409) {
      this.showToast('error', `Duplicate booking: ${message}`);
    } else if (err.status === 400) {
      this.showToast('error', `Validation error: ${message}`);
    } else if (err.status === 404) {
      this.showToast('error', `Not found: ${message}`);
    } else {
      this.showToast('error', `Server error: ${message}`);
    }
  }

  private scrollToForm(): void {
    setTimeout(() => {
      const formEl = document.querySelector('app-appointment-form');
      if (formEl) {
        formEl.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    }, 50);
  }
}
