import { GlobalConfig } from 'ngx-toastr';

export const ToastrConfig: Partial<GlobalConfig> = {
  onActivateTick: true,
  positionClass: 'toast-bottom-center',
  timeOut: 3000
};
