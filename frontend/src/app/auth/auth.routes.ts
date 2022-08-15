import { Routes } from '@angular/router';
import { AuthGuard } from '../guards/auth.guard';
import { AuthPageComponent } from './components/auth-page/auth-page.component';
import { ConfirmEmailPageComponent } from './components/confirm-email-page/confirm-email-page.component';
import { LoginPageComponent } from './components/login-page/login-page.component';
import { RegisterPageComponent } from './components/register-page/register-page.component';
import { ResetPageComponent } from './components/reset-page/reset-page.component';
import { RestorePageComponent } from './components/restore-page/restore-page.component';

export const AuthRoutes: Routes = [
  {
    path: 'auth',
    component: AuthPageComponent,
    children: [
      { path: 'login', component: LoginPageComponent, canDeactivate: [AuthGuard] },
      { path: 'register', component: RegisterPageComponent, canDeactivate: [AuthGuard] },
      { path: 'restore', component: RestorePageComponent },
      { path: 'restore/:key', component: ResetPageComponent },
      { path: 'confirm', component: ConfirmEmailPageComponent },
    ],
  },
];
