import { HttpErrorResponse } from '@angular/common/http';
import { ErrorHandler, Injector, Injectable } from '@angular/core';
import { AuthService } from '../services/auth.service';
import { NotificationService } from '../services/notification.service';

@Injectable()
export class GlobalErrorHandler extends ErrorHandler {
  constructor(private injector: Injector) {
    super();
  }

  private get notificationService(): NotificationService {
    return this.injector.get(NotificationService);
  }

  private get authService(): AuthService {
    return this.injector.get(AuthService);
  }

  handleError(error: unknown): void {
    // TODO: Remove in prod
    super.handleError(error);

    if (!(error instanceof HttpErrorResponse)) {
      this.notificationService.error('An unexpected client-side error has occurred.', 'Error');
      return;
    }

    if (error.status === 0) {
      this.notificationService.error('No connection.', 'Error');
      return;
    }

    if (error.status >= 500) {
      this.notificationService.error('An unexpected server-side error has occurred.', 'Error');
      return;
    }

    if (error.status === 401) {
      this.notificationService.error('Authorization has expired. Please sign in again', 'Error');
      this.authService.logout();
      return;
    }

    if (error.status >= 400) {
      this.notificationService.error(error.error, '');
      return;
    }
  }
}
