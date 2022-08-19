import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UserProfileComponent } from './components/user-profile/user-profile.component';
import { SharedModule } from 'src/shared/shared.module';

@NgModule({
  declarations: [
    UserProfileComponent
  ],
  imports: [
    CommonModule,
    SharedModule
  ]
})
export class UserModule { }
