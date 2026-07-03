import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiService } from './api.service';

export interface HabitacionResponse {
  id: number;
  codigo: string;
}

export interface HabitacionDisponibilidadRequest {
  hotelId: number;
  tipoAcomodacionId: number;
  tipoHabitacionId: number;
}

@Injectable({ providedIn: 'root' })
export class HabitacionService {
  constructor(private api: ApiService) {}

  getDisponibles(payload: HabitacionDisponibilidadRequest): Observable<HabitacionResponse[]> {
    const query = `?hotelId=${payload.hotelId}&tipoHabitacionId=${payload.tipoHabitacionId}&acomodacionId=${payload.tipoAcomodacionId}`;
    return this.api.get<HabitacionResponse[]>(`/habitacion/disponible${query}`);
  }
}
