import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-register-page',
  templateUrl: './register-page.component.html',
  styleUrls: ['./register-page.component.sass']
})
export class RegisterPageComponent implements OnInit {

  public placeholderName = 'Write your name';
  public placeholderEmail = 'Write your email';
  public placeholderPassword = 'Write your password';
  public labelName = 'Name';
  public labelEmail = 'Email';
  public labelPassword = 'Password';
  public inputText = 'text';
  public inputEmail = 'email';
  public inputPassword = 'password';
  public inputClass = 'input';
  public errorMailMessage = 'Invalid email';
  public buttonClass = 'stroke';
  public buttonText = 'Sign up';

  public userName = 't';
  public userEmail = 't';
  public userPassword = 't';

  constructor() { }

  ngOnInit(): void {
  }

  sendForm(){
    console.log(`data: ${this.userName} ${this.userEmail} ${this.userPassword}`);
  }

}
