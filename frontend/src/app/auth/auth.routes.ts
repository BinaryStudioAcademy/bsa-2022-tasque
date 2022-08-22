import { Routes } from '@angular/router';
import { RegisterGuard } from './guards/register.guard';
import { RestoreGuard } from './guards/restore.guard';
import { AuthPageComponent } from './components/auth-page/auth-page.component';
import { ConfirmEmailPageComponent } from './components/confirm-email-page/confirm-email-page.component';
import { LoginPageComponent } from './components/login-page/login-page.component';
import { RegisterPageComponent } from './components/register-page/register-page.component';
import { RestorePageComponent } from './components/restore-page/restore-page.component';

export const AuthRoutes: Routes = [
  {
    path: 'auth',
    component: AuthPageComponent,
    children: [
      { path: 'login', component: LoginPageComponent, canActivate: [LoginGuard] },
      { path: 'register', component: RegisterPageComponent, canActivate: [RegisterGuard], canDeactivate: [RegisterGuard] },
      { path: 'restore', component: RestorePageComponent, canActivate: [RestoreGuard], canDeactivate: [RestoreGuard] },
      { path: 'restore/:key', component: ResetPageComponent },
      { path: 'login', component: LoginPageComponent },
      {
        path: 'register',
        component: RegisterPageComponent,
        canDeactivate: [RegisterGuard],
      },
      {
        path: 'restore',
        component: RestorePageComponent,
        canDeactivate: [RestoreGuard],
      },
      { path: 'confirm', component: ConfirmEmailPageComponent },
    ],
  },
];
