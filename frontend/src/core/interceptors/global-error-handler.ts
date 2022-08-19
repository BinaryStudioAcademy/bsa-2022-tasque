import { HttpErrorResponse } from '@angular/common/http';
import { ErrorHandler, Inject, Injector, Injectable } from '@angular/core';
import { ToastrService } from 'ngx-toastr';

@Injectable()
export class GlobalErrorHandler extends ErrorHandler {
  constructor(@Inject(Injector) private injector: Injector) {
    super();
  }

  private get toastrService(): ToastrService {
    return this.injector.get(ToastrService);
  }

  handleError(error: any): void {
    if (
      error instanceof HttpErrorResponse &&
      error.status >= 400 &&
      error.status < 500 &&
      typeof error.error === 'string'
    ) {
      this.toastrService.error(error.error, '');
    } else {
      this.toastrService.error('An unexpected error has occurred.', 'Error', {
        closeButton: true,
        timeOut: 5000,
        onActivateTick: true,
      });
    }

    // TODO: Remove in prod
    super.handleError(error);
  }
}
