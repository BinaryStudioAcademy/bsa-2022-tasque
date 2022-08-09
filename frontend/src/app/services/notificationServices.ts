import { Injectable } from '@angular/core';
import { ToastrService } from 'ngx-toastr';

@Injectable({ providedIn: 'root' })
export class NotificationServices {
  public constructor(private toastr: ToastrService) {}

  position : string = 'toast-bottom-center';

  public Error(msg: string, title: string = '', timeOut: number = 3000) {
    this.toastr.error(msg, title, {
      timeOut: timeOut,
      positionClass: this.position,
    });
  }

  public Success(msg: string, title: string = '', timeOut: number = 3000) {
    this.toastr.success(msg, title, {
      timeOut: timeOut,
      positionClass: this.position,
    });
  }

  public Info(msg: string, title: string = '', timeOut: number = 3000) {
    this.toastr.info(msg, title, {
      timeOut: timeOut,
      positionClass: this.position,
    });
  }

  public Warning(msg: string, title: string = '', timeOut: number = 3000) {
    this.toastr.warning(msg, title, {
      timeOut: timeOut,
      positionClass: this.position,
    });
  }
}
