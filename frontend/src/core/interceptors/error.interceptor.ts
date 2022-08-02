import { Injectable } from '@angular/core';
import { HttpHandler, HttpInterceptor, HttpErrorResponse, HttpRequest, HttpEvent } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';

@Injectable({
    providedIn: 'root',
})
export class ErrorInterceptor implements HttpInterceptor {
    constructor() { }
    handleError(error: HttpErrorResponse): Observable<never> {
        return throwError(() => new Error(error.message ?? 'Something went wrong'));
    }
    intercept(req: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
        return next.handle(req).pipe(catchError(this.handleError));
    }
} 