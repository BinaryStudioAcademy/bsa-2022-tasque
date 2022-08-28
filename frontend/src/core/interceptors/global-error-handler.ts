import { HttpErrorResponse } from '@angular/common/http';
import { ErrorHandler, Injector, Injectable } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { AuthService } from '../services/auth.service';

@Injectable()
export class GlobalErrorHandler extends ErrorHandler {
  constructor(
    private injector: Injector) {
    super();
  }

  private get toastrService(): ToastrService {
    return this.injector.get(ToastrService);
  }

  private get authService(): AuthService {
    return this.injector.get(AuthService);
  }

  handleError(error: unknown): void {
    // TODO: Remove in prod
    super.handleError(error);

    if (!(error instanceof HttpErrorResponse)) {
      this.toastrService.error('An unexpected client-side error has occurred.', 'Error', {
        closeButton: true,
        timeOut: 5000,
        onActivateTick: true,
      });
      return;
    }

    if (error.status === 0) {
      this.toastrService.error('No connection.', 'Error', {
        closeButton: true,
        timeOut: 5000,
        onActivateTick: true,
      });
      return;
    }

    if (error.status >= 500) {
      this.toastrService.error('An unexpected server-side error has occurred.', 'Error', {
        closeButton: true,
        timeOut: 5000,
        onActivateTick: true,
      });
      return;
    }

    if (error.status === 401) {
      this.toastrService.error('Authorization has expired. Please sign in again', 'Error', {
        closeButton: true,
        timeOut: 5000,
        onActivateTick: true,
      });
      this.authService.logout();
      return;
    }

    if (error.status >= 400) {
      this.toastrService.error(error.error, '');
      return;
    }
  }
}
