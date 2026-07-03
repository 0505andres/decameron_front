import { effect, Injectable, computed, signal } from '@angular/core';
import { catchError, EMPTY, tap } from 'rxjs';
import { ReservasService, Reserva } from '../services/reservas.service';

@Injectable({ providedIn: 'root' })
export class ReservaFacade {
  private reservasSignal = signal<Reserva[]>([]);
  private loadingSignal = signal(false);
  readonly reservas = this.reservasSignal.asReadonly();
  readonly loading = this.loadingSignal.asReadonly();
  readonly totalReservas = computed(() => this.reservasSignal().length);

  constructor(private reservasService: ReservasService) {
    effect(() => {
      if (this.reservasSignal().length === 0) {
        this.loadReservas();
      }
    });
  }

  loadReservas() {
    this.loadingSignal.set(true);
    this.reservasService.getAll().pipe(
      catchError(() => {
        this.loadingSignal.set(false);
        return EMPTY;
      }),
      tap((res) => {
        this.reservasSignal.set(res);
        this.loadingSignal.set(false);
      })
    ).subscribe();
  }

  addReserva(reserva: Reserva) {
    this.reservasSignal.update((current) => [...current, reserva]);
  }
}
