import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from 'src/shared/shared.module';
import { LoginPageComponent } from './components/login-page/login-page.component';
import { RegisterPageComponent } from './components/register-page/register-page.component';
import { AuthPageComponent } from './components/auth-page/auth-page.component';
import { RestorePageComponent } from './components/restore-page/restore-page.component';
import { ConfirmEmailPageComponent } from './components/confirm-email-page/confirm-email-page.component';
import { ProtectedComponent } from './components/protected/protected.component';

@NgModule({
  declarations: [
    LoginPageComponent,
    RegisterPageComponent,
    AuthPageComponent,
    RestorePageComponent,
    ConfirmEmailPageComponent,
    ProtectedComponent,
  ],
  imports: [CommonModule, SharedModule],
})
export class AuthModule {}
