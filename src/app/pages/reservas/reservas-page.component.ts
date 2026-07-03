import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { MatTableModule } from '@angular/material/table';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { ReservaCreateDialogComponent } from './reserva-create-dialog.component';
import { ReservaFacade } from '../../facades/reserva.facade';

@Component({
  standalone: true,
  imports: [CommonModule, MatTableModule, MatButtonModule, MatIconModule, MatDialogModule, MatProgressSpinnerModule],
  template: `
    <section class="reservas-shell">
      <div class="toolbar">
        <h2>Reservas</h2>
        <button mat-flat-button color="primary" (click)="openCreateDialog()">
          <mat-icon>add</mat-icon>
          Nueva reserva
        </button>
      </div>

      <div *ngIf="loading()" class="loading-state">
        <mat-progress-spinner mode="indeterminate"></mat-progress-spinner>
      </div>

      <table mat-table [dataSource]="reservas()" class="mat-elevation-z1" *ngIf="!loading()">
        <ng-container matColumnDef="cliente">
          <th mat-header-cell *matHeaderCellDef>Cliente</th>
          <td mat-cell *matCellDef="let row">{{ row.cliente }}</td>
        </ng-container>
        <ng-container matColumnDef="numeroDocumento">
          <th mat-header-cell *matHeaderCellDef>Documento</th>
          <td mat-cell *matCellDef="let row">{{ row.numeroDocumento }}</td>
        </ng-container>
        <ng-container matColumnDef="edad">
          <th mat-header-cell *matHeaderCellDef>Edad</th>
          <td mat-cell *matCellDef="let row">{{ row.edad }}</td>
        </ng-container>
        <ng-container matColumnDef="hotel">
          <th mat-header-cell *matHeaderCellDef>Hotel</th>
          <td mat-cell *matCellDef="let row">{{ row.hotel }}</td>
        </ng-container>
        <ng-container matColumnDef="tipoHabitacion">
          <th mat-header-cell *matHeaderCellDef>Tipo</th>
          <td mat-cell *matCellDef="let row">{{ row.tipoHabitacion }}</td>
        </ng-container>
        <ng-container matColumnDef="habitacion">
          <th mat-header-cell *matHeaderCellDef>Habitación</th>
          <td mat-cell *matCellDef="let row">{{ row.habitacion }}</td>
        </ng-container>
        <ng-container matColumnDef="fechaIngreso">
          <th mat-header-cell *matHeaderCellDef>Ingreso</th>
          <td mat-cell *matCellDef="let row">{{ row.fechaIngreso }}</td>
        </ng-container>
        <ng-container matColumnDef="fechaSalida">
          <th mat-header-cell *matHeaderCellDef>Salida</th>
          <td mat-cell *matCellDef="let row">{{ row.fechaSalida }}</td>
        </ng-container>

        <tr mat-header-row *matHeaderRowDef="displayedColumns"></tr>
        <tr mat-row *matRowDef="let row; columns: displayedColumns"></tr>
      </table>
    </section>
  `,
  styles: [
    `
      .reservas-shell {
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
      table {
        width: 100%;
      }
      .loading-state {
        display: grid;
        place-items: center;
        min-height: 240px;
      }
    `
  ],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ReservasPageComponent {
  private dialog = inject(MatDialog);
  private reservaFacade = inject(ReservaFacade);

  reservas = this.reservaFacade.reservas;
  loading = this.reservaFacade.loading;
  readonly displayedColumns = ['cliente', 'hotel', 'habitacion', 'fechaIngreso', 'fechaSalida'];

  openCreateDialog() {
    const dialogRef = this.dialog.open(ReservaCreateDialogComponent, { width: '680px' });
    dialogRef.afterClosed().subscribe((created) => {
      if (created) {
        this.reservaFacade.loadReservas();
      }
    });
  }
}
