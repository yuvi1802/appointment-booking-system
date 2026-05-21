export type AppointmentStatus =
  | 'Pending'
  | 'Confirmed'
  | 'Completed'
  | 'Cancelled';

export interface Appointment {
  id?: number;
  customer_name: string;
  appointment_date: string;
  status: AppointmentStatus;
  created_at?: string;
}
