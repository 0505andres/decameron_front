import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiService } from './api.service';

export interface Reserva {
  id: number;
  cliente: string;
  numeroDocumento: string;
  edad: number;
  fechaIngreso: string;
  fechaSalida: string;
  hotel: string;
  tipoHabitacion: string;
  habitacion: string;
}

export interface ReservaCreateRequest {
  hotelId: number;
  tipoAcomodacionId: number;
  tipoHabitacionId: number;
  habitacionId: number;
  cliente: string;
  numeroDocumento: string;
  edad: number;
  fechaIngreso: string;
  fechaSalida: string;
}

@Injectable({ providedIn: 'root' })
export class ReservasService {
  constructor(private api: ApiService) {}

  getAll(): Observable<Reserva[]> {
    return this.api.get<Reserva[]>('/reserva');
  }

  create(payload: ReservaCreateRequest): Observable<Reserva> {
    return this.api.post<Reserva>('/reserva', payload);
  }
}
