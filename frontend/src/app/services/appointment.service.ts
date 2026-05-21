import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Appointment, AppointmentStatus } from '../models/appointment.model';

@Injectable({
  providedIn: 'root',
})
export class AppointmentService {
  private http = inject(HttpClient);

  private apiUrl =
    'https://appointment-booking-backend-fk1i.onrender.com/api/appointments';

  getAppointments(
    search?: string,
    status?: AppointmentStatus | ''
  ): Observable<Appointment[]> {
    let params = new HttpParams();

    if (search?.trim()) {
      params = params.set('search', search.trim());
    }

    if (status) {
      params = params.set('status', status);
    }

    return this.http.get<Appointment[]>(this.apiUrl, { params });
  }

  getAppointment(id: number): Observable<Appointment> {
    return this.http.get<Appointment>(`${this.apiUrl}/${id}`);
  }

  createAppointment(data: Appointment): Observable<Appointment> {
    return this.http.post<Appointment>(this.apiUrl, data);
  }

  updateAppointment(
    id: number,
    data: Appointment
  ): Observable<Appointment> {
    return this.http.put<Appointment>(
      `${this.apiUrl}/${id}`,
      data
    );
  }

  deleteAppointment(
    id: number
  ): Observable<{ success: boolean }> {
    return this.http.delete<{ success: boolean }>(
      `${this.apiUrl}/${id}`
    );
  }
}
