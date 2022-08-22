import { Injectable } from '@angular/core';
import { CanDeactivate, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';
import { RestorePageComponent } from '../components/restore-page/restore-page.component';

@Injectable({
  providedIn: 'root',
})
export class RestoreGuard implements CanDeactivate<RestorePageComponent> {
  canDeactivate(
    component: RestorePageComponent,
  ):
    | Observable<boolean | UrlTree>
    | Promise<boolean | UrlTree>
    | boolean
    | UrlTree {
    if (!component.requestForm.dirty) return true;
    return window.confirm('Data would not be saved. Continue?');
  }
}
