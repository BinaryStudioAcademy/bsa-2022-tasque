import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { CoreModule } from 'src/core/core.module';
import { SharedModule } from 'src/shared/shared.module';
import { ToastrModule } from 'ngx-toastr';
import { FormsModule } from '@angular/forms';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { MatDialogModule } from '@angular/material/dialog';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { CreateOrganizationComponent } from './components/create-organization/create-organization.component';
import { CreateProjectComponent } from './components/create-project/create-project.component';
import { CreateOrganizationDialogComponent } from './components/create-organization/create-organization-dialog/create-organization-dialog.component';
import { CreateProjectDialogComponent } from './components/create-project/create-project-dialog/create-project-dialog.component';
import { LoginPageComponent } from './components/login-page/login-page.component';
import { RegisterPageComponent } from './components/register-page/register-page.component';
import { AuthPageComponent } from './components/auth-page/auth-page.component';

@NgModule({
  declarations: [
    AppComponent,
    CreateOrganizationComponent,
    CreateOrganizationDialogComponent,
    CreateProjectComponent,
    CreateProjectDialogComponent,
    LoginPageComponent,
    RegisterPageComponent,
    AuthPageComponent,
  ],
  imports: [
    BrowserModule,
    SharedModule,
    AppRoutingModule,
    CoreModule,
    FormsModule,
    MatDialogModule,
    BrowserAnimationsModule,
    ToastrModule.forRoot(),
    FontAwesomeModule,
  ],
  providers: [BrowserAnimationsModule],
  bootstrap: [AppComponent],
})
export class AppModule {}
