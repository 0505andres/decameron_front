import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { MatListModule } from '@angular/material/list';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [RouterLink, RouterLinkActive, MatListModule, MatIconModule],
  template: `
    <aside class="sidebar">
      <div class="brand">
        <span class="brand-name">Decameron</span>
      </div>
      <mat-nav-list>
        <a mat-list-item routerLink="/welcome" routerLinkActive="active"> <mat-icon>home</mat-icon> Bienvenido</a>
        <a mat-list-item routerLink="/reservas" routerLinkActive="active"> <mat-icon>event</mat-icon> Reservas</a>
        <a mat-list-item routerLink="/reporte" routerLinkActive="active"> <mat-icon>bar_chart</mat-icon> Reporte</a>
      </mat-nav-list>
    </aside>
  `,
  styles: [
    `
      :host {
        display: block;
      }
      .sidebar {
        width: 260px;
        min-height: 100vh;
        background: #111827;
        color: #f8fafc;
        padding: 1.5rem 1rem;
        box-sizing: border-box;
        position: fixed;
      }
      .brand {
        margin-bottom: 2rem;
      }
      .brand-name {
        font-size: 1.25rem;
        font-weight: 700;
        letter-spacing: 0.03em;
      }
      a.mat-list-item {
        color: #f8fafc;
      }
      a.mat-list-item.active {
        background: rgba(255, 255, 255, 0.1);
      }
      @media (max-width: 900px) {
        .sidebar {
          position: relative;
          width: 100%;
          min-height: auto;
        }
      }
    `
  ],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class SidebarComponent {}
