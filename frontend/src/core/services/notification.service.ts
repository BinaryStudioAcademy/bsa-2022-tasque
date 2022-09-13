import { Injectable } from '@angular/core';
import { ToastrService } from 'ngx-toastr';

@Injectable({ providedIn: 'root' })
export class NotificationService {
  public constructor(private toastr: ToastrService) {}

  position = 'toast-top-right';
  timeOut = 3000;

  public error(msg: string, title = ''): void {
    this.toastr.error(msg, title, {
      timeOut: this.timeOut,
      positionClass: this.position,
    });
  }

  public success(msg: string, title = ''): void {
    this.toastr.success(msg, title, {
      timeOut: this.timeOut,
      positionClass: this.position,
    });
  }

  public info(msg: string, title = ''): void {
    this.toastr.info(msg, title, {
      timeOut: this.timeOut,
      positionClass: this.position,
    });
  }

  public warning(msg: string, title = ''): void {
    this.toastr.warning(msg, title, {
      timeOut: this.timeOut,
      positionClass: this.position,
    });
  }
}
