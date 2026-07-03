import { HttpHandlerFn, HttpInterceptorFn, HttpRequest } from '@angular/common/http';
import { inject } from '@angular/core';
import { finalize } from 'rxjs';
import { LoadingService } from '../services/loading.service';

let activeRequests = 0;

export const loadingInterceptor: HttpInterceptorFn = (req: HttpRequest<unknown>, next: HttpHandlerFn) => {
  const loadingService = inject(LoadingService);
  activeRequests += 1;
  loadingService.setLoading(true);

  return next(req).pipe(
    finalize(() => {
      activeRequests = Math.max(activeRequests - 1, 0);
      loadingService.setLoading(activeRequests > 0);
    })
  );
};
