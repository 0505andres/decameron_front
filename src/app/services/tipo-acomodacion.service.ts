import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiService } from './api.service';

export interface TipoAcomodacion {
  id: number;
  nombre: string;
}

@Injectable({ providedIn: 'root' })
export class TipoAcomodacionService {
  constructor(private api: ApiService) {}

  getAll(): Observable<TipoAcomodacion[]> {
    return this.api.get<TipoAcomodacion[]>('/tipo-acomodacion');
  }
}
