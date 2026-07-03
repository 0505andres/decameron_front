import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiService } from './api.service';

export interface RoomsReport {
  hotel: string;
  ocupacion: number;
  totalHabitaciones: number;
  ocupadas: number;
}

@Injectable({ providedIn: 'root' })
export class ReporteService {
  constructor(private api: ApiService) {}

  getRoomsReport(): Observable<RoomsReport[]> {
    return this.api.get<RoomsReport[]>('/hotel/rooms-report');
  }
}
