import { Routes } from '@angular/router';
import { AuthPageComponent } from './components/auth-page/auth-page.component';
import { LoginPageComponent } from './components/login-page/login-page.component';
import { RegisterPageComponent } from './components/register-page/register-page.component';
import { RestorePageComponent } from './components/restore-page/restore-page.component';

export const AuthRoutes: Routes = [
  {
    path: 'auth',
    component: AuthPageComponent,
    children: [
      { path: 'login', component: LoginPageComponent },
      { path: 'register', component: RegisterPageComponent },
      { path: 'restore', component: RestorePageComponent },
    ],
  },
];
