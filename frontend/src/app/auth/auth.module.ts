import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from 'src/shared/shared.module';
import { LoginPageComponent } from './components/login-page/login-page.component';
import { RegisterPageComponent } from './components/register-page/register-page.component';
import { AuthPageComponent } from './components/auth-page/auth-page.component';

@NgModule({
  declarations: [LoginPageComponent, RegisterPageComponent, AuthPageComponent],
  imports: [CommonModule, SharedModule],
})
export class AuthModule {}
