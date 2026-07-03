import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatTableModule } from '@angular/material/table';
import { ReporteFacade } from '../../facades/reporte.facade';
import { Papa } from 'ngx-papaparse';

@Component({
  standalone: true,
  imports: [CommonModule, MatTableModule, MatButtonModule, MatIconModule, MatProgressSpinnerModule],
  template: `
    <section class="reporte-shell">
      <div class="toolbar">
        <h2>Reporte de Habitaciones</h2>
        <button mat-flat-button color="primary" (click)="exportCsv()">
          <mat-icon>download</mat-icon>
          Exportar CSV
        </button>
      </div>

      <div *ngIf="loading()" class="loading-state">
        <mat-progress-spinner mode="indeterminate"></mat-progress-spinner>
      </div>

      <table mat-table [dataSource]="reportes()" class="mat-elevation-z1" *ngIf="!loading()">
        <ng-container matColumnDef="nombre">
          <th mat-header-cell *matHeaderCellDef>Hotel</th>
          <td mat-cell *matCellDef="let row">{{ row.nombre }}</td>
        </ng-container>
        <ng-container matColumnDef="numeroHabitaciones">
          <th mat-header-cell *matHeaderCellDef>Total Habitaciones</th>
          <td mat-cell *matCellDef="let row">{{ row.numeroHabitaciones }}</td>
        </ng-container>
        <ng-container matColumnDef="habitacionesCreadas">
          <th mat-header-cell *matHeaderCellDef>Habitaciones Creadas</th>
          <td mat-cell *matCellDef="let row">{{ row.habitacionesCreadas }}</td>
        </ng-container>
        <ng-container matColumnDef="habitacionesOcupadas">
          <th mat-header-cell *matHeaderCellDef>Habitaciones Ocupadas</th>
          <td mat-cell *matCellDef="let row">
            <span
              [class.green]="occupancyPercent(row) <= 49"
              [class.yellow]="occupancyPercent(row) >= 50 && occupancyPercent(row) <= 80"
              [class.red]="occupancyPercent(row) >= 81">
              {{ occupancyPercent(row) | number:'1.0-0' }}%
            </span>
          </td>
        </ng-container>

        <tr mat-header-row *matHeaderRowDef="displayedColumns"></tr>
        <tr mat-row *matRowDef="let row; columns: displayedColumns"></tr>
      </table>
    </section>
  `,
  styles: [
    `
      .reporte-shell {
        max-width: 1200px;
        margin: 0 auto;
        padding: 1rem;
      }
      .toolbar {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: 1rem;
        gap: 1rem;
      }
      .loading-state {
        display: grid;
        place-items: center;
        min-height: 240px;
      }
      .green {
        color: #166534;
        font-weight: 700;
      }
      .yellow {
        color: #854d0e;
        font-weight: 700;
      }
      .red {
        color: #b91c1c;
        font-weight: 700;
      }
    `
  ],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ReportePageComponent {
  private facade = inject(ReporteFacade);
  private papa = inject(Papa);

  reportes = this.facade.reportes;
  loading = this.facade.loading;
  readonly displayedColumns = ['nombre', 'numeroHabitaciones', 'habitacionesCreadas', 'habitacionesOcupadas'];

  occupancyPercent(row: { habitacionesOcupadas: number; habitacionesCreadas: number }) {
    return row.habitacionesCreadas
      ? (row.habitacionesOcupadas / row.habitacionesCreadas) * 100
      : 0;
  }

  exportCsv() {
    const csv = this.papa.unparse(this.reportes() as any);
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', 'reporte-habitaciones.csv');
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }
}
