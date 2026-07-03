import { ChangeDetectionStrategy, Component, effect, inject, signal } from '@angular/core';
import { AbstractControl, FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatSnackBar } from '@angular/material/snack-bar';
import { shareReplay, tap } from 'rxjs';
import { ReservasService } from '../../services/reservas.service';
import { HotelService } from '../../services/hotel.service';
import { TipoAcomodacionService } from '../../services/tipo-acomodacion.service';
import { TipoHabitacionService } from '../../services/tipo-habitacion.service';
import { HabitacionService } from '../../services/habitacion.service';

@Component({
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatButtonModule
  ],
  template: `
    <h2 mat-dialog-title>Nueva reserva</h2>
    <mat-dialog-content [formGroup]="form">
      <mat-form-field appearance="fill" class="full-width">
        <mat-label>Hotel</mat-label>
        <mat-select formControlName="hotelId">
          <mat-option *ngFor="let hotel of hotels$ | async" [value]="hotel.id">{{ hotel.nombre }}</mat-option>
        </mat-select>
        <mat-error *ngIf="form.controls.hotelId.hasError('required')">
          Hotel es obligatorio
        </mat-error>
      </mat-form-field>

      <mat-form-field appearance="fill" class="full-width">
        <mat-label>Acomodación</mat-label>
        <mat-select formControlName="tipoAcomodacionId">
          <mat-option *ngFor="let tipo of acomodaciones$ | async" [value]="tipo.id">{{ tipo.nombre }}</mat-option>
        </mat-select>
        <mat-error *ngIf="form.controls.tipoAcomodacionId.hasError('required')">
          Acomodación es obligatoria
        </mat-error>
      </mat-form-field>

      <mat-form-field appearance="fill" class="full-width">
        <mat-label>Tipo de habitación</mat-label>
        <mat-select formControlName="tipoHabitacionId">
          <mat-option *ngFor="let tipo of tiposHabitacion$ | async" [value]="tipo.id">{{ tipo.nombre }}</mat-option>
        </mat-select>
        <mat-error *ngIf="form.controls.tipoHabitacionId.hasError('required')">
          Tipo de habitación es obligatorio
        </mat-error>
      </mat-form-field>

      <mat-form-field appearance="fill" class="full-width">
        <mat-label>Habitación</mat-label>
        <mat-select formControlName="habitacionId" [disabled]="!habitacionEnabled()">
          <mat-option *ngFor="let habitacion of habitaciones$()" [value]="habitacion.id">{{ habitacion.codigo }}</mat-option>
        </mat-select>
        <mat-error *ngIf="form.controls.habitacionId.hasError('required')">
          Habitación es obligatoria
        </mat-error>
      </mat-form-field>

      <mat-form-field appearance="fill" class="full-width">
        <mat-label>Cliente</mat-label>
        <input matInput formControlName="cliente" />
        <mat-error *ngIf="form.controls.cliente.hasError('required')">
          Cliente es obligatorio
        </mat-error>
        <mat-error *ngIf="form.controls.cliente.hasError('maxlength')">
          Máximo 100 caracteres
        </mat-error>
      </mat-form-field>

      <mat-form-field appearance="fill" class="full-width">
        <mat-label>Número Documento</mat-label>
        <input matInput formControlName="numeroDocumento" />
        <mat-error *ngIf="form.controls.numeroDocumento.hasError('required')">
          Documento es obligatorio
        </mat-error>
        <mat-error *ngIf="form.controls.numeroDocumento.hasError('maxlength')">
          Máximo 20 caracteres
        </mat-error>
      </mat-form-field>

      <mat-form-field appearance="fill" class="full-width">
        <mat-label>Edad</mat-label>
        <input matInput type="number" formControlName="edad" />
        <mat-error *ngIf="form.controls.edad.hasError('required')">
          Edad es obligatoria
        </mat-error>
        <mat-error *ngIf="form.controls.edad.hasError('min') || form.controls.edad.hasError('max')">
          Edad debe estar entre 18 y 100
        </mat-error>
      </mat-form-field>

      <mat-form-field appearance="fill" class="full-width">
        <mat-label>Fecha Ingreso</mat-label>
        <input matInput type="date" formControlName="fechaIngreso" />
        <mat-error *ngIf="form.controls.fechaIngreso.hasError('required')">
          Fecha de ingreso es obligatoria
        </mat-error>
      </mat-form-field>

      <mat-form-field appearance="fill" class="full-width">
        <mat-label>Fecha Salida</mat-label>
        <input matInput type="date" formControlName="fechaSalida" />
        <mat-error *ngIf="form.controls.fechaSalida.hasError('required')">
          Fecha de salida es obligatoria
        </mat-error>
        <mat-error *ngIf="form.hasError('fechaSalidaInvalida')">
          La fecha de salida debe ser mayor a la fecha de ingreso
        </mat-error>
      </mat-form-field>
    </mat-dialog-content>
    <mat-dialog-actions align="end">
      <button mat-button (click)="close()">Cancelar</button>
      <button mat-flat-button color="primary" [disabled]="form.invalid" (click)="submit()">Guardar</button>
    </mat-dialog-actions>
  `,
  styles: [
    `
      .full-width {
        width: 100%;
      }
    `
  ],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ReservaCreateDialogComponent {
  private fb = inject(FormBuilder);
  private hotelService = inject(HotelService);
  private acomodacionService = inject(TipoAcomodacionService);
  private tipoHabitacionService = inject(TipoHabitacionService);
  private habitacionService = inject(HabitacionService);
  private reservasService = inject(ReservasService);
  private snackBar = inject(MatSnackBar);
  private dialogRef = inject(MatDialogRef<ReservaCreateDialogComponent>);

  form = this.fb.group({
    hotelId: [null, Validators.required],
    tipoAcomodacionId: [null, Validators.required],
    tipoHabitacionId: [null, Validators.required],
    habitacionId: [null, Validators.required],
    cliente: ['', [Validators.required, Validators.maxLength(100)]],
    numeroDocumento: ['', [Validators.required, Validators.maxLength(20)]],
    edad: [null, [Validators.required, Validators.min(18), Validators.max(100)]],
    fechaIngreso: ['', Validators.required],
    fechaSalida: ['', Validators.required]
  }, { validators: this.validateDates.bind(this) });

  hotels$ = this.hotelService.getAll().pipe(shareReplay(1));
  acomodaciones$ = this.acomodacionService.getAll().pipe(shareReplay(1));
  tiposHabitacion$ = this.tipoHabitacionService.getAll().pipe(shareReplay(1));

  private readonly habitacionesSignal = signal([] as Array<{ id: number; codigo: string }>);
  readonly habitaciones$ = this.habitacionesSignal.asReadonly();

  constructor() {
    effect(() => {
      const hotelId = this.form.controls.hotelId.value;
      const tipoAcomodacionId = this.form.controls.tipoAcomodacionId.value;
      const tipoHabitacionId = this.form.controls.tipoHabitacionId.value;

      if (hotelId && tipoAcomodacionId && tipoHabitacionId) {
        this.habitacionService
          .getDisponibles({ hotelId, tipoAcomodacionId, tipoHabitacionId })
          .subscribe((data) => this.habitacionesSignal.set(data));
      }
    });
  }

  habitacionEnabled() {
    return this.form.controls.hotelId.valid && this.form.controls.tipoAcomodacionId.valid && this.form.controls.tipoHabitacionId.valid;
  }

  validateDates(control: AbstractControl) {
    const ingreso = control.get('fechaIngreso')?.value as string;
    const salida = control.get('fechaSalida')?.value as string;
    if (!ingreso || !salida) {
      return null;
    }
    const ingresoDate = new Date(ingreso);
    const salidaDate = new Date(salida);
    return salidaDate > ingresoDate ? null : { fechaSalidaInvalida: true };
  }

  close() {
    this.dialogRef.close(false);
  }

  submit() {
    if (this.form.invalid) {
      return;
    }

    this.reservasService.create(this.form.getRawValue() as any).subscribe({
      next: () => {
        this.snackBar.open('Reserva creada con éxito', 'Cerrar', { duration: 4000 });
        this.dialogRef.close(true);
      },
      error: () => {
        this.snackBar.open('No se pudo crear la reserva', 'Cerrar', { duration: 4000 });
      }
    });
  }
}
