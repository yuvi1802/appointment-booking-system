import {
  Component,
  EventEmitter,
  Input,
  OnChanges,
  OnInit,
  Output,
  SimpleChanges,
  inject,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  AbstractControl,
  FormBuilder,
  ReactiveFormsModule,
  ValidationErrors,
  ValidatorFn,
  Validators,
} from '@angular/forms';
import {
  Appointment,
  AppointmentStatus,
} from '../../models/appointment.model';

@Component({
  selector: 'app-appointment-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './appointment-form.html',
  styleUrls: ['./appointment-form.css'],
})
export class AppointmentFormComponent implements OnInit, OnChanges {
  private fb = inject(FormBuilder);

  @Input() editingAppointment: Appointment | null = null;
  @Input() isSaving: boolean = false;
  @Output() save = new EventEmitter<Appointment>();
  @Output() cancel = new EventEmitter<void>();

  readonly statusOptions: AppointmentStatus[] = [
    'Pending',
    'Confirmed',
    'Completed',
    'Cancelled',
  ];

  form = this.fb.group({
    customer_name: ['', [Validators.required, this.notBlankValidator()]],
    appointment_date: ['', [Validators.required, this.futureDateValidator()]],
    status: this.fb.control<AppointmentStatus>('Pending', Validators.required),
  });

  submitted = false;

  ngOnInit(): void {
    if (this.editingAppointment) {
      this.populateForm(this.editingAppointment);
    }
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['editingAppointment']) {
      this.submitted = false;
      if (this.editingAppointment) {
        this.populateForm(this.editingAppointment);
      } else {
        this.resetForm();
      }
    }
  }

  get isEditMode(): boolean {
    return this.editingAppointment !== null;
  }

  get customerName() {
    return this.form.get('customer_name');
  }
  get appointmentDate() {
    return this.form.get('appointment_date');
  }
  get statusCtrl() {
    return this.form.get('status');
  }

  onSubmit(): void {
    this.submitted = true;

    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    const raw = this.form.value;
    const payload: Appointment = {
      customer_name: (raw.customer_name ?? '').trim(),
      appointment_date: raw.appointment_date ?? '',
      status: (raw.status ?? 'Pending') as AppointmentStatus,
    };

    if (this.isEditMode && this.editingAppointment?.id !== undefined) {
      payload.id = this.editingAppointment.id;
    }

    this.save.emit(payload);

    // Only reset in create mode (edit mode reset is controlled by parent)
    if (!this.isEditMode) {
      this.resetForm();
    }
  }

  onCancel(): void {
    this.resetForm();
    this.cancel.emit();
  }

  private populateForm(appointment: Appointment): void {
    this.form.patchValue({
      customer_name: appointment.customer_name,
      appointment_date: this.toDatetimeLocal(appointment.appointment_date),
      status: appointment.status,
    });
  }

  private resetForm(): void {
    this.submitted = false;
    this.form.reset({
      customer_name: '',
      appointment_date: '',
      status: 'Pending',
    });
  }

  // datetime-local needs "YYYY-MM-DDTHH:mm" (no seconds, no timezone)
  private toDatetimeLocal(value: string): string {
    if (!value) return '';
    const date = new Date(value);
    if (isNaN(date.getTime())) return '';
    const pad = (n: number) => String(n).padStart(2, '0');
    return (
      date.getFullYear() +
      '-' +
      pad(date.getMonth() + 1) +
      '-' +
      pad(date.getDate()) +
      'T' +
      pad(date.getHours()) +
      ':' +
      pad(date.getMinutes())
    );
  }

  // Custom validators
  private notBlankValidator(): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      const value = control.value;
      if (typeof value !== 'string') return null;
      if (value.length > 0 && value.trim().length === 0) {
        return { blank: true };
      }
      return null;
    };
  }

  private futureDateValidator(): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      const value = control.value;
      if (!value) return null;

      const date = new Date(value);
      if (isNaN(date.getTime())) {
        return { invalidDate: true };
      }

      if (date.getTime() <= Date.now()) {
        return { pastDate: true };
      }

      return null;
    };
  }
}
