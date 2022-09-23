import { HttpErrorResponse } from '@angular/common/http';
import { ErrorHandler, Injector, Injectable } from '@angular/core';
import { AuthService } from '../services/auth.service';
import { ToastrNotificationService } from '../services/toastr-notification.service';

@Injectable()
export class GlobalErrorHandler extends ErrorHandler {
  constructor(private injector: Injector) {
    super();
  }

  private get notificationService(): ToastrNotificationService {
    return this.injector.get(ToastrNotificationService);
  }

  private get authService(): AuthService {
    return this.injector.get(AuthService);
  }

  handleError(error: unknown): void {
    // TODO: Remove in prod
    super.handleError(error);

    if (!(error instanceof HttpErrorResponse)) {
      //TODO
      console.warn('An unexpected client-side error has occurred.');
      // this.notificationService.error(
      //   'An unexpected client-side error has occurred.',
      //   'Error',
      // );
      return;
    }

    if (error.status === 0) {
      //TODO
      console.warn('No connection.');
      // this.notificationService.error('No connection.', 'Error');
      return;
    }

    if (error.status >= 500) {
      //TODO
      console.warn('An unexpected client-side error has occurred.');

      // this.notificationService.error(
      //   'An unexpected server-side error has occurred.',
      //    'Error',
      //   );
      return;
    }

    if (error.status === 401) {
      this.notificationService.error(
        'Authorization has expired. Please sign in again',
        'Error',
      );
      this.authService.logout();
      return;
    }

    if (error.status >= 400) {
      //TODO
      console.warn(error.error);
      // this.notificationService.error(error.error, '');
      return;
    }
  }
}
