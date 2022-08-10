import { Injectable } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { LoginPageComponent } from '../components/login-page/login-page.component';

@Injectable({
  providedIn: 'root'
})
export class LoginService {

  constructor(private dialog: MatDialog) { }

  public openLoginDialog(): void {
    this.dialog.open(LoginPageComponent, {
      data: {},
      panelClass: 'fullscreen-dialog',
      backdropClass: 'fullscreen-dialog',      
      minWidth: '100%',
      minHeight: '100%'
    })
  }

}
