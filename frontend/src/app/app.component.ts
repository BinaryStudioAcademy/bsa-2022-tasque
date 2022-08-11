import { Component, OnInit } from '@angular/core';
import { LoginService } from 'src/shared/services/login.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.sass'],
})
export class AppComponent implements OnInit {
  title = 'tasque';

  constructor(private service: LoginService) {

  }
  ngOnInit(): void {
    this.service.openLoginDialog();
  }
}
