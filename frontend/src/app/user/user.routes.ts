import { Routes } from '@angular/router';
import { UserProfileComponent } from './components/user-profile/user-profile.component';

export const UserRoutes: Routes = [
  {
    path: 'user/profile',
    component: UserProfileComponent,
  },
];
