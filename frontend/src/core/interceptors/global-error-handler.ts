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
    if (error instanceof HttpErrorResponse) {
      const err = error as HttpErrorResponse;
      let errMsg = err.status + ': ' + err.statusText;
      if (err.status >= 400 && err.status < 500) {
        errMsg = err.error;
      }
      this.toastrService.error(errMsg, '', { onActivateTick: true });
    } else {
      this.toastrService.error('An unexpected error has occurred.', 'Error', {
        closeButton: true,
        timeOut: 5000,
        onActivateTick: true,
      });
    }
    super.handleError(error);
  }
}
