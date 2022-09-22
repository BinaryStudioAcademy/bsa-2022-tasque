import { Injectable } from '@angular/core';
import {
  HttpHandler,
  HttpInterceptor,
  HttpErrorResponse,
  HttpRequest,
  HttpEvent,
} from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { ToastrNotificationService } from '../services/toastr-notification.service';

@Injectable({
  providedIn: 'root',
})
export class ErrorInterceptor implements HttpInterceptor {
  constructor(private notificationService: ToastrNotificationService) {
    this.notificationService.position = 'toast-top-right';
  }
  handleError(error: HttpErrorResponse): Observable<never> {
    return throwError(new Error(error.message ?? 'Something went wrong'));
  }
  intercept(
    req: HttpRequest<unknown>,
    next: HttpHandler,
  ): Observable<HttpEvent<unknown>> {
    return new Observable((observer) => {
      next.handle(req).subscribe(
        (res: HttpEvent<unknown>) => {
          observer.next(res);
        },

        (err: HttpErrorResponse) => {
          this.notificationService.error(err.status + ': ' + err.statusText);
        },
      );
    });
  }
}
