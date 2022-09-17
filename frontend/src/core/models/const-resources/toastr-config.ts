import { GlobalConfig } from 'ngx-toastr';

export const ToastrConfig: Partial<GlobalConfig> = {
  onActivateTick: true,
  positionClass: 'toast-top-right',
  timeOut: 3000
};