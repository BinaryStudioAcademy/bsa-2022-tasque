import { Injectable } from '@angular/core';
import { ToastrService } from 'ngx-toastr';

@Injectable({ providedIn: 'root' })
export class NotificationServices {
  public constructor(private toastr: ToastrService) {}

  position = 'toast-bottom-center';
  timeOut = 3000;

  public Error(msg: string, title = ''): void {
    this.toastr.error(msg, title, {
      timeOut: this.timeOut,
      positionClass: this.position,
    });
  }

  public Success(msg: string, title = ''): void {
    this.toastr.success(msg, title, {
      timeOut: this.timeOut,
      positionClass: this.position,
    });
  }

  public Info(msg: string, title = ''): void {
    this.toastr.info(msg, title, {
      timeOut: this.timeOut,
      positionClass: this.position,
    });
  }

  public Warning(msg: string, title = ''): void {
    this.toastr.warning(msg, title, {
      timeOut: this.timeOut,
      positionClass: this.position,
    });
  }
}
