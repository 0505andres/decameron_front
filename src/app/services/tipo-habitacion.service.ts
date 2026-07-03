import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiService } from './api.service';

export interface TipoHabitacion {
  id: number;
  nombre: string;
}

@Injectable({ providedIn: 'root' })
export class TipoHabitacionService {
  constructor(private api: ApiService) {}

  getAll(): Observable<TipoHabitacion[]> {
    return this.api.get<TipoHabitacion[]>('/tipo-habitacion');
  }
}
