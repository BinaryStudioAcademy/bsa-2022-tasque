import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Observable, of, Subject } from 'rxjs';
import { map } from 'rxjs/operators';
import { UserService } from 'src/app/user/services/user.service';
import { UserModel } from '../models/user/user-model';

@Injectable({
  providedIn: 'root'
})
export class GetCurrentUserService {

  constructor(
    private userService: UserService,
    private router: Router
  ) {
    this.userService.getCurrentUser().pipe(map((resp) => {
      if (!resp.ok) {
        this.router.navigate(['auth/login']);
        return;
      }
      this.currentUser$ = of(resp.body as UserModel);
    }));
  }

  private currentUser$: Observable<UserModel>;

  get currentUser(): Observable<UserModel> {
    if (this.currentUser$ !== undefined)
      return this.currentUser$;
    return this.userService.getCurrentUser().pipe(
      map((resp) => {
        if (!resp.ok) {
          this.router.navigate(['auth/login']);
          ///return;
        }
        this.currentUser$ = of(resp.body as UserModel);
        return resp.body as UserModel;
      }));
  }

  public userAvatarUpdated$ = new Subject<string>();

  public updateUserAvatar(avatar: string | undefined): void {
    this.userAvatarUpdated$.next(avatar ?? '');
  }
}
