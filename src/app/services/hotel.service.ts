import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiService } from './api.service';

export interface Hotel {
  id: number;
  nombre: string;
}

@Injectable({ providedIn: 'root' })
export class HotelService {
  constructor(private api: ApiService) {}

  getAll(): Observable<Hotel[]> {
    return this.api.get<Hotel[]>('/hotel');
  }
}
