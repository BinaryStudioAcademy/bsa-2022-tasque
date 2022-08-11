import { Component } from '@angular/core';
import { LoginService } from 'src/services/login.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.test.html',
  styleUrls: ['./app.component.sass'],
})
export class AppComponent {
  title = 'tasque';

  constructor(
    public loginService: LoginService
  ){}

  public open(){
    this.loginService.openLoginDialog();
  }
}
