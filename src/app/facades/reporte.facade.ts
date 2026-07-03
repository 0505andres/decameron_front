import { Injectable, signal } from '@angular/core';
import { catchError, EMPTY, tap } from 'rxjs';
import { ReporteService, RoomsReport } from '../services/reporte.service';

@Injectable({ providedIn: 'root' })
export class ReporteFacade {
  private reportesSignal = signal<RoomsReport[]>([]);
  private loadingSignal = signal(false);
  readonly reportes = this.reportesSignal.asReadonly();
  readonly loading = this.loadingSignal.asReadonly();

  constructor(private reporteService: ReporteService) {
    this.loadReport();
  }

  loadReport() {
    this.loadingSignal.set(true);
    this.reporteService.getRoomsReport().pipe(
      catchError(() => {
        this.loadingSignal.set(false);
        return EMPTY;
      }),
      tap((report) => {
        this.reportesSignal.set(report);
        this.loadingSignal.set(false);
      })
    ).subscribe();
  }
}
