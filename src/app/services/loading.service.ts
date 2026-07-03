import { Injectable, signal } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class LoadingService {
  private _loading = signal(false);
  readonly loading = this._loading.asReadonly();

  setLoading(value: boolean) {
    this._loading.set(value);
  }
}
