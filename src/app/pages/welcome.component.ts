import { ChangeDetectionStrategy, Component } from '@angular/core';
import { MatCardModule } from '@angular/material/card';

@Component({
  standalone: true,
  selector: 'app-welcome',
  imports: [MatCardModule],
  template: `
    <section class="page-shell">
      <mat-card>
        <h1>Bienvenido</h1>
        <p>Explora reservas, reportes y administra la ocupación de habitaciones.</p>
      </mat-card>
    </section>
  `,
  styles: [
    `
      .page-shell {
        padding: 2rem;
      }
      mat-card {
        max-width: 900px;
        margin: 0 auto;
        padding: 1.75rem;
      }
      h1 {
        margin: 0 0 1rem;
        font-size: 2rem;
      }
      p {
        color: rgba(0,0,0,.7);
      }
    `
  ],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class WelcomeComponent {}
