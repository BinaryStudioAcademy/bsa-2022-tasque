import { Injectable } from '@angular/core';
import { ReplaySubject, Subject } from 'rxjs';
import { take } from 'rxjs/operators';
import { UserService } from 'src/app/user/services/user.service';
import { UserModel } from '../models/user/user-model';
import { JwtHelperService } from '@auth0/angular-jwt';

@Injectable({
  providedIn: 'root',
})
export class GetCurrentUserService {

  private jwtHelperService = new JwtHelperService();

  constructor(private userService: UserService) {}

  getUserId(): number {
    const token = localStorage.getItem('token');

    if(token) {
      const decodedToken = this.jwtHelperService.decodeToken(token);
      return decodedToken.id;
    }
    return -1;
  }

  private currentUserSubj = new ReplaySubject<UserModel>(1);
  public currentUser$ = this.currentUserSubj.asObservable();

  public getCurrentUser(): void {
    this.userService
      .getCurrentUser()
      .pipe(take(1))
      .subscribe((response) => {
        if (response.body) {
          this.currentUserSubj.next(response.body);
        }
      });
  }

  public setCurrentUserByEmail(email: string): void {
    this.userService.getUserByEmail(email).subscribe((resp) => {
      this.currentUserSubj.next(resp.body as UserModel);
    });
  }

  public clearCurrentUser(): void {
    this.currentUserSubj.complete();
    this.currentUserSubj = new ReplaySubject<UserModel>(1);
    this.currentUser$ = this.currentUserSubj.asObservable();
  }

  public userAvatarUpdated$ = new Subject<string>();

  public updateUserAvatar(avatar: string | undefined): void {
    this.userAvatarUpdated$.next(avatar ?? '');
  }
}
